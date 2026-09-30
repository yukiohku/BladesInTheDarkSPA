import { LABELS } from '../constants/labels'
import { useCharacter } from '../state/characterContext'
import { LogList } from '../components/LogList'
import { Section, TextArea } from '../components/ui'

export function LogTab() {
  const { character, dispatch } = useCharacter()

  return (
    <>
      <Section
        title={LABELS.log}
        hint="記録した変動を新しい順に表示しています。直近の1件は取り消せます。"
      >
        <LogList entries={character.log} />
      </Section>

      <Section title={LABELS.notes}>
        <TextArea
          label={LABELS.notes}
          value={character.notes}
          rows={10}
          onChange={(notes) => dispatch({ type: 'note', value: notes })}
        />
      </Section>
    </>
  )
}
