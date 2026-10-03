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
    expect(screen.getByText('プレイヤーが技能を選ぶ → GMが判定状況・効果を決める → 技能値に補正を加えた数のd6を振る')).toBeTruthy()
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
    const risky = screen.getByRole('table', { name: POSITION_LABELS.risky })
    expect(within(risky).getByRole('row', { name: /^4–5/ }).textContent).toContain('達成するが')
    expect(screen.queryByRole('table', { name: POSITION_LABELS.controlled })).toBeNull()
    expect(screen.queryByRole('table', { name: POSITION_LABELS.desperate })).toBeNull()
    expect(within(screen.getByRole('table', { name: 'ダイスの読み方' })).getByRole('row', { name: /^0個以下/ }).textContent).toContain('低い方')
    expect(screen.queryByRole('heading', { name: /経験値|成長|XP条件/ })).toBeNull()
    expect(screen.getByText(/経験値の記録と成長はシートの経験値欄を参照/)).toBeTruthy()
    expect(screen.getByRole('link', { name: 'CC BY 3.0 Unported' }).getAttribute('href')).toBe('https://creativecommons.org/licenses/by/3.0/')
  })

  it('状況タブで1つの結果表を切り替え、矢印キー・Home・Endでも選べる', async () => {
    const user = userEvent.setup()
    render(<RulesSummaryView />)
    const tabs = screen.getByRole('tablist', { name: '判定状況別の結果' })
    const controlledTab = within(tabs).getByRole('tab', { name: '優位' })
    const riskyTab = within(tabs).getByRole('tab', { name: 'リスキー' })
    const desperateTab = within(tabs).getByRole('tab', { name: '絶望的' })
    expect(riskyTab.getAttribute('aria-selected')).toBe('true')
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1)
    await user.click(controlledTab)
    const controlled = screen.getByRole('table', { name: POSITION_LABELS.controlled })
    expect(within(controlled).getByRole('row', { name: /^4–5/ }).textContent).toContain('撤退して別の方法')
    expect(within(controlled).getByRole('row', { name: /^1–3/ }).textContent).toContain(POSITION_LABELS.risky)
    expect(screen.queryByRole('table', { name: POSITION_LABELS.risky })).toBeNull()
    await user.keyboard('{ArrowLeft}')
    expect(document.activeElement).toBe(desperateTab)
    expect(screen.getByRole('table', { name: POSITION_LABELS.desperate })).toBeTruthy()
    await user.keyboard('{ArrowRight}{ArrowRight}')
    expect(document.activeElement).toBe(riskyTab)
    expect(screen.getByRole('table', { name: POSITION_LABELS.risky })).toBeTruthy()
    await user.keyboard('{Home}')
    expect(document.activeElement).toBe(controlledTab)
    await user.keyboard('{End}')
    expect(document.activeElement).toBe(desperateTab)
    const panel = screen.getByRole('tabpanel', { name: '絶望的' })
    expect(panel.id).toBe(desperateTab.getAttribute('aria-controls'))
    expect(controlledTab.tabIndex).toBe(-1)
    expect(desperateTab.tabIndex).toBe(0)
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
    const disclosure = screen.getByText('効果と危険の調整', { selector: 'summary' })
    expect(disclosure.closest('details')?.open).toBe(false)
    await user.click(disclosure)
    expect(disclosure.closest('details')?.open).toBe(true)
    expect(screen.getByText(/相手の弱点、人数や大きさ、道具の質/)).toBeTruthy()
    await user.click(disclosure)
    expect(disclosure.closest('details')?.open).toBe(false)
  })
})
