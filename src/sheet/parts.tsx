import { HEALING_CLOCK_SEGMENTS, RATING_MAX } from '../constants/playbooks'
import { ACTION_ALLOCATION_LABELS, MESSAGE } from '../constants/labels'
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
export function Bilingual({ name, ja }: { name: string; ja?: string }) {
  return ja ? (
    <>
      <span className="os-bi__ja">{ja}</span>
      <span className="os-bi__en">{name}</span>
    </>
  ) : (
    <>{name}</>
  )
}
function Count({ value, max }: { value: number; max: number }) {
  return (
    <span className="os-count" aria-label={`${value} / ${max}`}>
      {value}/{max}
    </span>
  )
}
export function StressBoxes({
  value,
  max,
  onChange,
}: {
  value: number
  max: number
  onChange: (value: number) => void
}) {
  return (
    <div className="os-stressrow">
      <div className="os-stress" role="group" aria-label="ストレス">
        {Array.from({ length: max }, (_, index) => (
          <button
            key={index}
            type="button"
            className={`os-stress__box${index < value ? ' os-stress__box--on' : ''}`}
            aria-pressed={index < value}
            aria-label={`ストレス ${index + 1}`}
            onClick={() => onChange(index === value - 1 ? index : index + 1)}
          />
        ))}
      </div>
      <Count value={value} max={max} />
    </div>
  )
}
export function CoinTrack({
  label,
  value,
  max,
  onChange,
}: {
  label: string
  value: number
  max: number
  onChange: (value: number) => void
}) {
  return (
    <div className={`os-coin${max > 10 ? ' os-coin--stash' : ''}`}>
      <span className="os-coin__label">{label}</span>
      <span className="os-coin__boxes">
        {Array.from({ length: max }, (_, index) => (
          <button
            key={index}
            type="button"
            className={`os-coin__box${index < value ? ' os-coin__box--on' : ''}`}
            aria-pressed={index < value}
            aria-label={`${label} ${index + 1}`}
            onClick={() => onChange(index === value - 1 ? index : index + 1)}
          />
        ))}
      </span>
      <Count value={value} max={max} />
    </div>
  )
}
export function RatingDots({
  name,
  en,
  value,
  max = RATING_MAX,
  fixedValue = 0,
  initialValue = 0,
  growth = false,
  editableMax = max,
  onChange,
  description,
}: {
  name: string
  en?: string
  value: number
  max?: number
  fixedValue?: number
  initialValue?: number
  growth?: boolean
  editableMax?: number
  onChange?: (value: number) => void
  description?: string
}) {
  return (
    <div className="os-rating">
      <span
        className="os-rating__dots"
        role={onChange ? undefined : 'img'}
        aria-label={onChange ? undefined : `${name}${en ? `（${en}）` : ''}：${value}`}
        title={onChange ? undefined : MESSAGE.ratingEditHint}
      >
        {Array.from({ length: max }, (_, index) =>
          onChange && index < fixedValue ? (
            <span
              key={index}
              className="os-rating__dot os-rating__dot--fixed"
              role="img"
              aria-label={`${en ?? name} ${index + 1}（プレイブック固定・変更不可）`}
              title="プレイブック固定・変更不可"
            />
          ) : onChange && index < initialValue ? (
            <span
              key={index}
              className="os-rating__dot os-rating__dot--selected"
              role="img"
              aria-label={`${en ?? name} ${index + 1}（${ACTION_ALLOCATION_LABELS.initialLocked}）`}
              title={ACTION_ALLOCATION_LABELS.initialLocked}
            />
          ) : onChange ? (
            <button
              key={index}
              type="button"
              className={`os-rating__dot os-rating__dot--editable${index < value ? ` os-rating__dot--selected${growth ? ' os-rating__dot--growth' : ''}` : ''}`}
              disabled={index >= editableMax}
              aria-pressed={index < value}
              aria-label={`${en ?? name} ${index + 1}`}
              title={index >= editableMax ? ACTION_ALLOCATION_LABELS.unavailable : index < value ? 'クリックで減らす' : 'クリックで増やす'}
              onClick={() => onChange(index === value - 1 ? index : index + 1)}
            />
          ) : (
            <span
              key={index}
              className={`os-rating__dot${index < value ? ' os-rating__dot--on' : ''}`}
              aria-hidden="true"
            />
          ),
        )}
      </span>
      <span className="os-rating__name" title={description}>
        <Bilingual name={en ?? name} ja={en ? name : undefined} />
      </span>
    </div>
  )
}
export function BookmarkTrack({
  name,
  value,
  max,
  onChange,
}: {
  name: string
  value: number
  max: number
  onChange: (value: number) => void
}) {
  return (
    <div className="os-bookmarkrow">
      <div className="os-bookmarks" role="group" aria-label={name}>
        {Array.from({ length: max }, (_, index) => (
          <button
            key={index}
            type="button"
            className={`os-bookmark${index < value ? ' os-bookmark--on' : ''}`}
            aria-pressed={index < value}
            aria-label={`${name} ${index + 1}`}
            onClick={() => onChange(index === value - 1 ? index : index + 1)}
          />
        ))}
      </div>
      <Count value={value} max={max} />
    </div>
  )
}
export function HealingClock({
  filled,
  minimum = 0,
  onChange,
}: {
  filled: number
  minimum?: number
  onChange: (value: number) => void
}) {
  const size = 56
  const radius = size / 2
  const segments = Array.from({ length: HEALING_CLOCK_SEGMENTS }, (_, index) => {
    const start = (index / HEALING_CLOCK_SEGMENTS) * Math.PI * 2 - Math.PI / 2
    const end = ((index + 1) / HEALING_CLOCK_SEGMENTS) * Math.PI * 2 - Math.PI / 2
    return `M ${radius} ${radius} L ${radius + radius * Math.cos(start)} ${radius + radius * Math.sin(start)} A ${radius} ${radius} 0 0 1 ${radius + radius * Math.cos(end)} ${radius + radius * Math.sin(end)} Z`
  })
  return (
    <div className="os-healing">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        {segments.map((d, index) => (
          <path
            key={index}
            d={d}
            className={`os-healing__seg${index < filled ? ' os-healing__seg--on' : ''}`}
            stroke="#1a1a1a"
            strokeWidth={1}
          />
        ))}
      </svg>
      <span className="os-healing__steps">
        {segments.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`os-healing__step${index < filled ? ' os-healing__step--on' : ''}`}
            disabled={index < minimum}
            aria-pressed={index < filled}
            aria-label={`治療クロック ${index + 1}`}
            onClick={() => onChange(Math.max(minimum, index === filled - 1 ? index : index + 1))}
          />
        ))}
      </span>
      <Count value={filled} max={HEALING_CLOCK_SEGMENTS} />
    </div>
  )
}
