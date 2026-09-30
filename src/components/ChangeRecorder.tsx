import { useState } from 'react'
import type { ChangeOperation, ResourceKey } from '../types/changelog'
import { RESOURCES, RESOURCE_ORDER } from '../constants/labels'
import { clamp, currentValue, formatValue, resourceBounds } from '../lib/changelog'
import { useCharacter } from '../state/characterContext'

const DEFAULT_OPERATION: Record<ResourceKey, ChangeOperation> = {
  edges: 'decrease',
  stress: 'increase',
  harm: 'increase',
  trauma: 'increase',
}

export function ChangeRecorder() {
  const { character, dispatch } = useCharacter()

  const [resource, setResource] = useState<ResourceKey>('stress')
  const [operation, setOperation] = useState<ChangeOperation>('increase')
  const [amount, setAmount] = useState(1)
  const [reason, setReason] = useState(RESOURCES.stress.reasons.increase[0])
  const [detail, setDetail] = useState('')

  const meta = RESOURCES[resource]
  const bounds = resourceBounds(character, resource)
  const value = currentValue(character, resource)
  const isTrauma = resource === 'trauma'
  const maxAmount = isTrauma ? 1 : Math.max(1, bounds.max)

  const direction = operation === 'increase' ? 1 : -1
  const preview = isTrauma
    ? value + direction
    : clamp(value + direction * amount, bounds.min, bounds.max)

  const reasonRequired = isTrauma && operation === 'increase' && !detail.trim()
  const noChange = preview === value

  const switchResource = (next: ResourceKey) => {
    setResource(next)
    const nextOperation = DEFAULT_OPERATION[next]
    setOperation(nextOperation)
    setReason(RESOURCES[next].reasons[nextOperation][0])
    setAmount(1)
  }

  const switchOperation = (next: ChangeOperation) => {
    setOperation(next)
    setReason(meta.reasons[next][0])
  }

  const submit = () => {
    dispatch({
      type: 'change.apply',
      draft: {
        resource,
        operation,
        amount: isTrauma ? 1 : amount,
        reason,
        detail,
      },
    })
    setDetail('')
  }

  return (
    <div className="recorder">
      <div className="recorder__resources" role="group" aria-label="対象">
        {RESOURCE_ORDER.map((key) => (
          <button
            key={key}
            type="button"
            className={`chip${key === resource ? ' chip--on' : ''}`}
            aria-pressed={key === resource}
            onClick={() => switchResource(key)}
          >
            {RESOURCES[key].label}
            <span className="chip__value">{formatValue(key, currentValue(character, key))}</span>
          </button>
        ))}
      </div>

      <div className="recorder__body">
        <div className="recorder__operations" role="group" aria-label="操作">
          {(['increase', 'decrease'] as const).map((key) => (
            <button
              key={key}
              type="button"
              className={`chip${key === operation ? ' chip--on' : ''}`}
              aria-pressed={key === operation}
              onClick={() => switchOperation(key)}
            >
              {meta.verbs[key]}
            </button>
          ))}
        </div>

        {!isTrauma && (
          <div className="field">
            <label className="field__label" htmlFor="recorder-amount">
              数量
            </label>
            <div className="stepper">
              <button
                type="button"
                className="stepper__button"
                onClick={() => setAmount((prev) => clamp(prev - 1, 1, maxAmount))}
                disabled={amount <= 1}
                aria-label="数量を1減らす"
              >
                −
              </button>
              <input
                id="recorder-amount"
                className="stepper__value"
                type="number"
                inputMode="numeric"
                min={1}
                max={maxAmount}
                value={amount}
                onChange={(event) => setAmount(clamp(Number(event.target.value), 1, maxAmount))}
              />
              <button
                type="button"
                className="stepper__button"
                onClick={() => setAmount((prev) => clamp(prev + 1, 1, maxAmount))}
                disabled={amount >= maxAmount}
                aria-label="数量を1増やす"
              >
                +
              </button>
            </div>
          </div>
        )}

        <div className="field">
          <label className="field__label" htmlFor="recorder-reason">
            理由
          </label>
          <select
            id="recorder-reason"
            className="field__input"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          >
            {meta.reasons[operation].map((preset) => (
              <option key={preset} value={preset}>
                {preset}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="recorder-detail">
            {meta.detailLabel}
          </label>
          <input
            id="recorder-detail"
            className="field__input"
            value={detail}
            placeholder={isTrauma ? 'トラウマ名（必須）' : '任意'}
            onChange={(event) => setDetail(event.target.value)}
          />
        </div>
      </div>

      <div className="recorder__footer">
        <p className={`recorder__preview${noChange ? ' recorder__preview--idle' : ''}`}>
          {meta.label}: <strong>{formatValue(resource, value)}</strong>
          {' → '}
          <strong>{formatValue(resource, Math.max(preview, 0))}</strong>
          {isTrauma ? ` 件` : ''}
        </p>
        <button
          type="button"
          className="button button--primary"
          onClick={submit}
          disabled={noChange || reasonRequired}
        >
          {meta.verbs[operation]}を記録
        </button>
      </div>

      {reasonRequired && <p className="field__error">トラウマ名を入力してください。</p>}
      {noChange && !reasonRequired && (
        <p className="field__hint">この操作では値が変わりません。</p>
      )}
    </div>
  )
}
