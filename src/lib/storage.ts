import type { Character } from '../types/character'
import { parseCharacterFile } from './serialize'
export const STORAGE_KEY = 'bitd.character.v2'
export const OLD_STORAGE_KEY = 'bitd.character.v1'
export const BACKUP_KEY = 'bitd.character.backup'
export const UNREADABLE_BACKUP_KEY = 'bitd.character.unreadable-backup'
export interface StoredCharacter {
  character: Character | null
  error: string
}
export function readStoredCharacter(): StoredCharacter {
  try {
    if (typeof window === 'undefined') return { character: null, error: '' }
    const raw =
      window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(OLD_STORAGE_KEY)
    if (!raw) return { character: null, error: '' }
    const result = parseCharacterFile(raw)
    return result.ok
      ? { character: result.character, error: '' }
      : {
          character: null,
          error: `${result.error} 保存データを保護するため自動保存を停止しています。データ画面からJSONを取り込むか新規作成してください。`,
        }
  } catch {
    return {
      character: null,
      error: '保存データにアクセスできません。JSONの書き出しで保存してください。',
    }
  }
}
export function loadCharacter() {
  return readStoredCharacter().character
}
export function preserveUnreadableData() {
  try {
    const raw =
      window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(OLD_STORAGE_KEY)
    if (raw) window.localStorage.setItem(UNREADABLE_BACKUP_KEY, raw)
    return true
  } catch {
    return false
  }
}
export function saveCharacter(character: Character) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(character))
    return true
  } catch {
    return false
  }
}
export function saveBackup(character: Character) {
  try {
    window.localStorage.setItem(BACKUP_KEY, JSON.stringify(character))
    return true
  } catch {
    return false
  }
}
