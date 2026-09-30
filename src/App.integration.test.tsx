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
  // 既定表示はプレイシート。編集タブを出すにはモードを切り替える
  await user.click(screen.getByRole('button', { name: '編集' }))
  await user.click(screen.getByRole('button', { name }))
}

/** 上の細いバーの数値を読み取るため、編集モードに切り替える */
async function readStatus(user: ReturnType<typeof userEvent.setup>): Promise<string> {
  await user.click(screen.getByRole('button', { name: '編集' }))
  return screen.getByRole('group', { name: '主要数値' }).textContent ?? ''
}

describe('変動記録', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  it('名前を入力するとヘッダーに反映される', async () => {
    const user = userEvent.setup()
    renderApp()

    // 名前は初期設定タブで入力する（シートは表示のみ）
    await openTab(user, '初期設定')
    await user.type(screen.getByLabelText('名前'), 'ヴィクセン')
    expect(screen.getByText('ヴィクセン')).toBeTruthy()
  })

  it('属性は初期設定タブで増減する', async () => {
    const user = userEvent.setup()
    renderApp()

    await openTab(user, '初期設定')
    const group = screen.getByRole('group', { name: '喧嘩' })

    const pips = within(group).getAllByRole('button')
    await user.click(pips[2])
    expect(pips[2].getAttribute('aria-pressed')).toBe('true')

    // 同じピップをもう一度押すと1つ減る
    await user.click(pips[2])
    expect(pips[2].getAttribute('aria-pressed')).toBe('false')
  })

  it('記録すると上のバーと履歴の両方が更新される', async () => {
    const user = userEvent.setup()
    renderApp()

    await openTab(user, '変動記録')
    await user.selectOptions(screen.getByLabelText('理由'), '押して賭ける（耐える）')

    // 数量は入力欄が常に範囲内に丸められるため、+ ボタンで増やす
    const plus = screen.getByRole('button', { name: '数量を1増やす' })
    await user.click(plus)
    await user.click(plus)

    await user.click(screen.getByRole('button', { name: '承受を記録' }))
    expect(await readStatus(user)).toContain('3/9')

    await user.click(screen.getByRole('button', { name: '履歴' }))
    expect(screen.getByText('ストレス承受（+3）')).toBeTruthy()
  })

  it('直近の履歴は取り消せる', async () => {
    const user = userEvent.setup()
    renderApp()

    await openTab(user, '変動記録')
    await user.click(screen.getByRole('button', { name: '承受を記録' }))

    await user.click(screen.getByRole('button', { name: '履歴' }))
    await user.click(screen.getByRole('button', { name: '取り消す' }))

    expect(screen.getByText('まだ記録がありません。')).toBeTruthy()
  })

  it('トラウマは名前を入力しないと記録されない', async () => {
    const user = userEvent.setup()
    renderApp()

    await openTab(user, '変動記録')
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

describe('プレイシートの操作', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  it('プレイシートが既定で出る', () => {
    renderApp()
    expect(screen.getByRole('group', { name: 'ストレス' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Akoros' })).toBeNull()
  })

  it('モードを切り替えると編集タブが出る', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: '編集' }))
    expect(screen.getByRole('button', { name: '初期設定' })).toBeTruthy()
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

  it('アクションレートを上下できる', async () => {
    const user = userEvent.setup()
    renderApp()

    const dot = screen.getByRole('button', { name: 'Skirmish 2' })
    await user.click(dot)
    expect(dot.getAttribute('aria-pressed')).toBe('true')
    await user.click(dot)
    expect(dot.getAttribute('aria-pressed')).toBe('false')
  })

  it('アイテムは日英併記で切り替えられる', async () => {
    const user = userEvent.setup()
    renderApp()

    // 日正式名のままでは照合できない
    const box = screen.getByRole('button', { name: '短刀' })
    await user.click(box)
    expect(box.getAttribute('aria-pressed')).toBe('true')

    // 英語も併記されている
    expect(screen.getByText('A Blade or Two')).toBeTruthy()
  })

  it('エッジは右のコイン列で変更できる', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: 'エッジ 2' }))
    expect(await readStatus(user)).toContain('エッジ2')
  })

  it('シートで選んだトラウマが上のバーの件数に出る', async () => {
    const user = userEvent.setup()
    renderApp()

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

  it('進行の栞を進められる', async () => {
    const user = userEvent.setup()
    renderApp()

    const mark = screen.getByRole('button', { name: 'RESOLVE 2' })
    await user.click(mark)
    expect(mark.getAttribute('aria-pressed')).toBe('true')
  })
})

describe('初期設定タブ', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  it('血統と経歴と悪癖を選べる', async () => {
    const user = userEvent.setup()
    renderApp()
    await openTab(user, '初期設定')

    const akoros = screen.getByRole('checkbox', { name: 'Akoros' })
    await user.click(akoros)
    expect((akoros as HTMLInputElement).checked).toBe(true)

    const law = screen.getByRole('checkbox', { name: '法律' })
    await user.click(law)
    expect((law as HTMLInputElement).checked).toBe(true)

    const gamble = screen.getByRole('checkbox', { name: '賭' })
    await user.click(gamble)
    expect((gamble as HTMLInputElement).checked).toBe(true)
  })

  it('初期設定の値はシートには出ない', async () => {
    const user = userEvent.setup()
    renderApp()
    await openTab(user, '初期設定')
    await user.click(screen.getByRole('checkbox', { name: 'Akoros' }))

    await user.click(screen.getByRole('button', { name: 'シート' }))
    expect(screen.queryByRole('button', { name: 'Akoros' })).toBeNull()
  })

  it('特殊能力を選んで名前がシートに出る', async () => {
    const user = userEvent.setup()
    renderApp()

    await openTab(user, '特殊能力')
    await user.click(screen.getByRole('radio', { name: /Mule/ }))

    await user.click(screen.getByRole('button', { name: 'シート' }))
    expect(screen.getByText('Mule')).toBeTruthy()
  })
})
