import { describe, expect, it } from 'vitest'
import { createDefaultCharacter } from '../constants/defaults'
import { applyChange, canRevert, revertChange } from './changelog'
import { characterReducer } from '../state/characterReducer'
describe('変動記録と取消', () => {
  it('上限で止めて理由と実際の前後の状態を保存する', () => {
    const character = applyChange(createDefaultCharacter(), {
      resource: 'stress',
      operation: 'increase',
      amount: 99,
      reason: '  抵抗  ',
    })
    expect(character.stress).toBe(9)
    expect(character.log[0].reason).toBe('抵抗')
    expect(character.log[0].before.stress).toBe(0)
    expect(character.log[0].after.stress).toBe(9)
  })
  it('減算は0で止まり、変動がなければ履歴を増やさない', () => {
    const original = createDefaultCharacter()
    expect(
      applyChange(original, { resource: 'coin', operation: 'decrease', amount: 2, reason: '' }),
    ).toBe(original)
  })
  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])('不正な数量 %s を無視する', (amount) => {
    const original = createDefaultCharacter()
    expect(
      applyChange(original, { resource: 'stress', operation: 'increase', amount, reason: '' }),
    ).toBe(original)
  })
  it('直近1件だけを取り消せる', () => {
    const first = applyChange(createDefaultCharacter(), {
      resource: 'stress',
      operation: 'increase',
      amount: 2,
      reason: '',
    })
    const second = applyChange(first, {
      resource: 'coin',
      operation: 'increase',
      amount: 1,
      reason: '',
    })
    expect(canRevert(second, first.log[0].id)).toBe(false)
    expect(revertChange(second, first.log[0].id)).toBe(second)
    const result = revertChange(second, second.log[0].id)
    expect(result.coin).toBe(0)
    expect(result.stress).toBe(2)
    expect(canRevert(result, first.log[0].id)).toBe(true)
  })
  it('コイン減少の取消は携帯コインも戻す', () => {
    let character = createDefaultCharacter()
    character = characterReducer(character, { type: 'resource', resource: 'coin', value: 4 })
    character = characterReducer(character, { type: 'carriedCoin', value: 4 })
    character = applyChange(character, {
      resource: 'coin',
      operation: 'decrease',
      amount: 2,
      reason: '支払う',
    })
    expect(character.carriedCoin).toBe(2)
    const result = revertChange(character, character.log[0].id)
    expect(result.carriedCoin).toBe(4)
    expect(result.coin).toBe(4)
  })
})
