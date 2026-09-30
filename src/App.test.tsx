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

  it('既定ではプレイ中に触る項目だけのシートを出す', () => {
    const html = render()

    // プレイ中に触るもの
    expect(html).toContain('ストレス')
    expect(html).toContain('トラウマ')
    expect(html).toContain('傷')
    expect(html).toContain('HEALING')
    expect(html).toContain('ARMOR USES')
    expect(html).toContain('SPECIAL ABILITY')
    expect(html).toContain('DANGEROUS FRIENDS')
    expect(html).toContain('ITEMS')
    expect(html).toContain('TEAMWORK')
    expect(html).toContain('PLANNING')
    expect(html).toContain('GATHER INFORMATION')
    expect(html).toContain('INSIGHT')
    expect(html).toContain('PROWESS')
    expect(html).toContain('RESOLVE')
    expect(html).toContain('STASH')
    expect(html).toContain('COIN')
  })

  it('キャラメイクで決める項目はシートに出さない', () => {
    const html = render()

    // 初期設定の項目はプレイシートには出さない
    expect(html).not.toContain('BLADES IN THE DARK')
    expect(html).not.toContain('CUTTER')
    expect(html).not.toContain('Akoros')
    expect(html).not.toContain('VICE / PURVEYOR')
    // 静的なルール文も落とす
    expect(html).not.toContain('BONUS DIE')
    expect(html).not.toContain('A DANGEROUS')
  })

  it('シート表示と編集を切り替えるモードを持つ', () => {
    const html = render()
    expect(html).toContain('シート')
    expect(html).toContain('編集')
  })
})
