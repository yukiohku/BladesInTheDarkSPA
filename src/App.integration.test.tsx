import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { CharacterProvider } from './state/CharacterProvider'

function renderApp() {
  return render(
    <CharacterProvider>
      <App />
    </CharacterProvider>,
  )
}

async function openTab(user: ReturnType<typeof userEvent.setup>, name: string) {
  await user.click(screen.getByRole('button', { name }))
}

describe('シートの操作', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  it('名前を入力するとヘッダーに反映される', async () => {
    const user = userEvent.setup()
    renderApp()

    const nameInput = screen.getByLabelText('名前')
    await user.type(nameInput, 'カッター')

    expect(screen.getByText('カッター')).toBeTruthy()
  })

  it('属性はピップで増減する', async () => {
    const user = userEvent.setup()
    renderApp()

    await openTab(user, '属性')
    const group = screen.getByRole('group', { name: '喧嘩' })

    const pips = within(group).getAllByRole('button')
    await user.click(pips[2])
    expect(pips[2].getAttribute('aria-pressed')).toBe('true')

    // 同じピップをもう一度押すと1つ減る
    await user.click(pips[2])
    expect(pips[2].getAttribute('aria-pressed')).toBe('false')
  })

  it('変動を記録すると値と履歴の両方が更新される', async () => {
    const user = userEvent.setup()
    renderApp()

    await openTab(user, '状態')

    await user.selectOptions(screen.getByLabelText('理由'), '押して賭ける（耐える）')

    // 数量は入力欄が常に範囲内に丸められるため、+ ボタンで増やす
    const plus = screen.getByRole('button', { name: '数量を1増やす' })
    await user.click(plus)
    await user.click(plus)

    await user.click(screen.getByRole('button', { name: '承受を記録' }))

    // ヘッダーの要約に反映される
    const summary = screen.getByRole('group', { name: '主要数値' })
    const stress = within(summary).getByText('ストレス').closest('.summary__item')
    expect(stress?.textContent).toContain('3')

    // 履歴に出る
    await openTab(user, '履歴')
    expect(screen.getByText('ストレス承受（+3）')).toBeTruthy()
  })

  it('直近の履歴は取り消せる', async () => {
    const user = userEvent.setup()
    renderApp()

    await openTab(user, '状態')
    await user.click(screen.getByRole('button', { name: '承受を記録' }))

    await openTab(user, '履歴')
    await user.click(screen.getByRole('button', { name: '取り消す' }))

    expect(screen.getByText('まだ記録がありません。')).toBeTruthy()
  })

  it('トラウマは名前を入力しないと記録されない', async () => {
    const user = userEvent.setup()
    renderApp()

    await openTab(user, '状態')
    await user.click(screen.getByRole('button', { name: /トラウマ/ }))

    // 内容が空ならボタンが無効
    const submit = screen.getByRole('button', { name: '受入を記録' })
    expect(submit.hasAttribute('disabled')).toBe(true)

    await user.type(screen.getByLabelText('トラウマの内容'), '聾')
    expect(submit.hasAttribute('disabled')).toBe(false)

    await user.click(submit)
    const summary = screen.getByRole('group', { name: '主要数値' })
    const trauma = within(summary).getByText('トラウマ').closest('.summary__item')
    expect(trauma?.textContent).toContain('1')
  })
})
