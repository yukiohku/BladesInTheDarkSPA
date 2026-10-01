import type {
  AcquiredAbility,
  ActionId,
  Character,
  ChoiceList,
  Clock,
  Crew,
  CrewMember,
  CustomItem,
  Friend,
  PlaybookId,
  SheetState,
} from '../types/character'
import type { ChangeDraft, ResourceKey } from '../types/changelog'
import { createDefaultCharacter, defaultSheet } from '../constants/defaults'
import {
  ACTIONS,
  CREATION_RATING_MAX,
  equipmentFor,
  findAbility,
  PLAYBOOKS,
  RATING_MAX,
  TRAUMA_MAX,
} from '../constants/playbooks'
import { applyChange, recordChange, revertChange } from '../lib/changelog'
import {
  clamp,
  creationProblems,
  creationRemaining,
  hasSpecialArmor,
  healingMinimum,
  resourceValue,
  stressMax,
  withResource,
} from '../lib/rules'
import { createId, nowIso } from '../lib/id'
import { RESOURCE_LABELS } from '../constants/labels'
export type CrewChoiceField = 'liabilities' | 'services' | 'itemRoster'
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
  | { type: 'change.apply'; draft: ChangeDraft }
  | { type: 'change.revert'; entryId: string }
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
      reason?: string
    }
  | { type: 'healing'; value: number }
  | { type: 'armor'; kind: 'armor' | 'heavy' | 'special' }
  | { type: 'trauma'; name: string }
  | { type: 'carriedCoin'; value: number }
  | { type: 'clock.add' }
  | { type: 'clock.patch'; id: string; patch: Partial<Clock> }
  | { type: 'clock.remove'; id: string }
  | { type: 'crew.patch'; patch: Partial<Crew> }
  | { type: 'crewChoice.patch'; field: CrewChoiceField; id: string; patch: Partial<ChoiceList> }
  | { type: 'crewChoice.add'; field: CrewChoiceField }
  | { type: 'crewChoice.remove'; field: CrewChoiceField; id: string }
  | { type: 'member.add' }
  | { type: 'member.patch'; id: string; patch: Partial<CrewMember> }
  | { type: 'member.remove'; id: string }
function patchList<T extends { id: string }>(items: T[], id: string, patch: Partial<T>): T[] {
  return items.map((item) => (item.id === id ? { ...item, ...patch, id: item.id } : item))
}
function touch(character: Character): Character {
  return { ...character, updatedAt: nowIso() }
}
export function characterReducer(character: Character, action: Action): Character {
  const record = (next: Character, title: string, reason = '') =>
    recordChange(character, next, title, reason)
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
      const next = {
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
        ratings: action.resetRatings ? base.ratings : character.ratings,
        creationComplete: action.resetRatings ? false : character.creationComplete,
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
            },
          },
        ],
      }
      return record(
        next,
        `プレイブック ${PLAYBOOKS[character.playbookId].title} → ${PLAYBOOKS[action.playbookId].title}`,
      )
    }
    case 'creation.complete':
      return creationProblems(character).length
        ? character
        : record({ ...character, creationComplete: true }, 'キャラクター作成を完了')
    case 'ratings.reset':
      return record(
        {
          ...character,
          ratings: defaultSheet(character.playbookId).ratings,
          creationComplete: false,
        },
        '初期アクションを再設定',
      )
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
      return record(
        {
          ...character,
          ratings: { ...character.ratings, [action.id]: clamp(action.value, min, max) },
        },
        `${ACTIONS.find((item) => item.id === action.id)?.name} を変更`,
      )
    }
    case 'resource': {
      const next = withResource(character, action.resource, action.value)
      return record(
        next,
        `${RESOURCE_LABELS[action.resource]} ${resourceValue(character, action.resource)} → ${resourceValue(next, action.resource)}`,
      )
    }
    case 'change.apply':
      return applyChange(character, action.draft)
    case 'change.revert':
      return revertChange(character, action.entryId)
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
      return record(
        { ...next, healing: Math.max(next.healing, healingMinimum(next)) },
        `${option.name} を取得`,
      )
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
      return action.patch.used === undefined
        ? touch(next)
        : record(next, `${option?.name ?? item.name} 使用回数を変更`)
    }
    case 'ability.remove': {
      const next = {
        ...character,
        abilities: character.abilities.filter((item) => item.id !== action.id),
      }
      return record(
        {
          ...next,
          stress: Math.min(next.stress, stressMax(next)),
          armorUses: {
            ...next.armorUses,
            special: hasSpecialArmor(next) && next.armorUses.special,
          },
        },
        '特殊能力を削除（入力訂正）',
      )
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
      return record({ ...character, equipment }, `${item.ja ?? item.name} 宣言数を変更`)
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
      return record(
        { ...character, itemUses: { ...character.itemUses, [item.id]: values } },
        `${item.ja ?? item.name} 使用枠${action.index + 1}を変更`,
      )
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
      return action.patch.declared === undefined
        ? touch(next)
        : record(next, '自由記入装備の宣言を変更')
    }
    case 'customItem.remove':
      return touch({
        ...character,
        customItems: character.customItems.filter((item) => item.id !== action.id),
      })
    case 'score.patch':
      return touch({ ...character, score: { ...character.score, ...action.patch } })
    case 'score.start':
      return record(
        {
          ...character,
          equipment: defaultSheet(character.playbookId).equipment,
          itemUses: defaultSheet(character.playbookId).itemUses,
          customItems: character.customItems.map((item) => ({ ...item, declared: false })),
          abilities: character.abilities.map((item) => ({ ...item, used: 0 })),
          armorUses: { ...character.armorUses, armor: false, heavy: false },
        },
        '次の仕事を開始（装備・使用回数・通常鎧をリセット）',
      )
    case 'specialArmor.reset':
      return record(
        { ...character, armorUses: { ...character.armorUses, special: false } },
        'ダウンタイム開始（特殊鎧をリセット）',
      )
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
      const label =
        action.field === 'fatal'
          ? '致命的な傷・結果'
          : `レベル${action.field === 'level1' ? 1 : action.field === 'level2' ? 2 : 3}の傷${action.index === undefined ? '' : ` ${action.index + 1}`}`
      return record({ ...character, harm }, `${label} を変更`, action.reason)
    }
    case 'healing':
      return record(
        { ...character, healing: clamp(action.value, healingMinimum(character), 4) },
        '治療クロックを変更',
      )
    case 'armor': {
      if (action.kind === 'special' && !hasSpecialArmor(character)) return character
      if (
        action.kind !== 'special' &&
        !character.equipment[action.kind === 'armor' ? 'armor' : 'armor-heavy']
      )
        return character
      return record(
        {
          ...character,
          armorUses: { ...character.armorUses, [action.kind]: !character.armorUses[action.kind] },
        },
        `鎧 ${action.kind} 使用を変更`,
      )
    }
    case 'trauma': {
      if (!action.name.trim()) return character
      const removing = character.traumas.includes(action.name)
      if (!removing && character.traumas.length >= TRAUMA_MAX) return character
      return record(
        {
          ...character,
          traumas: removing
            ? character.traumas.filter((item) => item !== action.name)
            : [...character.traumas, action.name],
        },
        removing ? 'トラウマを削除（入力訂正）' : 'トラウマを記録',
      )
    }
    case 'carriedCoin':
      return record(
        { ...character, carriedCoin: clamp(action.value, 0, character.coin) },
        '携帯するコインを変更',
      )
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
    case 'crew.patch':
      return touch({ ...character, crew: { ...character.crew, ...action.patch } })
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
          [action.field]: [
            ...character.crew[action.field],
            { id: createId('pick'), name: '', note: '' },
          ],
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
    case 'member.add':
      return touch({
        ...character,
        crew: {
          ...character.crew,
          roster: [
            ...character.crew.roster,
            { id: createId('member'), name: '', role: '', note: '', player: false },
          ],
        },
      })
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
  }
}
