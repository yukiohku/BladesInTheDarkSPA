import type { Character, SheetState } from '../types/character'
import type { ChangeDraft } from '../types/changelog'
import { createId, nowIso } from './id'
import { resourceValue, withResource } from './rules'
import { RESOURCE_LABELS } from '../constants/labels'
export { clamp } from './rules'
export function sheetSnapshot(character: Character): SheetState {
  const {
    schemaVersion: _version,
    id: _id,
    createdAt: _created,
    updatedAt: _updated,
    log: _log,
    legacy: _legacy,
    ...sheet
  } = character
  return sheet
}
export function recordChange(
  before: Character,
  after: Character,
  title: string,
  reason = '',
): Character {
  if (JSON.stringify(sheetSnapshot(before)) === JSON.stringify(sheetSnapshot(after))) return before
  const at = nowIso()
  return {
    ...after,
    updatedAt: at,
    log: [
      {
        id: createId('chg'),
        title,
        reason: reason.trim(),
        at,
        before: sheetSnapshot(before),
        after: sheetSnapshot(after),
      },
      ...before.log,
    ],
  }
}
export function applyChange(character: Character, draft: ChangeDraft): Character {
  if (!Number.isFinite(draft.amount) || draft.amount < 1) return character
  const before = resourceValue(character, draft.resource)
  const next = withResource(
    character,
    draft.resource,
    before + (draft.operation === 'increase' ? 1 : -1) * Math.floor(draft.amount),
  )
  return recordChange(
    character,
    next,
    `${RESOURCE_LABELS[draft.resource]} ${before} → ${resourceValue(next, draft.resource)}`,
    draft.reason,
  )
}
export function canRevert(character: Character, entryId: string) {
  const entry = character.log[0]
  return (
    entry?.id === entryId &&
    JSON.stringify(sheetSnapshot(character)) === JSON.stringify(entry.after)
  )
}
export function revertChange(character: Character, entryId: string): Character {
  if (!canRevert(character, entryId)) return character
  return {
    ...character,
    ...character.log[0].before,
    updatedAt: nowIso(),
    log: character.log.slice(1),
  }
}
