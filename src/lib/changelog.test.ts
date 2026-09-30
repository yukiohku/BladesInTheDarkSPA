import { describe, expect, it } from 'vitest'
import type { ChangeDraft } from '../types/changelog'
import { createDefaultCharacter } from '../constants/defaults'
import { applyChange, canRevert, currentValue, revertChange } from './changelog'

function draft(overrides: Partial<ChangeDraft> = {}): ChangeDraft {
  return { resource: 'stress', operation: 'increase', amount: 1, reason: 'テスト', ...overrides }
}

describe('applyChange', () => {
  it('ストレスの増加で値と履歴が更新される', () => {
    const before = createDefaultCharacter()
    const after = applyChange(before, draft({ amount: 2 }))

    expect(after.stress).toBe(2)
    expect(after.log).toHaveLength(1)
    expect(after.log[0]).toMatchObject({ resource: 'stress', before: 0, after: 2, amount: 2 })
  })

  it('ストレスは上限で止まる', () => {
    const after = applyChange(createDefaultCharacter(), draft({ amount: 20 }))
    expect(after.stress).toBe(9)
  })

  it('ストレスは0未満にならない', () => {
    const after = applyChange(createDefaultCharacter(), draft({ operation: 'decrease', amount: 3 }))
    expect(after.stress).toBe(0)
  })

  it('エッジは0から4の範囲', () => {
    const base = createDefaultCharacter()
    expect(applyChange(base, draft({ resource: 'edges', amount: 9 })).edges).toBe(4)
    expect(applyChange(base, draft({ resource: 'edges', operation: 'decrease', amount: 2 })).edges).toBe(0)
  })

  it('傷は0から4の範囲', () => {
    const after = applyChange(createDefaultCharacter(), draft({ resource: 'harm', amount: 9 }))
    expect(after.harm).toBe(4)
  })

  it('数量0では何も変わらない', () => {
    const base = createDefaultCharacter()
    const after = applyChange(base, draft({ amount: 0 }))
    expect(after).toBe(base)
  })

  it('上限に達している場合は履歴が増えない', () => {
    const base = createDefaultCharacter()
    const maxed = { ...base, edges: 4 }
    expect(applyChange(maxed, draft({ resource: 'edges', amount: 1 }))).toBe(maxed)
  })

  it('トラウマは内容がないときは記録されない', () => {
    const base = createDefaultCharacter()
    const after = applyChange(base, draft({ resource: 'trauma' }))
    expect(after).toBe(base)
    expect(after.traumas).toHaveLength(0)
  })

  it('トラウマは内容を指定すると1件増える', () => {
    const after = applyChange(
      createDefaultCharacter(),
      draft({ resource: 'trauma', detail: '聾' }),
    )
    expect(after.traumas).toHaveLength(1)
    expect(after.traumas[0].name).toBe('聾')
    expect(after.log[0].amount).toBe(1)
  })

  it('同じトラウマは重複して記録しない', () => {
    const base = createDefaultCharacter()
    const once = applyChange(base, draft({ resource: 'trauma', detail: '聾' }))
    const twice = applyChange(once, draft({ resource: 'trauma', detail: '聾' }))
    expect(twice.traumas).toHaveLength(1)
  })

  it('トラウマを克服すると最後の1件が外れる', () => {
    const base = createDefaultCharacter()
    const one = applyChange(base, draft({ resource: 'trauma', detail: '聾' }))
    const two = applyChange(one, draft({ resource: 'trauma', detail: '冷酷' }))
    const back = applyChange(two, draft({ resource: 'trauma', operation: 'decrease' }))

    expect(back.traumas.map((item) => item.name)).toEqual(['聾'])
    expect(back.log[0].operation).toBe('decrease')
  })
})

describe('revertChange', () => {
  it('直近の1件だけ取り消せる', () => {
    const first = applyChange(createDefaultCharacter(), draft({ amount: 2 }))
    const second = applyChange(first, draft({ amount: 3 }))

    expect(canRevert(second, first.log[0].id)).toBe(false)

    const reverted = revertChange(second, second.log[0].id)
    expect(reverted.stress).toBe(2)
    expect(reverted.log).toHaveLength(1)
  })

  it('直近でない項目は取り消せない', () => {
    const first = applyChange(createDefaultCharacter(), draft({ amount: 2 }))
    const second = applyChange(first, draft({ amount: 3 }))
    expect(revertChange(second, first.log[0].id)).toBe(second)
  })

  it('追加したトラウマは取り消しで外れる', () => {
    const added = applyChange(createDefaultCharacter(), draft({ resource: 'trauma', detail: '聾' }))
    const reverted = revertChange(added, added.log[0].id)

    expect(reverted.traumas).toHaveLength(0)
    expect(reverted.log).toHaveLength(0)
  })

  it('克服したトラウマは取り消しで戻る', () => {
    const added = applyChange(createDefaultCharacter(), draft({ resource: 'trauma', detail: '聾' }))
    const cleared = applyChange(added, draft({ resource: 'trauma', operation: 'decrease' }))
    const reverted = revertChange(cleared, cleared.log[0].id)

    expect(reverted.traumas.map((item) => item.name)).toEqual(['聾'])
  })

  it('存在しないIDでは何も変わらない', () => {
    const base = createDefaultCharacter()
    expect(revertChange(base, 'nope')).toBe(base)
  })
})

describe('currentValue', () => {
  it('トラウマは件数で返す', () => {
    const withTrauma = applyChange(
      createDefaultCharacter(),
      draft({ resource: 'trauma', detail: '聾' }),
    )
    expect(currentValue(withTrauma, 'trauma')).toBe(1)
  })
})
