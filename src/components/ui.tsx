import { useId } from 'react'
import type { ChangeEvent, CSSProperties, ReactNode } from 'react'
import type { Option } from '../constants/bitd'
import type { ChoiceList, Clock } from '../types/character'

export function Section({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: ReactNode
}) {
  return (
    <section className="section">
      <h2 className="section__title">{title}</h2>
      {hint && <p className="section__hint">{hint}</p>}
      <div className="section__body">{children}</div>
    </section>
  )
}

export function Grid({ children, columns = 2 }: { children: ReactNode; columns?: number }) {
  return (
    <div className="grid" style={{ '--columns': columns } as CSSProperties}>
      {children}
    </div>
  )
}

export function SelectInput({
  label,
  value,
  onChange,
  options,
  emptyLabel = '選択してください',
  hint,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: readonly { id: string; name: string }[]
  emptyLabel?: string
  hint?: string
}) {
  const id = useId()
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className="field__input"
        value={value}
        aria-describedby={hint ? `${id}-hint` : undefined}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">{emptyLabel}</option>
        {value && !options.some((option) => option.id === value) && (
          <option value={value}>{value}（取り込み値）</option>
        )}
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      {hint && <p id={`${id}-hint`} className="field__description">{hint}</p>}
    </div>
  )
}

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  options,
  hint,
  maxLength,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  options?: Option[]
  hint?: string
  maxLength?: number
}) {
  const id = useId()
  const listId = `${id}-options`

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="field__input"
        value={value}
        list={options ? listId : undefined}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
      />
      {options && (
        <datalist id={listId}>
          {options.map((option) => (
            <option key={option.id} value={option.name} />
          ))}
        </datalist>
      )}
      {hint && <p className="field__hint">{hint}</p>}
    </div>
  )
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
  hint,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  rows?: number
  placeholder?: string
  hint?: string
}) {
  const id = useId()
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        className="field__input field__input--area"
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value)}
      />
      {hint && <p className="field__hint">{hint}</p>}
    </div>
  )
}

export function Stepper({
  label,
  value,
  min,
  max,
  onChange,
  suffix,
  hint,
  level,
}: {
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
  suffix?: string
  hint?: string
  level?: string
}) {
  const id = useId()
  const set = (next: number) => onChange(Math.min(Math.max(next, min), max))

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className="stepper">
        <button
          type="button"
          className="stepper__button"
          onClick={() => set(value - 1)}
          disabled={value <= min}
          aria-label={`${label}を1減らす`}
        >
          −
        </button>
        <input
          id={id}
          className="stepper__value"
          type="number"
          inputMode="numeric"
          value={value}
          min={min}
          max={max}
          onChange={(event) => set(Number(event.target.value))}
        />
        <button
          type="button"
          className="stepper__button"
          onClick={() => set(value + 1)}
          disabled={value >= max}
          aria-label={`${label}を1増やす`}
        >
          +
        </button>
        {suffix && <span className="stepper__suffix">{suffix}</span>}
      </div>
      {level && <p className="field__hint">{level}</p>}
      {hint && <p className="field__hint">{hint}</p>}
    </div>
  )
}

export function Pips({
  label,
  value,
  max,
  onChange,
  hint,
}: {
  label: string
  value: number
  max: number
  onChange: (value: number) => void
  hint?: string
}) {
  return (
    <div className="field field--pips">
      <span className="field__label">{label}</span>
      <div className="pips" role="group" aria-label={label}>
        {Array.from({ length: max }, (_, index) => {
          const on = index < value
          return (
            <button
              key={index}
              type="button"
              className={`pip${on ? ' pip--on' : ''}`}
              aria-pressed={on}
              aria-label={`${index + 1}`}
              onClick={() => onChange(on && index === value - 1 ? index : index + 1)}
            />
          )
        })}
      </div>
      {hint && <p className="field__hint">{hint}</p>}
    </div>
  )
}

export function ChoiceListEditor({
  label,
  hint,
  items,
  options,
  placeholder,
  notePlaceholder = 'メモ',
  onPatch,
  onRemove,
  onAdd,
  addLabel = '追加',
}: {
  label: string
  hint?: string
  items: ChoiceList[]
  options?: Option[]
  placeholder?: string
  notePlaceholder?: string
  onPatch: (id: string, patch: Partial<ChoiceList>) => void
  onRemove?: (id: string) => void
  onAdd?: () => void
  addLabel?: string
}) {
  return (
    <div className="field-group">
      <div className="field-group__head">
        <span className="field__label">{label}</span>
        {onAdd && (
          <button type="button" className="button button--ghost" onClick={onAdd}>
            {addLabel}
          </button>
        )}
      </div>
      {hint && <p className="field__hint">{hint}</p>}

      {items.length === 0 && <p className="empty">未記入</p>}

      <div className="stack">
        {items.map((item, index) => (
          <div className="slot" key={item.id}>
            <div className="slot__head">
              <span className="slot__index">{index + 1}</span>
              {onRemove && (
                <button
                  type="button"
                  className="button button--danger-ghost"
                  onClick={() => onRemove(item.id)}
                >
                  削除
                </button>
              )}
            </div>
            <TextInput
              label="名称"
              value={item.name}
              options={options}
              placeholder={placeholder}
              onChange={(name) => onPatch(item.id, { name })}
            />
            <TextArea
              label={notePlaceholder}
              value={item.note}
              rows={2}
              onChange={(note) => onPatch(item.id, { note })}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export function CheckList({
  legend,
  hint,
  options,
  selected,
  onToggle,
  columns = 3,
}: {
  legend?: string
  hint?: string
  options: Option[]
  selected: readonly string[]
  onToggle: (id: string) => void
  columns?: number
}) {
  return (
    <div className="field-group">
      {legend && <span className="field__label">{legend}</span>}
      {hint && <p className="field__hint">{hint}</p>}
      <div className="checklist" style={{ '--check-columns': columns } as CSSProperties}>
        {options.map((option) => {
          const on = selected.includes(option.id)
          return (
            <label className={`checkitem${on ? ' checkitem--on' : ''}`} key={option.id}>
              <input type="checkbox" checked={on} onChange={() => onToggle(option.id)} />
              <span>{option.name}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

export function TextListEditor({
  label,
  hint,
  items,
  placeholder,
  onAdd,
  onRemove,
}: {
  label: string
  hint?: string
  items: string[]
  placeholder?: string
  onAdd: (value: string) => void
  onRemove: (index: number) => void
}) {
  const id = useId()
  return (
    <div className="field-group">
      <span className="field__label">{label}</span>
      {hint && <p className="field__hint">{hint}</p>}

      {items.length === 0 && <p className="empty">未記入</p>}

      <ul className="list">
        {items.map((item, index) => (
          <li className="list__item" key={`${item}-${index}`}>
            <span>{item}</span>
            <button
              type="button"
              className="button button--danger-ghost"
              onClick={() => onRemove(index)}
              aria-label="削除"
            >
              削除
            </button>
          </li>
        ))}
      </ul>

      <div className="inline-add">
        <input
          id={id}
          className="field__input"
          placeholder={placeholder}
          onKeyDown={(event) => {
            if (event.key !== 'Enter') return
            const input = event.currentTarget
            onAdd(input.value)
            input.value = ''
          }}
        />
        <button
          type="button"
          className="button"
          onClick={(event) => {
            const input = event.currentTarget.previousElementSibling as HTMLInputElement
            onAdd(input.value)
            input.value = ''
          }}
        >
          追加
        </button>
      </div>
    </div>
  )
}

export function ClockEditor({
  label,
  clock,
  onPatch,
  onRemove,
}: {
  label: string
  clock: Clock
  onPatch: (patch: Partial<Clock>) => void
  onRemove: () => void
}) {
  const id = useId()
  return (
    <div className="slot">
      <div className="slot__head">
        <span className="slot__index">{label}</span>
        <button type="button" className="button button--danger-ghost" onClick={onRemove}>
          削除
        </button>
      </div>
      <TextInput
        label="名称"
        value={clock.name}
        placeholder="傷の種類"
        onChange={(name) => onPatch({ name })}
      />
      <Stepper
        label="進行"
        value={clock.filled}
        min={0}
        max={clock.total}
        onChange={(filled) => onPatch({ filled })}
        hint={`全 ${clock.total} 分割`}
      />
      <div className="pips pips--clock" id={id} role="group" aria-label={`${label}の進行`}>
        {Array.from({ length: clock.total }, (_, index) => (
          <span
            key={index}
            className={`pip pip--static${index < clock.filled ? ' pip--on' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}
