import { useState } from 'react'
import { useCharacter } from '../state/characterContext'
import { Grid, Section, Stepper, TextArea, TextInput } from '../components/ui'
import { EquipmentPanel } from '../components/SheetPanels'
export function WeaponsTab() {
  const { character, dispatch } = useCharacter()
  const [confirmScore, setConfirmScore] = useState(false)
  return (
    <>
      <Section
        title="仕事の装備"
        hint="装備は必要になった時点で宣言します。Load 2や3の連結欄は1つの装備として扱います。"
      >
        <EquipmentPanel />
      </Section>
      <Section
        title="自由記入装備"
        hint="原典にない装備や入手した品の名前・Load・説明を記録できます。"
      >
        {character.customItems.map((item) => (
          <div className="slot" key={item.id}>
            <Grid>
              <TextInput
                label="装備名"
                value={item.name}
                onChange={(name) =>
                  dispatch({ type: 'customItem.patch', id: item.id, patch: { name } })
                }
              />
              <Stepper
                label={`${item.name || '装備'}のLoad`}
                value={item.load}
                min={0}
                max={9}
                onChange={(load) =>
                  dispatch({ type: 'customItem.patch', id: item.id, patch: { load } })
                }
              />
            </Grid>
            <TextArea
              label="装備の説明"
              value={item.notes}
              rows={2}
              onChange={(notes) =>
                dispatch({ type: 'customItem.patch', id: item.id, patch: { notes } })
              }
            />
            <button
              className="button button--danger-ghost"
              type="button"
              onClick={() => dispatch({ type: 'customItem.remove', id: item.id })}
            >
              削除：{item.name || '装備'}
            </button>
          </div>
        ))}
        <button
          className="button"
          type="button"
          onClick={() => dispatch({ type: 'customItem.add' })}
        >
          装備を追加
        </button>
      </Section>
      <Section
        title="次の仕事を始める"
        hint="装備の宣言・弾帯の使用枠・仕事ごとの能力使用回数・通常鎧と重装の使用をリセットします。特殊鎧はダウンタイム開始時に別途リセットします。"
      >
        {!confirmScore ? (
          <button type="button" className="button" onClick={() => setConfirmScore(true)}>
            次の仕事を開始
          </button>
        ) : (
          <div className="inline-add">
            <p>現在の仕事の使用状況をリセットします。履歴から直近の操作を取り消せます。</p>
            <button
              type="button"
              className="button button--primary"
              onClick={() => {
                dispatch({ type: 'score.start' })
                setConfirmScore(false)
              }}
            >
              リセットして開始
            </button>
            <button className="button" type="button" onClick={() => setConfirmScore(false)}>
              キャンセル
            </button>
          </div>
        )}
      </Section>
    </>
  )
}
