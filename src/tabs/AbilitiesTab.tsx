import { useState } from 'react'
import { isPlaybookId, PLAYBOOK_LIST, PLAYBOOKS } from '../constants/playbooks'
import type { PlaybookId } from '../types/character'
import { useCharacter } from '../state/characterContext'
import { Section, SelectInput } from '../components/ui'
import { AbilityCards } from '../components/SheetPanels'
import { ABILITY_LABELS, PLAYBOOK_LABELS } from '../constants/labels'
export function AbilitiesTab() {
  const { character, dispatch } = useCharacter()
  const [source, setSource] = useState<PlaybookId | null>(character.playbookId)
  if (character.playbookId === null) {
    return (
      <Section title="特殊能力" hint={PLAYBOOK_LABELS.selectFirst}>
        <AbilityCards editing />
      </Section>
    )
  }
  return (
    <>
      <Section
        title="取得済みの特殊能力"
        hint={`作成時に1つ、成長時に追加します。取得数は階級と連動しません。効果は参考訳・要約です。${ABILITY_LABELS.editHint}`}
      >
        <AbilityCards editing />
      </Section>
      <Section
        title="能力を取得"
        hint="他の基本プレイブックの能力は「古参」として取得できます。追加取得できる能力は複数の選択内容を記録できます。"
      >
        <SelectInput
          label="能力の取得元"
          value={source ?? ''}
          options={PLAYBOOK_LIST.map((book) => ({ id: book.id, name: book.title }))}
          onChange={(value) => {
            if (isPlaybookId(value)) setSource(value)
          }}
        />
        <div className="stack">
          {(source ? PLAYBOOKS[source].abilities : []).map((ability) => {
            const acquired = character.abilities.some((item) => item.definitionId === ability.id)
            const label = acquired
              ? (ability.repeatable ? ABILITY_LABELS.acquireAgain : ABILITY_LABELS.acquired)
              : ABILITY_LABELS.acquire
            return (
              <div className="ability-option" key={ability.id}>
                <h3>
                  {ability.ja} / {ability.name}
                </h3>
                <p>{ability.effect}</p>
                <button
                  className="button"
                  type="button"
                  disabled={!ability.repeatable && acquired}
                  onClick={() => dispatch({ type: 'ability.add', definitionId: ability.id })}
                >
                  {label}：{ability.name}
                </button>
              </div>
            )
          })}
        </div>
        <button
          type="button"
          className="button"
          onClick={() => dispatch({ type: 'ability.custom' })}
        >
          自由記入の能力を追加
        </button>
      </Section>
    </>
  )
}
