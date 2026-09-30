import { PLAYBOOKS } from '../constants/playbooks'
import { ATTRIBUTE_LABELS, ATTRIBUTE_ORDER, LABELS } from '../constants/labels'
import { useCharacter } from '../state/characterContext'
import { CheckList, Grid, Pips, Section, TextArea, TextInput } from '../components/ui'

/**
 * キャラメイクで決める項目をまとめるタブ。
 * プレイ中に触る項目はシート側にあるので、ここには置かない。
 */
export function SetupTab() {
  const { character, dispatch } = useCharacter()
  const official = character.official
  const playbook = PLAYBOOKS[official.playbookId] ?? PLAYBOOKS.cutter

  return (
    <>
      <Section title="基本情報" hint="キャンペーンの最初に決めて、あとはほぼ変えません。">
        <Grid>
          <TextInput
            label="クルー名"
            value={official.crewName}
            onChange={(value) => dispatch({ type: 'official.text', field: 'crewName', value })}
          />
          <TextInput
            label={LABELS.name}
            value={character.basics.name}
            onChange={(name) => dispatch({ type: 'basics', patch: { name } })}
          />
        </Grid>
        <TextArea
          label={LABELS.look}
          value={official.look}
          rows={3}
          placeholder="外見・特徴"
          onChange={(value) => dispatch({ type: 'official.text', field: 'look', value })}
        />
        <TextArea
          label={LABELS.summary}
          value={character.basics.summary}
          rows={3}
          onChange={(summary) => dispatch({ type: 'basics', patch: { summary } })}
        />
      </Section>

      <Section title={LABELS.heritage} hint="1つ選びます。">
        <CheckList
          options={playbook.heritages}
          selected={official.heritageIds}
          onToggle={(id) => dispatch({ type: 'official.toggle', bucket: 'heritageIds', id })}
        />
      </Section>

      <Section title={LABELS.background} hint="1つ選びます。">
        <CheckList
          options={playbook.backgrounds}
          selected={official.backgroundIds}
          onToggle={(id) => dispatch({ type: 'official.toggle', bucket: 'backgroundIds', id })}
        />
      </Section>

      <Section title="VICE / PURVEYOR" hint="3つまで。プレイ中はを持ちます。">
        <CheckList
          options={playbook.vices}
          selected={official.viceIds}
          onToggle={(id) => dispatch({ type: 'official.toggle', bucket: 'viceIds', id })}
        />
        <p className="field__hint">選択中: {official.viceIds.length} / 3</p>
      </Section>

      <Section title="属性" hint="公式シートには無い項目。1〜4で振ります。">
        <Grid columns={2}>
          {ATTRIBUTE_ORDER.map((key) => (
            <Pips
              key={key}
              label={ATTRIBUTE_LABELS[key]}
              value={character.attributes[key]}
              max={4}
              onChange={(value) => dispatch({ type: 'attribute', key, value })}
            />
          ))}
        </Grid>
      </Section>

      <Section title={LABELS.drives} hint="キャラクターを突き動かすもの3つ。">
        <div className="stack">
          {character.drives.map((drive, index) => (
            <div className="slot" key={drive.id}>
              <span className="slot__index">{index + 1}</span>
              <TextInput
                label="動機"
                value={drive.name}
                placeholder="例：姉を追い出す"
                onChange={(name) =>
                  dispatch({ type: 'choice.patch', field: 'drives', id: drive.id, patch: { name } })
                }
              />
              <TextArea
                label="補足"
                value={drive.note}
                rows={2}
                onChange={(note) =>
                  dispatch({ type: 'choice.patch', field: 'drives', id: drive.id, patch: { note } })
                }
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title={LABELS.flaws} hint="3つ。">
        <div className="stack">
          {character.flaws.map((flaw) => (
            <TextInput
              key={flaw.id}
              label="欠点"
              value={flaw.name}
              onChange={(name) =>
                dispatch({ type: 'choice.patch', field: 'flaws', id: flaw.id, patch: { name } })
              }
            />
          ))}
        </div>
      </Section>
    </>
  )
}
