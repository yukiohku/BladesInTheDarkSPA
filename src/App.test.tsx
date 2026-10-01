import { afterEach, describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import App from './App'
import { CharacterProvider } from './state/CharacterProvider'
import { characterReducer } from './state/characterReducer'
import { createDefaultCharacter } from './constants/defaults'
import { PLAYBOOK_LIST } from './constants/playbooks'
import { STORAGE_KEY } from './lib/storage'
afterEach(() => window.localStorage.clear())
describe('初期描画', () => {
  it.each(PLAYBOOK_LIST)('$titleの保存データを描画できる', (book) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(createDefaultCharacter(book.id)))
    const html = renderToString(
      <CharacterProvider>
        <App />
      </CharacterProvider>,
    )
    expect(html).toContain(book.title)
    expect(html).toContain('Blades in the Dark')
    expect(html).toContain('ストレス')
    expect(html).toContain('SPECIAL ABILITIES')
    expect(html).toContain('HEALING')
    expect(html).toContain('ARMOR USES')
    expect(html).toContain(book.xpTrigger)
  })
})
describe('携帯するコイン欄', () => {
  const renderWithCoin = (coin: number) => {
    const character = characterReducer(createDefaultCharacter('cutter'), {
      type: 'resource',
      resource: 'coin',
      value: coin,
    })
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(character))
    return renderToString(
      <CharacterProvider>
        <App />
      </CharacterProvider>,
    )
  }
  it('所持COINが0のときは欄自体を表示しない', () => {
    expect(renderWithCoin(0)).not.toContain('携帯するコイン')
  })
  it('所持COINがあるときは欄を表示する', () => {
    expect(renderWithCoin(2)).toContain('携帯するコイン')
  })
})
