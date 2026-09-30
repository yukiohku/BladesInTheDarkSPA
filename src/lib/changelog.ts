import type { Character } from '../types/character'
import type { ChangeDraft, ChangeEntry, ResourceKey } from '../types/changelog'
import { HARM_LEVELS, RESOURCES } from '../constants/labels'
import { createId, nowIso } from './id'

export interface ResourceBounds {
  min: number
  max: number
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function resourceBounds(character: Character, resource: ResourceKey): ResourceBounds {
  switch (resource) {
    case 'edges':
      return { min: RESOURCES.edges.min, max: RESOURCES.edges.max }
    case 'stress':
      return { min: RESOURCES.stress.min, max: character.stressMax }
    case 'harm':
      return { min: RESOURCES.harm.min, max: RESOURCES.harm.max }
    case 'trauma':
      return { min: 0, max: Infinity }
  }
}

export function currentValue(character: Character, resource: ResourceKey): number {
  switch (resource) {
    case 'edges':
      return character.edges
    case 'stress':
      return character.stress
    case 'harm':
      return character.harm
    case 'trauma':
      return character.traumas.length
  }
}

function setResource(character: Character, resource: ResourceKey, value: number): Character {
  switch (resource) {
    case 'edges':
      return { ...character, edges: value }
    case 'stress':
      return { ...character, stress: value }
    case 'harm':
      return { ...character, harm: value }
    case 'trauma':
      return character
  }
}

function makeEntry(
  draft: ChangeDraft,
  before: number,
  after: number,
  detail: string,
): ChangeEntry {
  return {
    id: createId('chg'),
    resource: draft.resource,
    operation: draft.operation,
    amount: Math.abs(after - before),
    reason: draft.reason.trim(),
    detail,
    before,
    after,
    at: nowIso(),
  }
}

export function applyChange(character: Character, draft: ChangeDraft): Character {
  const before = currentValue(character, draft.resource)
  const detail = (draft.detail ?? '').trim()
  const bounds = resourceBounds(character, draft.resource)

  if (draft.resource === 'trauma') {
    return applyTraumaChange(character, draft, detail, before)
  }

  const amount = Math.max(0, Math.floor(draft.amount))
  if (amount === 0) return character

  const direction = draft.operation === 'increase' ? 1 : -1
  const after = clamp(before + direction * amount, bounds.min, bounds.max)
  if (after === before) return character

  const entry = makeEntry(draft, before, after, detail)
  const next = setResource(character, draft.resource, after)
  return { ...next, updatedAt: nowIso(), log: [entry, ...next.log] }
}

function applyTraumaChange(
  character: Character,
  draft: ChangeDraft,
  detail: string,
  before: number,
): Character {
  if (draft.operation === 'increase') {
    if (!detail) return character
    if (character.traumas.some((trauma) => trauma.name === detail)) return character

    const entry = makeEntry(draft, before, before + 1, detail)
    return {
      ...character,
      updatedAt: nowIso(),
      traumas: [...character.traumas, { id: createId('pick'), name: detail, note: '' }],
      log: [entry, ...character.log],
    }
  }

  if (character.traumas.length === 0) return character
  const removed = character.traumas[character.traumas.length - 1]
  const entry = makeEntry(draft, before, before - 1, removed.name)
  return {
    ...character,
    updatedAt: nowIso(),
    traumas: character.traumas.slice(0, -1),
    log: [entry, ...character.log],
  }
}

function restore(character: Character, entry: ChangeEntry): Character {
  if (entry.resource === 'trauma') {
    if (entry.operation === 'increase') {
      return {
        ...character,
        traumas: character.traumas.filter((trauma) => trauma.name !== entry.detail),
      }
    }
    if (character.traumas.some((trauma) => trauma.name === entry.detail)) return character
    return {
      ...character,
      traumas: [...character.traumas, { id: createId('pick'), name: entry.detail, note: '' }],
    }
  }
  return setResource(character, entry.resource, entry.before)
}

/** 取り消しできるのは直近の1件のみ（値の一貫性を保つため）。 */
export function canRevert(character: Character, entryId: string): boolean {
  return character.log[0]?.id === entryId
}

export function revertChange(character: Character, entryId: string): Character {
  const entry = character.log.find((candidate) => candidate.id === entryId)
  if (!entry || !canRevert(character, entryId)) return character

  const restored = restore(character, entry)
  return {
    ...restored,
    updatedAt: nowIso(),
    log: character.log.slice(1),
  }
}

export function formatValue(resource: ResourceKey, value: number): string {
  if (resource === 'harm') return HARM_LEVELS[clamp(value, 0, HARM_LEVELS.length - 1)]
  return `${value}`
}

export function describeChange(entry: ChangeEntry): string {
  const meta = RESOURCES[entry.resource]
  const sign = entry.operation === 'increase' ? '+' : '−'
  const amount = entry.resource === 'trauma' ? '1' : `${sign}${entry.amount}`
  return `${meta.pastTense[entry.operation]}（${amount}）`
}
