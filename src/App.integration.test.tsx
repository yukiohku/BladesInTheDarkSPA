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
  // 既定表示はシート。編集タブを出すにはモードを切り替える
  await user.click(screen.getByRole('button', { name: '編集' }))
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

    await openTab(user, '属性・動機・欠点')
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

    await openTab(user, '状態と変動記録')

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

    await openTab(user, '状態と変動記録')
    await user.click(screen.getByRole('button', { name: '承受を記録' }))

    await openTab(user, '履歴')
    await user.click(screen.getByRole('button', { name: '取り消す' }))

    expect(screen.getByText('まだ記録がありません。')).toBeTruthy()
  })

  it('トラウマは名前を入力しないと記録されない', async () => {
    const user = userEvent.setup()
    renderApp()

    await openTab(user, '状態と変動記録')
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

describe('公式シートの操作', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  it('シート表示が既定で出る', () => {
    renderApp()
    expect(screen.getByText('BLADES IN THE DARK')).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'CUTTER' })).toBeTruthy()
  })

  it('ストレスのマスを押すと要約に反映される', async () => {
    const user = userEvent.setup()
    renderApp()

    const group = screen.getByRole('group', { name: 'ストレス' })
    await user.click(within(group).getByRole('button', { name: 'ストレス 3' }))

    const summary = screen.getByRole('group', { name: '主要数値' })
    const stress = within(summary).getByText('ストレス').closest('.summary__item')
    expect(stress?.textContent).toContain('3')
  })

  it('血統のチェックボックスを切り替えられる', async () => {
    const user = userEvent.setup()
    renderApp()

    const box = screen.getByRole('button', { name: 'Akoros' })
    expect(box.getAttribute('aria-pressed')).toBe('false')
    await user.click(box)
    expect(box.getAttribute('aria-pressed')).toBe('true')
  })

  it('アクションレートを上下できる', async () => {
    const user = userEvent.setup()
    renderApp()

    const dot = screen.getByRole('button', { name: 'Skirmish 2' })
    await user.click(dot)
    expect(dot.getAttribute('aria-pressed')).toBe('true')
    await user.click(dot)
    expect(dot.getAttribute('aria-pressed')).toBe('false')
  })

  it('血統は複数選択できる', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: 'Akoros' }))
    await user.click(screen.getByRole('button', { name: 'Iruvia' }))
    expect(screen.getByRole('button', { name: 'Akoros' }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('button', { name: 'Iruvia' }).getAttribute('aria-pressed')).toBe('true')
  })

  it('アイテムのチェックボックスを切り替えられる', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: 'A Blade or Two' }))
    expect(screen.getByRole('button', { name: 'A Blade or Two' }).getAttribute('aria-pressed')).toBe('true')
  })

  it('変動記録で入れたトラウマがシートのチェックボックスにも出る', async () => {
    const user = userEvent.setup()
    renderApp()

    // まずシートでトラウマが未選択であることを確認する
    const traumaBox = screen.getByRole('button', { name: '冷酷' })
    expect(traumaBox.getAttribute('aria-pressed')).toBe('false')

    await user.click(traumaBox)
    expect(traumaBox.getAttribute('aria-pressed')).toBe('true')

    // 編集モードの要約にも件数が出る
    const summary = screen.getByRole('group', { name: '主要数値' })
    const trauma = within(summary).getByText('トラウマ').closest('.summary__item')
    expect(trauma?.textContent).toContain('1')
  })

  it('傷の行を押すと要約の傷が変わる', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: '2' }))
    const summary = screen.getByRole('group', { name: '主要数値' })
    const harm = within(summary).getByText('傷').closest('.summary__item')
    expect(harm?.textContent).toContain('重傷')
  })
})
