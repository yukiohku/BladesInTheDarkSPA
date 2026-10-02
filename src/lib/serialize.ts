import type {
  AcquiredAbility,
  Character,
  Clock,
  Crew,
  Friend,
  PlaybookId,
  SheetState,
} from '../types/character'
import { SCHEMA_VERSION } from '../types/character'
import { createDefaultCharacter, defaultCrew, defaultSheet } from '../constants/defaults'
import {
  ACTION_GROUPS,
  ACTIONS,
  ATTRIBUTE_XP_MAX,
  COIN_MAX,
  equipmentFor,
  findAbility,
  HEALING_CLOCK_SEGMENTS,
  INITIAL_ALLOCATION_POINTS,
  INITIAL_RATING_MAX,
  isPlaybookId,
  PLAYBOOK_XP_MAX,
  RATING_MAX,
  STASH_MAX,
  TRAUMAS,
} from '../constants/playbooks'
import { clamp, healingMinimum, stressMax } from './rules'
import { createId, nowIso } from './id'
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
function record(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {}
}
function str(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback
}
function bool(value: unknown, fallback = false) {
  return typeof value === 'boolean' ? value : fallback
}
function num(value: unknown, fallback: number, min = 0, max = 999) {
  return typeof value === 'number' && Number.isFinite(value) ? clamp(value, min, max) : fallback
}
function array(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}
function strings(value: unknown) {
  return array(value).filter((item): item is string => typeof item === 'string')
}
function stringMap(value: unknown): Record<string, string> {
  return Object.fromEntries(
    Object.entries(record(value)).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string',
    ),
  )
}
function choices(value: unknown) {
  return array(value)
    .filter(isRecord)
    .map((item) => ({
      id: str(item.id) || createId('pick'),
      name: str(item.name),
      note: str(item.note),
    }))
}
function clocks(value: unknown): Clock[] {
  return array(value)
    .filter(isRecord)
    .map((item) => {
      const total = num(item.total, 4, 1, 24)
      return {
        id: str(item.id) || createId('clock'),
        name: str(item.name),
        total,
        filled: num(item.filled, 0, 0, total),
      }
    })
}
function crew(value: unknown): Crew {
  const source = record(value)
  const base = defaultCrew()
  return {
    ...base,
    name: str(source.name),
    typeId: str(source.typeId),
    typeName: str(source.typeName),
    tier: num(source.tier, 1, 1, 6),
    charter: str(source.charter),
    summary: str(source.summary),
    holdTotal: num(source.holdTotal, 6, 1, 24),
    influenceTotal: num(source.influenceTotal, 6, 1, 24),
    hold: num(source.hold, 0, 0, num(source.holdTotal, 6, 1, 24)),
    influence: num(source.influence, 0, 0, num(source.influenceTotal, 6, 1, 24)),
    territory: str(source.territory),
    lair: str(source.lair),
    liabilities: choices(source.liabilities),
    services: choices(source.services),
    itemRoster: choices(source.itemRoster),
    roster: array(source.roster)
      .filter(isRecord)
      .map((item) => ({
        id: str(item.id) || createId('member'),
        name: str(item.name),
        role: str(item.role),
        note: str(item.note),
        player: bool(item.player),
      })),
    notes: str(source.notes),
  }
}
function abilities(value: unknown): AcquiredAbility[] {
  const result: AcquiredAbility[] = []
  for (const item of array(value).filter(isRecord)) {
    const definitionId = str(item.definitionId)
    const option = findAbility(definitionId)
    if (option && !option.repeatable && result.some((entry) => entry.definitionId === definitionId))
      continue
    const choice = str(item.choice)
    const requestedId = str(item.id)
    result.push({
      id:
        requestedId && !result.some((entry) => entry.id === requestedId)
          ? requestedId
          : createId('ability'),
      definitionId: option ? definitionId : '',
      name: str(item.name, option ? '' : definitionId),
      effect: str(item.effect),
      choice: option?.choices && !option.choices.some((entry) => entry.id === choice) ? '' : choice,
      notes: str(item.notes),
      used: num(item.used, 0, 0, option?.uses ?? 0),
    })
  }
  return result
}
export function normalizeSheet(value: unknown): SheetState {
  const source = record(value)
  const playbookId = isPlaybookId(source.playbookId) ? source.playbookId : 'cutter'
  const base = defaultSheet(playbookId)
  const identity = record(source.identity)
  const ratingSource = record(source.ratings)
  const initialSource = record(source.initialActionRatings)
  const xpSource = record(source.xp)
  const harm = record(source.harm)
  const armor = record(source.armorUses)
  const score = record(source.score)
  const equipment = record(source.equipment)
  const uses = record(source.itemUses)
  const next: SheetState = {
    ...base,
    playbookId,
    identity: {
      name: str(identity.name),
      look: str(identity.look),
      heritageId: str(identity.heritageId),
      heritageDetail: str(identity.heritageDetail),
      backgroundId: str(identity.backgroundId),
      backgroundDetail: str(identity.backgroundDetail),
      viceId: str(identity.viceId),
      viceDetail: str(identity.viceDetail),
      purveyor: str(identity.purveyor),
    },
    ratings: { ...base.ratings },
    xp: {
      playbook: num(xpSource.playbook, 0, 0, PLAYBOOK_XP_MAX),
      insight: num(xpSource.insight, 0, 0, ATTRIBUTE_XP_MAX),
      prowess: num(xpSource.prowess, 0, 0, ATTRIBUTE_XP_MAX),
      resolve: num(xpSource.resolve, 0, 0, ATTRIBUTE_XP_MAX),
    },
    abilities: abilities(source.abilities),
    friends: Array.isArray(source.friends)
      ? source.friends.filter(isRecord).map((item): Friend => ({
          id: str(item.id) || createId('friend'),
          name: str(item.name),
          relation:
            item.relation === 'friend' || item.relation === 'rival' ? item.relation : 'neutral',
        }))
      : base.friends,
    equipment: Object.fromEntries(
      equipmentFor(playbookId).map((item) => [
        item.id,
        num(equipment[item.id], 0, 0, item.quantity),
      ]),
    ),
    itemUses: Object.fromEntries(
      equipmentFor(playbookId)
        .filter((item) => item.uses)
        .map((item) => [
          item.id,
          Array.from({ length: item.uses ?? 0 }, (_, index) => str(array(uses[item.id])[index])),
        ]),
    ),
    customItems: array(source.customItems)
      .filter(isRecord)
      .map((item) => ({
        id: str(item.id) || createId('item'),
        name: str(item.name),
        load: num(item.load, 1, 0, 9),
        declared: bool(item.declared),
        notes: str(item.notes),
      })),
    score: {
      load: score.load === 'light' || score.load === 'heavy' ? score.load : 'normal',
      planId: str(score.planId),
      detail: str(score.detail),
    },
    gatherNotes: stringMap(source.gatherNotes),
    stress: num(source.stress, 0, 0, 99),
    traumas: [...new Set(strings(source.traumas))].filter((item) => item.trim()).slice(0, 4),
    harm: {
      level1: [str(array(harm.level1)[0]), str(array(harm.level1)[1])],
      level2: [str(array(harm.level2)[0]), str(array(harm.level2)[1])],
      level3: str(harm.level3),
      fatal: str(harm.fatal),
    },
    healing: num(source.healing, 0, 0, HEALING_CLOCK_SEGMENTS),
    armorUses: { armor: bool(armor.armor), heavy: bool(armor.heavy), special: bool(armor.special) },
    coin: num(source.coin, 0, 0, COIN_MAX),
    stash: num(source.stash, 0, 0, STASH_MAX),
    carriedCoin: num(source.carriedCoin, 0, 0, num(source.coin, 0, 0, COIN_MAX)),
    notes: str(source.notes),
    clocks: clocks(source.clocks),
    crew: crew(source.crew),
  }
  for (const item of ACTIONS)
    next.ratings[item.id] = num(
      ratingSource[item.id],
      base.ratings[item.id],
      base.ratings[item.id],
      RATING_MAX,
    )
  if (source.initialActionRatings === null) {
    const initial = { ...base.ratings }
    let remaining = INITIAL_ALLOCATION_POINTS
    for (const item of ACTIONS) {
      const value = num(ratingSource[item.id], base.ratings[item.id], base.ratings[item.id], INITIAL_RATING_MAX)
      const added = Math.min(remaining, value - base.ratings[item.id])
      initial[item.id] += added
      remaining -= added
    }
    next.ratings = initial
    next.initialActionRatings = null
  } else {
    const initial = { ...base.ratings }
    let remaining = INITIAL_ALLOCATION_POINTS
    for (const item of ACTIONS) {
      const value = num(initialSource[item.id], base.ratings[item.id], base.ratings[item.id], Math.min(INITIAL_RATING_MAX, next.ratings[item.id]))
      const added = Math.min(remaining, value - base.ratings[item.id])
      initial[item.id] += added
      remaining -= added
    }
    next.initialActionRatings = initial
  }
  next.stress = Math.min(next.stress, stressMax(next))
  next.healing = Math.max(next.healing, healingMinimum(next))
  for (const item of equipmentFor(playbookId))
    if (item.requires && !next.equipment[item.requires]) next.equipment[item.id] = 0
  return next
}
function migratedSheet(source: Record<string, unknown>): SheetState {
  const official = record(source.official)
  const basics = record(source.basics)
  const playbookId: PlaybookId = isPlaybookId(official.playbookId) ? official.playbookId : 'cutter'
  const base = defaultSheet(playbookId)
  const oldRatings = record(official.ratings)
  const oldHarm = record(official.harmNotes)
  const oldGeneral = record(official.generalItems)
  const oldPlaybook = record(official.playbookItems)
  const abilityId = str(official.abilityId)
  const selected = findAbility(`${playbookId}:${abilityId}`)
  const acquired: AcquiredAbility[] = selected
    ? [
        {
          id: createId('ability'),
          definitionId: selected.id,
          name: '',
          effect: '',
          choice: '',
          notes: '',
          used: 0,
        },
      ]
    : []
  for (const name of strings(official.veteranSlots).filter((item) => item.trim()))
    acquired.push({
      id: createId('ability'),
      definitionId: '',
      name,
      effect: '',
      choice: '',
      notes: 'v1のVeteranから移行',
      used: 0,
    })
  const ratings = { ...base.ratings }
  // 旧キャラクターへ初期値を加算しない。空のレートは旧形式の0として扱う。
  for (const group of ACTION_GROUPS)
    for (const item of group.items)
      ratings[item.id] = num(oldRatings[`${group.id}.${item.id}`], 0, 0, 4)
  const legacyTraumas = array(source.traumas)
    .filter(isRecord)
    .map((item) => str(item.name))
    .filter((name) => name.trim())
    .map((name) => TRAUMAS.find((option) => option.name === name)?.id ?? name)
  const oldLevel = num(source.harm, 0, 0, 4)
  const harmNote = (level: number, index = 0) =>
    str(oldHarm[`${level}-${index}`]) ||
    (index === 0
      ? str(oldHarm[String(level)]) ||
        (oldLevel === level ? `v1でレベル${level}の傷あり（内容未記入）` : '')
      : '')
  const next = normalizeSheet({
    ...base,
    initialActionRatings: base.ratings,
    ratings,
    abilities: acquired,
    identity: {
      ...base.identity,
      name: str(basics.name),
      look: str(official.look),
      heritageId: strings(official.heritageIds)[0] ?? str(basics.heritageId),
      heritageDetail: str(basics.heritageName),
      backgroundId: strings(official.backgroundIds)[0] ?? str(basics.backgroundId),
      backgroundDetail: str(basics.backgroundName),
      viceId: strings(official.viceIds)[0] ?? '',
    },
    xp: {
      playbook: official.playbookXp,
      insight: official.insightXp,
      prowess: official.prowessXp,
      resolve: official.resolveXp,
    },
    friends: Array.isArray(official.friends)
      ? official.friends.filter(isRecord).map((item) => ({
          id: str(item.id) || createId('friend'),
          name: str(item.name),
          relation: item.down ? 'rival' : item.up ? 'friend' : 'neutral',
        }))
      : base.friends,
    equipment: Object.fromEntries(
      equipmentFor(playbookId).map((item) => [
        item.id,
        oldGeneral[item.id] === true || oldPlaybook[item.id] === true ? 1 : 0,
      ]),
    ),
    harm: {
      level1: [harmNote(1), harmNote(1, 1)],
      level2: [harmNote(2), harmNote(2, 1)],
      level3: harmNote(3),
      fatal: oldLevel >= 4 ? 'v1で致命傷が記録されています' : '',
    },
    stress: source.stress,
    traumas: legacyTraumas,
    healing: official.healingFilled,
    armorUses: official.armorUses,
    coin: official.coin,
    stash: official.stash,
    notes: [str(basics.summary), str(source.notes)].filter(Boolean).join('\n\n'),
    clocks: source.harmClocks,
    crew: { ...record(source.crew), name: str(official.crewName) || str(record(source.crew).name) },
    gatherNotes: Object.fromEntries(
      strings(official.gatherInfo).map((text, index) => [`${playbookId}:${index}`, text]),
    ),
  })
  return next
}
export function normalizeCharacter(value: unknown): Character {
  if (!isRecord(value)) return createDefaultCharacter()
  const old = value.schemaVersion === undefined || value.schemaVersion === 1
  const base = createDefaultCharacter()
  const legacy = array(value.legacy)
    .filter(isRecord)
    .map((item) => ({
      title: str(item.title),
      at: str(item.at, nowIso()),
      data: item.data ?? null,
    }))
  return {
    ...(old ? migratedSheet(value) : normalizeSheet(value)),
    schemaVersion: SCHEMA_VERSION,
    id: str(value.id, base.id),
    createdAt: str(value.createdAt, base.createdAt),
    updatedAt: str(value.updatedAt, base.updatedAt),
    legacy: old
      ? [
          ...legacy,
          {
            title: 'v1から移行した原データ（独自項目・履歴・範囲外の値を含む）',
            at: nowIso(),
            data: value,
          },
        ]
      : legacy,
  }
}
export type ParseResult = { ok: true; character: Character } | { ok: false; error: string }
export function parseCharacterFile(raw: string): ParseResult {
  let value: unknown
  try {
    value = JSON.parse(raw)
  } catch {
    return { ok: false, error: 'JSONを読み込めません。ファイルの内容を確認してください。' }
  }
  if (!isRecord(value)) return { ok: false, error: 'キャラクターシートのオブジェクトが必要です。' }
  const version = value.schemaVersion ?? 1
  if (typeof version !== 'number' || !Number.isInteger(version) || version < 1)
    return { ok: false, error: '保存形式のバージョンが不正です。' }
  if (version > SCHEMA_VERSION)
    return { ok: false, error: '新しいバージョンのファイルです。アプリを更新してください。' }
  if (version === 2 && (!isRecord(value.identity) || !isPlaybookId(value.playbookId)))
    return { ok: false, error: 'キャラクターシートの身元またはプレイブックが不正です。' }
  if (version === 1 && !isRecord(value.basics) && !isRecord(value.attributes))
    return { ok: false, error: 'キャラクターシートの構造ではありません。' }
  return { ok: true, character: normalizeCharacter(value) }
}
export function serializeCharacter(character: Character) {
  return `${JSON.stringify(character, null, 2)}\n`
}
export function suggestedFileName(character: Character) {
  const safe = character.identity.name.trim().replace(/[\\/:*?"<>|\s]+/g, '-') || 'sheet'
  return `bitd-${safe}-${new Date().toISOString().slice(0, 10)}.json`
}
