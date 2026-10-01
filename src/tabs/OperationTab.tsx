import { PLANS, PLAYBOOKS } from '../constants/playbooks'
import { useCharacter } from '../state/characterContext'
import { Section, SelectInput, TextArea } from '../components/ui'
export function OperationTab() {
  const { character, dispatch } = useCharacter()
  const book = PLAYBOOKS[character.playbookId]
  const plan = PLANS.find((item) => item.id === character.score.planId)
  return (
    <>
      <Section title="計画と詳細">
        <SelectInput
          label="計画"
          value={character.score.planId}
          options={PLANS}
          onChange={(planId) => dispatch({ type: 'score.patch', patch: { planId } })}
        />
        <TextArea
          label={plan?.prompt ?? '計画の詳細'}
          value={character.score.detail}
          onChange={(detail) => dispatch({ type: 'score.patch', patch: { detail } })}
        />
      </Section>
      <Section
        title="情報収集"
        hint={`${book.title}の質問例。状況に応じて自由に情報を集められます。`}
      >
        <div className="stack">
          {book.gatherInfo.map((question, index) => (
            <TextArea
              key={`${book.id}:${index}`}
              label={question}
              value={character.gatherNotes[`${book.id}:${index}`] ?? ''}
              onChange={(value) => dispatch({ type: 'gather', key: `${book.id}:${index}`, value })}
            />
          ))}
        </div>
      </Section>
      <Section title="チームワーク">
        <p>仲間を助ける（Assist）：ストレス1で味方に＋1d。</p>
        <p>
          集団行動の指揮（Lead）、仲間を守る（Protect）、仕込み（Set
          up）の結果と負担は卓で判断して記録します。
        </p>
      </Section>
    </>
  )
}
