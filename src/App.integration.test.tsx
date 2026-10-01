import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { CharacterProvider } from './state/CharacterProvider'
import { createDefaultCharacter } from './constants/defaults'
import { ACTIONS, PLAYBOOK_LIST } from './constants/playbooks'
import { readStoredCharacter, STORAGE_KEY } from './lib/storage'
function renderApp() {
  return render(
    <CharacterProvider>
      <App />
    </CharacterProvider>,
  )
}
async function tab(user: ReturnType<typeof userEvent.setup>, name: string) {
  if (!screen.queryByRole('navigation', { name: 'シートのセクション' }))
    await user.click(within(screen.getByRole('group', { name: '表示モード' })).getByRole('button', { name: '編集' }))
  await user.click(within(screen.getByRole('navigation', { name: 'シートのセクション' })).getByRole('button', { name }))
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
  it('固定点を操作対象から外し、追加点の選択・解除と残り点数を表示する', async () => {
    const user = userEvent.setup()
    renderApp()
    expect(screen.queryByText(/作成中|PLの追加点/)).toBeNull()
    await tab(user, '初期設定')
    const fixed = screen.getByLabelText('Command 1（プレイブック固定・変更不可）')
    expect(screen.queryByText(/固定 \d ＋ 追加 \d/)).toBeNull()
    await user.click(fixed)
    expect(document.activeElement).not.toBe(fixed)
    expect(screen.getByLabelText('Command 2').getAttribute('aria-pressed')).toBe('false')
    await user.click(screen.getByLabelText('Command 2'))
    expect(screen.getByLabelText('Command 2').getAttribute('aria-pressed')).toBe('true')
    await user.click(screen.getByLabelText('Hunt 2'))
    await user.click(screen.getByLabelText('Study 1'))
    expect(screen.getByText(/PLの追加点：4 \/ 4点（残り 0点）/)).toBeTruthy()
    expect(screen.getByLabelText('Tinker 1').hasAttribute('disabled')).toBe(true)
    await user.click(screen.getByLabelText('Command 2'))
    expect(screen.getByLabelText('Command 2').getAttribute('aria-pressed')).toBe('false')
    expect(screen.getByLabelText('Tinker 1').hasAttribute('disabled')).toBe(false)
    expect(screen.getByText(/PLの追加点：3 \/ 4点（残り 1点）/)).toBeTruthy()
    await user.click(screen.getByRole('button', { name: 'シート' }))
    expect(screen.queryByText(/作成中|PLの追加点|固定.*追加/)).toBeNull()
    expect(screen.getByRole('img', { name: '指揮（Command）：1' })).toBeTruthy()
    expect(screen.getByRole('img', { name: '乱戦（Skirmish）：2' })).toBeTruthy()
  })
  it('専用タブを外し、クルー名と質問例を残して以前の詳細を保存する', async () => {
    const user = userEvent.setup()
    const character = createDefaultCharacter()
    character.crew.name = '旧クルー'
    character.crew.notes = '以前のクルーメモ'
    character.crew.roster = [{ id: 'member', name: '仲間', role: '協力者', note: '旧記録', player: true }]
    character.score.planId = 'stealth'
    character.score.detail = '以前の作戦メモ'
    character.gatherNotes = { 'cutter:0': '以前の情報収集メモ' }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(character))
    renderApp()
    await tab(user, '初期設定')
    expect(screen.queryByRole('button', { name: '作戦メモ' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'クルー' })).toBeNull()
    const crewName = screen.getByRole('textbox', { name: '所属クルー名' })
    expect((crewName as HTMLInputElement).value).toBe('旧クルー')
    await user.clear(crewName)
    await user.type(crewName, '新クルー')
    await user.click(screen.getByRole('button', { name: 'シート' }))
    expect(screen.getByText('新クルー')).toBeTruthy()
    const questions = screen.getByText('情報収集の質問例')
    await user.click(questions)
    for (const question of PLAYBOOK_LIST[0].gatherInfo) expect(screen.getByText(question)).toBeTruthy()
    act(() => window.dispatchEvent(new Event('pagehide')))
    const saved = readStoredCharacter().character
    expect(saved?.crew).toEqual({ ...character.crew, name: '新クルー' })
    expect(saved?.score).toEqual(character.score)
    expect(saved?.gatherNotes).toEqual(character.gatherNotes)
  })
  it('技能と分離した経験値欄で四つのXPを更新し、画面切り替え後も保持する', async () => {
    const user = userEvent.setup()
    renderApp()
    const skills = screen.getByRole('region', { name: '技能・抵抗' })
    const experience = screen.getByRole('region', { name: '経験値' })
    expect(within(skills).getAllByRole('img')).toHaveLength(12)
    expect(within(skills).queryByRole('button')).toBeNull()

    for (const name of ['PLAYBOOK', 'INSIGHT', 'PROWESS']) {
      await user.click(within(experience).getByRole('button', { name: `${name} 2` }))
    }
    const resolve = within(experience).getByRole('button', { name: 'RESOLVE 1' })
    resolve.focus()
    await user.keyboard(' ')
    expect(resolve.getAttribute('aria-pressed')).toBe('true')
    expect(within(skills).getByRole('img', { name: '乱戦（Skirmish）：2' })).toBeTruthy()

    await tab(user, '初期設定')
    await user.click(screen.getByRole('button', { name: 'シート' }))
    const restored = within(screen.getByRole('region', { name: '経験値' }))
    expect(restored.getByRole('button', { name: 'RESOLVE 1' }).getAttribute('aria-pressed')).toBe('true')
    for (const name of ['PLAYBOOK', 'INSIGHT', 'PROWESS']) {
      expect(restored.getByRole('button', { name: `${name} 2` }).getAttribute('aria-pressed')).toBe('true')
    }
  })
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
      await user.click(screen.getByLabelText('Hunt 1'))
      await user.tab()
      expect(document.activeElement).toBe(screen.getByLabelText('Hunt 2'))
      await user.keyboard('{Enter}')
      await user.click(screen.getByRole('button', { name: 'シート' }))
      expect(screen.getByRole('img', { name: '狩り（Hunt）：2' })).toBeTruthy()
      expect(screen.getByRole('button', { name: 'INSIGHT 2' }).getAttribute('aria-pressed')).toBe('true')

      await tab(user, '初期設定')
      await user.click(screen.getByLabelText('Hunt 2'))
      await user.click(screen.getByRole('button', { name: 'シート' }))
      expect(screen.getByRole('img', { name: '狩り（Hunt）：1' })).toBeTruthy()
    },
    15000,
  )
  it.each(PLAYBOOK_LIST)('$titleを選んで固有能力を取得しシートに表示する', async (book) => {
    const user = userEvent.setup()
    renderApp()
    await chooseBook(user, book.id)
    expect(screen.getAllByRole('img', { name: /プレイブック固定・変更不可/ })).toHaveLength(3)
    for (const action of ACTIONS) {
      const fixed = book.initialRatings[action.id] ?? 0
      for (let index = 1; index <= fixed; index++) {
        expect(screen.getByLabelText(`${action.name} ${index}（プレイブック固定・変更不可）`)).toBeTruthy()
        expect(screen.getByLabelText(`${action.name} ${index}（プレイブック固定・変更不可）`).tagName).toBe('SPAN')
      }
    }
    await tab(user, '特殊能力')
    await user.click(screen.getByRole('button', { name: `取得：${book.abilities[0].name}` }))
    await user.click(screen.getByRole('button', { name: 'シート' }))
    expect(screen.getByRole('heading', { name: book.title })).toBeTruthy()
    expect(screen.getByText(book.abilities[0].name)).toBeTruthy()
    expect(screen.getByText(book.xpTrigger)).toBeTruthy()
    expect(screen.getByRole('button', { name: book.items[0].ja })).toBeTruthy()
  }, 15000)
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
  it('知人との関係は編集で設定し、シートでは表示だけにする', async () => {
    const user = userEvent.setup()
    renderApp()
    const [first, second] = PLAYBOOK_LIST[0].friends
    expect(screen.getByRole('img', { name: `${first.name}：未選択` })).toBeTruthy()
    await tab(user, '初期設定')
    await user.selectOptions(screen.getByLabelText(`${first.name}との関係`), 'friend')
    await user.selectOptions(screen.getByLabelText(`${second.name}との関係`), 'friend')
    expect((screen.getByLabelText(`${first.name}との関係`) as HTMLSelectElement).value).toBe(
      'neutral',
    )
    await user.selectOptions(screen.getByLabelText(`${first.name}との関係`), 'rival')
    await user.click(screen.getByRole('button', { name: 'シート' }))
    const firstRival = screen.getByRole('img', { name: `${first.name}：ライバル` })
    expect(firstRival.textContent).toBe('△▼')
    expect(screen.getByRole('img', { name: `${second.name}：親しい人物` }).textContent).toBe('▲▽')
    expect(screen.queryByRole('button', { name: /：親しい人物|：ライバル/ })).toBeNull()
    expect(screen.queryByRole('combobox', { name: /との関係/ })).toBeNull()
    await user.click(firstRival)
    expect(document.activeElement).not.toBe(firstRival)
    await user.keyboard('{Enter} ')
    await tab(user, '初期設定')
    expect((screen.getByLabelText(`${first.name}との関係`) as HTMLSelectElement).value).toBe(
      'rival',
    )
    expect((screen.getByLabelText(`${second.name}との関係`) as HTMLSelectElement).value).toBe(
      'friend',
    )
    await user.selectOptions(screen.getByLabelText(`${first.name}との関係`), 'neutral')
    await user.click(screen.getByRole('button', { name: 'シート' }))
    expect(screen.getByRole('img', { name: `${first.name}：未選択` }).textContent).toBe('△▽')
  })
  it('追加4点と能力1つで作成を完了する', async () => {
    const user = userEvent.setup()
    renderApp()
    await tab(user, '初期設定')
    expect(
      screen.getByRole('button', { name: 'キャラクター作成を完了' }).hasAttribute('disabled'),
    ).toBe(true)
    await user.click(screen.getByLabelText('Hunt 2'))
    await user.click(screen.getByLabelText('Study 2'))
    expect(screen.getByText(/PLの追加点：4.*残り 0点/)).toBeTruthy()
    await tab(user, '特殊能力')
    await user.click(screen.getByRole('button', { name: '取得：Mule' }))
    await tab(user, '初期設定')
    await user.click(screen.getByRole('button', { name: 'キャラクター作成を完了' }))
    expect(screen.getByLabelText('Skirmish 4')).toBeTruthy()
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
  it('個別の傷を確定ボタンなしで保持し、治療・XP・資産の上限を表示する', async () => {
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
    expect(screen.queryByRole('button', { name: /傷.*を記録/ })).toBeNull()
    await user.type(screen.getByLabelText('レベル1の傷 1（効果低下）'), '打撲')
    await user.type(screen.getByLabelText('レベル1の傷 2（効果低下）'), '疲労')
    await tab(user, '状態')
    expect((screen.getByLabelText('レベル1の傷 1（効果低下）') as HTMLInputElement).value).toBe('打撲')
    expect((screen.getByLabelText('レベル1の傷 2（効果低下）') as HTMLInputElement).value).toBe('疲労')
    await user.click(screen.getByRole('button', { name: 'シート' }))
    expect((screen.getByLabelText('レベル1の傷 1（効果低下）') as HTMLInputElement).value).toBe(
      '打撲',
    )
    expect((screen.getByLabelText('レベル1の傷 2（効果低下）') as HTMLTextAreaElement).value).toBe('疲労')
  })
  it('傷の追記・訂正・削除を画面切り替えと再読み込み後も保持する', async () => {
    const user = userEvent.setup()
    const view = renderApp()
    const first = screen.getByRole('textbox', { name: 'レベル1の傷 1（効果低下）' })
    await user.type(first, '打撲')
    expect(document.activeElement).toBe(first)
    expect(screen.getByRole('textbox', { name: 'レベル1の傷 1（効果低下）' })).toBe(first)
    await user.type(screen.getByRole('textbox', { name: 'レベル1の傷 2（効果低下）' }), '疲労')
    await tab(user, '状態')
    const second = screen.getByRole('textbox', { name: 'レベル1の傷 2（効果低下）' })
    expect((second as HTMLInputElement).value).toBe('疲労')
    await user.clear(second)
    const edited = screen.getByRole('textbox', { name: 'レベル1の傷 1（効果低下）' })
    await user.clear(edited)
    await user.type(edited, '左腕の打撲')
    await user.type(screen.getByRole('textbox', { name: 'レベル3の傷（手助け・自分を追い込む）' }), '骨折')
    await user.type(screen.getByRole('textbox', { name: '致命的な傷・結果' }), '重篤')
    await user.click(screen.getByRole('button', { name: 'シート' }))
    act(() => window.dispatchEvent(new Event('pagehide')))
    expect(readStoredCharacter().character?.harm).toMatchObject({
      level1: ['左腕の打撲', ''], level3: '骨折', fatal: '重篤',
    })
    view.unmount()
    renderApp()
    expect((screen.getByRole('textbox', { name: 'レベル1の傷 1（効果低下）' }) as HTMLTextAreaElement).value).toBe('左腕の打撲')
    expect((screen.getByRole('textbox', { name: 'レベル1の傷 2（効果低下）' }) as HTMLTextAreaElement).value).toBe('')
    expect((screen.getByRole('textbox', { name: 'レベル3の傷（手助け・自分を追い込む）' }) as HTMLTextAreaElement).value).toBe('骨折')
    expect((screen.getByRole('textbox', { name: '致命的な傷・結果' }) as HTMLTextAreaElement).value).toBe('重篤')
  })
  it('数値の増減を適用し、履歴や理由入力は表示しない', async () => {
    const user = userEvent.setup()
    renderApp()
    await tab(user, '状態')
    expect(screen.queryByRole('button', { name: '履歴' })).toBeNull()
    expect(screen.queryByLabelText('理由')).toBeNull()
    await user.click(screen.getByRole('button', { name: '数量を1増やす' }))
    await user.click(screen.getByRole('button', { name: '増減を適用' }))
    await user.click(screen.getByRole('button', { name: 'シート' }))
    expect(screen.getByRole('button', { name: 'ストレス 2' }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('button', { name: 'ストレス 3' }).getAttribute('aria-pressed')).toBe('false')
    await tab(user, 'データ')
    expect(screen.queryByText('記録件数')).toBeNull()
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
