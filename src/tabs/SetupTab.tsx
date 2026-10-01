import { useState } from 'react'
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
import { CreationProgress, RatingsPanel } from '../components/SheetPanels'
import { creationProblems } from '../lib/rules'
import type { PlaybookId } from '../types/character'
export function SetupTab() {
  const { character, dispatch } = useCharacter()
  const [pending, setPending] = useState<PlaybookId | null>(null)
  const [resetRatings, setResetRatings] = useState(false)
  const problems = creationProblems(character)
  const identity = character.identity
  const patch = (field: keyof typeof identity, value: string) =>
    dispatch({ type: 'identity', patch: { [field]: value } })
  return (
    <>
      <Section
        title="プレイブック"
        hint="基本7種から選びます。能力・固有装備・知人・XP条件が変わります。"
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
              setPending(value)
              setResetRatings(!character.creationComplete)
            }
          }}
        />
        <a href={PLAYBOOKS[character.playbookId].source} target="_blank" rel="noreferrer">
          このプレイブックの公式原本
        </a>
        {pending && (
          <div className="switch-preview" role="region" aria-label="プレイブック変更の確認">
            <h3>
              {PLAYBOOKS[character.playbookId].title} → {PLAYBOOKS[pending].title}
            </h3>
            <p>名前・ストレス・傷・資産・XP・取得済み能力・自由記入装備は維持します。</p>
            <p>
              知人{character.friends.length}
              件、固有装備の宣言と使用枠、情報収集の質問メモを新しいプレイブックのものに置き換えます。変更前の内容はデータ画面に保管します。
            </p>
            <ul>
              {character.friends.map((friend) => (
                <li key={friend.id}>
                  {friend.name || '未設定'}（
                  {friend.relation === 'friend'
                    ? '友人'
                    : friend.relation === 'rival'
                      ? 'ライバル'
                      : '未選択'}
                  ）
                </li>
              ))}
            </ul>
            <p>置き換える固有装備の宣言・使用枠：</p>
            <ul>
              {PLAYBOOKS[character.playbookId].items.map((item) => (
                <li key={item.id}>
                  {item.ja || item.name}：{character.equipment[item.id] || 0}個
                  {character.itemUses[item.id]?.some(Boolean) &&
                    `（使用枠：${character.itemUses[item.id].map((value) => value || '未使用').join(' / ')}）`}
                </li>
              ))}
            </ul>
            {Object.values(character.gatherNotes).some(Boolean) && (
              <>
                <p>置き換える情報収集メモ：</p>
                <ul>
                  {Object.entries(character.gatherNotes)
                    .filter(([, note]) => note)
                    .map(([id, note]) => (
                      <li key={id}>{note}</li>
                    ))}
                </ul>
              </>
            )}
            <label className="checkbox">
              <input
                type="checkbox"
                checked={resetRatings}
                onChange={(event) => setResetRatings(event.target.checked)}
              />
              アクションを新しい初期値に戻し、追加4点を配分し直す
            </label>
            <p>アクション：{resetRatings ? '初期値に再設定する' : '現在の値を維持する'}</p>
            <div className="inline-add">
              <button
                type="button"
                className="button button--primary"
                onClick={() => {
                  dispatch({ type: 'playbook.change', playbookId: pending, resetRatings })
                  setPending(null)
                }}
              >
                変更を確定
              </button>
              <button type="button" className="button" onClick={() => setPending(null)}>
                キャンセル
              </button>
            </div>
          </div>
        )}
      </Section>
      <Section title="基本情報">
        <Grid>
          <TextInput
            label="名前"
            value={identity.name}
            onChange={(value) => patch('name', value)}
          />
          <TextInput
            label="偽名"
            value={identity.alias}
            onChange={(value) => patch('alias', value)}
          />
        </Grid>
        <TextInput
          label="所属クルー名"
          value={character.crew.name}
          onChange={(name) => dispatch({ type: 'crew.name', name })}
        />
        <TextArea label="外見" value={identity.look} onChange={(value) => patch('look', value)} />
      </Section>
      <Section title="出自・経歴・悪癖">
        <Grid>
          <SelectInput
            label="出自"
            value={identity.heritageId}
            options={HERITAGES}
            onChange={(value) => patch('heritageId', value)}
          />
          <SelectInput
            label="経歴"
            value={identity.backgroundId}
            options={BACKGROUNDS}
            onChange={(value) => patch('backgroundId', value)}
          />
        </Grid>
        <TextArea
          label="出自の詳細"
          value={identity.heritageDetail}
          rows={2}
          onChange={(value) => patch('heritageDetail', value)}
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
      <Section
        title="アクションとキャラクター作成"
        hint="初期値の3点に追加4点。作成中は各アクション最大2です。成長後は通常3、Masteryなどの裁定で4まで記録できます。"
      >
        <CreationProgress />
        <RatingsPanel />
        {!character.creationComplete ? (
          <>
            <ul>
              {problems.map((problem) => (
                <li key={problem}>{problem}</li>
              ))}
            </ul>
            <button
              className="button button--primary"
              type="button"
              disabled={problems.length > 0}
              onClick={() => dispatch({ type: 'creation.complete' })}
            >
              キャラクター作成を完了
            </button>
          </>
        ) : (
          <p>作成済み。成長後のアクション値を編集できます。</p>
        )}
        <button
          className="button button--ghost"
          type="button"
          onClick={() => {
            if (
              window.confirm(
                'アクションを印刷済み初期値に戻します。追加4点は配分し直します。よろしいですか？',
              )
            )
              dispatch({ type: 'ratings.reset' })
          }}
        >
          初期アクションを再設定
        </button>
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
