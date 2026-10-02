import { useState } from 'react'
import { ACTION_ALLOCATION_LABELS as LABELS } from '../constants/labels'
import { INITIAL_ALLOCATION_POINTS } from '../constants/playbooks'
import { canConfirmInitialAllocation, initialAllocationCount, totalActionGrowth } from '../lib/actionAllocation'
import { useCharacter } from '../state/characterContext'
import type { SheetState } from '../types/character'
import { RatingsPanel } from './SheetPanels'

export function ActionAllocationPanel() {
  const { character, dispatch } = useCharacter()
  const [draft, setDraft] = useState<SheetState['ratings'] | null>(null)
  const allocating = character.initialActionRatings === null || draft !== null
  const initial = draft ?? character.initialActionRatings ?? character.ratings
  const count = initialAllocationCount(character, initial)
  const growth = totalActionGrowth(character)
  return (
    <div className="action-editor">
      <RatingsPanel initialDraft={draft ?? undefined} onInitialChange={setDraft} />
      <aside className="action-allocation" aria-label={LABELS.region}>
        <div className="action-allocation__totals" role="status" aria-live="polite" aria-atomic="true">
          <p>{LABELS.initial}：<strong>{count}/{INITIAL_ALLOCATION_POINTS}点</strong></p>
          <p>{LABELS.growth}：<strong>{growth}点</strong></p>
        </div>
        <ul className="action-allocation__legend" aria-label="アクション欄の凡例">
          <li><span className="action-allocation__swatch action-allocation__swatch--fixed" />{LABELS.fixedLegend}</li>
          <li><span className="action-allocation__swatch action-allocation__swatch--initial" />{LABELS.initialLegend}</li>
          <li><span className="action-allocation__swatch action-allocation__swatch--growth" />{LABELS.growthLegend}</li>
        </ul>
        <p className="field__hint">{draft ? LABELS.revisionHint : allocating ? LABELS.allocating : LABELS.growthHint}</p>
        {allocating ? (
          <button
            type="button"
            className="button button--primary"
            disabled={!canConfirmInitialAllocation(character, initial)}
            onClick={() => {
              dispatch({ type: 'ratings.confirmInitial', ratings: initial })
              setDraft(null)
            }}
          >{LABELS.confirm}</button>
        ) : (
          <button
            type="button"
            className="button"
            onClick={() => {
              if (character.initialActionRatings) setDraft({ ...character.initialActionRatings })
            }}
          >{LABELS.revise}</button>
        )}
        {draft && (
          <>
            <button type="button" className="button button--ghost" onClick={() => setDraft(null)}>{LABELS.cancel}</button>
            {growth > 0 && <p className="field__hint">{LABELS.capacityHint}</p>}
          </>
        )}
        {!allocating && <p className="field__hint">{LABELS.manualHint}</p>}
      </aside>
    </div>
  )
}
