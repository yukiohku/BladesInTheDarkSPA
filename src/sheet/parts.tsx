import { useId } from 'react'
import { COIN_MAX, HEALING_CLOCK_SEGMENTS, STRESS_BOXES, XP_TRACK_MAX } from '../constants/playbooks'

/** 公式シートの小さなチェックボックス */
export function Box({
  checked,
  onChange,
  label,
  size = 'normal',
}: {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
  size?: 'normal' | 'small'
}) {
  return (
    <button
      type="button"
      className={`os-box${size === 'small' ? ' os-box--small' : ''}${checked ? ' os-box--on' : ''}`}
      aria-pressed={checked}
      aria-label={label}
      title={label}
      onClick={() => onChange(!checked)}
    />
  )
}

export function CheckRow({
  id,
  name,
  checked,
  onToggle,
  trailing,
}: {
  id: string
  name: string
  checked: boolean
  onToggle: (id: string) => void
  trailing?: React.ReactNode
}) {
  return (
    <div className={`os-checkrow${checked ? ' os-checkrow--on' : ''}`}>
      <Box checked={checked} onChange={() => onToggle(id)} label={name} />
      <span className="os-checkrow__name">{name}</span>
      {trailing}
    </div>
  )
}

/** ストレスの9マス。公式は斜めの平行四辺形 */
export function StressBoxes({ value, onChange }: { value: number; onChange: (next: number) => void }) {
  return (
    <div className="os-stress" role="group" aria-label="ストレス">
      {Array.from({ length: STRESS_BOXES }, (_, index) => {
        const filled = index < value
        return (
          <button
            key={index}
            type="button"
            className={`os-stress__box${filled ? ' os-stress__box--on' : ''}`}
            aria-pressed={filled}
            aria-label={`ストレス ${index + 1}`}
            onClick={() => onChange(filled && index === value - 1 ? index : index + 1)}
          />
        )
      })}
    </div>
  )
}

/** コイン・貯蔵品のトラック。9マス + 末尾の1マス（公式と同じ） */
export function CoinTrack({
  label,
  value,
  onChange,
  checks,
}: {
  label: string
  value: number
  onChange: (next: number) => void
  checks?: [boolean, boolean]
}) {
  return (
    <div className="os-coin">
      <span className="os-coin__label">{label}</span>
      {checks && (
        <span className="os-coin__checks">
          <Box checked={checks[0]} onChange={() => onChange(value)} label={`${label} 補助1`} size="small" />
          <Box checked={checks[1]} onChange={() => onChange(value)} label={`${label} 補助2`} size="small" />
        </span>
      )}
      <span className="os-coin__boxes">
        {Array.from({ length: COIN_MAX }, (_, index) => {
          const filled = index < value
          return (
            <button
              key={index}
              type="button"
              className={`os-coin__box${filled ? ' os-coin__box--on' : ''}`}
              aria-pressed={filled}
              aria-label={`${label} ${index + 1}`}
              onClick={() => onChange(filled && index === value - 1 ? index : index + 1)}
            />
          )
        })}
        <span className="os-coin__tall" aria-hidden="true" />
      </span>
    </div>
  )
}

/** アクションレート。1Dana目と derret目を分ける縦線つき */
export function RatingDots({
  name,
  value,
  onChange,
}: {
  name: string
  value: number
  onChange: (next: number) => void
}) {
  return (
    <div className="os-rating">
      <span className="os-rating__dots">
        {Array.from({ length: 4 }, (_, index) => {
          const filled = index < value
          return (
            <button
              key={index}
              type="button"
              className={`os-rating__dot${filled ? ' os-rating__dot--on' : ''}${index === 0 ? ' os-rating__dot--first' : ''}`}
              aria-pressed={filled}
              aria-label={`${name} ${index + 1}`}
              onClick={() => onChange(filled && index === value - 1 ? index : index + 1)}
            />
          )
        })}
      </span>
      <span className="os-rating__name">{name}</span>
    </div>
  )
}

/** 進行トラック（6個の栞） */
export function BookmarkTrack({
  name,
  value,
  onChange,
}: {
  name: string
  value: number
  onChange: (next: number) => void
}) {
  return (
    <div className="os-bookmarks" role="group" aria-label={name}>
      {Array.from({ length: XP_TRACK_MAX }, (_, index) => {
        const filled = index < value
        return (
          <button
            key={index}
            type="button"
            className={`os-bookmark${filled ? ' os-bookmark--on' : ''}`}
            aria-pressed={filled}
            aria-label={`${name} ${index + 1}`}
            onClick={() => onChange(filled && index === value - 1 ? index : index + 1)}
          />
        )
      })}
    </div>
  )
}

/** 治療クロック。6分割の円 */
export function HealingClock({
  filled,
  onChange,
}: {
  filled: number
  onChange: (next: number) => void
}) {
  const size = 44
  const radius = size / 2
  const segments = Array.from({ length: HEALING_CLOCK_SEGMENTS }, (_, index) => {
    const start = (index / HEALING_CLOCK_SEGMENTS) * Math.PI * 2 - Math.PI / 2
    const end = ((index + 1) / HEALING_CLOCK_SEGMENTS) * Math.PI * 2 - Math.PI / 2
    const x1 = radius + radius * Math.cos(start)
    const y1 = radius + radius * Math.sin(start)
    const x2 = radius + radius * Math.cos(end)
    const y2 = radius + radius * Math.sin(end)
    return {
      d: `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`,
      on: index < filled,
    }
  })

  return (
    <div className="os-healing">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        {segments.map((segment, index) => (
          <path
            key={index}
            d={segment.d}
            className={`os-healing__seg${segment.on ? ' os-healing__seg--on' : ''}`}
            stroke="#1a1a1a"
            strokeWidth={1}
          />
        ))}
      </svg>
      <span className="os-healing__steps">
        {Array.from({ length: HEALING_CLOCK_SEGMENTS }, (_, index) => {
          const on = index < filled
          return (
            <button
              key={index}
              type="button"
              className={`os-healing__step${on ? ' os-healing__step--on' : ''}`}
              aria-pressed={on}
              aria-label={`治療クロック ${index + 1}`}
              onClick={() => onChange(on && index === filled - 1 ? index : index + 1)}
            />
          )
        })}
      </span>
    </div>
  )
}

/** 書き込み用の下線入力 */
export function RuleLine({
  value,
  onChange,
  label,
  className = '',
}: {
  value: string
  onChange: (next: string) => void
  label: string
  className?: string
}) {
  const id = useId()
  return (
    <div className={`os-rule ${className}`.trim()}>
      <label className="os-rule__label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="os-rule__input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}
