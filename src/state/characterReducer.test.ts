import { describe, expect, it } from 'vitest'
import { createDefaultCharacter } from '../constants/defaults'
import { characterReducer } from './characterReducer'

function reduceAll(actions: Parameters<typeof characterReducer>[1][]) {
  return actions.reduce(characterReducer, createDefaultCharacter())
}

describe('characterReducer', () => {
  it('属性は0から4に丸める', () => {
    expect(reduceAll([{ type: 'attribute', key: 'edge', value: 9 }]).attributes.edge).toBe(4)
    expect(reduceAll([{ type: 'attribute', key: 'edge', value: -3 }]).attributes.edge).toBe(0)
  })

  it('ストレスは上限で丸める', () => {
    expect(reduceAll([{ type: 'number', field: 'stress', value: 20 }]).stress).toBe(9)
  })

  it('上限を下げると現在のストレスも追従する', () => {
    const result = reduceAll([
      { type: 'number', field: 'stress', value: 7 },
      { type: 'number', field: 'stressMax', value: 4 },
    ])
    expect(result.stressMax).toBe(4)
    expect(result.stress).toBe(4)
  })

  it('傷のクロックの進行は分割数を超えない', () => {
    const added = reduceAll([{ type: 'clock.add' }])
    const clock = added.harmClocks[0]

    const result = characterReducer(added, {
      type: 'clock.patch',
      id: clock.id,
      patch: { filled: 99 },
    })
    expect(result.harmClocks[0].filled).toBe(clock.total)
  })

  it('空のテキストは追加しない', () => {
    const result = reduceAll([
      { type: 'text.add', field: 'dramaticUnderscores', value: '   ' },
    ])
    expect(result.dramaticUnderscores).toHaveLength(0)
  })

  it('change.apply が変更履歴に記録される', () => {
    const base = createDefaultCharacter()
    const result = characterReducer(base, {
      type: 'change.apply',
      draft: { resource: 'harm', operation: 'increase', amount: 2, reason: '失敗' },
    })
    expect(result.harm).toBe(2)
    expect(result.log).toHaveLength(1)
  })

  it('変更履歴にない項目を削除できる', () => {
    const added = reduceAll([{ type: 'weapon.add' }, { type: 'weapon.add' }])
    const target = added.weapons[0].id
    const result = characterReducer(added, { type: 'weapon.remove', id: target })
    expect(result.weapons).toHaveLength(1)
  })
})
