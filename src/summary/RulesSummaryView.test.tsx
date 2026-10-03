import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RulesSummaryView } from './RulesSummaryView'
import { POSITION_LABELS } from '../constants/labels'

beforeEach(() => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: vi.fn() })
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView')
})

describe('ルールサマリー', () => {
  it('5章の早見表を表示し、章末の出典一覧や先頭へ戻るボタンを表示しない', () => {
    render(<RulesSummaryView />)
    expect(screen.getByRole('heading', { level: 1, name: 'ルールサマリー' })).toBeTruthy()
    expect(screen.queryByText(/判定の手順と、仕事中/)).toBeNull()
    expect(screen.queryByText(/目的と行動を伝え/)).toBeNull()
    expect(screen.queryByRole('heading', { name: '判定が必要なとき' })).toBeNull()
    expect(screen.queryByText('シートへの記録')).toBeNull()
    expect(screen.getByText('技能選択（PL）→ 状況・効果（GM）→ 技能値d6＋補正')).toBeTruthy()
    expect(screen.queryByRole('heading', { name: 'アクション判定の流れ' })).toBeNull()
    const contents = screen.getByRole('navigation', { name: 'サマリーの目次' })
    expect(within(contents).getAllByRole('button')).toHaveLength(5)
    for (const name of ['判定', '判定を有利にする方法と協力', '悪影響への対処', '仕事の準備と進行', 'ダウンタイム']) {
      const chapter = screen.getByRole('region', { name })
      expect(within(chapter).getAllByRole('table').length).toBeGreaterThan(0)
      expect(within(chapter).queryByRole('link')).toBeNull()
    }
    expect(screen.queryByText('この章の原典')).toBeNull()
    expect(screen.queryByRole('button', { name: 'サマリーの先頭へ' })).toBeNull()
    const controlled = screen.getByRole('table', { name: POSITION_LABELS.controlled })
    expect(within(controlled).getByRole('row', { name: /^4–5/ }).textContent).toContain('撤退して別の方法')
    expect(within(controlled).getByRole('row', { name: /^1–3/ }).textContent).toContain(POSITION_LABELS.risky)
    expect(within(screen.getByRole('table', { name: 'ダイスの読み方' })).getByRole('row', { name: /^0個以下/ }).textContent).toContain('低い方')
    expect(screen.queryByRole('heading', { name: /経験値|成長|XP条件/ })).toBeNull()
    expect(screen.getByText(/経験値の記録と成長はシートの経験値欄を参照/)).toBeTruthy()
    expect(screen.getByRole('link', { name: 'CC BY 3.0 Unported' }).getAttribute('href')).toBe('https://creativecommons.org/licenses/by/3.0/')
  })

  it('目次をキーボードで選ぶと見出しに移動する', async () => {
    const user = userEvent.setup()
    render(<RulesSummaryView />)
    const contents = screen.getByRole('navigation', { name: 'サマリーの目次' })
    within(contents).getByRole('button', { name: '悪影響への対処' }).focus()
    await user.keyboard('{Enter}')
    const heading = screen.getByRole('heading', { level: 2, name: '悪影響への対処' })
    expect(document.activeElement).toBe(heading)
    expect(heading.scrollIntoView).toHaveBeenCalledWith({ block: 'start' })
  })

  it('費用と併用条件は常時表示し、補足だけを開閉できる', async () => {
    const user = userEvent.setup()
    render(<RulesSummaryView />)
    expect(screen.getByText(/追い込みで＋1dを得ることと取引で＋1dを得ることは併用できません/).closest('details')).toBeNull()
    const disclosure = screen.getByText('効果の評価と危険との交換', { selector: 'summary' })
    expect(disclosure.closest('details')?.open).toBe(false)
    await user.click(disclosure)
    expect(disclosure.closest('details')?.open).toBe(true)
    expect(screen.getByText(/GMは有効性/)).toBeTruthy()
    await user.click(disclosure)
    expect(disclosure.closest('details')?.open).toBe(false)
  })
})
