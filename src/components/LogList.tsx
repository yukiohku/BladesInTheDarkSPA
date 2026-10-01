import { useCharacter } from '../state/characterContext'
import { canRevert } from '../lib/changelog'
import type { ChangeEntry } from '../types/changelog'
export function LogList({ entries }: { entries: ChangeEntry[] }) {
  const { character, dispatch } = useCharacter()
  if (entries.length === 0) return <p className="empty">まだ記録がありません。</p>
  return (
    <ul className="log">
      {entries.map((entry) => (
        <li className="log__item" key={entry.id}>
          <div className="log__main">
            <span className="log__verb">{entry.title}</span>
            {entry.reason && <span className="log__reason">{entry.reason}</span>}
          </div>
          <div className="log__side">
            <time>{new Date(entry.at).toLocaleString('ja-JP')}</time>
            {canRevert(character, entry.id) && (
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
      ))}
    </ul>
  )
}
