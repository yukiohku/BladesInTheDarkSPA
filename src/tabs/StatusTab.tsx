import { TRAUMAS } from '../constants/bitd'
import { HARM_LEVELS, LABELS } from '../constants/labels'
import { characterStatus } from '../lib/status'
import { useCharacter } from '../state/characterContext'
import { ChangeRecorder } from '../components/ChangeRecorder'
import { ChoiceListEditor, ClockEditor, Grid, Section, Stepper } from '../components/ui'

export function StatusTab() {
  const { character, dispatch } = useCharacter()
  const notes = characterStatus(character)

  return (
    <>
      <Section title="変動を記録" hint="プレイ中の数値変動はここから記録すると、履歴に残ります。">
        <ChangeRecorder />
      </Section>

      {notes.length > 0 && (
        <ul className="notes">
          {notes.map((note) => (
            <li className={`note note--${note.level}`} key={note.text}>
              {note.text}
            </li>
          ))}
        </ul>
      )}

      <Section title="現在の数値">
        <Grid>
          <Stepper
            label={`${LABELS.edges}（${LABELS.edgesAlt}）`}
            value={character.edges}
            min={0}
            max={4}
            onChange={(value) => dispatch({ type: 'number', field: 'edges', value })}
          />
          <Stepper
            label={LABELS.stress}
            value={character.stress}
            min={0}
            max={character.stressMax}
            onChange={(value) => dispatch({ type: 'number', field: 'stress', value })}
            hint={`上限 ${character.stressMax}`}
          />
          <Stepper
            label={LABELS.stressMax}
            value={character.stressMax}
            min={1}
            max={20}
            onChange={(value) => dispatch({ type: 'number', field: 'stressMax', value })}
          />
          <Stepper
            label={LABELS.harm}
            value={character.harm}
            min={0}
            max={4}
            onChange={(value) => dispatch({ type: 'number', field: 'harm', value })}
            level={HARM_LEVELS[character.harm]}
          />
          <Stepper
            label={LABELS.armor}
            value={character.armor}
            min={0}
            max={6}
            onChange={(value) => dispatch({ type: 'number', field: 'armor', value })}
          />
          <Stepper
            label={LABELS.armorEffect}
            value={character.armorEffect}
            min={0}
            max={6}
            onChange={(value) => dispatch({ type: 'number', field: 'armorEffect', value })}
          />
        </Grid>
      </Section>

      <Section title={LABELS.traumas}>
        <ChoiceListEditor
          label={LABELS.traumas}
          items={character.traumas}
          options={TRAUMAS}
          onPatch={(id, patch) => dispatch({ type: 'choice.patch', field: 'traumas', id, patch })}
          onRemove={(id) => dispatch({ type: 'choice.remove', field: 'traumas', id })}
          onAdd={() => dispatch({ type: 'choice.add', field: 'traumas' })}
        />
      </Section>

      <Section title={LABELS.harmClocks}>
        {character.harmClocks.length === 0 && <p className="empty">未登録</p>}
        <div className="stack">
          {character.harmClocks.map((clock) => (
            <ClockEditor
              key={clock.id}
              label="傷のクロック"
              clock={clock}
              onPatch={(patch) => dispatch({ type: 'clock.patch', id: clock.id, patch })}
              onRemove={() => dispatch({ type: 'clock.remove', id: clock.id })}
            />
          ))}
        </div>
        <button type="button" className="button" onClick={() => dispatch({ type: 'clock.add' })}>
          クロックを追加
        </button>
      </Section>
    </>
  )
}
