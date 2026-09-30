import type { Character } from '../types/character'
import { parseCharacterFile } from './serialize'

const STORAGE_KEY = 'bitd.character.v1'
const BACKUP_KEY = 'bitd.character.backup'

function hasStorage(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.localStorage
  } catch {
    return false
  }
}

export function loadCharacter(): Character | null {
  if (!hasStorage()) return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const result = parseCharacterFile(raw)
    return result.ok ? result.character : null
  } catch {
    return null
  }
}

export function saveCharacter(character: Character): boolean {
  if (!hasStorage()) return false
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(character))
    return true
  } catch {
    return false
  }
}

export function clearStoredCharacter(): void {
  if (!hasStorage()) return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* 保存できなくても処理は続行する */
  }
}

/** 取り込み直前に現在のシートを退避し、戻せるようにする。 */
export function saveBackup(character: Character): void {
  if (!hasStorage()) return
  try {
    window.localStorage.setItem(BACKUP_KEY, JSON.stringify(character))
  } catch {
    /* 退避できなくても取り込み自体は続行する */
  }
}

export function loadBackup(): Character | null {
  if (!hasStorage()) return null
  try {
    const raw = window.localStorage.getItem(BACKUP_KEY)
    if (!raw) return null
    const result = parseCharacterFile(raw)
    return result.ok ? result.character : null
  } catch {
    return null
  }
}

export function hasBackup(): boolean {
  if (!hasStorage()) return false
  try {
    return window.localStorage.getItem(BACKUP_KEY) !== null
  } catch {
    return false
  }
}
