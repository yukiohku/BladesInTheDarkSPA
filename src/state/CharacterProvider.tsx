import { useEffect, useMemo, useReducer, useState } from 'react'
import type { ReactNode } from 'react'
import { createDefaultCharacter } from '../constants/defaults'
import { preserveUnreadableData, readStoredCharacter, saveCharacter } from '../lib/storage'
import { CharacterContext } from './characterContext'
import { characterReducer } from './characterReducer'
import type { Action } from './characterReducer'
export function CharacterProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(readStoredCharacter)
  const [character, reduce] = useReducer(
    characterReducer,
    initial.character,
    (saved) => saved ?? createDefaultCharacter(),
  )
  const [blocked, setBlocked] = useState(initial.error)
  const [saveError, setSaveError] = useState('')
  useEffect(() => {
    if (blocked) return
    const timer = window.setTimeout(
      () =>
        setSaveError(
          saveCharacter(character)
            ? ''
            : '自動保存できませんでした。JSONを書き出して保存してください。',
        ),
      300,
    )
    return () => window.clearTimeout(timer)
  }, [character, blocked])
  const value = useMemo(
    () => ({
      character,
      storageError: saveError || blocked,
      dispatch: (action: Action) => {
        if (action.type === 'replace' || action.type === 'reset') {
          if (blocked && !preserveUnreadableData()) {
            setSaveError('元の保存データを退避できなかったため、置き換えを中止しました。')
            return false
          }
          setBlocked('')
        }
        reduce(action)
        return true
      },
    }),
    [character, blocked, saveError],
  )
  return <CharacterContext.Provider value={value}>{children}</CharacterContext.Provider>
}
