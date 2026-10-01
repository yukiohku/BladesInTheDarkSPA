import { useState } from 'react'
import { RESOURCE_LABELS } from '../constants/labels'
import { useCharacter } from '../state/characterContext'
import { resourceMax, resourceValue } from '../lib/rules'
import { SelectInput, Stepper, TextInput } from './ui'
import type { ResourceKey } from '../types/changelog'
const keys: ResourceKey[] = ['stress', 'coin', 'stash', 'playbook', 'insight', 'prowess', 'resolve']
export function ChangeRecorder() {
  const { character, dispatch } = useCharacter()
  const [resource, setResource] = useState<ResourceKey>('stress')
  const [operation, setOperation] = useState<'increase' | 'decrease'>('increase')
  const [amount, setAmount] = useState(1)
  const [reason, setReason] = useState('')
  const max = resourceMax(character, resource)
  const current = resourceValue(character, resource)
  const after = Math.max(0, Math.min(max, current + (operation === 'increase' ? amount : -amount)))
  return (
    <form
      className="recorder"
      onSubmit={(event) => {
        event.preventDefault()
        dispatch({ type: 'change.apply', draft: { resource, operation, amount, reason } })
      }}
    >
      <SelectInput
        label="記録する対象"
        value={resource}
        options={keys.map((id) => ({ id, name: RESOURCE_LABELS[id] }))}
        onChange={(value) => {
          const next = keys.find((key) => key === value)
          if (next) {
            setResource(next)
            setAmount(1)
          }
        }}
      />
      <SelectInput
        label="増減"
        value={operation}
        options={[
          { id: 'increase', name: '増やす' },
          { id: 'decrease', name: '減らす' },
        ]}
        onChange={(value) => {
          if (value === 'increase' || value === 'decrease') setOperation(value)
        }}
      />
      <Stepper label="数量" value={amount} min={1} max={max} onChange={setAmount} />
      <TextInput label="理由" value={reason} onChange={setReason} />
      <p aria-live="polite">
        {RESOURCE_LABELS[resource]} {current} → {after}（上限 {max}）
      </p>
      <button type="submit" className="button button--primary" disabled={current === after}>
        変動を記録
      </button>
    </form>
  )
}
