import { createContext, useContext } from 'react'
import type { Character } from '../types/character'
import type { Action } from './characterReducer'

export interface CharacterContextValue {
  character: Character
  storageError: string
  dispatch: (action: Action) => boolean
}

export const CharacterContext = createContext<CharacterContextValue | null>(null)

export function useCharacter(): CharacterContextValue {
  const value = useContext(CharacterContext)
  if (!value) {
    throw new Error('CharacterProvider の内側でのみ useCharacter を使えます。')
  }
  return value
}
