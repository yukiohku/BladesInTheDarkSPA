import {
  BACKGROUNDS,
  HERITAGES,
  isPlaybookId,
  PLAYBOOK_LIST,
  PLAYBOOKS,
  VICES,
} from '../constants/playbooks'
import { useCharacter } from '../state/characterContext'
import { Grid, Section, SelectInput, TextArea, TextInput } from '../components/ui'
import { ActionAllocationPanel } from '../components/ActionAllocationPanel'
import { SETUP_LABELS } from '../constants/labels'
export function SetupTab() {
  const { character, dispatch } = useCharacter()
  const identity = character.identity
  const heritage = HERITAGES.find((item) => item.id === identity.heritageId)
  const patch = (field: keyof typeof identity, value: string) =>
    dispatch({ type: 'identity', patch: { [field]: value } })
  return (
    <>
      <Section
        title="プレイブック"
        hint="基本7種から選びます。切り替えると知人・固有装備・情報収集メモ・取得済み特殊能力は新しい内容に置き換わり、アクションは初期値に戻ります。名前・状態・資産・XPは維持し、置き換え前の固有データはデータ画面に保管します。"
      >
        <SelectInput
          label="プレイブック"
          value={character.playbookId}
          options={PLAYBOOK_LIST.map((book) => ({
            id: book.id,
            name: `${book.title} — ${book.descriptor}`,
          }))}
          onChange={(value) => {
            if (isPlaybookId(value) && value !== character.playbookId) {
              dispatch({ type: 'playbook.change', playbookId: value, resetRatings: true })
            }
          }}
        />
        <a href={PLAYBOOKS[character.playbookId].source} target="_blank" rel="noreferrer">
          このプレイブックの公式原本
        </a>
      </Section>
      <Section title="基本情報">
        <Grid>
          <TextInput
            label="名前"
            value={identity.name}
            onChange={(value) => patch('name', value)}
          />
          <TextInput
            label="所属クルー名"
            value={character.crew.name}
            onChange={(name) => dispatch({ type: 'crew.name', name })}
          />
        </Grid>
        <TextArea label="外見" value={identity.look} onChange={(value) => patch('look', value)} />
      </Section>
      <Section title="出自・経歴・悪癖">
        <SelectInput
          label="出自"
          value={identity.heritageId}
          options={HERITAGES.map((item) => ({ id: item.id, name: `${item.name}：${item.summary}` }))}
          hint={heritage?.description}
          onChange={(value) => patch('heritageId', value)}
        />
        <TextArea
          label="出自の詳細"
          value={identity.heritageDetail}
          rows={2}
          placeholder={SETUP_LABELS.heritageDetailPlaceholder}
          onChange={(value) => patch('heritageDetail', value)}
        />
        <SelectInput
          label="経歴"
          value={identity.backgroundId}
          options={BACKGROUNDS}
          onChange={(value) => patch('backgroundId', value)}
        />
        <TextArea
          label="経歴の詳細"
          value={identity.backgroundDetail}
          rows={2}
          onChange={(value) => patch('backgroundDetail', value)}
        />
        <SelectInput
          label="悪癖"
          value={identity.viceId}
          options={VICES}
          onChange={(value) => patch('viceId', value)}
        />
        <TextArea
          label="悪癖の内容"
          value={identity.viceDetail}
          rows={2}
          onChange={(value) => patch('viceDetail', value)}
        />
        <TextInput
          label="悪癖の提供者・場所"
          value={identity.purveyor}
          onChange={(value) => patch('purveyor', value)}
        />
      </Section>
      <Section title="アクション">
        <ActionAllocationPanel key={character.playbookId} />
      </Section>
      <Section
        title={PLAYBOOKS[character.playbookId].friendsTitle}
        hint="親しい人物1人と別のライバル1人を選びます。名前は編集できます。"
      >
        {character.friends.map((friend) => (
          <div className="friend-editor" key={friend.id}>
            <TextInput
              label="知人の名前・役割"
              value={friend.name}
              onChange={(name) =>
                dispatch({ type: 'friend.patch', id: friend.id, patch: { name } })
              }
            />
            <SelectInput
              label={`${friend.name || '知人'}との関係`}
              value={friend.relation}
              options={[
                { id: 'neutral', name: '未選択' },
                { id: 'friend', name: '親しい人物' },
                { id: 'rival', name: 'ライバル' },
              ]}
              onChange={(relation) => {
                if (relation === 'neutral' || relation === 'friend' || relation === 'rival')
                  dispatch({ type: 'friend.patch', id: friend.id, patch: { relation } })
              }}
            />
            <button
              type="button"
              className="button button--danger-ghost"
              aria-label={`${friend.name || '知人'}を削除`}
              onClick={() => dispatch({ type: 'friend.remove', id: friend.id })}
            >
              削除
            </button>
          </div>
        ))}
        <button className="button" type="button" onClick={() => dispatch({ type: 'friend.add' })}>
          知人を追加
        </button>
      </Section>
      <Section title="人物設定・メモ">
        <TextArea
          label="信念・動機・自由メモ"
          value={character.notes}
          rows={6}
          onChange={(value) => dispatch({ type: 'note', value })}
        />
      </Section>
    </>
  )
}
