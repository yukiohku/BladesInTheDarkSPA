import { PLAYBOOKS } from '../constants/playbooks'
import { useCharacter } from '../state/characterContext'
import { CheckList, Grid, Section, TextArea, TextInput } from '../components/ui'

/**
 * 作戦ごとのメモ。プレイシートには載せず、ここに退避している。
 * シートからBeck的前景を要求和されたため。
 */
export function OperationTab() {
  const { character, dispatch } = useCharacter()
  const official = character.official
  const playbook = PLAYBOOKS[official.playbookId] ?? PLAYBOOKS.cutter

  return (
    <>
      <Section title="TEAMWORK" hint="手を出したらチェックする。">
        <CheckList
          options={playbook.teamwork}
          selected={playbook.teamwork.filter((item) => official.teamwork[item.id]).map((i) => i.id)}
          onToggle={(id) => dispatch({ type: 'official.toggle', bucket: 'teamwork', id })}
          columns={2}
        />
      </Section>

      <Section title="PLANNING &amp; LOAD" hint="chosen a plan, detail を決める。">
        <Grid columns={2}>
          {playbook.planning.map((item) => (
            <Section key={item.id} title={`${item.name}: ${item.prompt}`}>
              <TextInput
                label="detail"
                value={official.planning[item.id]?.detail ?? ''}
                onChange={(value) =>
                  dispatch({ type: 'official.planning', id: item.id, patch: { detail: value } })
                }
              />
              <TextInput
                label="load 上限"
                value={official.planning[item.id]?.load ?? ''}
                onChange={(value) =>
                  dispatch({ type: 'official.planning', id: item.id, patch: { load: value } })
                }
              />
            </Section>
          ))}
        </Grid>
      </Section>

      <Section title="GATHER INFORMATION" hint="询问した内容をメモしておく。">
        <div className="stack">
          {playbook.gatherInfo.map((question, index) => (
            <TextArea
              key={question}
              label={question}
              rows={2}
              value={official.gatherInfo[index] ?? ''}
              onChange={(value) => dispatch({ type: 'official.gather', index, value })}
            />
          ))}
        </div>
      </Section>
    </>
  )
}
