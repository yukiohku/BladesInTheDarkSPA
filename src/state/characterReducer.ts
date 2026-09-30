import type {
  Character,
  ChoiceList,
  Clock,
  Crew,
  CrewMember,
  Weapon,
} from '../types/character'
import type { AttributeKey } from '../types/character'
import type { ChangeDraft } from '../types/changelog'
import { createDefaultCharacter } from '../constants/defaults'
import { ATTRIBUTE_MAX } from '../constants/labels'
import { applyChange, clamp, revertChange } from '../lib/changelog'
import { createId, nowIso } from '../lib/id'

export type ChoiceListField =
  | 'drives'
  | 'heritageAbilities'
  | 'backgroundAbilities'
  | 'roleAbilities'
  | 'specialAbilities'
  | 'vices'
  | 'traumas'
  | 'flaws'

export type CrewChoiceField = 'liabilities' | 'services' | 'itemRoster'

export type TextListField = 'dramaticUnderscores' | 'customMoves'

export type NumberField =
  | 'edges'
  | 'stress'
  | 'stressMax'
  | 'armor'
  | 'armorEffect'
  | 'harm'

export type Action =
  | { type: 'replace'; character: Character }
  | { type: 'reset' }
  | { type: 'basics'; patch: Partial<Character['basics']> }
  | { type: 'crewRole'; id: string }
  | { type: 'attribute'; key: AttributeKey; value: number }
  | { type: 'number'; field: NumberField; value: number }
  | { type: 'choice.patch'; field: ChoiceListField; id: string; patch: Partial<ChoiceList> }
  | { type: 'choice.add'; field: ChoiceListField }
  | { type: 'choice.remove'; field: ChoiceListField; id: string }
  | { type: 'choice.set'; field: ChoiceListField; items: ChoiceList[] }
  | { type: 'crewChoice.patch'; field: CrewChoiceField; id: string; patch: Partial<ChoiceList> }
  | { type: 'crewChoice.add'; field: CrewChoiceField }
  | { type: 'crewChoice.remove'; field: CrewChoiceField; id: string }
  | { type: 'text.add'; field: TextListField; value: string }
  | { type: 'text.remove'; field: TextListField; index: number }
  | { type: 'weapon.add' }
  | { type: 'weapon.patch'; id: string; patch: Partial<Weapon> }
  | { type: 'weapon.remove'; id: string }
  | { type: 'clock.add' }
  | { type: 'clock.patch'; id: string; patch: Partial<Clock> }
  | { type: 'clock.remove'; id: string }
  | { type: 'member.add' }
  | { type: 'member.patch'; id: string; patch: Partial<CrewMember> }
  | { type: 'member.remove'; id: string }
  | { type: 'crew.patch'; patch: Partial<Crew> }
  | { type: 'change.apply'; draft: ChangeDraft }
  | { type: 'change.revert'; entryId: string }

function touch(character: Character): Character {
  return { ...character, updatedAt: nowIso() }
}

function patchList<T extends { id: string }>(
  list: T[],
  id: string,
  patch: Partial<T>,
): T[] {
  return list.map((item) => (item.id === id ? { ...item, ...patch } : item))
}

function applyNumber(character: Character, field: NumberField, raw: number): Character {
  const next = { ...character }

  switch (field) {
    case 'edges':
      next.edges = Math.round(clamp(raw, 0, 4))
      break
    case 'stress':
      next.stress = Math.round(clamp(raw, 0, character.stressMax))
      break
    case 'stressMax': {
      const max = Math.round(clamp(raw, 1, 20))
      next.stressMax = max
      next.stress = clamp(next.stress, 0, max)
      break
    }
    case 'armor':
      next.armor = Math.round(clamp(raw, 0, 6))
      break
    case 'armorEffect':
      next.armorEffect = Math.round(clamp(raw, 0, 6))
      break
    case 'harm':
      next.harm = Math.round(clamp(raw, 0, 4))
      break
  }

  return next
}

function createClock(): Clock {
  return { id: createId('clock'), name: '', filled: 0, total: 6 }
}

function createWeapon(): Weapon {
  return { id: createId('weapon'), name: '', range: '', damage: '', load: '', effect: '' }
}

function createMember(): CrewMember {
  return { id: createId('member'), name: '', role: '', note: '', player: false }
}

export function characterReducer(character: Character, action: Action): Character {
  switch (action.type) {
    case 'replace':
      return action.character

    case 'reset':
      return createDefaultCharacter()

    case 'basics':
      return touch({ ...character, basics: { ...character.basics, ...action.patch } })

    case 'crewRole':
      return touch({ ...character, crewRoleId: action.id })

    case 'attribute':
      return touch({
        ...character,
        attributes: {
          ...character.attributes,
          [action.key]: Math.round(clamp(action.value, 0, ATTRIBUTE_MAX)),
        },
      })

    case 'number':
      return touch(applyNumber(character, action.field, action.value))

    case 'choice.patch':
      return touch({
        ...character,
        [action.field]: patchList(character[action.field], action.id, action.patch),
      })

    case 'choice.add':
      return touch({
        ...character,
        [action.field]: [...character[action.field], { id: createId('pick'), name: '', note: '' }],
      })

    case 'choice.remove':
      return touch({
        ...character,
        [action.field]: character[action.field].filter((item) => item.id !== action.id),
      })

    case 'choice.set':
      return touch({ ...character, [action.field]: action.items })

    case 'crewChoice.patch':
      return touch({
        ...character,
        crew: {
          ...character.crew,
          [action.field]: patchList(character.crew[action.field], action.id, action.patch),
        },
      })

    case 'crewChoice.add':
      return touch({
        ...character,
        crew: {
          ...character.crew,
          [action.field]: [...character.crew[action.field], { id: createId('pick'), name: '', note: '' }],
        },
      })

    case 'crewChoice.remove':
      return touch({
        ...character,
        crew: {
          ...character.crew,
          [action.field]: character.crew[action.field].filter((item) => item.id !== action.id),
        },
      })

    case 'text.add':
      if (!action.value.trim()) return character
      return touch({ ...character, [action.field]: [...character[action.field], action.value.trim()] })

    case 'text.remove':
      return touch({
        ...character,
        [action.field]: character[action.field].filter((_, index) => index !== action.index),
      })

    case 'weapon.add':
      return touch({ ...character, weapons: [...character.weapons, createWeapon()] })

    case 'weapon.patch':
      return touch({
        ...character,
        weapons: patchList(character.weapons, action.id, action.patch),
      })

    case 'weapon.remove':
      return touch({
        ...character,
        weapons: character.weapons.filter((item) => item.id !== action.id),
      })

    case 'clock.add':
      return touch({ ...character, harmClocks: [...character.harmClocks, createClock()] })

    case 'clock.patch': {
      const harmClocks = patchList(character.harmClocks, action.id, action.patch).map((clock) => ({
        ...clock,
        filled: clamp(clock.filled, 0, clock.total),
      }))
      return touch({ ...character, harmClocks })
    }

    case 'clock.remove':
      return touch({
        ...character,
        harmClocks: character.harmClocks.filter((item) => item.id !== action.id),
      })

    case 'member.add':
      return touch({ ...character, crew: { ...character.crew, roster: [...character.crew.roster, createMember()] } })

    case 'member.patch':
      return touch({
        ...character,
        crew: {
          ...character.crew,
          roster: patchList(character.crew.roster, action.id, action.patch),
        },
      })

    case 'member.remove':
      return touch({
        ...character,
        crew: {
          ...character.crew,
          roster: character.crew.roster.filter((item) => item.id !== action.id),
        },
      })

    case 'crew.patch':
      return touch({ ...character, crew: { ...character.crew, ...action.patch } })

    case 'change.apply':
      return applyChange(character, action.draft)

    case 'change.revert':
      return revertChange(character, action.entryId)
  }
}
