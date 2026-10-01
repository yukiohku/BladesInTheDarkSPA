import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { CharacterProvider } from './state/CharacterProvider'
import { createDefaultCharacter } from './constants/defaults'
import { PLAYBOOK_LIST } from './constants/playbooks'
import { STORAGE_KEY } from './lib/storage'
function renderApp() {
  return render(
    <CharacterProvider>
      <App />
    </CharacterProvider>,
  )
}
async function tab(user: ReturnType<typeof userEvent.setup>, name: string) {
  if (!screen.queryByRole('button', { name: '初期設定' }))
    await user.click(screen.getByRole('button', { name: '編集' }))
  await user.click(screen.getByRole('button', { name }))
}
async function chooseBook(user: ReturnType<typeof userEvent.setup>, book: string) {
  await tab(user, '初期設定')
  await user.selectOptions(screen.getByLabelText('プレイブック'), book)
  if (book !== 'cutter') await user.click(screen.getByRole('button', { name: '変更を確定' }))
}
beforeEach(() => {
  window.localStorage.clear()
  vi.spyOn(window, 'confirm').mockReturnValue(true)
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})
describe('基本7種の操作', () => {
  it.each([false, true])(
    '作成完了=%sでもシートのアクションは表示のみで、編集の変更とXP操作を反映する',
    async (creationComplete) => {
      const user = userEvent.setup()
      const character = createDefaultCharacter()
      character.creationComplete = creationComplete
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(character))
      renderApp()

      const rating = screen.getByRole('img', { name: '狩り（Hunt）：0' })
      expect(screen.queryByRole('button', { name: /^Hunt / })).toBeNull()
      expect(screen.queryByRole('button', { name: /^Skirmish / })).toBeNull()
      await user.click(rating)
      await user.keyboard('{Enter} ')
      expect(screen.getByRole('img', { name: '狩り（Hunt）：0' })).toBeTruthy()

      await user.click(screen.getByRole('button', { name: 'INSIGHT 2' }))
      await tab(user, '初期設定')
      await user.click(screen.getByRole('button', { name: 'Hunt 1' }))
      await user.tab()
      expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Hunt 2' }))
      await user.keyboard('{Enter}')
      await user.click(screen.getByRole('button', { name: 'シート' }))
      expect(screen.getByRole('img', { name: '狩り（Hunt）：2' })).toBeTruthy()
      expect(screen.getByRole('button', { name: 'INSIGHT 2' }).getAttribute('aria-pressed')).toBe('true')

      await tab(user, '初期設定')
      await user.click(screen.getByRole('button', { name: 'Hunt 2' }))
      await user.click(screen.getByRole('button', { name: 'シート' }))
      expect(screen.getByRole('img', { name: '狩り（Hunt）：1' })).toBeTruthy()
    },
  )
  it.each(PLAYBOOK_LIST)('$titleを選んで固有能力を取得しシートに表示する', async (book) => {
    const user = userEvent.setup()
    renderApp()
    await chooseBook(user, book.id)
    await tab(user, '特殊能力')
    await user.click(screen.getByRole('button', { name: `取得：${book.abilities[0].name}` }))
    await user.click(screen.getByRole('button', { name: 'シート' }))
    expect(screen.getByRole('heading', { name: book.title })).toBeTruthy()
    expect(screen.getByText(book.abilities[0].name)).toBeTruthy()
    expect(screen.getByText(book.xpTrigger)).toBeTruthy()
    expect(screen.getByRole('button', { name: book.items[0].ja })).toBeTruthy()
  })
  it('プレイブック変更をキャンセルすると既存の状態を保つ', async () => {
    const user = userEvent.setup()
    renderApp()
    await tab(user, '初期設定')
    await user.type(screen.getByLabelText('名前'), '人物')
    await user.selectOptions(screen.getByLabelText('プレイブック'), 'hound')
    expect(screen.getByRole('region', { name: 'プレイブック変更の確認' }).textContent).toContain(
      '知人5件',
    )
    await user.click(screen.getByRole('button', { name: 'キャンセル' }))
    expect((screen.getByLabelText('プレイブック') as HTMLSelectElement).value).toBe('cutter')
    expect((screen.getByLabelText('名前') as HTMLInputElement).value).toBe('人物')
  })
  it('シートの知人チェックで関係を選び、編集画面にも反映する', async () => {
    const user = userEvent.setup()
    renderApp()
    const [first, second] = PLAYBOOK_LIST[0].friends
    const firstFriend = screen.getByRole('button', { name: `${first.name}：親しい人物` })
    await user.click(firstFriend)
    await user.click(screen.getByRole('button', { name: `${second.name}：親しい人物` }))
    expect(firstFriend.getAttribute('aria-pressed')).toBe('false')
    await user.click(screen.getByRole('button', { name: `${first.name}：ライバル` }))
    await tab(user, '初期設定')
    expect((screen.getByLabelText(`${first.name}との関係`) as HTMLSelectElement).value).toBe(
      'rival',
    )
    expect((screen.getByLabelText(`${second.name}との関係`) as HTMLSelectElement).value).toBe(
      'friend',
    )
  })
  it('追加4点と能力1つで作成を完了する', async () => {
    const user = userEvent.setup()
    renderApp()
    await tab(user, '初期設定')
    expect(
      screen.getByRole('button', { name: 'キャラクター作成を完了' }).hasAttribute('disabled'),
    ).toBe(true)
    await user.click(screen.getByRole('button', { name: 'Hunt 2' }))
    await user.click(screen.getByRole('button', { name: 'Study 2' }))
    expect(screen.getByText(/追加4点の残り 0/)).toBeTruthy()
    await tab(user, '特殊能力')
    await user.click(screen.getByRole('button', { name: '取得：Mule' }))
    await tab(user, '初期設定')
    await user.click(screen.getByRole('button', { name: 'キャラクター作成を完了' }))
    expect(screen.getByRole('button', { name: 'Skirmish 4' })).toBeTruthy()
    expect(screen.getByText(/作成済み/)).toBeTruthy()
  })
  it('複数能力・Veteran・上限補正を表示する', async () => {
    const user = userEvent.setup()
    renderApp()
    await tab(user, '特殊能力')
    await user.click(screen.getByRole('button', { name: '取得：Mule' }))
    await user.selectOptions(screen.getByLabelText('能力の取得元'), 'hound')
    await user.click(screen.getByRole('button', { name: '取得：Survivor' }))
    await user.click(screen.getByRole('button', { name: 'シート' }))
    expect(screen.getByText('Mule')).toBeTruthy()
    expect(screen.getByText('Survivor')).toBeTruthy()
    expect(screen.getByText('Veteran')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'ストレス 10' })).toBeTruthy()
    expect(screen.getByRole('option', { name: '重 8' })).toBeTruthy()
  })
  it('Leechの薬品枠とLoad超過を扱う', async () => {
    const user = userEvent.setup()
    renderApp()
    await chooseBook(user, 'leech')
    await user.click(screen.getByRole('button', { name: 'シート' }))
    await user.click(screen.getByRole('button', { name: '弾帯1' }))
    await user.selectOptions(screen.getByLabelText('弾帯1 使用枠 3'), 'Grenade')
    expect((screen.getByLabelText('弾帯1 使用枠 1') as HTMLSelectElement).value).toBe('')
    expect((screen.getByLabelText('弾帯1 使用枠 3') as HTMLSelectElement).value).toBe('Grenade')
    await user.selectOptions(screen.getByLabelText('仕事のLoad'), 'light')
    await user.click(screen.getByRole('button', { name: '良質な破壊道具' }))
    await user.click(screen.getByRole('button', { name: '仕掛け道具 2' }))
    expect(screen.getByText(/使用Load 5 \/ 3/)).toBeTruthy()
  })
  it('個別の傷と治療4分割、XP8と6、資産の上限を表示する', async () => {
    const user = userEvent.setup()
    renderApp()
    expect(
      within(screen.getByRole('group', { name: 'PLAYBOOK' })).getAllByRole('button'),
    ).toHaveLength(8)
    expect(
      within(screen.getByRole('group', { name: 'INSIGHT' })).getAllByRole('button'),
    ).toHaveLength(6)
    expect(screen.queryByRole('button', { name: 'COIN 5' })).toBeNull()
    expect(screen.getByRole('button', { name: 'STASH 40' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: '治療クロック 5' })).toBeNull()
    await user.type(screen.getByLabelText('レベル1の傷 1（効果低下）'), '打撲')
    await user.click(screen.getByRole('button', { name: 'レベル1の傷 1（効果低下）を記録' }))
    await user.type(screen.getByLabelText('レベル1の傷 2（効果低下）'), '疲労')
    await user.click(screen.getByRole('button', { name: 'レベル1の傷 2（効果低下）を記録' }))
    await tab(user, '履歴')
    await user.click(screen.getByRole('button', { name: '取り消す' }))
    await user.click(screen.getByRole('button', { name: 'シート' }))
    expect((screen.getByLabelText('レベル1の傷 1（効果低下）') as HTMLInputElement).value).toBe(
      '打撲',
    )
    expect((screen.getByLabelText('レベル1の傷 2（効果低下）') as HTMLInputElement).value).toBe('')
  })
  it('変動フォームの理由と取消が状態に反映される', async () => {
    const user = userEvent.setup()
    renderApp()
    await tab(user, '変動記録')
    await user.type(screen.getByLabelText('理由'), '抵抗した')
    await user.click(screen.getByRole('button', { name: '数量を1増やす' }))
    await user.click(screen.getByRole('button', { name: '変動を記録' }))
    await user.click(screen.getByRole('button', { name: 'シート' }))
    expect(screen.getByRole('button', { name: 'ストレス 2' }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('button', { name: 'ストレス 3' }).getAttribute('aria-pressed')).toBe('false')
    await tab(user, '履歴')
    expect(screen.getByText('抵抗した')).toBeTruthy()
    await user.click(screen.getByRole('button', { name: '取り消す' }))
    await user.click(screen.getByRole('button', { name: 'シート' }))
    expect(screen.getByRole('button', { name: 'ストレス 1' }).getAttribute('aria-pressed')).toBe('false')
  })
  it('LurkのExpertiseの対象とWhisperの儀式メモを入力する', async () => {
    const user = userEvent.setup()
    renderApp()
    await chooseBook(user, 'lurk')
    await tab(user, '特殊能力')
    await user.click(screen.getByRole('button', { name: '取得：Expertise' }))
    await user.selectOptions(screen.getByLabelText('Expertise の選択内容'), 'prowl')
    await user.selectOptions(screen.getByLabelText('能力の取得元'), 'whisper')
    await user.click(screen.getByRole('button', { name: '取得：Ritual' }))
    await user.type(screen.getByLabelText('Ritual：習得した儀式・手順・代償'), '霊を呼ぶ儀式')
    await user.click(screen.getByRole('button', { name: 'シート' }))
    expect((screen.getByLabelText('Expertise の選択内容') as HTMLSelectElement).value).toBe('prowl')
    expect(
      (screen.getByLabelText('Ritual：習得した儀式・手順・代償') as HTMLTextAreaElement).value,
    ).toBe('霊を呼ぶ儀式')
  })
  it('保存人物をシート内に表示し、上部は表示切り替えだけにする', async () => {
    const user = userEvent.setup()
    const character = createDefaultCharacter('spider')
    character.identity.name = '保存人物'
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(character))
    renderApp()
    expect(screen.getByRole('heading', { name: 'SPIDER' })).toBeTruthy()
    expect(screen.getByText('保存人物')).toBeTruthy()
    expect(screen.getByRole('banner').textContent).toBe('シート編集')
    expect(within(screen.getByRole('banner')).getAllByRole('button')).toHaveLength(2)
    expect(screen.queryByText('エッジ')).toBeNull()
    expect(screen.queryByRole('button', { name: 'エッジ 2' })).toBeNull()
    await user.click(screen.getByRole('button', { name: '編集' }))
    expect((screen.getByLabelText('名前') as HTMLInputElement).value).toBe('保存人物')
    expect(screen.getByRole('banner').textContent).toBe('シート編集')
    expect(screen.getByRole('button', { name: '編集' }).getAttribute('aria-pressed')).toBe('true')
  })
  it('壊れたJSONの取り込みで現在のキャラクターを維持する', async () => {
    const user = userEvent.setup()
    renderApp()
    await tab(user, '初期設定')
    await user.type(screen.getByLabelText('名前'), '維持する人物')
    await tab(user, 'データ')
    const file = new File(['{broken'], 'broken.json', { type: 'application/json' })
    Object.defineProperty(file, 'text', { value: async () => '{broken' })
    await user.upload(screen.getByLabelText('キャラクターJSONファイル'), file)
    expect(await screen.findByText(/JSONを読み込めません/)).toBeTruthy()
    expect(window.confirm).not.toHaveBeenCalled()
    await tab(user, '初期設定')
    expect((screen.getByLabelText('名前') as HTMLInputElement).value).toBe('維持する人物')
  })
  it('新規作成前のバックアップから戻せる', async () => {
    const user = userEvent.setup()
    renderApp()
    await tab(user, '初期設定')
    await user.type(screen.getByLabelText('名前'), '戻す人物')
    await tab(user, 'データ')
    await user.selectOptions(screen.getByLabelText('新しいキャラクターのプレイブック'), 'hound')
    await user.click(screen.getByRole('button', { name: '新しいキャラクターを作成' }))
    await user.click(screen.getByRole('button', { name: '取り込み前のシートに戻す' }))
    await tab(user, '初期設定')
    expect((screen.getByLabelText('名前') as HTMLInputElement).value).toBe('戻す人物')
    expect((screen.getByLabelText('プレイブック') as HTMLSelectElement).value).toBe('cutter')
  })
})
