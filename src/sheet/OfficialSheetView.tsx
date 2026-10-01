import {
  ACTION_GROUPS,
  ATTRIBUTE_XP_MAX,
  BACKGROUNDS,
  COIN_MAX,
  COMMON_XP_TRIGGERS,
  HERITAGES,
  PLAYBOOKS,
  PLAYBOOK_XP_MAX,
  STASH_MAX,
  VICES,
} from '../constants/playbooks'
import { useCharacter } from '../state/characterContext'
import {
  AbilityCards,
  EquipmentPanel,
  HarmPanel,
  RatingsPanel,
} from '../components/SheetPanels'
import { TextArea } from '../components/ui'
import { TraumaPanel } from '../tabs/StatusTab'
import { BookmarkTrack, CoinTrack, StressBoxes } from './parts'
import { abilityDefinitions, loadLimits, stressMax } from '../lib/rules'
import { characterStatus } from '../lib/status'
import logoUrl from '../assets/blades-logo.png'

function IdentityRow({
  label,
  value,
  showEmpty = false,
}: {
  label: string
  value: string
  showEmpty?: boolean
}) {
  if (!value && !showEmpty) return null
  return (
    <div className="os-idrow">
      <span className="os-idrow__label">{label}</span>
      <span
        className={`os-idrow__value${value ? '' : ' os-idrow__value--empty'}`}
        aria-label={value || `${label} 未入力`}
      >
        {value || '\u00a0'}
      </span>
    </div>
  )
}

export function OfficialSheetView() {
  const { character, dispatch } = useCharacter()
  const book = PLAYBOOKS[character.playbookId]
  const identity = character.identity
  const limits = loadLimits(character)
  return (
    <div className="os">
      <div className="os__banner">
        <img className="os__logo" src={logoUrl} alt="Blades in the Dark" />
        <div className="os__playbook">
          <h2 className="os__title">{book.title}</h2>
          <p className="os__descriptor">{book.descriptor}</p>
        </div>
      </div>
      <div className="os__col os__col--left">
        <section className="os-identity" aria-label="人物情報">
          <div className="os-charname">
            <span className="os-charname__label">名前</span>
            <span className="os-charname__value">{identity.name || '（未設定）'}</span>
          </div>
          <IdentityRow label="クルー" value={character.crew.name} />
          <IdentityRow
            label="出自"
            showEmpty
            value={
              HERITAGES.find((item) => item.id === identity.heritageId)?.name ?? identity.heritageId
            }
          />
          <IdentityRow
            label="経歴"
            showEmpty
            value={
              BACKGROUNDS.find((item) => item.id === identity.backgroundId)?.name ??
              identity.backgroundId
            }
          />
          <IdentityRow label="外見" value={identity.look} showEmpty />
          <IdentityRow
            label="悪癖"
            showEmpty
            value={[
              VICES.find((item) => item.id === identity.viceId)?.name ?? identity.viceId,
              identity.viceDetail,
              identity.purveyor,
            ]
              .filter(Boolean)
              .join(' / ')}
          />
        </section>
        <section className="os-condition">
          <h3 className="os-minititle">
            ストレス <small>STRESS</small>
          </h3>
          <StressBoxes
            value={character.stress}
            max={stressMax(character)}
            onChange={(value) => dispatch({ type: 'resource', resource: 'stress', value })}
          />
          {characterStatus(character).map((message) => (
            <p role="status" className="sheet-warning" key={message}>
              {message}
            </p>
          ))}
        </section>
        <section className="os-condition">
          <h3 className="os-minititle">
            トラウマ <small>TRAUMA {character.traumas.length}/4</small>
          </h3>
          <TraumaPanel compact />
        </section>
        <section className="os-condition os-harmblock">
          <h3 className="os-minititle">
            傷 <small>HARM</small>
          </h3>
          <HarmPanel compact />
        </section>
        <section className="os-notes">
          <h3 className="os-minititle">
            メモ <small>NOTES</small>
          </h3>
          <TextArea
            label="信念・動機・自由メモ"
            value={character.notes}
            rows={2}
            onChange={(value) => dispatch({ type: 'note', value })}
          />
        </section>
        <details className="os-gather">
          <summary>情報収集の質問例</summary>
          <ul>
            {book.gatherInfo.map((question) => <li key={question}>{question}</li>)}
          </ul>
        </details>
      </div>
      <div className="os__col os__col--center">
        <section className="os-panel os-panel--ability">
          <h3 className="os-panel__title">
            SPECIAL ABILITIES <small>特殊能力</small>
          </h3>
          <AbilityCards />
        </section>
        <section className="os-panel os-friends">
          <h3 className="os-panel__title">
            FRIENDS <small>{book.friendsTitle}</small>
          </h3>
          {character.friends.map((friend) => (
            <div className="os-friend" key={friend.id}>
              <span
                className="os-friend__relation"
                role="img"
                aria-label={`${friend.name}：${friend.relation === 'friend' ? '親しい人物' : friend.relation === 'rival' ? 'ライバル' : '未選択'}`}
              >
                {(['friend', 'rival'] as const).map((relation) => {
                  const selected = friend.relation === relation
                  const isFriend = relation === 'friend'
                  return (
                    <span
                      key={relation}
                      className={`os-friend__mark os-friend__mark--${relation}${selected ? ' os-friend__mark--selected' : ''}`}
                      aria-hidden="true"
                    >
                      {isFriend ? (selected ? '▲' : '△') : selected ? '▼' : '▽'}
                    </span>
                  )
                })}
              </span>
              <span className="os-friend__readout">{friend.name}</span>
            </div>
          ))}
          <p className="os-friendlegend">△ 親しい人物 / ▽ ライバル</p>
        </section>
        <section className="os-panel os-equipment">
          <h3 className="os-panel__title">
            ITEMS{' '}
            <span className="os-loadlegend">
              LOAD {limits.light}/{limits.normal}/{limits.heavy}
            </span>
          </h3>
          <EquipmentPanel />
        </section>
      </div>
      <div className="os__col os__col--right">
        <section className="os-assets" aria-label="個人資産">
          <CoinTrack
            label="STASH"
            value={character.stash}
            max={STASH_MAX}
            onChange={(value) => dispatch({ type: 'resource', resource: 'stash', value })}
          />
          <CoinTrack
            label="COIN"
            value={character.coin}
            max={COIN_MAX}
            onChange={(value) => dispatch({ type: 'resource', resource: 'coin', value })}
          />
        </section>
        <RatingsPanel sheet />
        <section className="os-experience" aria-label="経験値">
          <h3 className="os-panel__title">
            EXPERIENCE <small>経験値</small>
          </h3>
          <div className="os-experience__tracks">
            <div className="os-experience__row">
              <span className="os-minititle">PLAYBOOK</span>
              <BookmarkTrack
                name="PLAYBOOK"
                value={character.xp.playbook}
                max={PLAYBOOK_XP_MAX}
                onChange={(value) => dispatch({ type: 'resource', resource: 'playbook', value })}
              />
            </div>
            {ACTION_GROUPS.map((group) => (
              <div className="os-experience__row" key={group.id}>
                <span className="os-minititle">{group.name}</span>
                <BookmarkTrack
                  name={group.name}
                  value={character.xp[group.id]}
                  max={ATTRIBUTE_XP_MAX}
                  onChange={(value) => dispatch({ type: 'resource', resource: group.id, value })}
                />
              </div>
            ))}
          </div>
        </section>
        <section className="os-xp-rules">
          <h3 className="os-minititle">XP条件</h3>
          <p>Desperateのアクション判定ごとに対応属性へXP1。</p>
          <ul>
            {[
              book.xpTrigger,
              ...COMMON_XP_TRIGGERS,
              ...abilityDefinitions(character).flatMap((option) =>
                option.xpTrigger ? [option.xpTrigger] : [],
              ),
            ].map((trigger) => (
              <li key={trigger}>{trigger}</li>
            ))}
          </ul>
          <details>
            <summary>セッション終了・成長</summary>
            <p>
              該当する条件ごとにXP1、複数回ならXP2をプレイブックか属性へ記録します。トラックが埋まったら、卓で成長を確認して、編集画面で能力やアクションを追加します。アクション値は「初期設定」で変更できます。
            </p>
          </details>
        </section>
      </div>
    </div>
  )
}
