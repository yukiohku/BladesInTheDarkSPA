import { afterEach, describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import App from './App'
import { CharacterProvider } from './state/CharacterProvider'
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
