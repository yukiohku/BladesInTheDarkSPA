import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { CharacterProvider } from '../state/CharacterProvider'
import { createDefaultCharacter } from '../constants/defaults'
import { BACKGROUNDS, HERITAGES } from '../constants/playbooks'
import { STORAGE_KEY } from '../lib/storage'

afterEach(() => {
  cleanup()
  window.localStorage.clear()
})

function identityTitle(label: string) {
  return screen.getByText(label, { selector: '.os-idrow__label' }).closest('.os-idrow')?.getAttribute('title')
}

describe('出自・経歴の説明', () => {
  it('選択・詳細の変更をシートのツールチップに反映し、未選択では説明を外す', async () => {
    window.localStorage.clear()
    const user = userEvent.setup()
    render(<CharacterProvider><App /></CharacterProvider>)
    expect(identityTitle('出自')).toBeNull()
    expect(identityTitle('経歴')).toBeNull()
    await user.click(screen.getByRole('button', { name: '編集' }))
    const heritageSelect = screen.getByRole('combobox', { name: '出自' })
    const backgroundSelect = screen.getByRole('combobox', { name: '経歴' })
    for (const item of HERITAGES) {
      expect(within(heritageSelect).getByRole('option', { name: `${item.name}：${item.summary}` }).getAttribute('title')).toBe(item.description)
    }
    for (const item of BACKGROUNDS) {
      expect(within(backgroundSelect).getByRole('option', { name: item.name }).getAttribute('title')).toBe(item.description)
    }
    await user.selectOptions(heritageSelect, 'akoros')
    await user.selectOptions(backgroundSelect, 'labor')
    expect(heritageSelect.getAttribute('title')).toBe(HERITAGES[0].description)
    expect(backgroundSelect.getAttribute('title')).toBe(BACKGROUNDS[1].description)
    await user.selectOptions(heritageSelect, 'tycheros')
    await user.selectOptions(backgroundSelect, 'underworld')
    expect(heritageSelect.getAttribute('title')).toBe(HERITAGES[5].description)
    expect(backgroundSelect.getAttribute('title')).toBe(BACKGROUNDS[6].description)
    await user.type(screen.getByRole('textbox', { name: '出自の詳細' }), '祖父母が移住した')
    await user.type(screen.getByRole('textbox', { name: '経歴の詳細' }), '元密輸業者')
    await user.click(screen.getByRole('button', { name: 'シート' }))
    expect(identityTitle('出自')).toBe(`${HERITAGES[5].description}\n出自の詳細：祖父母が移住した`)
    expect(identityTitle('経歴')).toBe(`${BACKGROUNDS[6].description}\n経歴の詳細：元密輸業者`)
    expect(screen.queryByRole('tooltip')).toBeNull()
    await user.click(screen.getByRole('button', { name: '編集' }))
    await user.selectOptions(screen.getByRole('combobox', { name: '出自' }), '')
    await user.selectOptions(screen.getByRole('combobox', { name: '経歴' }), '')
    await user.clear(screen.getByRole('textbox', { name: '出自の詳細' }))
    await user.clear(screen.getByRole('textbox', { name: '経歴の詳細' }))
    await user.click(screen.getByRole('button', { name: 'シート' }))
    expect(identityTitle('出自')).toBeNull()
    expect(identityTitle('経歴')).toBeNull()
  })

  it('未知の取り込み値にも記入された詳細を表示し、既知の選択肢の説明を流用しない', () => {
    const character = createDefaultCharacter(null)
    character.identity.heritageId = '遠方の島'
    character.identity.backgroundId = '旅芸人'
    character.identity.heritageDetail = '漁師の一家'
    character.identity.backgroundDetail = '巡業していた'
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(character))
    render(<CharacterProvider><App /></CharacterProvider>)
    expect(screen.getByText('遠方の島')).toBeTruthy()
    expect(screen.getByText('旅芸人')).toBeTruthy()
    expect(identityTitle('出自')).toBe('出自の詳細：漁師の一家')
    expect(identityTitle('経歴')).toBe('経歴の詳細：巡業していた')
  })
})
