import { ATTRIBUTE_LABELS, ATTRIBUTE_ORDER } from '../constants/labels'
import { useCharacter } from '../state/characterContext'
import { Grid, Pips, Section } from '../components/ui'

export function AttributesTab() {
  const { character, dispatch } = useCharacter()

  return (
    <Section title="属性" hint="初期配置2を基準に、1〜4で振ります。">
      <Grid columns={2}>
        {ATTRIBUTE_ORDER.map((key) => (
          <Pips
            key={key}
            label={ATTRIBUTE_LABELS[key]}
            value={character.attributes[key]}
            max={4}
            onChange={(value) => dispatch({ type: 'attribute', key, value })}
          />
        ))}
      </Grid>
    </Section>
  )
}
