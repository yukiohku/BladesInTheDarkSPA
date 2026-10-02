import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useEffect } from 'react'
import { cleanup, render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { CharacterProvider } from '../state/CharacterProvider'
import { useCharacter } from '../state/characterContext'
import { createDefaultCharacter } from '../constants/defaults'
import {
  BACKUP_KEY,
  OLD_STORAGE_KEY,
  readStoredCharacter,
  saveBackup,
  saveCharacter,
  STORAGE_KEY,
  UNREADABLE_BACKUP_KEY,
} from './storage'
import { parseCharacterFile } from './serialize'
beforeEach(() => window.localStorage.clear())
afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
})
describe('ブラウザ保存', () => {
  it('v1保存から移行しても原保存キーを上書きしない', () => {
    const raw = JSON.stringify({
      schemaVersion: 1,
      basics: { name: '旧キャラクター' },
      attributes: { edge: 2 },
    })
    window.localStorage.setItem(OLD_STORAGE_KEY, raw)
    const result = readStoredCharacter()
    if (!result.character) throw new Error(result.error)
    expect(result.character.identity.name).toBe('旧キャラクター')
    expect(saveCharacter(result.character)).toBe(true)
    expect(window.localStorage.getItem(OLD_STORAGE_KEY)).toBe(raw)
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeTruthy()
  })
  it('壊れたv2保存を検出し、自動保存で上書きしない', async () => {
    vi.useFakeTimers()
    window.localStorage.setItem(STORAGE_KEY, '{broken')
    render(
      <CharacterProvider>
        <App />
      </CharacterProvider>,
    )
    expect(screen.getByRole('alert').textContent).toContain('自動保存を停止')
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('{broken')
    act(() => window.dispatchEvent(new Event('pagehide')))
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('{broken')
  })
  it('300ms後に独立したv2キーへ保存する', async () => {
    vi.useFakeTimers()
    render(
      <CharacterProvider>
        <App />
      </CharacterProvider>,
    )
    await act(async () => {
      await vi.advanceTimersByTimeAsync(299)
    })
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1)
    })
    expect(readStoredCharacter().character?.schemaVersion).toBe(2)
  })
  it.each(['pagehide', 'visibilitychange'])('%sで保存待ちの最新入力を退避する', async (event) => {
    vi.useFakeTimers()
    let updateName: (name: string) => void = () => { throw new Error('Provider未初期化') }
    function Probe() {
      const { dispatch } = useCharacter()
      useEffect(() => {
        updateName = (name) => { dispatch({ type: 'identity', patch: { name } }) }
      }, [dispatch])
      return null
    }
    render(<CharacterProvider><Probe /></CharacterProvider>)
    act(() => updateName('途中の名前'))
    act(() => updateName('保存待ちの人物'))
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()
    act(() => {
      if (event === 'visibilitychange') {
        vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden')
        document.dispatchEvent(new Event(event))
      } else window.dispatchEvent(new Event(event))
    })
    expect(readStoredCharacter().character?.identity.name).toBe('保存待ちの人物')
    const writes = vi.spyOn(Storage.prototype, 'setItem')
    await act(async () => { await vi.advanceTimersByTimeAsync(300) })
    act(() => window.dispatchEvent(new Event('pagehide')))
    expect(writes).not.toHaveBeenCalled()
  })
  it('明示的な新規作成でも読めない元データを退避してから保存する', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    window.localStorage.setItem(STORAGE_KEY, '{broken')
    render(
      <CharacterProvider>
        <App />
      </CharacterProvider>,
    )
    await user.click(screen.getByRole('button', { name: '編集' }))
    await user.click(screen.getByRole('button', { name: 'データ' }))
    await user.click(screen.getByRole('button', { name: '新しいキャラクターを作成' }))
    expect(window.localStorage.getItem(UNREADABLE_BACKUP_KEY)).toBe('{broken')
    await waitFor(() => expect(readStoredCharacter().character?.playbookId).toBeNull())
  })
  it('読めない元データの退避に失敗したら置き換えず自動保存停止を保つ', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    window.localStorage.setItem(STORAGE_KEY, '{broken')
    const originalSetItem = Storage.prototype.setItem
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key, value) {
      if (key === UNREADABLE_BACKUP_KEY) throw new Error('quota')
      originalSetItem.call(this, key, value)
    })
    render(
      <CharacterProvider>
        <App />
      </CharacterProvider>,
    )
    await user.click(screen.getByRole('button', { name: '編集' }))
    await user.click(screen.getByRole('button', { name: 'データ' }))
    await user.click(screen.getByRole('button', { name: '新しいキャラクターを作成' }))
    expect(screen.getByRole('status').textContent).toContain('新規作成を中止')
    expect(screen.getByRole('alert').textContent).toContain('置き換えを中止')
    await new Promise((resolve) => setTimeout(resolve, 350))
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('{broken')
  })
  it('バックアップに元のキャラクターを読み込めるJSONとして保存する', () => {
    const original = createDefaultCharacter('whisper')
    expect(saveBackup(original)).toBe(true)
    expect(window.localStorage.getItem(BACKUP_KEY)).toBeTruthy()
    expect(parseCharacterFile(window.localStorage.getItem(BACKUP_KEY) ?? '')).toEqual({
      ok: true, character: original,
    })
  })
  it('保存が拒否されたら失敗を返す', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })
    expect(saveCharacter(createDefaultCharacter('cutter'))).toBe(false)
    expect(saveBackup(createDefaultCharacter('cutter'))).toBe(false)
  })
})
