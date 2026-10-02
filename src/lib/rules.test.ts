import { describe, expect, it } from 'vitest'
import { createDefaultCharacter } from '../constants/defaults'
import { withResource } from './rules'
import { characterReducer } from '../state/characterReducer'
describe('数値の直接編集', () => {
  it('上限で止める', () => {
    expect(withResource(createDefaultCharacter('cutter'), 'stress', 99).stress).toBe(9)
  })
  it('0未満と不正な値は0にする', () => {
    const original = createDefaultCharacter('cutter')
    expect(withResource(original, 'coin', -2).coin).toBe(0)
    expect(withResource(original, 'stress', Number.NaN).stress).toBe(0)
  })
  it('コイン減少で携帯コインも上限に合わせる', () => {
    let character = createDefaultCharacter('cutter')
    character = characterReducer(character, { type: 'resource', resource: 'coin', value: 4 })
    character = characterReducer(character, { type: 'carriedCoin', value: 4 })
    character = characterReducer(character, { type: 'resource', resource: 'coin', value: 2 })
    expect(character.carriedCoin).toBe(2)
    expect(character.coin).toBe(2)
  })
})
