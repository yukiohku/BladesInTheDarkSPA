import type { Character } from '../types/character'

export type StatusLevel = 'info' | 'warn' | 'danger'

export interface StatusNote {
  level: StatusLevel
  text: string
}

export function characterStatus(character: Character): StatusNote[] {
  const notes: StatusNote[] = []

  if (character.harm >= 4) {
    notes.push({ level: 'danger', text: '致命傷です。プレイの上では死亡として扱われます。' })
  } else if (character.harm >= 3) {
    notes.push({ level: 'danger', text: '命の危機です。重傷のままだと通常の行動ができません。' })
  } else if (character.harm >= 2) {
    notes.push({ level: 'warn', text: '重傷です。回復するまでは行動に制限があります。' })
  }

  if (character.stress >= character.stressMax) {
    notes.push({ level: 'warn', text: 'ストレスが上限です。トラウマを受け入れて0に戻してください。' })
  } else if (character.stress >= character.stressMax - 1) {
    notes.push({ level: 'info', text: 'ストレスが上限手前です。' })
  }

  if (character.armor <= 0) {
    notes.push({ level: 'info', text: '鎧を装着していません。' })
  }

  return notes
}
