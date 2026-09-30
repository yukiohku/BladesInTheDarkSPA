import { useCharacter } from '../state/characterContext'
import type { RatingGroup } from '../state/characterReducer'
import type { CheckBucket } from '../state/characterReducer'
import {
  HARM_ROWS,
  PLAYBOOKS,
  VETERAN_SLOTS,
} from '../constants/playbooks'
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

function useOfficial() {
  const { character, dispatch } = useCharacter()
  const official = character.official
  const playbook = PLAYBOOKS[official.playbookId] ?? PLAYBOOKS.cutter
  return { official, playbook, dispatch, character }
}

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
  const { official, playbook, dispatch, character } = useOfficial()

  const toggle = (bucket: CheckBucket, id: string) =>
    dispatch({ type: 'official.toggle', bucket, id })

  return (
    <div className="os">
      {/* ================= 左列 ================= */}
      <div className="os__col os__col--left">
        <div className="os-brandrow">
          <span className="os-brand">BLADES IN THE DARK</span>
          <RuleLine
            label="クルー"
            value={official.crewName}
            onChange={(value) => dispatch({ type: 'official.text', field: 'crewName', value })}
            className="os-rule--wide"
          />
        </div>

        <div className="os-duo">
          <RuleLine
            label={LABELS.name}
            value={character.basics.name}
            onChange={(name) => dispatch({ type: 'basics', patch: { name } })}
          />
          <RuleLine
            label={LABELS.alias}
            value={official.alias}
            onChange={(value) => dispatch({ type: 'official.text', field: 'alias', value })}
          />
        </div>

        <textarea
          className="os-look"
          rows={2}
          placeholder="外見"
          aria-label="外見"
          value={official.look}
          onChange={(event) => dispatch({ type: 'official.text', field: 'look', value: event.target.value })}
        />

        <div className="os-duo os-duo--list">
          <div>
            <h3 className="os-minititle">{LABELS.heritage}</h3>
            <div className="os-items os-items--inline">
              {playbook.heritages.map((item) => (
                <CheckRow
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  checked={official.heritageIds.includes(item.id)}
                  onToggle={(id) => toggle('heritageIds', id)}
                />
              ))}
            </div>
          </div>
          <div>
            <h3 className="os-minititle">{LABELS.background}</h3>
            <div className="os-items os-items--inline">
              {playbook.backgrounds.map((item) => (
                <CheckRow
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  checked={official.backgroundIds.includes(item.id)}
                  onToggle={(id) => toggle('backgroundIds', id)}
                />
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="os-minititle">VICE / PURVEYOR</h3>
          <div className="os-items os-items--inline">
            {playbook.vices.map((item) => (
              <CheckRow
                key={item.id}
                id={item.id}
                name={item.name}
                checked={official.viceIds.includes(item.id)}
                onToggle={(id) => toggle('viceIds', id)}
              />
            ))}
          </div>
        </div>

        <div className="os-duo os-duo--tight">
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

        <div>
          <h3 className="os-minititle">{LABELS.notes}</h3>
          <textarea
            className="os-notes"
            rows={6}
            aria-label={LABELS.notes}
            value={character.notes}
            onChange={(event) => dispatch({ type: 'note', value: event.target.value })}
          />
        </div>
      </div>

      {/* ================= 中央列 ================= */}
      <div className="os__col os__col--center">
        <div className="os-titlebar">
          <h2 className="os-title">{playbook.title}</h2>
          <p className="os-descriptor">{playbook.descriptor}</p>
        </div>

        <div className="os-panel">
          <h3 className="os-panel__title">SPECIAL ABILITIES</h3>
          <div className="os-abilities">
            {playbook.abilities.map((ability) => (
              <label className="os-ability" key={ability.id}>
                <input
                  type="radio"
                  name="ability"
                  checked={official.abilityId === ability.id}
                  onChange={() => dispatch({ type: 'official.ability', value: ability.id })}
                />
                <span>
                  <b>{ability.name}: </b>
                  {ability.effect}
                </span>
              </label>
            ))}
            {Array.from({ length: VETERAN_SLOTS }, (_, index) => {
              const slotId = `vet-${index}`
              return (
                <label className="os-ability os-ability--vet" key={slotId}>
                  <input
                    type="radio"
                    name="ability"
                    checked={official.abilityId === slotId}
                    onChange={() => dispatch({ type: 'official.ability', value: slotId })}
                  />
                  <span>
                    <b>◯◯◯ VETERAN: </b>
                    <input
                      className="os-inline"
                      placeholder="別のソースから選ぶ"
                      aria-label={`Veteran ${index + 1}`}
                      value={official.veteranSlots[index] ?? ''}
                      onChange={(event) =>
                        dispatch({ type: 'official.veteran', index, value: event.target.value })
                      }
                    />
                  </span>
                </label>
              )
            })}
          </div>
        </div>

        <div className="os-split">
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

          <div className="os-panel os-panel--itemshead">
            <h3 className="os-panel__title">
              ITEMS{' '}
              <span className="os-loadlegend">
                LOAD {playbook.loadLimits.light} light / {playbook.loadLimits.normal} normal /{' '}
                {playbook.loadLimits.heavy} heavy
              </span>
            </h3>
            <p className="os-hint">チェックリストは右の欄にあります。</p>
          </div>
        </div>

        <div className="os-panel os-panel--rules">
          <h3 className="os-panel__title">XP</h3>
          <ul className="os-rules">
            <li>絶望的な行動ロールをするたび、その属性に xp を記す。</li>
            <li>
              セッション終わりに、次のどれかが起きたら1 xp（playbook か属性に）、
              複数回起きたら2 xp を記す。
            </li>
            <li>暴力や脅迫で，对方 등장した。</li>
            <li>信仰・動機・血統・経歴を行動に出した。</li>
            <li>悪癖やトラウマに由来する問題を乗り切った。</li>
          </ul>
        </div>

      </div>

      {/* ================= 右サイド ================= */}
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

        {/* 公式は無題の2行。1行目はエッジ（リリー）の置き場に使う */}
        <div className="os-extra">
          <span className="os-extra__checks">
            <Box
              checked={false}
              onChange={() => undefined}
              label="補助"
              size="small"
            />
            <Box
              checked={false}
              onChange={() => undefined}
              label="補助"
              size="small"
            />
          </span>
          <span className="os-extra__label os-extra__label--fixed">エッジ（リリー）</span>
          <span className="os-extra__boxes">
            {Array.from({ length: 9 }, (_, box) => {
              const filled = box < character.edges
              return (
                <button
                  key={box}
                  type="button"
                  className={`os-coin__box${filled ? ' os-coin__box--on' : ''}`}
                  aria-pressed={filled}
                  aria-label={`エッジ ${box + 1}`}
                  onClick={() =>
                    dispatch({
                      type: 'number',
                      field: 'edges',
                      value: filled && box === character.edges - 1 ? box : box + 1,
                    })
                  }
                />
              )
            })}
            <span className="os-coin__tall" aria-hidden="true" />
          </span>
        </div>

        <div className="os-extra">
          <span className="os-extra__checks">
            {[0, 1].map((slot) => (
              <Box
                key={slot}
                checked={official.extraCheck}
                onChange={() =>
                  dispatch({
                    type: 'official.extra',
                    patch: { check: !official.extraCheck },
                  })
                }
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

        <div className="os-track os-track--bonus">
          <h3 className="os-track__title">BONUS DIE</h3>
          <p className="os-bonus">
            <b>PUSH YOURSELF</b> (2 stress) -OR- accept a <b>DEVIL&apos;S BARGAIN.</b>
          </p>
        </div>
      </div>

      {/* 公式では ITEMS のチェックリストが右列の下に入る */}
      <div className="os__col os__col--items">
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

      {/* 最下段は中央と右にまたがる */}
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
          <p className="os-hint">計画を選び、detail を決める。load 上限も。</p>
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
    </div>
  )
}
