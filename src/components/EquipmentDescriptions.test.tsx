import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { CharacterProvider } from '../state/CharacterProvider'
import { createDefaultCharacter } from '../constants/defaults'
import { GENERAL_ITEMS, PLAYBOOK_LIST } from '../constants/playbooks'
import { EQUIPMENT_DESCRIPTIONS } from '../constants/equipmentDescriptions'
import { STORAGE_KEY } from '../lib/storage'
import { EquipmentPanel } from './SheetPanels'

afterEach(() => {
  cleanup()
  window.localStorage.clear()
})

describe('装備の説明', () => {
  it.each(PLAYBOOK_LIST)('$titleの共有装備欄で全固有装備・共通装備を説明し、宣言操作を保つ', async (book) => {
    const user = userEvent.setup()
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(createDefaultCharacter(book.id)))
    render(<CharacterProvider><EquipmentPanel /></CharacterProvider>)
    function checkDescriptions() {
      for (const item of [...book.items, ...GENERAL_ITEMS]) {
        const name = screen.getByText(item.ja ?? item.name, { selector: '.equipment-name' })
        const title = name.getAttribute('title')
        expect(EQUIPMENT_DESCRIPTIONS[item.id]?.trim()).toBeTruthy()
        expect(title).toContain(EQUIPMENT_DESCRIPTIONS[item.id])
        if (item.name.startsWith('Fine ')) expect(title).toContain('品質が1段階高い')
        expect(screen.getByRole('button', { name: `${item.ja ?? item.name}${item.quantity > 1 ? ' 1' : ''}` })).toBeTruthy()
      }
    }
    checkDescriptions()
    await user.click(screen.getByRole('button', { name: '短刀' }))
    expect(screen.getByRole('button', { name: '短刀' }).getAttribute('aria-pressed')).toBe('true')
    checkDescriptions()
    expect(screen.getByRole('button', { name: '短刀' }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.queryByRole('tooltip')).toBeNull()
  })

  it('自由記入装備の説明を入力・訂正するとシートのツールチップも更新する', async () => {
    window.localStorage.clear()
    const user = userEvent.setup()
    render(<CharacterProvider><App /></CharacterProvider>)
    await user.click(screen.getByRole('button', { name: '編集' }))
    await user.click(within(screen.getByRole('navigation', { name: 'シートのセクション' })).getByRole('button', { name: '装備' }))
    await user.click(screen.getByRole('button', { name: '装備を追加' }))
    await user.type(screen.getByRole('textbox', { name: '装備名' }), '古い鍵')
    await user.type(screen.getByRole('textbox', { name: '装備の説明' }), '祖母の家の鍵\n青い紐付き')
    expect(screen.getByText('古い鍵', { selector: '.equipment-name' }).getAttribute('title')).toBe('祖母の家の鍵\n青い紐付き')
    await user.click(screen.getByRole('button', { name: 'シート' }))
    expect(screen.getByText('古い鍵', { selector: '.equipment-name' }).getAttribute('title')).toBe('祖母の家の鍵\n青い紐付き')
    await user.click(screen.getByRole('button', { name: '古い鍵' }))
    await user.click(screen.getByRole('button', { name: '編集' }))
    expect(screen.getByRole('button', { name: '古い鍵' }).getAttribute('aria-pressed')).toBe('true')
    await user.clear(screen.getByRole('textbox', { name: '装備の説明' }))
    await user.click(screen.getByRole('button', { name: 'シート' }))
    expect(screen.getByText('古い鍵', { selector: '.equipment-name' }).getAttribute('title')).toBeNull()
  })
})
