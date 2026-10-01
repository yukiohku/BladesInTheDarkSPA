import { useCharacter } from '../state/characterContext'
import { LogList } from '../components/LogList'
import { Section } from '../components/ui'
export function LogTab() {
  const { character } = useCharacter()
  return (
    <Section
      title="変更履歴"
      hint="直近の記録後に別の編集がない場合、その記録を取り消せます。旧形式の履歴はデータ画面に保管しています。"
    >
      <LogList entries={character.log} />
    </Section>
  )
}
