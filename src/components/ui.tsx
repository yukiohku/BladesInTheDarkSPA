import { useId } from 'react'
import type { ChangeEvent, CSSProperties, ReactNode } from 'react'
import type { Option } from '../constants/bitd'

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
  description,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: readonly { id: string; name: string; description?: string }[]
  emptyLabel?: string | null
  hint?: string
  description?: string
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
        title={description}
        aria-describedby={hint ? `${id}-hint` : undefined}
        onChange={(event) => onChange(event.target.value)}
      >
        {emptyLabel !== null && <option value="">{emptyLabel}</option>}
        {value && !options.some((option) => option.id === value) && (
          <option value={value}>{value}（取り込み値）</option>
        )}
        {options.map((option) => (
          <option key={option.id} value={option.id} title={option.description}>
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
