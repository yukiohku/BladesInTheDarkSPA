import { describe, expect, it } from 'vitest'
import { createDefaultCharacter } from '../constants/defaults'
import { applyChange } from './changelog'
import { normalizeCharacter, parseCharacterFile, serializeCharacter } from './serialize'

describe('parseCharacterFile', () => {
  it('書き出した内容をそのまま読み込める', () => {
    const original = applyChange(
      createDefaultCharacter(),
      { resource: 'stress', operation: 'increase', amount: 3, reason: '耐える' },
    )
    const result = parseCharacterFile(serializeCharacter(original))

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.character).toEqual(original)
  })

  it('JSONとして壊れている場合はエラー', () => {
    const result = parseCharacterFile('{ 壊れている')
    expect(result.ok).toBe(false)
  })

  it('オブジェクトでなければエラー', () => {
    expect(parseCharacterFile('[]').ok).toBe(false)
    expect(parseCharacterFile('123').ok).toBe(false)
    expect(parseCharacterFile('"text"').ok).toBe(false)
  })

  it('シートの構造でなければエラー', () => {
    const result = parseCharacterFile('{"foo":1}')
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toContain('キャラクターシート')
  })

  it('新しいバージョンのファイルは拒否する', () => {
    const future = JSON.stringify({ schemaVersion: 999, basics: {}, attributes: {} })
    const result = parseCharacterFile(future)
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toContain('新しいバージョン')
  })
})

describe('normalizeCharacter', () => {
  it('欠けた項目は既定値で埋める', () => {
    const result = normalizeCharacter({ basics: { name: '太郎' } })
    expect(result.basics.name).toBe('太郎')
    expect(result.stress).toBe(0)
    expect(result.drives).toHaveLength(3)
    expect(result.vices).toHaveLength(3)
  })

  it('範囲外の値は範囲内に丸める', () => {
    const result = normalizeCharacter({
      basics: {},
      attributes: { edge: 99, cool: -5, grit: 2.6 },
      edges: 88,
      harm: -3,
    })
    expect(result.attributes.edge).toBe(4)
    expect(result.attributes.cool).toBe(0)
    expect(result.attributes.grit).toBe(3)
    expect(result.edges).toBe(4)
    expect(result.harm).toBe(0)
  })

  it('壊れた変動履歴は落とす', () => {
    const result = normalizeCharacter({
      basics: {},
      log: [
        { id: 'ok', resource: 'stress', operation: 'increase', amount: 1 },
        { id: 'bad', resource: 'unknown', operation: 'increase' },
        'not-an-object',
      ],
    })
    expect(result.log).toHaveLength(1)
    expect(result.log[0].id).toBe('ok')
  })

  it('傷のクロックの進行は範囲内に収める', () => {
    const result = normalizeCharacter({
      basics: {},
      harmClocks: [{ name: '傷', filled: 99, total: 4 }],
    })
    expect(result.harmClocks[0]).toMatchObject({ filled: 4, total: 4 })
  })

  it('オブジェクトでなければ既定値を返す', () => {
    const result = normalizeCharacter('nope')
    expect(result.basics.name).toBe('')
    expect(result.attributes).toEqual(createDefaultCharacter().attributes)
  })
})
