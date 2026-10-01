import type { SheetState } from '../types/character'
import { stressMax } from './rules'
export function characterStatus(character: SheetState) {
  const messages: string[] = []
  if (character.stress >= stressMax(character))
    messages.push(
      'ストレス枠が埋まりました。トラウマとストレスの処理を卓で確認して記録してください。',
    )
  if (character.traumas.length >= 4)
    messages.push('トラウマが4つあります。通常の悪党としての活動を終える状態です。')
  if (character.harm.fatal) messages.push('致命的な傷・結果が記録されています。')
  return messages
}
