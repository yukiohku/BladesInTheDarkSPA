import { useEffect, useMemo, useReducer } from 'react'
import type { ReactNode } from 'react'
import { createDefaultCharacter } from '../constants/defaults'
import { loadCharacter, saveCharacter } from '../lib/storage'
import { CharacterContext } from './characterContext'
import type { CharacterContextValue } from './characterContext'
import { characterReducer } from './characterReducer'

const SAVE_DEBOUNCE_MS = 300

export function CharacterProvider({ children }: { children: ReactNode }) {
  const [character, dispatch] = useReducer(characterReducer, null, () => {
    return loadCharacter() ?? createDefaultCharacter()
  })

  useEffect(() => {
    const timer = window.setTimeout(() => {
      saveCharacter(character)
    }, SAVE_DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [character])

  const value = useMemo<CharacterContextValue>(
    () => ({ character, dispatch }),
    [character],
  )

  return <CharacterContext.Provider value={value}>{children}</CharacterContext.Provider>
}
