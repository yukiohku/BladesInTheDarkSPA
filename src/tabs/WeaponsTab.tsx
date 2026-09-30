import { LABELS } from '../constants/labels'
import { useCharacter } from '../state/characterContext'
import { Grid, Section, TextInput, TextListEditor } from '../components/ui'

export function WeaponsTab() {
  const { character, dispatch } = useCharacter()

  return (
    <>
      <Section title={LABELS.weapons}>
        {character.weapons.length === 0 && <p className="empty">未登録</p>}
        <div className="stack">
          {character.weapons.map((weapon) => (
            <div className="slot" key={weapon.id}>
              <div className="slot__head">
                <span className="slot__index">{weapon.name || '装備'}</span>
                <button
                  type="button"
                  className="button button--danger-ghost"
                  onClick={() => dispatch({ type: 'weapon.remove', id: weapon.id })}
                >
                  削除
                </button>
              </div>
              <TextInput
                label="名称"
                value={weapon.name}
                onChange={(name) => dispatch({ type: 'weapon.patch', id: weapon.id, patch: { name } })}
              />
              <Grid columns={2}>
                <TextInput
                  label="射程"
                  value={weapon.range}
                  placeholder="近接 / 10m など"
                  onChange={(range) =>
                    dispatch({ type: 'weapon.patch', id: weapon.id, patch: { range } })
                  }
                />
                <TextInput
                  label="ダメージ"
                  value={weapon.damage}
                  placeholder="1d6 など"
                  onChange={(damage) =>
                    dispatch({ type: 'weapon.patch', id: weapon.id, patch: { damage } })
                  }
                />
                <TextInput
                  label="負荷"
                  value={weapon.load}
                  placeholder="軽 / 重"
                  onChange={(load) =>
                    dispatch({ type: 'weapon.patch', id: weapon.id, patch: { load } })
                  }
                />
                <TextInput
                  label="効果"
                  value={weapon.effect}
                  placeholder="+効果 1 など"
                  onChange={(effect) =>
                    dispatch({ type: 'weapon.patch', id: weapon.id, patch: { effect } })
                  }
                />
              </Grid>
            </div>
          ))}
        </div>
        <button type="button" className="button" onClick={() => dispatch({ type: 'weapon.add' })}>
          装備を追加
        </button>
      </Section>

      <Section title={LABELS.dramaticUnderscores}>
        <TextListEditor
          label={LABELS.dramaticUnderscores}
          items={character.dramaticUnderscores}
          placeholder="入力して追加"
          onAdd={(value) => dispatch({ type: 'text.add', field: 'dramaticUnderscores', value })}
          onRemove={(index) => dispatch({ type: 'text.remove', field: 'dramaticUnderscores', index })}
        />
      </Section>

<Section title={LABELS.customMoves}>
        <TextListEditor
          label={LABELS.customMoves}
          items={character.customMoves}
          placeholder="入力して追加"
          onAdd={(value) => dispatch({ type: 'text.add', field: 'customMoves', value })}
          onRemove={(index) => dispatch({ type: 'text.remove', field: 'customMoves', index })}
        />
      </Section>
    </>
  )
}
