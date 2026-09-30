import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import App from './App'
import { CharacterProvider } from './state/CharacterProvider'

function render() {
  return renderToString(
    <CharacterProvider>
      <App />
    </CharacterProvider>,
  )
}

describe('App', () => {
  it('例外なく描画できる', () => {
    expect(render()).toContain('刃物 in the Dark')
  })

  it('既定では公式シートを表示する', () => {
    const html = render()
    expect(html).toContain('BLADES IN THE DARK')
    expect(html).toContain('CUTTER')
    expect(html).toContain('SPECIAL ABILITIES')
    expect(html).toContain('DANGEROUS FRIENDS')
    expect(html).toContain('GATHER INFORMATION')
    expect(html).toContain('INSIGHT')
    expect(html).toContain('PROWESS')
    expect(html).toContain('RESOLVE')
    expect(html).toContain('BONUS DIE')
  })

  it('シート表示と編集を切り替えるモードを持つ', () => {
    const html = render()
    expect(html).toContain('シート')
    expect(html).toContain('編集')
  })
})
