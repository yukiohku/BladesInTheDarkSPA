import { useRef, useState } from 'react'
import { MESSAGE, PLAYBOOK_LABELS } from '../constants/labels'
import { parseCharacterFile, serializeCharacter, suggestedFileName } from '../lib/serialize'
import { hasBackup, loadBackup, saveBackup } from '../lib/storage'
import { useCharacter } from '../state/characterContext'
import { Section, SelectInput } from '../components/ui'
import { isPlaybookId, PLAYBOOK_LIST } from '../constants/playbooks'
import type { PlaybookId } from '../types/character'

function formatTimestamp(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString('ja-JP')
}

export function DataTab() {
  const { character, dispatch } = useCharacter()
  const fileInput = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(false)
  const [newPlaybook, setNewPlaybook] = useState<PlaybookId | null>(null)

  const json = serializeCharacter(character)
  const canRestore = hasBackup()

  const download = () => {
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = suggestedFileName(character)
    document.body.append(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    setError('')
    setMessage(MESSAGE.exportOk)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json)
      setError('')
      setMessage(MESSAGE.copied)
    } catch {
      setError(MESSAGE.copyFailed)
    }
  }

  const upload = async (file: File) => {
    let text: string
    try {
      text = await file.text()
    } catch {
      setError('ファイルを読み込めませんでした。')
      return
    }
    const result = parseCharacterFile(text)

    if (!result.ok) {
      setMessage('')
      setError(result.error)
      return
    }

    const name = result.character.identity.name || '無名'
    if (
      !window.confirm(`「${name}」を読み込みます。現在のシートは置き換わります。よろしいですか？`)
    ) {
      return
    }

    if (!saveBackup(character)) {
      setError(
        'バックアップを保存できなかったため、取り込みを中止しました。現在のJSONを書き出してください。',
      )
      return
    }
    if (!dispatch({ type: 'replace', character: result.character })) {
      setError('元の保存データを保護できなかったため、取り込みを中止しました。')
      return
    }
    setError('')
    setMessage(MESSAGE.importOk)
  }

  const restoreBackup = () => {
    const backup = loadBackup()
    if (!backup) {
      setMessage('')
      setError(MESSAGE.noBackup)
      return
    }
    if (!window.confirm('取り込み前のシートに戻します。よろしいですか？')) return

    if (!dispatch({ type: 'replace', character: backup })) {
      setError('元の保存データを保護できなかったため、復元を中止しました。')
      return
    }
    setError('')
    setMessage(MESSAGE.restored)
  }

  const reset = () => {
    if (!window.confirm(MESSAGE.resetConfirm)) return
    if (!saveBackup(character)) {
      setError('バックアップを保存できなかったため、新規作成を中止しました。')
      return
    }
    if (!dispatch({ type: 'reset', playbookId: newPlaybook })) {
      setError('元の保存データを保護できなかったため、新規作成を中止しました。')
      return
    }
    setError('')
    setMessage(MESSAGE.resetDone)
  }

  return (
    <>
      <Section
        title="エクスポート"
        hint={`1キャラクター1ファイルで書き出します。ファイル名: ${suggestedFileName(character)}`}
      >
        <div className="inline-add">
          <button type="button" className="button button--primary" onClick={download}>
            JSONをダウンロード
          </button>
          <button type="button" className="button" onClick={copy}>
            クリップボードにコピー
          </button>
        </div>
      </Section>

      <Section title="インポート" hint="保存したJSONファイルを読み込みます。">
        <input
          ref={fileInput}
          className="field__input"
          type="file"
          aria-label="キャラクターJSONファイル"
          accept="application/json,.json"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) void upload(file)
            event.target.value = ''
          }}
        />
        {canRestore && (
          <div className="inline-add">
            <button type="button" className="button" onClick={restoreBackup}>
              取り込み前のシートに戻す
            </button>
          </div>
        )}
      </Section>

      <Section title="内容の確認">
        <div className="inline-add">
          <button type="button" className="button" onClick={() => setPreview((prev) => !prev)}>
            {preview ? 'JSONを隠す' : 'JSONを表示'}
          </button>
        </div>
        {preview && <pre className="code">{json}</pre>}
      </Section>

      <Section title="このシートについて">
        <dl className="meta">
          <dt>最終更新</dt>
          <dd>{formatTimestamp(character.updatedAt)}</dd>
          <dt>作成日</dt>
          <dd>{formatTimestamp(character.createdAt)}</dd>
        </dl>
        <p className="field__hint">
          データはブラウザの中だけに保存されます。別の端末へ移すときは、エクスポートを利用してください。
        </p>
        <SelectInput
          label="新しいキャラクターのプレイブック"
          value={newPlaybook ?? ''}
          emptyLabel={PLAYBOOK_LABELS.unselected}
          options={PLAYBOOK_LIST.map((book) => ({ id: book.id, name: book.title }))}
          onChange={(value) => {
            if (value === '') setNewPlaybook(null)
            else if (isPlaybookId(value)) setNewPlaybook(value)
          }}
        />
        <button type="button" className="button button--danger" onClick={reset}>
          新しいキャラクターを作成
        </button>
      </Section>

      {character.legacy.length > 0 && (
        <Section
          title="移行・変更前のデータ"
          hint="旧形式の独自項目や履歴、修正前の上限を超える値はここに保管しています。現在のJSONにも含まれます。"
        >
          {character.legacy.map((archive, index) => (
            <details key={`${archive.at}:${index}`}>
              <summary>{archive.title}</summary>
              <pre className="code">{JSON.stringify(archive.data, null, 2)}</pre>
            </details>
          ))}
        </Section>
      )}

      {(message || error) && (
        <p className={error ? 'field__error' : 'field__ok'} role="status">
          {error || message}
        </p>
      )}
    </>
  )
}
