import { BACKGROUNDS, HERITAGES } from '../constants/bitd'
import { LABELS } from '../constants/labels'
import { useCharacter } from '../state/characterContext'
import { ChoiceListEditor, Grid, Section, TextArea, TextInput } from '../components/ui'

export function BasicsTab() {
  const { character, dispatch } = useCharacter()
  const { basics } = character

  const setBasics = (patch: Partial<typeof basics>) => dispatch({ type: 'basics', patch })

  const matchHeritage = (name: string) => HERITAGES.find((option) => option.name === name)?.id ?? ''
  const matchBackground = (name: string) =>
    BACKGROUNDS.find((option) => option.name === name)?.id ?? ''

  return (
    <>
      <Section title="基本情報">
        <Grid>
          <TextInput
            label={LABELS.name}
            value={basics.name}
            placeholder="キャラクター名"
            onChange={(name) => setBasics({ name })}
          />
          <TextInput
            label={LABELS.pronouns}
            value={basics.pronouns}
            placeholder="呼び名・代名詞"
            onChange={(pronouns) => setBasics({ pronouns })}
          />
          <TextInput
            label={LABELS.heritage}
            value={basics.heritageName}
            options={HERITAGES}
            onChange={(heritageName) =>
              setBasics({ heritageName, heritageId: matchHeritage(heritageName) })
            }
          />
          <TextInput
            label={LABELS.background}
            value={basics.backgroundName}
            options={BACKGROUNDS}
            onChange={(backgroundName) =>
              setBasics({ backgroundName, backgroundId: matchBackground(backgroundName) })
            }
          />
        </Grid>
        <TextArea
          label={LABELS.summary}
          value={basics.summary}
          rows={4}
          placeholder="外見・性格・口癖など"
          onChange={(summary) => setBasics({ summary })}
        />
      </Section>

      <Section title={LABELS.drives} hint="キャラクターを突き動かすものを3つ。">
        <ChoiceListEditor
          label={LABELS.drives}
          items={character.drives}
          placeholder="例：姉を追い出す"
          notePlaceholder="なぜそれが多名か"
          onPatch={(id, patch) => dispatch({ type: 'choice.patch', field: 'drives', id, patch })}
        />
      </Section>
    </>
  )
}
