import type {
  Attributes,
  Character,
  ChoiceList,
  Clock,
  Crew,
  CrewMember,
  OfficialSheet,
  PlanningSlot,
  Weapon,
} from '../types/character'
import type { ChangeEntry, ChangeOperation, ResourceKey } from '../types/changelog'
import { SCHEMA_VERSION } from '../types/character'
import { createDefaultCharacter, defaultOfficial } from '../constants/defaults'
import { ATTRIBUTE_MAX, ATTRIBUTE_ORDER, VALIDATION } from '../constants/labels'
import {
  COIN_MAX,
  HARM_MAX,
  HARM_ROWS,
  HEALING_CLOCK_SEGMENTS,
  PLAYBOOKS,
  RATING_MAX,
  VETERAN_SLOTS,
  XP_TRACK_MAX,
} from '../constants/playbooks'
import { createId, nowIso } from './id'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback
}

function asNumber(
  value: unknown,
  fallback: number,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
): number {
  const parsed = typeof value === 'number' ? value : Number.NaN
  if (Number.isNaN(parsed)) return fallback
  return Math.min(Math.max(parsed, min), max)
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function asStringArray(value: unknown): string[] {
  return asArray(value)
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

function asChoiceList(value: unknown, count?: number): ChoiceList[] {
  const list = asArray(value)
    .filter(isRecord)
    .map((item) => ({
      id: asString(item.id) || createId('pick'),
      name: asString(item.name),
      note: asString(item.note),
    }))

  if (count === undefined) return list
  while (list.length < count) {
    list.push({ id: createId('pick'), name: '', note: '' })
  }
  return list.slice(0, count)
}

function asClockList(value: unknown): Clock[] {
  return asArray(value)
    .filter(isRecord)
    .map((item) => {
      const total = Math.max(1, Math.round(asNumber(item.total, 6, 1, 24)))
      return {
        id: asString(item.id) || createId('clock'),
        name: asString(item.name),
        filled: Math.round(asNumber(item.filled, 0, 0, total)),
        total,
      }
    })
}

function asCrewMembers(value: unknown): CrewMember[] {
  return asArray(value)
    .filter(isRecord)
    .map((item) => ({
      id: asString(item.id) || createId('member'),
      name: asString(item.name),
      role: asString(item.role),
      note: asString(item.note),
      player: asBoolean(item.player),
    }))
}

function asWeapons(value: unknown): Weapon[] {
  return asArray(value)
    .filter(isRecord)
    .map((item) => ({
      id: asString(item.id) || createId('weapon'),
      name: asString(item.name),
      range: asString(item.range),
      damage: asString(item.damage),
      load: asString(item.load),
      effect: asString(item.effect),
    }))
}

function asLog(value: unknown): ChangeEntry[] {
  const resources: ResourceKey[] = ['edges', 'stress', 'harm', 'trauma']
  const operations: ChangeOperation[] = ['increase', 'decrease']

  return asArray(value)
    .filter(isRecord)
    .filter((item) => resources.includes(asString(item.resource) as ResourceKey))
    .filter((item) => operations.includes(asString(item.operation) as ChangeOperation))
    .map((item) => ({
      id: asString(item.id) || createId('chg'),
      resource: asString(item.resource) as ResourceKey,
      operation: asString(item.operation) as ChangeOperation,
      amount: asNumber(item.amount, 0, 0, 999),
      reason: asString(item.reason),
      detail: asString(item.detail),
      before: asNumber(item.before, 0, 0, 999),
      after: asNumber(item.after, 0, 0, 999),
      at: asString(item.at, nowIso()),
    }))
}

function asAttributes(value: unknown): Attributes {
  const base = createDefaultCharacter().attributes
  if (!isRecord(value)) return base

  const result = {} as Attributes
  for (const key of ATTRIBUTE_ORDER) {
    result[key] = Math.round(asNumber(value[key], base[key], 0, ATTRIBUTE_MAX))
  }
  return result
}

function asCrew(value: unknown): Crew {
  const base = createDefaultCharacter().crew
  if (!isRecord(value)) return base

  return {
    name: asString(value.name),
    typeId: asString(value.typeId),
    typeName: asString(value.typeName),
    tier: Math.round(asNumber(value.tier, 1, 1, 6)),
    charter: asString(value.charter),
    summary: asString(value.summary),
    hold: Math.round(asNumber(value.hold, 0, 0, 24)),
    influence: Math.round(asNumber(value.influence, 0, 0, 24)),
    holdTotal: Math.round(asNumber(value.holdTotal, 6, 1, 24)),
    influenceTotal: Math.round(asNumber(value.influenceTotal, 6, 1, 24)),
    territory: asString(value.territory),
    lair: asString(value.lair),
    liabilities: asChoiceList(value.liabilities),
    services: asChoiceList(value.services),
    itemRoster: asChoiceList(value.itemRoster),
    roster: asCrewMembers(value.roster),
    notes: asString(value.notes),
  }
}

function asBooleanMap(value: unknown, keys: string[]): Record<string, boolean> {
  const source = isRecord(value) ? value : {}
  const result: Record<string, boolean> = {}
  for (const key of keys) result[key] = asBoolean(source[key])
  return result
}

function asNumberMap(value: unknown, max: number): Record<string, number> {
  const source = isRecord(value) ? value : {}
  const result: Record<string, number> = {}
  for (const [key, raw] of Object.entries(source)) {
    if (typeof raw === 'number') result[key] = Math.round(clampValue(raw, 0, max))
  }
  return result
}

function clampValue(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function asBoolPair(value: unknown): [boolean, boolean] {
  if (!Array.isArray(value)) return [false, false]
  return [asBoolean(value[0]), asBoolean(value[1])]
}

function asNumPair(value: unknown): [number, number] {
  if (!Array.isArray(value)) return [0, 0]
  return [
    Math.round(clampValue(asNumber(value[0], 0), 0, COIN_MAX)),
    Math.round(clampValue(asNumber(value[1], 0), 0, COIN_MAX)),
  ]
}

function asStringPair(value: unknown): [string, string] {
  if (!Array.isArray(value)) return ['', '']
  return [asString(value[0]), asString(value[1])]
}

function asPlanning(value: unknown, ids: string[]): Record<string, PlanningSlot> {
  const source = isRecord(value) ? value : {}
  const result: Record<string, PlanningSlot> = {}
  for (const id of ids) {
    const slot = isRecord(source[id]) ? source[id] : {}
    result[id] = { detail: asString(slot.detail), load: asString(slot.load) }
  }
  return result
}

function asOfficial(value: unknown): OfficialSheet {
  const base = defaultOfficial()
  if (!isRecord(value)) return base

  const playbook = PLAYBOOKS[asString(value.playbookId, 'cutter')] ?? PLAYBOOKS.cutter

  const harmNotes: Record<string, string> = {}
  for (const row of HARM_ROWS) {
    const raw = isRecord(value.harmNotes) ? value.harmNotes : {}
    harmNotes[String(row.level)] = asString(raw[String(row.level)])
  }

  const armorUses = isRecord(value.armorUses) ? value.armorUses : {}

  return {
    playbookId: playbook.id,

    crewName: asString(value.crewName),
    alias: asString(value.alias),
    look: asString(value.look),

    heritageIds: asStringArray(value.heritageIds),
    backgroundIds: asStringArray(value.backgroundIds),
    viceIds: asStringArray(value.viceIds),
    traumaIds: asStringArray(value.traumaIds),

    harmLevel: Math.round(asNumber(value.harmLevel, 0, 0, HARM_MAX)),
    harmNotes,
    healingFilled: Math.round(
      asNumber(value.healingFilled, 0, 0, HEALING_CLOCK_SEGMENTS),
    ),
    armorUses: {
      armor: asBoolean(armorUses.armor),
      heavy: asBoolean(armorUses.heavy),
      special: asBoolean(armorUses.special),
    },

    stash: Math.round(asNumber(value.stash, 0, 0, COIN_MAX)),
    coin: Math.round(asNumber(value.coin, 0, 0, COIN_MAX)),
    extraTrackLabels: asStringPair(value.extraTrackLabels),
    extraTrackChecks: asBoolPair(value.extraTrackChecks),
    extraTrackFilled: asNumPair(value.extraTrackFilled),

    playbookXp: Math.round(asNumber(value.playbookXp, 0, 0, XP_TRACK_MAX)),
    insightXp: Math.round(asNumber(value.insightXp, 0, 0, XP_TRACK_MAX)),
    prowessXp: Math.round(asNumber(value.prowessXp, 0, 0, XP_TRACK_MAX)),
    resolveXp: Math.round(asNumber(value.resolveXp, 0, 0, XP_TRACK_MAX)),
    ratings: asNumberMap(value.ratings, RATING_MAX),

    abilityId: asString(value.abilityId),
    veteranSlots: asStringArray(value.veteranSlots).slice(0, VETERAN_SLOTS),

    friends: Array.isArray(value.friends)
      ? value.friends.filter(isRecord).slice(0, 10).map((item) => ({
          id: asString(item.id) || createId('friend'),
          name: asString(item.name),
          up: asBoolean(item.up),
          down: asBoolean(item.down),
        }))
      : [],
    generalItems: asBooleanMap(
      value.generalItems,
      playbook.itemsGeneral.map((item) => item.id),
    ),
    playbookItems: asBooleanMap(
      value.playbookItems,
      playbook.itemsPlaybook.map((item) => item.id),
    ),

    teamwork: asBooleanMap(
      value.teamwork,
      playbook.teamwork.map((item) => item.id),
    ),
    planning: asPlanning(
      value.planning,
      playbook.planning.map((item) => item.id),
    ),
    gatherInfo: (Array.isArray(value.gatherInfo) ? value.gatherInfo : [])
      .map((item) => asString(item))
      .slice(0, playbook.gatherInfo.length)
      .concat(Array<string>(Math.max(0, playbook.gatherInfo.length)).fill('')),
  }
}

export type ParseResult =
  | { ok: true; character: Character }
  | { ok: false; error: string }

/**
 * 壊れた項目は既定値に差し替える寛容な読み込み。
 * 手書きで編集したJSONでも可能な限り開けるようにするため。
 */
export function normalizeCharacter(input: unknown): Character {
  const base = createDefaultCharacter()
  if (!isRecord(input)) return base

  const basics = isRecord(input.basics) ? input.basics : {}
  const timestamp = nowIso()

  return {
    schemaVersion: SCHEMA_VERSION,
    id: asString(input.id) || base.id,
    createdAt: asString(input.createdAt, timestamp),
    updatedAt: asString(input.updatedAt, timestamp),

    basics: {
      name: asString(basics.name),
      pronouns: asString(basics.pronouns),
      heritageId: asString(basics.heritageId),
      heritageName: asString(basics.heritageName),
      backgroundId: asString(basics.backgroundId),
      backgroundName: asString(basics.backgroundName),
      summary: asString(basics.summary),
    },

    attributes: asAttributes(input.attributes),
    official: asOfficial(input.official),
    drives: asChoiceList(input.drives, 3),
    heritageAbilities: asChoiceList(input.heritageAbilities, 2),
    backgroundAbilities: asChoiceList(input.backgroundAbilities, 3),
    crewRole: asString(input.crewRole),
    roleAbilities: asChoiceList(input.roleAbilities, 1),
    specialAbilities: asChoiceList(input.specialAbilities, 1),
    vices: asChoiceList(input.vices, 3),

    crew: asCrew(input.crew),

    edges: Math.round(asNumber(input.edges, 0, 0, 4)),
    stress: Math.round(asNumber(input.stress, 0, 0, 99)),
    stressMax: Math.round(asNumber(input.stressMax, 9, 1, 20)),
    traumas: asChoiceList(input.traumas),
    flaws: asChoiceList(input.flaws, 3),
    armor: Math.round(asNumber(input.armor, 0, 0, 6)),
    armorEffect: Math.round(asNumber(input.armorEffect, 0, 0, 6)),
    harm: Math.round(asNumber(input.harm, 0, 0, 4)),
    harmClocks: asClockList(input.harmClocks),

    weapons: asWeapons(input.weapons),
    dramaticUnderscores: asStringArray(input.dramaticUnderscores),
    customMoves: asStringArray(input.customMoves),
    notes: asString(input.notes),
    log: asLog(input.log),
  }
}

export function parseCharacterFile(raw: string): ParseResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return { ok: false, error: VALIDATION.notObject }
  }

  if (!isRecord(parsed)) return { ok: false, error: VALIDATION.notObject }

  const version = asNumber(parsed.schemaVersion, 1, 0, 999)
  if (version > SCHEMA_VERSION) return { ok: false, error: VALIDATION.futureSchema }

  const looksLikeSheet = isRecord(parsed.basics) || isRecord(parsed.attributes)
  if (!looksLikeSheet) return { ok: false, error: VALIDATION.badCharacter }

  return { ok: true, character: normalizeCharacter(parsed) }
}

export function serializeCharacter(character: Character): string {
  return `${JSON.stringify(character, null, 2)}\n`
}

export function suggestedFileName(character: Character): string {
  const safe = character.basics.name.trim().replace(/[\\/:*?"<>|\s]+/g, '-') || 'sheet'
  const date = new Date().toISOString().slice(0, 10)
  return `bitd-${safe}-${date}.json`
}
