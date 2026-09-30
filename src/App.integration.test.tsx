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

/** 上の細いバーの数値を読み取るため、編集モードに切り替える */
async function readStatus(user: ReturnType<typeof userEvent.setup>): Promise<string> {
  await user.click(screen.getByRole('button', { name: '編集' }))
  return screen.getByRole('group', { name: '主要数値' }).textContent ?? ''
}

describe('シートの編集タブ', () => {
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

    // 上のバーの数値に反映される
    expect(await readStatus(user)).toContain('3/9')

    // 履歴に出る
    await user.click(screen.getByRole('button', { name: '履歴' }))
    expect(screen.getByText('ストレス承受（+3）')).toBeTruthy()
  })

  it('直近の履歴は取り消せる', async () => {
    const user = userEvent.setup()
    renderApp()

    await openTab(user, '状態と変動記録')
    await user.click(screen.getByRole('button', { name: '承受を記録' }))

    await user.click(screen.getByRole('button', { name: '履歴' }))
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
    expect(await readStatus(user)).toContain('トラウマ1')
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

  it('モードを切り替えると編集タブが出る', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: '編集' }))
    expect(screen.getByRole('button', { name: '基本情報' })).toBeTruthy()
  })

  it('ストレスのマスを押すと上のバーに反映される', async () => {
    const user = userEvent.setup()
    renderApp()

    const group = screen.getByRole('group', { name: 'ストレス' })
    const box = within(group).getByRole('button', { name: 'ストレス 3' })
    await user.click(box)

    expect(box.getAttribute('aria-pressed')).toBe('true')
    expect(await readStatus(user)).toContain('ストレス3/9')
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

  it('エッジは公式で無題の行に表示される', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: 'エッジ 2' }))
    expect(await readStatus(user)).toContain('エッジ2')
  })

  it('シートで選んだトラウマが上のバーの件数に出る', async () => {
    const user = userEvent.setup()
    renderApp()

    // まずシートでトラウマが未選択であることを確認する
    const traumaBox = screen.getByRole('button', { name: '冷酷' })
    expect(traumaBox.getAttribute('aria-pressed')).toBe('false')

    await user.click(traumaBox)
    expect(traumaBox.getAttribute('aria-pressed')).toBe('true')
    expect(await readStatus(user)).toContain('トラウマ1')
  })

  it('傷の行を押すと上のバーの表示が変わる', async () => {
    const user = userEvent.setup()
    renderApp()

    const level = screen.getByRole('button', { name: '2' })
    await user.click(level)
    expect(level.getAttribute('aria-pressed')).toBe('true')
    expect(await readStatus(user)).toContain('傷重傷')
  })
})
