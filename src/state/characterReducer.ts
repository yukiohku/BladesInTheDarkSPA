import type {
  Character,
  ChoiceList,
  Clock,
  Crew,
  CrewMember,
  OfficialFriend,
  OfficialSheet,
  PlanningSlot,
  Weapon,
} from '../types/character'
import type { AttributeKey } from '../types/character'
import type { ChangeDraft } from '../types/changelog'
import { createDefaultCharacter } from '../constants/defaults'
import { ATTRIBUTE_MAX } from '../constants/labels'
import {
  COIN_MAX,
  HEALING_CLOCK_SEGMENTS,
  RATING_MAX,
  XP_TRACK_MAX,
} from '../constants/playbooks'
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

export type RatingGroup = 'insight' | 'prowess' | 'resolve'

export type Action =
  | { type: 'replace'; character: Character }
  | { type: 'reset' }
  | { type: 'basics'; patch: Partial<Character['basics']> }
  | { type: 'note'; value: string }
  | { type: 'crewRole'; value: string }
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
  | { type: 'official.patch'; patch: Partial<OfficialSheet> }
  | { type: 'official.text'; field: 'crewName' | 'look'; value: string }
  | { type: 'official.harmNote'; key: string; value: string }
  | { type: 'official.healing'; value: number }
  | { type: 'official.armorUse'; kind: 'armor' | 'heavy' | 'special' }
  | { type: 'official.toggle'; bucket: CheckBucket; id: string }
  | { type: 'official.stash'; value: number }
  | { type: 'official.coin'; value: number }
  | { type: 'official.extra'; patch: { label?: string; check?: boolean; filled?: number } }
  | { type: 'official.xp'; group: 'playbook' | RatingGroup; value: number }
  | { type: 'official.rating'; group: RatingGroup; id: string; value: number }
  | { type: 'official.ability'; value: string }
  | { type: 'official.veteran'; index: number; value: string }
  | { type: 'official.friend.add' }
  | { type: 'official.friend.patch'; id: string; patch: Partial<OfficialFriend> }
  | { type: 'official.friend.remove'; id: string }
  | { type: 'official.planning'; id: string; patch: Partial<PlanningSlot> }
  | { type: 'official.gather'; index: number; value: string }
  | { type: 'trauma.toggle'; name: string }

export type CheckBucket =
  | 'heritageIds'
  | 'backgroundIds'
  | 'viceIds'
  | 'generalItems'
  | 'playbookItems'
  | 'teamwork'

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
      return touch({ ...character, crewRole: action.value })

    case 'note':
      return touch({ ...character, notes: action.value })

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

    case 'official.patch':
      return touch({ ...character, official: { ...character.official, ...action.patch } })

    case 'official.text':
      return touch({ ...character, official: { ...character.official, [action.field]: action.value } })

    case 'official.harmNote':
      return touch({
        ...character,
        official: {
          ...character.official,
          harmNotes: { ...character.official.harmNotes, [action.key]: action.value },
        },
      })

    case 'official.healing':
      return touch({
        ...character,
        official: {
          ...character.official,
          healingFilled: Math.round(clamp(action.value, 0, HEALING_CLOCK_SEGMENTS)),
        },
      })

    case 'official.armorUse': {
      const uses = character.official.armorUses
      return touch({
        ...character,
        official: {
          ...character.official,
          armorUses: { ...uses, [action.kind]: !uses[action.kind] },
        },
      })
    }

    case 'official.toggle':
      return toggleInBucket(character, action.bucket, action.id)

    case 'official.stash':
      return touch({
        ...character,
        official: {
          ...character.official,
          stash: Math.round(clamp(action.value, 0, COIN_MAX)),
        },
      })

    case 'official.coin':
      return touch({
        ...character,
        official: {
          ...character.official,
          coin: Math.round(clamp(action.value, 0, COIN_MAX)),
        },
      })

    case 'official.extra': {
      const official = character.official
      const next = { ...official }
      if (action.patch.label !== undefined) next.extraLabel = action.patch.label
      if (action.patch.check !== undefined) next.extraCheck = action.patch.check
      if (action.patch.filled !== undefined) {
        next.extraFilled = Math.round(clamp(action.patch.filled, 0, COIN_MAX))
      }
      return touch({ ...character, official: next })
    }

    case 'official.xp': {
      const key = `${action.group}Xp` as 'playbookXp' | 'insightXp' | 'prowessXp' | 'resolveXp'
      return touch({
        ...character,
        official: {
          ...character.official,
          [key]: Math.round(clamp(action.value, 0, XP_TRACK_MAX)),
        },
      })
    }

    case 'official.rating': {
      const key = `${action.group}.${action.id}`
      return touch({
        ...character,
        official: {
          ...character.official,
          ratings: {
            ...character.official.ratings,
            [key]: Math.round(clamp(action.value, 0, RATING_MAX)),
          },
        },
      })
    }

    case 'official.ability':
      return touch({ ...character, official: { ...character.official, abilityId: action.value } })

    case 'official.veteran': {
      const slots = [...character.official.veteranSlots]
      if (action.index < 0 || action.index >= slots.length) return character
      slots[action.index] = action.value
      return touch({ ...character, official: { ...character.official, veteranSlots: slots } })
    }

    case 'official.friend.add':
      return touch({
        ...character,
        official: {
          ...character.official,
          friends: [
            ...character.official.friends,
            { id: createId('friend'), name: '', up: false, down: false },
          ],
        },
      })

    case 'official.friend.patch':
      return touch({
        ...character,
        official: {
          ...character.official,
          friends: patchList(character.official.friends, action.id, action.patch),
        },
      })

    case 'official.friend.remove':
      return touch({
        ...character,
        official: {
          ...character.official,
          friends: character.official.friends.filter((friend) => friend.id !== action.id),
        },
      })

    case 'official.planning': {
      const existing: PlanningSlot = character.official.planning[action.id] ?? {
        detail: '',
        load: '',
      }
      return touch({
        ...character,
        official: {
          ...character.official,
          planning: { ...character.official.planning, [action.id]: { ...existing, ...action.patch } },
        },
      })
    }

    case 'official.gather': {
      const answers = [...character.official.gatherInfo]
      if (action.index < 0 || action.index >= answers.length) return character
      answers[action.index] = action.value
      return touch({
        ...character,
        official: { ...character.official, gatherInfo: answers },
      })
    }

    case 'trauma.toggle': {
      const exists = character.traumas.some((trauma) => trauma.name === action.name)
      const traumas = exists
        ? character.traumas.filter((trauma) => trauma.name !== action.name)
        : [...character.traumas, { id: createId('pick'), name: action.name, note: '' }]
      return touch({ ...character, traumas })
    }
  }
}

const LIST_BUCKETS: CheckBucket[] = ['heritageIds', 'backgroundIds', 'viceIds']

/**
 * リスト選択は複数可、アイテムや協力は真偽値のトグル。
 * どちらも「同じ id を押すたびに有無を切り替える」挙動に統一しています。
 */
function toggleInBucket(character: Character, bucket: CheckBucket, id: string): Character {
  const official = character.official

  if (LIST_BUCKETS.includes(bucket)) {
    const current = official[bucket] as string[]
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    return touch({ ...character, official: { ...official, [bucket]: next } })
  }

  const current = official[bucket] as Record<string, boolean>
  return touch({
    ...character,
    official: { ...official, [bucket]: { ...current, [id]: !current[id] } },
  })
}
