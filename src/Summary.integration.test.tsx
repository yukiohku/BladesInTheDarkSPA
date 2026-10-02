import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { CharacterProvider } from './state/CharacterProvider'
import { createDefaultCharacter } from './constants/defaults'
import { STORAGE_KEY, readStoredCharacter } from './lib/storage'
import { parseCharacterFile, serializeCharacter } from './lib/serialize'
import { characterReducer } from './state/characterReducer'

function renderApp() {
  return render(<CharacterProvider><App /></CharacterProvider>)
}

beforeEach(() => {
  window.localStorage.clear()
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: vi.fn() })
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
  Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView')
})

describe('サマリー画面との往復', () => {
  it('初回はシートを開き、未選択のまま3画面を切り替えられる', async () => {
    const user = userEvent.setup()
    renderApp()
    expect(screen.getByRole('heading', { name: 'WHO ARE YOU?' })).toBeTruthy()
    const modes = screen.getByRole('group', { name: '表示モード' })
    expect(within(modes).getByRole('button', { name: 'シート' }).getAttribute('aria-pressed')).toBe('true')
    await user.click(within(modes).getByRole('button', { name: 'サマリー' }))
    expect(screen.getByRole('main', { name: 'ルールサマリー' })).toBeTruthy()
    expect(within(modes).getByRole('button', { name: 'サマリー' }).getAttribute('aria-pressed')).toBe('true')
    expect(within(modes).getByRole('button', { name: 'シート' }).getAttribute('aria-pressed')).toBe('false')
    expect(screen.queryByRole('navigation', { name: 'シートのセクション' })).toBeNull()
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'instant' })
    await user.click(within(modes).getByRole('button', { name: '編集' }))
    expect(screen.getByRole('combobox', { name: 'プレイブック' })).toBeTruthy()
    await user.click(screen.getByRole('button', { name: '状態' }))
    await user.click(within(modes).getByRole('button', { name: 'サマリー' }))
    await user.click(within(modes).getByRole('button', { name: '編集' }))
    expect(screen.getByRole('button', { name: '状態' }).getAttribute('aria-current')).toBe('page')
    await user.click(within(modes).getByRole('button', { name: 'シート' }))
    expect(screen.getByRole('heading', { name: 'WHO ARE YOU?' })).toBeTruthy()
  })

  it('保存待ちのシート入力を維持し、閲覧操作による更新や追加保存をしない', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.type(screen.getByRole('textbox', { name: 'レベル1の傷 1（効果低下）' }), '打撲')
    await user.click(screen.getByRole('button', { name: 'ストレス 2' }))
    await user.click(screen.getByRole('button', { name: 'サマリー' }))
    act(() => window.dispatchEvent(new Event('pagehide')))
    const saved = readStoredCharacter().character
    expect(saved).toMatchObject({ stress: 2, harm: { level1: ['打撲', ''] }, playbookId: null })
    if (!saved) throw new Error('保存されていません')
    const parsed = parseCharacterFile(serializeCharacter(saved))
    if (!parsed.ok) throw new Error(parsed.error)
    expect(parsed.character).toEqual(saved)
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const writes = vi.spyOn(Storage.prototype, 'setItem')
    await user.click(within(screen.getByRole('navigation', { name: 'サマリーの目次' })).getByRole('button', { name: 'ダウンタイム' }))
    await user.click(screen.getByRole('button', { name: 'シート' }))
    expect(screen.getByRole('textbox', { name: 'レベル1の傷 1（効果低下）' })).toHaveProperty('value', '打撲')
    expect(screen.getByRole('button', { name: 'ストレス 2' }).getAttribute('aria-pressed')).toBe('true')
    await act(async () => { await new Promise((resolve) => window.setTimeout(resolve, 400)) })
    expect(writes).not.toHaveBeenCalled()
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe(raw)
  })

  it('初期配分の未確定の訂正を往復時に破棄し、確定済みの値を維持する', async () => {
    const character = createDefaultCharacter('cutter')
    const confirmed = characterReducer(character, {
      type: 'ratings.confirmInitial', ratings: { ...character.ratings, hunt: 2, study: 2 },
    })
    window.localStorage.setItem(STORAGE_KEY, serializeCharacter(confirmed))
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByRole('button', { name: '編集' }))
    await user.click(screen.getByRole('button', { name: '初期配分を修正' }))
    await user.click(screen.getByRole('button', { name: 'Hunt 1' }))
    expect(screen.getByRole('button', { name: '訂正をやめる' })).toBeTruthy()
    await user.click(screen.getByRole('button', { name: 'サマリー' }))
    await user.click(screen.getByRole('button', { name: '編集' }))
    expect(screen.queryByRole('button', { name: '訂正をやめる' })).toBeNull()
    expect(screen.getByRole('img', { name: 'Hunt 2（初期配分・修正で変更）' })).toBeTruthy()
    act(() => window.dispatchEvent(new Event('pagehide')))
    expect(readStoredCharacter().character?.initialActionRatings).toEqual(confirmed.initialActionRatings)
  })

  it('保存エラーを表示しながら参照でき、読めない保存を上書きしない', async () => {
    window.localStorage.setItem(STORAGE_KEY, '{broken')
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByRole('button', { name: 'サマリー' }))
    expect(screen.getByRole('alert').textContent).toContain('自動保存を停止')
    expect(screen.getByRole('heading', { level: 1, name: 'ルールサマリー' })).toBeTruthy()
    act(() => window.dispatchEvent(new Event('pagehide')))
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('{broken')
  })
})
