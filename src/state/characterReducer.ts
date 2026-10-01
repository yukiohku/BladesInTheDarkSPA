import type {
  AcquiredAbility,
  ActionId,
  Character,
  Clock,
  CustomItem,
  Friend,
  PlaybookId,
  SheetState,
} from '../types/character'
import type { ResourceAdjustment, ResourceKey } from '../types/resources'
import { createDefaultCharacter, defaultSheet } from '../constants/defaults'
import {
  CREATION_RATING_MAX,
  equipmentFor,
  findAbility,
  PLAYBOOKS,
  RATING_MAX,
  TRAUMA_MAX,
} from '../constants/playbooks'
import {
  adjustResource,
  clamp,
  creationProblems,
  creationRemaining,
  hasSpecialArmor,
  healingMinimum,
  stressMax,
  withResource,
} from '../lib/rules'
import { createId, nowIso } from '../lib/id'
export type Action =
  | { type: 'replace'; character: Character }
  | { type: 'reset'; playbookId?: PlaybookId }
  | { type: 'identity'; patch: Partial<SheetState['identity']> }
  | { type: 'note'; value: string }
  | { type: 'playbook.change'; playbookId: PlaybookId; resetRatings: boolean }
  | { type: 'creation.complete' }
  | { type: 'ratings.reset' }
  | { type: 'rating'; id: ActionId; value: number }
  | { type: 'resource'; resource: ResourceKey; value: number }
  | { type: 'resource.adjust'; adjustment: ResourceAdjustment }
  | { type: 'ability.add'; definitionId: string }
  | { type: 'ability.custom' }
  | { type: 'ability.patch'; id: string; patch: Partial<AcquiredAbility> }
  | { type: 'ability.remove'; id: string }
  | { type: 'friend.patch'; id: string; patch: Partial<Friend> }
  | { type: 'friend.add' }
  | { type: 'friend.remove'; id: string }
  | { type: 'equipment'; id: string; quantity: number }
  | { type: 'item.use'; id: string; index: number; value: string }
  | { type: 'customItem.add' }
  | { type: 'customItem.patch'; id: string; patch: Partial<CustomItem> }
  | { type: 'customItem.remove'; id: string }
  | { type: 'score.patch'; patch: Partial<SheetState['score']> }
  | { type: 'score.start' }
  | { type: 'specialArmor.reset' }
  | { type: 'gather'; key: string; value: string }
  | {
      type: 'harm'
      field: 'level1' | 'level2' | 'level3' | 'fatal'
      index?: number
      value: string
    }
  | { type: 'healing'; value: number }
  | { type: 'armor'; kind: 'armor' | 'heavy' | 'special' }
  | { type: 'trauma'; name: string }
  | { type: 'carriedCoin'; value: number }
  | { type: 'clock.add' }
  | { type: 'clock.patch'; id: string; patch: Partial<Clock> }
  | { type: 'clock.remove'; id: string }
  | { type: 'crew.name'; name: string }

function patchList<T extends { id: string }>(items: T[], id: string, patch: Partial<T>): T[] {
  return items.map((item) => (item.id === id ? { ...item, ...patch, id: item.id } : item))
}
function touch(character: Character): Character {
  return { ...character, updatedAt: nowIso() }
}
export function characterReducer(character: Character, action: Action): Character {
  switch (action.type) {
    case 'replace':
      return action.character
    case 'reset':
      return createDefaultCharacter(action.playbookId)
    case 'identity':
      return touch({ ...character, identity: { ...character.identity, ...action.patch } })
    case 'note':
      return touch({ ...character, notes: action.value })
    case 'playbook.change': {
      if (action.playbookId === character.playbookId) return character
      const base = defaultSheet(action.playbookId)
      const cleared: Character = {
        ...character,
        playbookId: action.playbookId,
        friends: base.friends,
        equipment: {
          ...base.equipment,
          ...Object.fromEntries(
            equipmentFor(action.playbookId)
              .filter((item) => !item.id.includes(':'))
              .map((item) => [item.id, character.equipment[item.id] ?? 0]),
          ),
        },
        itemUses: base.itemUses,
        gatherNotes: {},
        abilities: [],
        ratings: action.resetRatings ? base.ratings : character.ratings,
        creationComplete: action.resetRatings ? false : character.creationComplete,
      }
      const next = {
        ...cleared,
        stress: Math.min(character.stress, stressMax(cleared)),
        armorUses: {
          ...character.armorUses,
          special: hasSpecialArmor(cleared) && character.armorUses.special,
        },
        legacy: [
          ...character.legacy,
          {
            title: `${PLAYBOOKS[character.playbookId].title} 変更前の固有データ`,
            at: nowIso(),
            data: {
              friends: character.friends,
              equipment: character.equipment,
              itemUses: character.itemUses,
              gatherNotes: character.gatherNotes,
              ratings: character.ratings,
              abilities: character.abilities,
            },
          },
        ],
      }
      return touch(next)
    }
    case 'creation.complete':
      return creationProblems(character).length
        ? character
        : touch({ ...character, creationComplete: true })
    case 'ratings.reset':
      return touch({
        ...character,
        ratings: defaultSheet(character.playbookId).ratings,
        creationComplete: false,
      })
    case 'rating': {
      const min = character.creationComplete
        ? 0
        : (PLAYBOOKS[character.playbookId].initialRatings[action.id] ?? 0)
      const max = character.creationComplete
        ? RATING_MAX
        : Math.min(
            CREATION_RATING_MAX,
            character.ratings[action.id] + Math.max(0, creationRemaining(character)),
          )
      return touch({
        ...character,
        ratings: { ...character.ratings, [action.id]: clamp(action.value, min, max) },
      })
    }
    case 'resource': {
      const next = withResource(character, action.resource, action.value)
      return touch(next)
    }
    case 'resource.adjust': {
      const next = adjustResource(character, action.adjustment)
      return next === character ? character : touch(next)
    }
    case 'ability.add': {
      const option = findAbility(action.definitionId)
      if (
        !option ||
        (!option.repeatable && character.abilities.some((item) => item.definitionId === option.id))
      )
        return character
      const next = {
        ...character,
        abilities: [
          ...character.abilities,
          {
            id: createId('ability'),
            definitionId: option.id,
            name: '',
            effect: '',
            choice: '',
            notes: '',
            used: 0,
          },
        ],
      }
      return touch({ ...next, healing: Math.max(next.healing, healingMinimum(next)) })
    }
    case 'ability.custom':
      return touch({
        ...character,
        abilities: [
          ...character.abilities,
          {
            id: createId('ability'),
            definitionId: '',
            name: '',
            effect: '',
            choice: '',
            notes: '',
            used: 0,
          },
        ],
      })
    case 'ability.patch': {
      const item = character.abilities.find((candidate) => candidate.id === action.id)
      if (!item) return character
      const option = findAbility(item.definitionId)
      const patch = {
        ...action.patch,
        definitionId: item.definitionId,
        used: clamp(action.patch.used ?? item.used, 0, option?.uses ?? 0),
      }
      if (
        option?.choices &&
        action.patch.choice &&
        !option.choices.some((choice) => choice.id === action.patch.choice)
      )
        return character
      const next = { ...character, abilities: patchList(character.abilities, item.id, patch) }
      return touch(next)
    }
    case 'ability.remove': {
      const next = {
        ...character,
        abilities: character.abilities.filter((item) => item.id !== action.id),
      }
      return touch({
        ...next,
        stress: Math.min(next.stress, stressMax(next)),
        armorUses: {
          ...next.armorUses,
          special: hasSpecialArmor(next) && next.armorUses.special,
        },
      })
    }
    case 'friend.patch': {
      const friends = character.friends.map((friend) =>
        action.patch.relation &&
        action.patch.relation !== 'neutral' &&
        friend.id !== action.id &&
        friend.relation === action.patch.relation
          ? { ...friend, relation: 'neutral' as const }
          : friend,
      )
      return touch({ ...character, friends: patchList(friends, action.id, action.patch) })
    }
    case 'friend.add':
      return touch({
        ...character,
        friends: [...character.friends, { id: createId('friend'), name: '', relation: 'neutral' }],
      })
    case 'friend.remove':
      return touch({
        ...character,
        friends: character.friends.filter((item) => item.id !== action.id),
      })
    case 'equipment': {
      const item = equipmentFor(character.playbookId).find((option) => option.id === action.id)
      if (!item || (item.requires && !character.equipment[item.requires] && action.quantity > 0))
        return character
      const equipment = {
        ...character.equipment,
        [item.id]: clamp(action.quantity, 0, item.quantity),
      }
      for (const option of equipmentFor(character.playbookId))
        if (option.requires && !equipment[option.requires]) equipment[option.id] = 0
      return touch({ ...character, equipment })
    }
    case 'item.use': {
      const item = equipmentFor(character.playbookId).find((option) => option.id === action.id)
      if (
        !item?.uses ||
        !character.equipment[item.id] ||
        action.index < 0 ||
        action.index >= item.uses
      )
        return character
      const values = Array.from(
        { length: item.uses },
        (_, index) => character.itemUses[item.id]?.[index] ?? '',
      )
      values[action.index] = action.value
      return touch({ ...character, itemUses: { ...character.itemUses, [item.id]: values } })
    }
    case 'customItem.add':
      return touch({
        ...character,
        customItems: [
          ...character.customItems,
          { id: createId('item'), name: '', load: 1, declared: false, notes: '' },
        ],
      })
    case 'customItem.patch': {
      const patch = {
        ...action.patch,
        ...(action.patch.load === undefined ? {} : { load: clamp(action.patch.load, 0, 9) }),
      }
      const next = { ...character, customItems: patchList(character.customItems, action.id, patch) }
      return touch(next)
    }
    case 'customItem.remove':
      return touch({
        ...character,
        customItems: character.customItems.filter((item) => item.id !== action.id),
      })
    case 'score.patch':
      return touch({ ...character, score: { ...character.score, ...action.patch } })
    case 'score.start':
      return touch({
        ...character,
        equipment: defaultSheet(character.playbookId).equipment,
        itemUses: defaultSheet(character.playbookId).itemUses,
        customItems: character.customItems.map((item) => ({ ...item, declared: false })),
        abilities: character.abilities.map((item) => ({ ...item, used: 0 })),
        armorUses: { ...character.armorUses, armor: false, heavy: false },
      })
    case 'specialArmor.reset':
      return touch({ ...character, armorUses: { ...character.armorUses, special: false } })
    case 'gather':
      return touch({
        ...character,
        gatherNotes: { ...character.gatherNotes, [action.key]: action.value },
      })
    case 'harm': {
      const harm = { ...character.harm }
      if (action.field === 'level1' || action.field === 'level2') {
        if (action.index !== 0 && action.index !== 1) return character
        const row: [string, string] = [...harm[action.field]]
        row[action.index] = action.value
        harm[action.field] = row
      } else harm[action.field] = action.value
      return touch({ ...character, harm })
    }
    case 'healing':
      return touch({ ...character, healing: clamp(action.value, healingMinimum(character), 4) })
    case 'armor': {
      if (action.kind === 'special' && !hasSpecialArmor(character)) return character
      if (
        action.kind !== 'special' &&
        !character.equipment[action.kind === 'armor' ? 'armor' : 'armor-heavy']
      )
        return character
      return touch({
        ...character,
        armorUses: { ...character.armorUses, [action.kind]: !character.armorUses[action.kind] },
      })
    }
    case 'trauma': {
      if (!action.name.trim()) return character
      const removing = character.traumas.includes(action.name)
      if (!removing && character.traumas.length >= TRAUMA_MAX) return character
      return touch({
        ...character,
        traumas: removing
          ? character.traumas.filter((item) => item !== action.name)
          : [...character.traumas, action.name],
      })
    }
    case 'carriedCoin':
      return touch({ ...character, carriedCoin: clamp(action.value, 0, character.coin) })
    case 'clock.add':
      return touch({
        ...character,
        clocks: [...character.clocks, { id: createId('clock'), name: '', filled: 0, total: 4 }],
      })
    case 'clock.patch': {
      const item = character.clocks.find((clock) => clock.id === action.id)
      if (!item) return character
      const total = clamp(action.patch.total ?? item.total, 1, 24)
      const patch = {
        ...action.patch,
        total,
        filled: clamp(action.patch.filled ?? item.filled, 0, total),
      }
      return touch({ ...character, clocks: patchList(character.clocks, item.id, patch) })
    }
    case 'clock.remove':
      return touch({
        ...character,
        clocks: character.clocks.filter((item) => item.id !== action.id),
      })
    case 'crew.name':
      return touch({ ...character, crew: { ...character.crew, name: action.name } })
  }
}
