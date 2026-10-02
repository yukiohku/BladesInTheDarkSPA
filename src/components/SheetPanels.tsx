import { useRef, useState } from 'react'
import {
  ACTION_GROUPS,
  ALCHEMICALS,
  findAbility,
  GENERAL_ITEMS,
  HEALING_CLOCK_SEGMENTS,
  PLAYBOOKS,
  RATING_MAX,
} from '../constants/playbooks'
import { useCharacter } from '../state/characterContext'
import { ABILITY_LABELS, EQUIPMENT_LABELS, PLAYBOOK_LABELS, STATUS_LABELS } from '../constants/labels'
import { abilityRemovalConfirmation } from '../lib/abilityRemoval'
import { AbilityRemovalDialog } from './AbilityRemovalDialog'
import {
  attributeRating,
  clamp,
  hasSpecialArmor,
  healingMinimum,
  loadLimits,
  usedLoad,
} from '../lib/rules'
import { Box, Bilingual, RatingDots, HealingClock } from '../sheet/parts'
import { SelectInput, Stepper, TextArea } from './ui'
import type { EquipmentOption } from '../constants/playbooks'
import type { SheetState } from '../types/character'
import { initialAllocationMax } from '../lib/actionAllocation'
import { actionDescriptionText } from '../constants/actionDescriptions'
export function RatingsPanel({ sheet = false, initialDraft, onInitialChange }: {
  sheet?: boolean
  initialDraft?: SheetState['ratings']
  onInitialChange?: (ratings: SheetState['ratings']) => void
}) {
  const { character, dispatch } = useCharacter()
  const book = character.playbookId ? PLAYBOOKS[character.playbookId] : null
  const allocating = !sheet && (character.initialActionRatings === null || initialDraft !== undefined)
  const ratings = initialDraft ?? character.ratings
  return (
    <div
      className={`ratings-panel${sheet ? '' : ' ratings-panel--editing'}`}
      role={sheet ? 'region' : undefined}
      aria-label={sheet ? '技能・抵抗' : undefined}
    >
      {ACTION_GROUPS.map((group) => (
        <section key={group.id}>
          <div className={sheet ? 'os-track__head' : undefined}>
            <h3 className={sheet ? 'os-track__title' : undefined}>
              <span>
                {group.name}
                {sheet && (
                  <>
                    {' '}<small>{group.ja}</small>
                  </>
                )}
              </span>{' '}
              <span className="field__hint">抵抗 {attributeRating(character, group.id)}</span>
            </h3>
          </div>
          {group.items.map((item) => (
            <RatingDots
              key={item.id}
              name={item.ja}
              en={item.name}
              description={sheet ? actionDescriptionText(item.id) : undefined}
              value={ratings[item.id]}
              fixedValue={sheet ? 0 : (book?.initialRatings[item.id] ?? 0)}
              initialValue={allocating || sheet ? 0 : character.initialActionRatings?.[item.id]}
              growth={!sheet && !allocating}
              editableMax={allocating ? initialAllocationMax(character, ratings, item.id) : RATING_MAX}
              onChange={
                sheet || !book ? undefined : (value) => {
                  if (initialDraft && onInitialChange) {
                    onInitialChange({
                      ...initialDraft,
                      [item.id]: clamp(value, book.initialRatings[item.id] ?? 0, initialAllocationMax(character, initialDraft, item.id)),
                    })
                  } else dispatch({ type: 'rating', id: item.id, value })
                }
              }
            />
          ))}
        </section>
      ))}
    </div>
  )
}
export function AbilityCards({ editing = false }: { editing?: boolean }) {
  const { character, dispatch } = useCharacter()
  const [removingId, setRemovingId] = useState<string | null>(null)
  const removeTrigger = useRef<HTMLButtonElement | null>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  return (
    <div className="stack" ref={cardsRef} tabIndex={editing ? -1 : undefined}>
      {character.abilities.length === 0 && (
        <p className="empty">{character.playbookId ? '未取得（編集の特殊能力から取得できます）' : PLAYBOOK_LABELS.abilitiesHint}</p>
      )}
      {character.abilities.map((item, index) => {
        const option = findAbility(item.definitionId)
        const name = option?.name ?? (item.name || '自由記入の能力')
        const heading = (
          <h3>
            <Bilingual name={name} ja={option?.ja} />{' '}
            {option && !item.definitionId.startsWith(`${character.playbookId}:`) && (
              <small>Veteran</small>
            )}
          </h3>
        )
        return (
          <section className="ability-card" key={item.id} aria-label={`${name} ${index + 1}`}>
            {editing ? (
              <div className="ability-card__header">
                {heading}
                <button
                  className="button button--danger-ghost ability-card__remove"
                  type="button"
                  aria-label={`${name} ${index + 1}の${ABILITY_LABELS.remove}`}
                  onClick={(event) => {
                    removeTrigger.current = event.currentTarget
                    setRemovingId(item.id)
                  }}
                >
                  {ABILITY_LABELS.remove}
                </button>
              </div>
            ) : heading}
            {editing && removingId === item.id && (
              <AbilityRemovalDialog
                name={name}
                message={abilityRemovalConfirmation(character, item.id, name)}
                onCancel={() => {
                  setRemovingId(null)
                  removeTrigger.current?.focus()
                }}
                onConfirm={() => {
                  dispatch({ type: 'ability.remove', id: item.id })
                  setRemovingId(null)
                  cardsRef.current?.focus()
                }}
              />
            )}
            <p>{option?.effect ?? item.effect}</p>
            {editing && !option && (
              <>
                <TextArea
                  label="能力名"
                  value={item.name}
                  rows={1}
                  onChange={(name) =>
                    dispatch({ type: 'ability.patch', id: item.id, patch: { name } })
                  }
                />
                <TextArea
                  label="能力の効果"
                  value={item.effect}
                  onChange={(effect) =>
                    dispatch({ type: 'ability.patch', id: item.id, patch: { effect } })
                  }
                />
              </>
            )}
            {option?.choices && (
              <SelectInput
                label={`${name} の選択内容`}
                value={item.choice}
                options={option.choices}
                onChange={(choice) =>
                  dispatch({ type: 'ability.patch', id: item.id, patch: { choice } })
                }
              />
            )}
            {(editing || option?.noteLabel || item.notes) && (
              <TextArea
                label={`${name}：${option?.noteLabel ?? 'メモ'}`}
                value={item.notes}
                rows={2}
                onChange={(notes) =>
                  dispatch({ type: 'ability.patch', id: item.id, patch: { notes } })
                }
              />
            )}
            {option?.uses && (
              <Stepper
                label={`${name} 使用済み`}
                value={item.used}
                min={0}
                max={option.uses}
                onChange={(used) =>
                  dispatch({ type: 'ability.patch', id: item.id, patch: { used } })
                }
              />
            )}
          </section>
        )
      })}
    </div>
  )
}
export function EquipmentPanel() {
  const { character, dispatch } = useCharacter()
  const book = character.playbookId ? PLAYBOOKS[character.playbookId] : null
  const limits = loadLimits(character)
  const load = usedLoad(character)
  const max = limits[character.score.load]
  const renderItem = (item: EquipmentOption) => {
    const quantity = character.equipment[item.id] ?? 0
    return (
      <div
        className={`equipment-row${item.uses && quantity > 0 ? ' equipment-row--uses' : ''}`}
        key={item.id}
      >
        <div className="equipment-heading">
          <span>
            <span className="equipment-name">{item.ja ?? item.name}</span>
            <small>
              Load {item.load}
            </small>
          </span>
          <span className="equipment-checks">
            {Array.from({ length: item.quantity }, (_, index) => (
              <button
                key={index}
                type="button"
                className={`os-box${index < quantity ? ' os-box--on' : ''}`}
                aria-pressed={index < quantity}
                aria-label={`${item.ja ?? item.name}${item.quantity > 1 ? ` ${index + 1}` : ''}`}
                disabled={Boolean(item.requires && !character.equipment[item.requires])}
                onClick={() =>
                  dispatch({
                    type: 'equipment',
                    id: item.id,
                    quantity: index < quantity && index === quantity - 1 ? index : index + 1,
                  })
                }
              />
            ))}
          </span>
        </div>
        {item.uses && quantity > 0 && (
          <div className="grid">
            {Array.from({ length: item.uses }, (_, index) => (
              <SelectInput
                key={index}
                label={`${item.ja} 使用枠 ${index + 1}`}
                value={character.itemUses[item.id]?.[index] ?? ''}
                options={ALCHEMICALS}
                emptyLabel="未使用"
                onChange={(value) => dispatch({ type: 'item.use', id: item.id, index, value })}
              />
            ))}
          </div>
        )}
      </div>
    )
  }
  return (
    <>
      <div className="equipment-load">
        <div className="equipment-load__controls">
          <SelectInput
            label="仕事のLoad"
            value={character.score.load}
            options={[
              { id: 'light', name: `軽 ${limits.light}` },
              { id: 'normal', name: `標準 ${limits.normal}` },
              { id: 'heavy', name: `重 ${limits.heavy}` },
            ]}
            onChange={(load) => {
              if (load === 'light' || load === 'normal' || load === 'heavy')
                dispatch({ type: 'score.patch', patch: { load } })
            }}
          />
          <p className={`load-total${load > max ? ' field__error' : ''}`} role="status">
            使用Load {load} / {max}
          </p>
        </div>
        {load > max && (
          <p className="equipment-load__warning field__error" role="status">
            {EQUIPMENT_LABELS.loadExceeded}
          </p>
        )}
      </div>
      <h4>{book ? `${book.title} 固有装備` : PLAYBOOK_LABELS.items}</h4>
      {book ? (
        <div className="equipment-list">{book.items.map(renderItem)}</div>
      ) : (
        <p className="field__hint">{PLAYBOOK_LABELS.itemsHint}</p>
      )}
      <h4>共通装備</h4>
      <div className="equipment-list">{GENERAL_ITEMS.map(renderItem)}</div>
      {character.customItems.length > 0 && <h4>自由記入装備</h4>}
      {character.customItems.map((item) => (
        <div className="equipment-heading" key={item.id}>
          <span>
            {item.name || '未設定'} <small>Load {item.load}</small>
          </span>
          <Box
            label={item.name || '自由記入装備'}
            checked={item.declared}
            onChange={(declared) =>
              dispatch({ type: 'customItem.patch', id: item.id, patch: { declared } })
            }
          />
        </div>
      ))}
      {character.coin > 0 && (
        <Stepper
          label="携帯するコイン（1 Coin＝Load 1）"
          value={character.carriedCoin}
          min={0}
          max={character.coin}
          onChange={(value) => dispatch({ type: 'carriedCoin', value })}
        />
      )}
    </>
  )
}
function HarmInput({
  label,
  value,
  field,
  index,
  compact = false,
}: {
  label: string
  value: string
  field: keyof SheetState['harm']
  index?: number
  compact?: boolean
}) {
  const { dispatch } = useCharacter()
  return (
    <div
      className={`harm-input${compact ? ' harm-input--compact' : ''}`}
    >
      <label>
        <span className={compact ? 'sheet-sr-only' : undefined}>{label}</span>
        {compact ? (
          <textarea
            className="os-harm__input"
            aria-label={label}
            rows={2}
            value={value}
            onChange={(event) => dispatch({ type: 'harm', field, index, value: event.target.value })}
          />
        ) : (
          <input
            value={value}
            onChange={(event) => dispatch({ type: 'harm', field, index, value: event.target.value })}
          />
        )}
      </label>
    </div>
  )
}
export function HarmPanel({ compact = false }: { compact?: boolean }) {
  const { character, dispatch } = useCharacter()
  const minimum = healingMinimum(character)
  return (
    <>
      <table className="os-harm" aria-label="傷の記録">
        <colgroup>
          <col className="os-harm__col-level" />
          <col />
          <col />
          <col className="os-harm__col-effect" />
        </colgroup>
        {!compact && (
          <thead>
            <tr>
              <th scope="col">Lv</th>
              <th scope="col" colSpan={2}>傷</th>
              <th scope="col">影響</th>
            </tr>
          </thead>
        )}
        <tbody>
          {(['level3', 'level2', 'level1'] as const).map((field) => {
            const level = field === 'level3' ? 3 : field === 'level2' ? 2 : 1
            const values = field === 'level3' ? [character.harm.level3] : character.harm[field]
            const effect = level === 3 ? '手助け・追い込み' : level === 2 ? '−1d' : '効果低下'
            return (
              <tr key={field}>
                <th scope="row" className="os-harm__levelcell">
                  {level}
                </th>
                {values.map((value, index) => (
                  <td key={index} colSpan={level === 3 ? 2 : undefined}>
                    <HarmInput
                      compact
                      key={`${field}:${index}`}
                      label={
                        level === 3
                          ? 'レベル3の傷（手助け・自分を追い込む）'
                          : `レベル${level}の傷 ${index + 1}（${effect}）`
                      }
                      field={field}
                      index={level === 3 ? undefined : index}
                      value={value}
                    />
                  </td>
                ))}
                <td className="os-harm__effect">{effect}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className={compact ? 'os-fatal' : undefined}>
        <HarmInput
          label="致命的な傷・結果"
          field="fatal"
          value={character.harm.fatal}
          compact={compact}
        />
        {compact && <span className="os-fatal__label">致命的な傷・結果</span>}
      </div>
      {!compact && <p className="field__hint">{STATUS_LABELS.manualHint}</p>}
      {character.abilities.some((item) => item.definitionId === 'hound:tough-as-nails') && (
        <p>Tough as Nails：ペナルティは1段階軽くなります。致命傷は対象外です。</p>
      )}
      <div className={compact ? 'os-duo' : 'status-recovery'}>
        <div>
          {compact ? (
            <>
              <h4 className="os-minititle">HEALING / 治療</h4>
              <HealingClock
                filled={character.healing}
                minimum={minimum}
                onChange={(value) => dispatch({ type: 'healing', value })}
              />
            </>
          ) : (
            <Stepper
              label={STATUS_LABELS.healing}
              value={character.healing}
              min={minimum}
              max={HEALING_CLOCK_SEGMENTS}
              suffix={`/ ${HEALING_CLOCK_SEGMENTS}`}
              onChange={(value) => dispatch({ type: 'healing', value })}
            />
          )}
          {minimum > 0 && <p>Vigorous：1区画は恒久的に埋まっています。</p>}
        </div>
        <div>
          <h4 className={compact ? 'os-minititle' : undefined}>{compact ? 'ARMOR USES / 鎧' : STATUS_LABELS.armor}</h4>
          {(
            [
              { id: 'armor', name: '通常鎧', enabled: Boolean(character.equipment.armor) },
              { id: 'heavy', name: '重装', enabled: Boolean(character.equipment['armor-heavy']) },
              { id: 'special', name: '特殊鎧', enabled: hasSpecialArmor(character) },
            ] as const
          ).map((item) => (
            <label className="armor-control" key={item.id}>
              <input
                type="checkbox"
                checked={character.armorUses[item.id]}
                disabled={!item.enabled}
                onChange={() => dispatch({ type: 'armor', kind: item.id })}
              />
              {item.name}
              {!item.enabled && <small>（装備・能力が必要）</small>}
            </label>
          ))}
          {!compact && hasSpecialArmor(character) && (
            <div className="status-armor-reset">
              <button
                type="button"
                className="button button--small"
                disabled={!character.armorUses.special}
                onClick={() => dispatch({ type: 'specialArmor.reset' })}
              >
                {STATUS_LABELS.armorReset}
              </button>
              <p className="field__hint">{STATUS_LABELS.armorResetHint}</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
