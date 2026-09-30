import {
  CREW_ROLES,
  HERITAGE_ABILITIES,
  ROLE_ABILITIES,
  SPECIAL_ABILITIES,
  VICES,
} from '../constants/bitd'
import { LABELS } from '../constants/labels'
import { useCharacter } from '../state/characterContext'
import { ChoiceListEditor, Grid, Section, TextInput } from '../components/ui'

export function AbilitiesTab() {
  const { character, dispatch } = useCharacter()

  return (
    <>
      <Section title="役割" hint="クルー内での立場と、その異能。">
        <Grid>
          <TextInput
            label={LABELS.crewRole}
            value={character.crewRole}
            options={CREW_ROLES}
            onChange={(value) => dispatch({ type: 'crewRole', value })}
            hint="一覧から選ぶか自由に記入できます"
          />
        </Grid>
        <ChoiceListEditor
          label={LABELS.roleAbilities}
          items={character.roleAbilities}
          options={ROLE_ABILITIES}
          onPatch={(id, patch) =>
            dispatch({ type: 'choice.patch', field: 'roleAbilities', id, patch })
          }
        />
      </Section>

      <Section title={LABELS.heritageAbilities} hint="血統から2つ。">
        <ChoiceListEditor
          label={LABELS.heritageAbilities}
          items={character.heritageAbilities}
          options={HERITAGE_ABILITIES}
          onPatch={(id, patch) =>
            dispatch({ type: 'choice.patch', field: 'heritageAbilities', id, patch })
          }
        />
      </Section>

      <Section title={LABELS.backgroundAbilities} hint="経歴から3つ。">
        <ChoiceListEditor
          label={LABELS.backgroundAbilities}
          items={character.backgroundAbilities}
          onPatch={(id, patch) =>
            dispatch({ type: 'choice.patch', field: 'backgroundAbilities', id, patch })
          }
        />
      </Section>

      <Section title={LABELS.specialAbilities} hint="ティアが上がるごとに1つずつ。">
        <ChoiceListEditor
          label={LABELS.specialAbilities}
          items={character.specialAbilities}
          options={SPECIAL_ABILITIES}
          onPatch={(id, patch) =>
            dispatch({ type: 'choice.patch', field: 'specialAbilities', id, patch })
          }
          onRemove={(id) => dispatch({ type: 'choice.remove', field: 'specialAbilities', id })}
          onAdd={() => dispatch({ type: 'choice.add', field: 'specialAbilities' })}
        />
      </Section>

      <Section title={LABELS.vices} hint="3つ。">
        <ChoiceListEditor
          label={LABELS.vices}
          items={character.vices}
          options={VICES}
          onPatch={(id, patch) => dispatch({ type: 'choice.patch', field: 'vices', id, patch })}
        />
      </Section>
    </>
  )
}
