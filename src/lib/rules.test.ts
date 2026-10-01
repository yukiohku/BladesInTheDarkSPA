import { describe, expect, it } from 'vitest'
import { createDefaultCharacter } from '../constants/defaults'
import { adjustResource } from './rules'
import { characterReducer } from '../state/characterReducer'
describe('数値の増減', () => {
  it('上限で止める', () => {
    const character = adjustResource(createDefaultCharacter(), {
      resource: 'stress',
      operation: 'increase',
      amount: 99,
    })
    expect(character.stress).toBe(9)
  })
  it('減算は0で止まり、変動がなければ元の状態を返す', () => {
    const original = createDefaultCharacter()
    expect(
      adjustResource(original, { resource: 'coin', operation: 'decrease', amount: 2 }),
    ).toBe(original)
  })
  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])('不正な数量 %s を無視する', (amount) => {
    const original = createDefaultCharacter()
    expect(
      adjustResource(original, { resource: 'stress', operation: 'increase', amount }),
    ).toBe(original)
  })
  it('コイン減少で携帯コインも上限に合わせる', () => {
    let character = createDefaultCharacter()
    character = characterReducer(character, { type: 'resource', resource: 'coin', value: 4 })
    character = characterReducer(character, { type: 'carriedCoin', value: 4 })
    character = adjustResource(character, {
      resource: 'coin',
      operation: 'decrease',
      amount: 2,
    })
    expect(character.carriedCoin).toBe(2)
    expect(character.coin).toBe(2)
  })
})
