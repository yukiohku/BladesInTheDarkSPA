import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import App from './App'
import { CharacterProvider } from './state/CharacterProvider'

describe('App', () => {
  it('例外なく描画できる', () => {
    const html = renderToString(
      <CharacterProvider>
        <App />
      </CharacterProvider>,
    )
    expect(html).toContain('刃物 in the Dark')
  })

  it('全セクションのタブを表示する', () => {
    const html = renderToString(
      <CharacterProvider>
        <App />
      </CharacterProvider>,
    )
    for (const label of ['基本情報', '属性', '異能', 'クルー', '状態', '装備', '履歴', 'データ']) {
      expect(html).toContain(label)
    }
  })
})
