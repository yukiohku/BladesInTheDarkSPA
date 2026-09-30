import type {
  Attributes,
  Character,
  ChoiceList,
  Clock,
  Crew,
  CrewMember,
  Weapon,
} from '../types/character'
import type { ChangeEntry, ChangeOperation, ResourceKey } from '../types/changelog'
import { SCHEMA_VERSION } from '../types/character'
import { createDefaultCharacter } from '../constants/defaults'
import { ATTRIBUTE_MAX, ATTRIBUTE_ORDER, VALIDATION } from '../constants/labels'
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
