import { useCharacter } from '../state/characterContext'
import type { CheckBucket, RatingGroup } from '../state/characterReducer'
import { HARM_ROWS, PLAYBOOKS } from '../constants/playbooks'
import type { NamedItem } from '../constants/playbooks'
import { LABELS } from '../constants/labels'
import {
  BookmarkTrack,
  Box,
  CheckRow,
  CoinTrack,
  HealingClock,
  RatingDots,
  RuleLine,
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
}: {
  items: NamedItem[]
  bucket: CheckBucket
  selected: Record<string, boolean>
  onToggle: (bucket: CheckBucket, id: string) => void
}) {
  return (
    <div className="os-items">
      {items.map((item) => (
        <CheckRow
          key={item.id}
          id={item.id}
          name={item.name}
          checked={Boolean(selected[item.id])}
          onToggle={(id) => onToggle(bucket, id)}
        />
      ))}
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

  return (
    <div className="os">
      {/* ========== 左列：いちばん触るもの ========== */}
      <div className="os__col os__col--left">
        <RuleLine
          label={LABELS.name}
          value={character.basics.name}
          onChange={(name) => dispatch({ type: 'basics', patch: { name } })}
          className="os-rule--wide"
        />

        <div>
          <h3 className="os-minititle">{LABELS.stress}</h3>
          <StressBoxes
            value={character.stress}
            onChange={(value) => dispatch({ type: 'number', field: 'stress', value })}
          />
        </div>

        <div>
          <h3 className="os-minititle">{LABELS.traumas}</h3>
          <div className="os-items os-items--inline">
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

        <div className="os-duo os-duo--wide">
          <div>
            <h3 className="os-minititle">{LABELS.harm}</h3>
            <table className="os-harm">
              <tbody>
                {HARM_ROWS.map((row) => {
                  const active = character.harm === row.level
                  return (
                    <tr key={row.level} className={active ? 'os-harm__row--on' : undefined}>
                      <th>
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
                      <td>
                        <input
                          className="os-harm__input"
                          aria-label={`傷 ${row.level} の内容`}
                          value={official.harmNotes[String(row.level)] ?? ''}
                          onChange={(event) =>
                            dispatch({
                              type: 'official.harmNote',
                              level: row.level,
                              value: event.target.value,
                            })
                          }
                        />
                      </td>
                      <td className="os-harm__effect">{row.effect}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="os-harmright">
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

        <div className="os-grow">
          <h3 className="os-minititle">{LABELS.notes}</h3>
          <textarea
            className="os-notes os-notes--grow"
            rows={10}
            aria-label={LABELS.notes}
            value={character.notes}
            onChange={(event) => dispatch({ type: 'note', value: event.target.value })}
          />
        </div>
      </div>

      {/* ========== 中央：物資と仲間 ========== */}
      <div className="os__col os__col--center">
        <div className="os-panel os-panel--tight">
          <h3 className="os-panel__title">SPECIAL ABILITY</h3>
          <p className="os-chosen">
            {chosen ? <b>{chosen.name}</b> : chosenVet || '—'}
          </p>
          <div className="os-vets">
            {official.veteranSlots.map((slot, index) => (
              <span className="os-vet" key={`vet-${index}`}>
                <span className="os-vet__dot" aria-hidden="true" />
                <input
                  className="os-vet__input"
                  placeholder="VETERAN"
                  aria-label={`Veteran ${index + 1}`}
                  value={slot}
                  onChange={(event) =>
                    dispatch({ type: 'official.veteran', index, value: event.target.value })
                  }
                />
              </span>
            ))}
          </div>
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
                  name={item.name}
                  value={official.ratings[`${group}.${item.id}`] ?? 0}
                  onChange={(value) =>
                    dispatch({ type: 'official.rating', group, id: item.id, value })
                  }
                />
              ))}
            </div>
          </div>
        ))}

        <div className="os-panel">
          <h3 className="os-panel__title">GATHER INFORMATION</h3>
          {playbook.gatherInfo.map((question, index) => (
            <div className="os-gather" key={question}>
              <span className="os-gather__q">{question}</span>
              <input
                className="os-gather__a"
                aria-label={question}
                value={official.gatherInfo[index] ?? ''}
                onChange={(event) =>
                  dispatch({ type: 'official.gather', index, value: event.target.value })
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* ========== 下段：作戦ごと ========== */}
      <div className="os__row os__row--bottom">
        <div className="os-panel">
          <h3 className="os-panel__title">TEAMWORK</h3>
          <div className="os-items">
            {playbook.teamwork.map((item) => (
              <CheckRow
                key={item.id}
                id={item.id}
                name={item.name}
                checked={Boolean(official.teamwork[item.id])}
                onToggle={(id) => toggle('teamwork', id)}
              />
            ))}
          </div>
        </div>

        <div className="os-panel">
          <h3 className="os-panel__title">PLANNING &amp; LOAD</h3>
          <p className="os-hint">計画を選び、detail を決める。</p>
          {playbook.planning.map((item) => (
            <div className="os-plan" key={item.id}>
              <span className="os-plan__name">
                {item.name}: <i>{item.prompt}</i>
              </span>
              <input
                className="os-plan__detail"
                aria-label={`${item.name} の詳細`}
                placeholder="detail"
                value={official.planning[item.id]?.detail ?? ''}
                onChange={(event) =>
                  dispatch({
                    type: 'official.planning',
                    id: item.id,
                    patch: { detail: event.target.value },
                  })
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
