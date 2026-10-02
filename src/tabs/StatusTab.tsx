import { useState } from 'react'
import { TRAUMAS } from '../constants/playbooks'
import { STATUS_LABELS } from '../constants/labels'
import { useCharacter } from '../state/characterContext'
import { Section, TextInput } from '../components/ui'
import { HarmPanel } from '../components/SheetPanels'
import { ResourceControls } from '../components/ResourceControls'
export function TraumaPanel({ compact = false }: { compact?: boolean }) {
  const { character, dispatch } = useCharacter()
  const [custom, setCustom] = useState('')
  return (
    <div className={compact ? undefined : 'trauma-panel'}>
      <div className="trauma-options">
        {TRAUMAS.map((option) => (
          <label key={option.id} className={character.traumas.includes(option.id) ? 'trauma-option--on' : undefined}>
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
      {!compact && <p className="field__hint">{STATUS_LABELS.traumaHint}</p>}
      <details className="trauma-extra">
        <summary>{compact ? '自由記入・説明' : STATUS_LABELS.traumaExtra}</summary>
        {compact && <p className="field__hint">{STATUS_LABELS.traumaHint}</p>}
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
    </div>
  )
}
export function StatusTab() {
  const { character } = useCharacter()
  return (
    <div className="status-layout">
      <div className="status-resources">
        <Section title={STATUS_LABELS.assets}>
          <ResourceControls resources={['coin', 'stash']} />
        </Section>
        <Section title={STATUS_LABELS.experience}>
          <ResourceControls resources={['playbook', 'insight', 'prowess', 'resolve']} />
        </Section>
      </div>
      <Section title={STATUS_LABELS.condition}>
        <ResourceControls resources={['stress']} />
        <div className="status-subheading">
          <h3>トラウマ</h3>
          <span>{character.traumas.length} / 4</span>
        </div>
        <TraumaPanel />
      </Section>
      <Section title={STATUS_LABELS.harm}>
        <HarmPanel />
      </Section>
    </div>
  )
}
