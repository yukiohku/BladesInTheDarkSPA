import { useRef, useState } from 'react'
import { MESSAGE } from '../constants/labels'
import { parseCharacterFile, serializeCharacter, suggestedFileName } from '../lib/serialize'
import { useCharacter } from '../state/characterContext'
import { Section } from '../components/ui'

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

  const json = serializeCharacter(character)

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
      setError('コピーできませんでした。')
    }
  }

  const upload = async (file: File) => {
    const text = await file.text()
    const result = parseCharacterFile(text)

    if (!result.ok) {
      setMessage('')
      setError(result.error)
      return
    }

    const name = result.character.basics.name || '無名'
    if (!window.confirm(`「${name}」を読み込みます。現在のシートは置き換わります。よろしいですか？`)) {
      return
    }

    dispatch({ type: 'replace', character: result.character })
    setError('')
    setMessage(MESSAGE.importOk)
  }

  const reset = () => {
    if (!window.confirm(MESSAGE.resetConfirm)) return
    dispatch({ type: 'reset' })
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
          accept="application/json,.json"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) void upload(file)
            event.target.value = ''
          }}
        />
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
          <dt>記録件数</dt>
          <dd>{character.log.length} 件</dd>
        </dl>
        <p className="field__hint">
          データはブラウザの中だけに保存されます。別の端末へ移すときは、エクスポートを利用してください。
        </p>
        <button type="button" className="button button--danger" onClick={reset}>
          シートを初期化
        </button>
      </Section>

      {(message || error) && (
        <p className={error ? 'field__error' : 'field__ok'} role="status">
          {error || message}
        </p>
      )}
    </>
  )
}
