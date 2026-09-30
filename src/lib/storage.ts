import type { Character } from '../types/character'
import { parseCharacterFile } from './serialize'

const STORAGE_KEY = 'bitd.character.v1'

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
