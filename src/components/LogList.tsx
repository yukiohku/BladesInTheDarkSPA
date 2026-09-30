import type { ChangeEntry } from '../types/changelog'
import { RESOURCES } from '../constants/labels'
import { canRevert, describeChange, formatValue } from '../lib/changelog'
import { useCharacter } from '../state/characterContext'

function formatTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString('ja-JP', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function LogList({ entries }: { entries: ChangeEntry[] }) {
  const { character, dispatch } = useCharacter()

  if (entries.length === 0) {
    return <p className="empty">まだ記録がありません。</p>
  }

  return (
    <ul className="log">
      {entries.map((entry) => {
        const meta = RESOURCES[entry.resource]
        const revertible = canRevert(character, entry.id)

        return (
          <li className={`log__item log__item--${entry.operation}`} key={entry.id}>
            <div className="log__main">
              <span className="log__verb">{describeChange(entry)}</span>
              <span className="log__reason">{entry.reason}</span>
              {entry.detail && <span className="log__detail">{entry.detail}</span>}
            </div>
            <div className="log__side">
              <span className="log__value">
                {meta.label} {formatValue(entry.resource, entry.before)}
                {' → '}
                {formatValue(entry.resource, entry.after)}
              </span>
              <span className="log__time">{formatTime(entry.at)}</span>
              {revertible && (
                <button
                  type="button"
                  className="button button--danger-ghost"
                  onClick={() => dispatch({ type: 'change.revert', entryId: entry.id })}
                >
                  取り消す
                </button>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
