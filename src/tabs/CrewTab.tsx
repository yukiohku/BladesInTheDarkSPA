import { CREW_MEMBER_ROLES, CREW_TYPES } from '../constants/bitd'
import { LABELS } from '../constants/labels'
import { useCharacter } from '../state/characterContext'
import type { CrewChoiceField } from '../state/characterReducer'
import { ChoiceListEditor, Grid, Section, Stepper, TextArea, TextInput } from '../components/ui'

const LISTS: { field: CrewChoiceField; label: string }[] = [
  { field: 'liabilities', label: LABELS.crewLiabilities },
  { field: 'services', label: LABELS.crewServices },
  { field: 'itemRoster', label: LABELS.crewItemRoster },
]

export function CrewTab() {
  const { character, dispatch } = useCharacter()
  const { crew } = character

  const patchCrew = (patch: Partial<typeof crew>) => dispatch({ type: 'crew.patch', patch })

  return (
    <>
      <Section title="クルーの基本">
        <Grid>
          <TextInput
            label={LABELS.crewName}
            value={crew.name}
            onChange={(name) => patchCrew({ name })}
          />
          <TextInput
            label={LABELS.crewType}
            value={crew.typeName}
            options={CREW_TYPES}
            onChange={(typeName) =>
              patchCrew({
                typeName,
                typeId: CREW_TYPES.find((option) => option.name === typeName)?.id ?? '',
              })
            }
          />
          <Stepper
            label={LABELS.crewTier}
            value={crew.tier}
            min={1}
            max={6}
            onChange={(tier) => patchCrew({ tier })}
            suffix="ティア"
          />
        </Grid>
        <TextArea
          label={LABELS.crewCharter}
          value={crew.charter}
          rows={3}
          placeholder="このクルーの綱領"
          onChange={(charter) => patchCrew({ charter })}
        />
        <TextArea
          label={LABELS.crewSummary}
          value={crew.summary}
          rows={3}
          onChange={(summary) => patchCrew({ summary })}
        />
      </Section>

      <Section title="掌握と影響力">
        <Grid>
          <Stepper
            label={LABELS.crewHold}
            value={crew.hold}
            min={0}
            max={crew.holdTotal}
            onChange={(hold) => patchCrew({ hold })}
            hint={`全 ${crew.holdTotal} 分割`}
          />
          <Stepper
            label={LABELS.crewInfluence}
            value={crew.influence}
            min={0}
            max={crew.influenceTotal}
            onChange={(influence) => patchCrew({ influence })}
            hint={`全 ${crew.influenceTotal} 分割`}
          />
        </Grid>
      </Section>

      <Section title="縄張りと隠れ家">
        <TextArea
          label={LABELS.crewTerritory}
          value={crew.territory}
          rows={3}
          onChange={(territory) => patchCrew({ territory })}
        />
        <TextArea
          label={LABELS.crewLair}
          value={crew.lair}
          rows={3}
          onChange={(lair) => patchCrew({ lair })}
        />
      </Section>

      {LISTS.map(({ field, label }) => (
        <Section key={field} title={label}>
          <ChoiceListEditor
            label={label}
            items={crew[field]}
            notePlaceholder="補足"
            onPatch={(id, patch) => dispatch({ type: 'crewChoice.patch', field, id, patch })}
            onRemove={(id) => dispatch({ type: 'crewChoice.remove', field, id })}
            onAdd={() => dispatch({ type: 'crewChoice.add', field })}
          />
        </Section>
      ))}

      <Section title={LABELS.crewRoster}>
        {crew.roster.length === 0 && <p className="empty">メンバーがいません。</p>}
        <div className="stack">
          {crew.roster.map((member) => (
            <div className="slot" key={member.id}>
              <div className="slot__head">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={member.player}
                    onChange={(event) =>
                      dispatch({
                        type: 'member.patch',
                        id: member.id,
                        patch: { player: event.target.checked },
                      })
                    }
                  />
                  <span>プレイヤーキャラクター</span>
                </label>
                <button
                  type="button"
                  className="button button--danger-ghost"
                  onClick={() => dispatch({ type: 'member.remove', id: member.id })}
                >
                  削除
                </button>
              </div>
              <Grid>
                <TextInput
                  label="名前"
                  value={member.name}
                  onChange={(name) =>
                    dispatch({ type: 'member.patch', id: member.id, patch: { name } })
                  }
                />
                <TextInput
                  label="役割"
                  value={member.role}
                  options={CREW_MEMBER_ROLES}
                  onChange={(role) =>
                    dispatch({ type: 'member.patch', id: member.id, patch: { role } })
                  }
                />
              </Grid>
              <TextArea
                label="メモ"
                value={member.note}
                rows={2}
                onChange={(note) =>
                  dispatch({ type: 'member.patch', id: member.id, patch: { note } })
                }
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          className="button"
          onClick={() => dispatch({ type: 'member.add' })}
        >
          メンバーを追加
        </button>
      </Section>

      <Section title={LABELS.crewNotes}>
        <TextArea
          label={LABELS.crewNotes}
          value={crew.notes}
          rows={4}
          onChange={(notes) => patchCrew({ notes })}
        />
      </Section>
    </>
  )
}
