import { PLAYBOOKS } from '../constants/playbooks'
import { LABELS } from '../constants/labels'
import { useCharacter } from '../state/characterContext'
import { Grid, Section, TextInput } from '../components/ui'

/**
 * 特殊能力の参照と選択。
 * 効果文はプレイ中にphem必要ないので、ここに閉じ込めている。
 */
export function AbilitiesTab() {
  const { character, dispatch } = useCharacter()
  const official = character.official
  const playbook = PLAYBOOKS[official.playbookId] ?? PLAYBOOKS.cutter

  return (
    <>
      <Section
        title={LABELS.specialAbilities}
        hint="1つ選びます。ティアが上がるたびに増やせます。シートには名前だけが表示されます。"
      >
        <div className="stack">
          {playbook.abilities.map((ability) => {
            const selected = official.abilityId === ability.id
            return (
              <label className={`pick${selected ? ' pick--on' : ''}`} key={ability.id}>
                <input
                  type="radio"
                  name="ability"
                  checked={selected}
                  onChange={() => dispatch({ type: 'official.ability', value: ability.id })}
                />
                <span>
                  <b>{ability.name}: </b>
                  {ability.effect}
                </span>
              </label>
            )
          })}
        </div>
      </Section>

      <Section title="VETERAN" hint="別のソースから選ぶ枠。3つまで。">
        <Grid columns={3}>
          {Array.from({ length: 3 }, (_, index) => (
            <TextInput
              key={index}
              label={`枠 ${index + 1}`}
              value={official.veteranSlots[index] ?? ''}
              onChange={(value) => dispatch({ type: 'official.veteran', index, value })}
            />
          ))}
        </Grid>
      </Section>

      <Section title={LABELS.crewRole} hint="クルー内での立場。公式シートには枠がありません。">
        <TextInput
          label={LABELS.crewRole}
          value={character.crewRole}
          onChange={(value) => dispatch({ type: 'crewRole', value })}
        />
      </Section>
    </>
  )
}
