import { useCharacter } from '../state/characterContext'
import type { CSSProperties } from 'react'
import type { CheckBucket, RatingGroup } from '../state/characterReducer'
import { HARM_ROWS, PLAYBOOKS } from '../constants/playbooks'
import type { NamedItem } from '../constants/playbooks'
import { LABELS } from '../constants/labels'
import logoUrl from '../assets/blades-logo.png'
import {
  BookmarkTrack,
  Box,
  CheckRow,
  CoinTrack,
  HealingClock,
  RatingDots,
  StressBoxes,
} from './parts'

/**
 * プレイ中に触る項目だけを公式レイアウトで並べた表示。
 *
 * キャラメイクで決めるもの（クルー名・偽名・外見・血統・経歴・悪癖）と、
 * 静的なルール文（XP・BONUS DIE・効果文）は編集タブに回してある。
 */
function ItemList({
  items,
  bucket,
  selected,
  onToggle,
  columns = 2,
}: {
  items: NamedItem[]
  bucket: CheckBucket
  selected: Record<string, boolean>
  onToggle: (bucket: CheckBucket, id: string) => void
  columns?: number
}) {
  return (
    <div
      className="os-items os-items--cols2"
      style={{ '--os-item-columns': columns } as CSSProperties}
    >
      {items.map((item) => (
        <CheckRow
          key={item.id}
          id={item.id}
          name={item.name}
          ja={item.ja}
          checked={Boolean(selected[item.id])}
          onToggle={(id) => onToggle(bucket, id)}
        />
      ))}
    </div>
  )
}

/** id の配列を.playbook 上の表示名に変換する。見つからないものは id をそのまま出す。 */
function namesOf(items: NamedItem[], ids: readonly string[]): string[] {
  return ids.map((id) => items.find((item) => item.id === id)?.name ?? id)
}

function IdentityRow({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <div className="os-idrow">
      <span className="os-idrow__label">{label}</span>
      <span className="os-idrow__value">{value}</span>
    </div>
  )
}

export function OfficialSheetView() {
  const { character, dispatch } = useCharacter()
  const official = character.official
  const playbook = PLAYBOOKS[official.playbookId] ?? PLAYBOOKS.cutter

  const toggle = (bucket: CheckBucket, id: string) =>
    dispatch({ type: 'official.toggle', bucket, id })

  const chosen = playbook.abilities.find((ability) => ability.id === official.abilityId)
  const chosenVet = official.abilityId.startsWith('vet-')
    ? official.veteranSlots[Number(official.abilityId.slice(4))] || ''
    : ''

  const heritage = namesOf(playbook.heritages, official.heritageIds).join(' / ')
  const background = namesOf(playbook.backgrounds, official.backgroundIds).join(' / ')
  const vices = namesOf(playbook.vices, official.viceIds).join(' / ')

  return (
    <div className="os">
      {/* ロゴと playbook 名は「誰のシートか」を示す同一性なので残す */}
      <div className="os__banner">
        <img className="os__logo" src={logoUrl} alt="Blades in the Dark" />
        <h2 className="os__title">{playbook.title}</h2>
      </div>

      {/* ========== 左列：いちばん触るもの ========== */}
      <div className="os__col os__col--left">
        {/* 初期設定の結果だけ表示する（入力は編集タブ側。プレイ中に触らない） */}
        <div className="os-identity">
          <div className="os-charname">
            <span className="os-charname__label">{LABELS.name}</span>
            <span className="os-charname__value">
              {character.basics.name || '（未設定）'}
            </span>
          </div>
          <IdentityRow label="クルー" value={official.crewName} />
          <IdentityRow label={LABELS.heritage} value={heritage} />
          <IdentityRow label={LABELS.background} value={background} />
          <IdentityRow label="悪癖" value={vices} />
          <IdentityRow label={LABELS.look} value={official.look} />
        </div>

        <div>
          <h3 className="os-minititle">{LABELS.stress}</h3>
          <StressBoxes
            value={character.stress}
            max={character.stressMax}
            onChange={(value) => dispatch({ type: 'number', field: 'stress', value })}
          />
        </div>

        <div>
          <h3 className="os-minititle">{LABELS.traumas}</h3>
          <div className="os-items os-items--cols2">
            {playbook.traumas.map((item) => (
              <CheckRow
                key={item.id}
                id={item.id}
                name={item.name}
                checked={character.traumas.some((trauma) => trauma.name === item.name)}
                onToggle={() => dispatch({ type: 'trauma.toggle', name: item.name })}
              />
            ))}
          </div>
        </div>

        {/* 傷は紙上でかなり書くので、幅と行高を払う */}
        <div className="os-harmblock">
          <h3 className="os-minititle">{LABELS.harm}</h3>
          <table className="os-harm">
            {/* 幅を確実に効かせるため table-layout: fixed と併用する */}
            <colgroup>
              <col className="os-harm__col-level" />
              <col />
              <col />
              <col className="os-harm__col-effect" />
            </colgroup>
            <tbody>
              {HARM_ROWS.map((row) => {
                const active = character.harm === row.level
                return (
                  <tr key={row.level} className={active ? 'os-harm__row--on' : undefined}>
                    <th className="os-harm__levelcell">
                      <button
                        type="button"
                        className="os-harm__level"
                        aria-pressed={active}
                        onClick={() =>
                          dispatch({
                            type: 'number',
                            field: 'harm',
                            value: active ? 0 : row.level,
                          })
                        }
                      >
                        {row.level}
                      </button>
                    </th>
                    {Array.from({ length: row.cells }, (_, index) => {
                      const key = `${row.level}-${index}`
                      return (
                        <td key={key} colSpan={row.cells === 1 ? 2 : undefined}>
                          <textarea
                            className="os-harm__input"
                            rows={2}
                            aria-label={`傷 ${row.level} ${row.cells > 1 ? `の欄${index + 1}` : 'の内容'}`}
                            value={official.harmNotes[key] ?? ''}
                            onChange={(event) =>
                              dispatch({
                                type: 'official.harmNote',
                                key,
                                value: event.target.value,
                              })
                            }
                          />
                        </td>
                      )
                    })}
                    <td className="os-harm__effect">{row.effect}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="os-duo">
          <div>
            <h3 className="os-minititle">HEALING</h3>
            <HealingClock
              filled={official.healingFilled}
              onChange={(value) => dispatch({ type: 'official.healing', value })}
            />
          </div>
          <div>
            <h3 className="os-minititle">ARMOR USES</h3>
            <div className="os-items">
              {(['armor', 'heavy', 'special'] as const).map((kind) => {
                const name = kind === 'armor' ? '鎧' : kind === 'heavy' ? '重装' : '特殊'
                return (
                  <div className="os-checkrow" key={kind}>
                    <Box
                      checked={official.armorUses[kind]}
                      onChange={() => dispatch({ type: 'official.armorUse', kind })}
                      label={name}
                    />
                    <span className="os-checkrow__name">{name}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ========== 中央：物資と仲間 ========== */}
      <div className="os__col os__col--center">
        {/* 選んだ特殊能力は效果文まで載せる（プレイ中に読むものだから） */}
        <div className="os-panel os-panel--ability">
          <h3 className="os-panel__title">SPECIAL ABILITY</h3>
{chosen ? (
            <>
              <p className="os-abilityname">
                <span className="os-bi__ja">{chosen.ja ?? chosen.name}</span>
                <span className="os-bi__en">{chosen.name}</span>
              </p>
              <p className="os-abilityeffect">{chosen.effect}</p>
            </>
          ) : chosenVet ? (
            <>
              <p className="os-abilityname">VETERAN</p>
              <p className="os-abilityeffect">{chosenVet}</p>
            </>
          ) : (
            <p className="os-abilityeffect os-abilityeffect--none">
              未選択（特殊能力タブで選びます）
            </p>
          )}

          {official.veteranSlots.some((slot) => slot.trim()) && (
            <div className="os-vets">
              {official.veteranSlots.map((slot, index) =>
                slot.trim() ? (
                  <div className="os-vet" key={`vet-${index}`}>
                    <span className="os-vet__dot" aria-hidden="true" />
                    <span className="os-vet__text">{slot}</span>
                  </div>
                ) : null,
              )}
            </div>
          )}
        </div>

        <div className="os-panel">
          <h3 className="os-panel__title">DANGEROUS FRIENDS</h3>
          {official.friends.map((friend) => (
            <div className="os-friend" key={friend.id}>
              <Box
                checked={friend.up}
                onChange={() =>
                  dispatch({ type: 'official.friend.patch', id: friend.id, patch: { up: !friend.up } })
                }
                label="上げる"
                size="small"
              />
              <Box
                checked={friend.down}
                onChange={() =>
                  dispatch({ type: 'official.friend.patch', id: friend.id, patch: { down: !friend.down } })
                }
                label="下げる"
                size="small"
              />
              <input
                className="os-friend__name"
                aria-label="仲間名"
                value={friend.name}
                onChange={(event) =>
                  dispatch({
                    type: 'official.friend.patch',
                    id: friend.id,
                    patch: { name: event.target.value },
                  })
                }
              />
              <button
                type="button"
                className="os-x"
                aria-label="削除"
                onClick={() => dispatch({ type: 'official.friend.remove', id: friend.id })}
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            className="os-add"
            onClick={() => dispatch({ type: 'official.friend.add' })}
          >
            追加
          </button>
        </div>

        <div className="os-panel">
          <h3 className="os-panel__title">ITEMS <span className="os-loadlegend">LOAD {playbook.loadLimits.light}/{playbook.loadLimits.normal}/{playbook.loadLimits.heavy}</span></h3>
          <ItemList
            items={playbook.itemsGeneral}
            bucket="generalItems"
            selected={official.generalItems}
            onToggle={toggle}
          />
          <ItemList
            items={playbook.itemsPlaybook}
            bucket="playbookItems"
            selected={official.playbookItems}
            onToggle={toggle}
          />
        </div>
      </div>

      {/* ========== 右：進行とレーティング ========== */}
      <div className="os__col os__col--right">
        <CoinTrack
          label="STASH"
          value={official.stash}
          onChange={(value) => dispatch({ type: 'official.stash', value })}
        />
        <CoinTrack
          label="COIN"
          value={official.coin}
          onChange={(value) => dispatch({ type: 'official.coin', value })}
        />
        <CoinTrack
          label="エッジ"
          value={character.edges}
          onChange={(value) => dispatch({ type: 'number', field: 'edges', value })}
        />
        <div className="os-extra">
          <span className="os-extra__checks">
            {[0, 1].map((slot) => (
              <Box
                key={slot}
                checked={official.extraCheck}
                onChange={() => dispatch({ type: 'official.extra', patch: { check: !official.extraCheck } })}
                label="補助"
                size="small"
              />
            ))}
          </span>
          <input
            className="os-extra__label"
            aria-label="追加トラックの名前"
            placeholder="（無題）"
            value={official.extraLabel}
            onChange={(event) =>
              dispatch({ type: 'official.extra', patch: { label: event.target.value } })
            }
          />
          <span className="os-extra__boxes">
            {Array.from({ length: 9 }, (_, box) => {
              const filled = box < official.extraFilled
              return (
                <button
                  key={box}
                  type="button"
                  className={`os-coin__box${filled ? ' os-coin__box--on' : ''}`}
                  aria-pressed={filled}
                  aria-label={`追加トラック ${box + 1}`}
                  onClick={() =>
                    dispatch({
                      type: 'official.extra',
                      patch: {
                        filled: filled && box === official.extraFilled - 1 ? box : box + 1,
                      },
                    })
                  }
                />
              )
            })}
            <span className="os-coin__tall" aria-hidden="true" />
          </span>
        </div>

        <div className="os-track">
          <div className="os-track__head">
            <h3 className="os-track__title">PLAYBOOK</h3>
            <BookmarkTrack
              name="PLAYBOOK"
              value={official.playbookXp}
              onChange={(value) => dispatch({ type: 'official.xp', group: 'playbook', value })}
            />
          </div>
        </div>

        {(
          [
            ['insight', 'INSIGHT', playbook.insight],
            ['prowess', 'PROWESS', playbook.prowess],
            ['resolve', 'RESOLVE', playbook.resolve],
          ] as [RatingGroup, string, NamedItem[]][]
        ).map(([group, title, items]) => (
          <div className="os-track" key={group}>
            <div className="os-track__head">
              <h3 className="os-track__title">{title}</h3>
              <BookmarkTrack
                name={title}
                value={official[`${group}Xp`]}
                onChange={(value) => dispatch({ type: 'official.xp', group, value })}
              />
            </div>
            <div className="os-ratings">
              {items.map((item) => (
                <RatingDots
                  key={item.id}
                  name={item.ja ?? item.name}
                  en={item.name}
                  value={official.ratings[`${group}.${item.id}`] ?? 0}
                  onChange={(value) =>
                    dispatch({ type: 'official.rating', group, id: item.id, value })
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
