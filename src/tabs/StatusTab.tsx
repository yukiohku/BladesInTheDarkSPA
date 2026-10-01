import { useState } from 'react'
import { TRAUMAS } from '../constants/playbooks'
import { useCharacter } from '../state/characterContext'
import { ClockEditor, Section, TextInput } from '../components/ui'
import { HarmPanel } from '../components/SheetPanels'
import { ResourceAdjustmentForm } from '../components/ResourceAdjustmentForm'
export function TraumaPanel({ compact = false }: { compact?: boolean }) {
  const { character, dispatch } = useCharacter()
  const [custom, setCustom] = useState('')
  return (
    <>
      {!compact && (
        <p className="field__hint">
          トラウマは永続的です。チェック解除は入力訂正です。4つ目で通常の悪党としての活動を終えます。
        </p>
      )}
      <div className="trauma-options">
        {TRAUMAS.map((option) => (
          <label key={option.id}>
            <input
              type="checkbox"
              checked={character.traumas.includes(option.id)}
              disabled={!character.traumas.includes(option.id) && character.traumas.length >= 4}
              onChange={() => dispatch({ type: 'trauma', name: option.id })}
            />
            {option.name}
          </label>
        ))}
      </div>
      {character.traumas
        .filter((name) => !TRAUMAS.some((option) => option.id === name))
        .map((name) => (
          <label key={name}>
            <input type="checkbox" checked onChange={() => dispatch({ type: 'trauma', name })} />
            {name}（取り込み・自由記入）
          </label>
        ))}
      <details className="trauma-extra" open={compact ? undefined : true}>
        {compact && <summary>自由記入・説明</summary>}
        {compact && (
          <p className="field__hint">
            トラウマは永続的です。解除は入力訂正。4つ目で通常の悪党としての活動を終えます。
          </p>
        )}
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (custom.trim()) {
              dispatch({ type: 'trauma', name: custom.trim() })
              setCustom('')
            }
          }}
        >
          <TextInput label="自由記入のトラウマ" value={custom} onChange={setCustom} />
          <button
            className="button"
            type="submit"
            disabled={
              !custom.trim() ||
              character.traumas.length >= 4 ||
              character.traumas.includes(custom.trim())
            }
          >
            トラウマを追加
          </button>
        </form>
      </details>
    </>
  )
}
export function StatusTab() {
  const { character, dispatch } = useCharacter()
  return (
    <>
      <Section title="数値の増減">
        <ResourceAdjustmentForm />
      </Section>
      <Section title="傷・治療・鎧">
        <HarmPanel />
      </Section>
      <Section title="トラウマ">
        <TraumaPanel />
      </Section>
      <Section
        title="ダウンタイムの開始"
        hint="能力の説明に従って特殊鎧を回復させます。ストレス・傷・能力の効果は手動で処理します。"
      >
        <button
          type="button"
          className="button"
          onClick={() => dispatch({ type: 'specialArmor.reset' })}
        >
          特殊鎧の使用をリセット
        </button>
      </Section>
      <Section title="長期プロジェクト・クロック">
        {character.clocks.map((clock) => (
          <ClockEditor
            key={clock.id}
            label={clock.name || 'クロック'}
            clock={clock}
            onPatch={(patch) => dispatch({ type: 'clock.patch', id: clock.id, patch })}
            onRemove={() => dispatch({ type: 'clock.remove', id: clock.id })}
          />
        ))}
        <button type="button" className="button" onClick={() => dispatch({ type: 'clock.add' })}>
          クロックを追加
        </button>
      </Section>
    </>
  )
}
