import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { CharacterProvider } from './state/CharacterProvider'
import { ACTIONS, PLAYBOOK_LIST } from './constants/playbooks'
import { createDefaultCharacter } from './constants/defaults'
import { PLAYBOOK_LABELS } from './constants/labels'
import { BACKUP_KEY, readStoredCharacter, STORAGE_KEY } from './lib/storage'
import { parseCharacterFile, serializeCharacter } from './lib/serialize'

function renderApp() {
  return render(<CharacterProvider><App /></CharacterProvider>)
}

beforeEach(() => window.localStorage.clear())
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('プレイブック未選択のシート', () => {
  it('Cutterから未選択へ戻し、共通入力と変更前データを保存して再読込できる', async () => {
    const user = userEvent.setup()
    const character = createDefaultCharacter('cutter')
    character.identity.name = '残す名前'
    character.notes = '残すメモ'
    character.equipment.blade = 1
    character.equipment['cutter:hand-weapon'] = 1
    window.localStorage.setItem(STORAGE_KEY, serializeCharacter(character))
    const view = renderApp()
    await user.click(screen.getByRole('button', { name: '編集' }))
    await user.selectOptions(screen.getByRole('combobox', { name: 'プレイブック' }), '')
    expect((screen.getByRole('combobox', { name: 'プレイブック' }) as HTMLSelectElement).value).toBe('')
    expect(screen.queryByRole('link', { name: 'このプレイブックの公式原本' })).toBeNull()
    await user.click(screen.getByRole('button', { name: 'シート' }))
    expect(screen.getByText(PLAYBOOK_LABELS.sheetHint)).toBeTruthy()
    expect(screen.queryByRole('heading', { name: 'CUTTER' })).toBeNull()
    expect(screen.getByText('残す名前')).toBeTruthy()
    expect(screen.getByRole('button', { name: '短刀' }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.queryByRole('button', { name: '良質な片手武器' })).toBeNull()
    expect(screen.getByRole('img', { name: '乱戦（Skirmish）：0' })).toBeTruthy()
    act(() => window.dispatchEvent(new Event('pagehide')))
    expect(readStoredCharacter().character).toMatchObject({
      playbookId: null, identity: { name: '残す名前' }, notes: '残すメモ',
      legacy: [{ title: 'CUTTER 変更前の固有データ', data: { equipment: { 'cutter:hand-weapon': 1 } } }],
    })
    view.unmount()
    renderApp()
    expect(screen.getByText(PLAYBOOK_LABELS.sheetHint)).toBeTruthy()
    await user.click(screen.getByRole('button', { name: '編集' }))
    await user.click(screen.getByRole('button', { name: 'データ' }))
    expect(screen.getByText('CUTTER 変更前の固有データ')).toBeTruthy()
    await user.click(screen.getByRole('button', { name: '初期設定' }))
    await user.selectOptions(screen.getByRole('combobox', { name: 'プレイブック' }), 'cutter')
    expect(screen.getByRole('img', { name: 'Skirmish 2（プレイブック固定・変更不可）' })).toBeTruthy()
  })
  it('初回もシートを表示し、未選択のまま共通入力を保存・再読込できる', async () => {
    const user = userEvent.setup()
    const view = renderApp()
    expect(screen.getByRole('button', { name: 'シート' }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('img', { name: 'Blades in the Dark' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'WHO ARE YOU?' })).toBeTruthy()
    expect(screen.getByText(PLAYBOOK_LABELS.sheetHint)).toBeTruthy()
    expect(screen.queryByRole('heading', { name: 'CUTTER' })).toBeNull()
    expect(screen.getByRole('table', { name: '傷の記録' })).toBeTruthy()
    expect(screen.getByRole('region', { name: '技能・抵抗' })).toBeTruthy()
    expect(screen.getByRole('region', { name: '経験値' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: '良質な片手武器' })).toBeNull()
    expect(screen.queryByText(/Marlane/)).toBeNull()
    for (const action of ACTIONS) {
      expect(screen.getByRole('img', { name: `${action.ja}（${action.name}）：0` })).toBeTruthy()
    }
    await user.type(screen.getByRole('textbox', { name: '信念・動機・自由メモ' }), 'まだ見ぬ仕事')
    await user.click(screen.getByRole('button', { name: '短刀' }))
    act(() => window.dispatchEvent(new Event('pagehide')))
    expect(readStoredCharacter().character).toMatchObject({
      playbookId: null, notes: 'まだ見ぬ仕事', equipment: { blade: 1 }, initialActionRatings: null,
    })
    view.unmount()
    renderApp()
    expect(screen.getByText(PLAYBOOK_LABELS.sheetHint)).toBeTruthy()
    expect((screen.getByRole('textbox', { name: '信念・動機・自由メモ' }) as HTMLTextAreaElement).value).toBe('まだ見ぬ仕事')
    expect(screen.getByRole('button', { name: '短刀' }).getAttribute('aria-pressed')).toBe('true')
  })

  it.each(PLAYBOOK_LIST)('初期設定で$titleを選ぶと固有情報が入り、先に入力した情報を保つ', async (book) => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByRole('button', { name: '編集' }))
    expect((screen.getByRole('combobox', { name: 'プレイブック' }) as HTMLSelectElement).value).toBe('')
    expect(screen.queryByRole('link', { name: 'このプレイブックの公式原本' })).toBeNull()
    expect(screen.queryByRole('button', { name: '初期配分を確定' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Hunt 1' })).toBeNull()
    await user.type(screen.getByRole('textbox', { name: '名前' }), '名もなき悪党')
    await user.type(screen.getByRole('textbox', { name: '所属クルー名' }), '夜の仲間')
    await user.click(screen.getByRole('button', { name: '特殊能力' }))
    expect(screen.queryByRole('button', { name: /^取得：/ })).toBeNull()
    expect(screen.getByText(PLAYBOOK_LABELS.selectFirst)).toBeTruthy()
    await user.click(screen.getByRole('button', { name: '初期設定' }))
    await user.selectOptions(screen.getByRole('combobox', { name: 'プレイブック' }), book.id)
    expect(screen.queryByRole('link', { name: 'このプレイブックの公式原本' })).toBeNull()
    expect(screen.getByRole('button', { name: '初期配分を確定' }).hasAttribute('disabled')).toBe(true)
    expect(screen.getAllByRole('img', { name: /プレイブック固定・変更不可/ })).toHaveLength(3)
    await user.click(screen.getByRole('button', { name: '特殊能力' }))
    expect(screen.getByRole('button', { name: `取得：${book.abilities[0].name}` })).toBeTruthy()
    await user.click(screen.getByRole('button', { name: 'シート' }))
    expect(screen.getByRole('heading', { name: book.title })).toBeTruthy()
    expect(screen.getByText('名もなき悪党')).toBeTruthy()
    expect(screen.getByText('夜の仲間')).toBeTruthy()
    expect(screen.getByText(book.friends[0].name)).toBeTruthy()
    expect(screen.getByRole('button', { name: book.items[0].ja ?? book.items[0].name })).toBeTruthy()
    expect(screen.getByText(book.xpTrigger)).toBeTruthy()
    for (const action of ACTIONS) {
      expect(screen.getByRole('img', { name: `${action.ja}（${action.name}）：${book.initialRatings[action.id] ?? 0}` })).toBeTruthy()
    }
    act(() => window.dispatchEvent(new Event('pagehide')))
    expect(readStoredCharacter().character?.playbookId).toBe(book.id)
    expect(readStoredCharacter().character?.legacy).toHaveLength(0)
  })

  it('未選択のJSONを取り込んで共通入力を再開できる', async () => {
    const user = userEvent.setup()
    const character = createDefaultCharacter(null)
    character.identity.name = '作成途中の人物'
    character.notes = '相談中の設定'
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    renderApp()
    await user.click(screen.getByRole('button', { name: '編集' }))
    await user.click(screen.getByRole('button', { name: 'データ' }))
    await user.upload(screen.getByLabelText('キャラクターJSONファイル'), new File([serializeCharacter(character)], 'unselected.json', { type: 'application/json' }))
    expect(screen.getByRole('status').textContent).toContain('JSONを読み込みました。')
    await user.click(screen.getByRole('button', { name: 'シート' }))
    expect(screen.getByText('作成途中の人物')).toBeTruthy()
    expect(screen.getByText(PLAYBOOK_LABELS.sheetHint)).toBeTruthy()
    expect((screen.getByRole('textbox', { name: '信念・動機・自由メモ' }) as HTMLTextAreaElement).value).toBe('相談中の設定')
  })

  it('新規作成はプレイブックを選ばず未選択に戻し、既存人物をバックアップに保管する', async () => {
    const user = userEvent.setup()
    const character = createDefaultCharacter('hound')
    character.identity.name = '保存済みの狩人'
    window.localStorage.setItem(STORAGE_KEY, serializeCharacter(character))
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    renderApp()
    expect(screen.getByRole('heading', { name: 'HOUND' })).toBeTruthy()
    await user.click(screen.getByRole('button', { name: '編集' }))
    await user.click(screen.getByRole('button', { name: 'データ' }))
    expect(screen.queryByRole('combobox', { name: '新しいキャラクターのプレイブック' })).toBeNull()
    await user.click(screen.getByRole('button', { name: '新しいキャラクターを作成' }))
    expect(parseCharacterFile(window.localStorage.getItem(BACKUP_KEY) ?? '')).toEqual({
      ok: true, character,
    })
    expect(screen.queryByRole('button', { name: '取り込み前のシートに戻す' })).toBeNull()
    act(() => window.dispatchEvent(new Event('pagehide')))
    expect(readStoredCharacter().character).toMatchObject({
      playbookId: null, identity: { name: '' }, initialActionRatings: null,
      abilities: [], friends: [], legacy: [],
    })
    expect(Object.values(readStoredCharacter().character?.ratings ?? {})).toEqual(ACTIONS.map(() => 0))
    await user.click(screen.getByRole('button', { name: 'シート' }))
    expect(screen.getByText(PLAYBOOK_LABELS.sheetHint)).toBeTruthy()
  })
})
