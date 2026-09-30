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
    // シート側のロゴがタイトル代わりになるので、文字としては出ない
    expect(render()).toContain('SPECIAL ABILITY')
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
    expect(html).toContain('INSIGHT')
    expect(html).toContain('PROWESS')
    expect(html).toContain('RESOLVE')
    expect(html).toContain('STASH')
    expect(html).toContain('COIN')
  })

  it('サマリー性质的パネルはシートに載せない', () => {
    const html = render()
    expect(html).not.toContain('TEAMWORK')
    expect(html).not.toContain('PLANNING')
    expect(html).not.toContain('GATHER INFORMATION')
  })

  it('ロゴと playbook 名は同一性として残す', () => {
    const html = render()
    expect(html).toContain('Blades in the Dark')
    expect(html).toContain('CUTTER')
  })

  it('初期設定の選択肢リストはシートに出さない', () => {
    const html = render()

    // 選ぶためのチェックリストは編集タブ側
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
