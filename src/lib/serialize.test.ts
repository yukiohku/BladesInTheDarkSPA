import { describe, expect, it } from 'vitest'
import { createDefaultCharacter } from '../constants/defaults'
import { PLAYBOOK_LIST } from '../constants/playbooks'
import { characterReducer } from '../state/characterReducer'
import { normalizeCharacter, parseCharacterFile, serializeCharacter } from './serialize'
import { resourceValue, usedLoad } from './rules'
const oldSheet = {
  schemaVersion: 1,
  id: 'old',
  createdAt: '2026-09-01T00:00:00.000Z',
  updatedAt: '2026-09-02T00:00:00.000Z',
  basics: { name: '旧人物', summary: '人物の概要' },
  attributes: { edge: 3 },
  edges: 4,
  stress: 8,
  stressMax: 12,
  traumas: [{ id: 't', name: '冷酷', note: '旧メモ' }],
  weapons: [{ id: 'w', name: '旧武器', damage: '特殊な値' }],
  official: {
    playbookId: 'cutter',
    ratings: { 'prowess.skirmish': 3, 'resolve.command': 2 },
    abilityId: 'mule',
    veteranSlots: ['自由な能力'],
    friends: [{ id: 'f', name: '友人', up: true, down: false }],
    harmNotes: { '1': '打撲', '2': '骨折', '3': '' },
    healingFilled: 6,
    coin: 7,
    stash: 9,
    crewName: '旧クルー',
    generalItems: { blade: true },
    playbookItems: { 'large-weapon': true },
    gatherInfo: ['', '答え'],
  },
  notes: 'メモ',
  log: [{ id: 'log', resource: 'edges', before: 0, after: 4 }],
}
describe('保存と移行', () => {
  it.each(PLAYBOOK_LIST)('$titleの書き出しを再読込して全状態を保持する', (book) => {
    let original = createDefaultCharacter(book.id)
    original = characterReducer(original, {
      type: 'ability.add',
      definitionId: book.abilities[0].id,
    })
    original = characterReducer(original, { type: 'resource', resource: 'stress', value: 3 })
    original = characterReducer(original, { type: 'rating', id: 'tinker', value: 0 })
    original = characterReducer(original, { type: 'rating', id: 'hunt', value: 4 })
    const result = parseCharacterFile(serializeCharacter(original))
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.character).toEqual(original)
    expect(result.character.ratings.tinker).toBe(book.initialRatings.tinker ?? 0)
    expect(result.character.ratings.hunt).toBe(4)
    expect(result.character).not.toHaveProperty('creationComplete')
  })
  it('弾帯の未使用枠の位置、能力の選択・メモ・使用回数を保持する', () => {
    let original = createDefaultCharacter('leech')
    original = characterReducer(original, {
      type: 'equipment',
      id: 'leech:bandolier-1',
      quantity: 1,
    })
    original = characterReducer(original, {
      type: 'item.use',
      id: 'leech:bandolier-1',
      index: 2,
      value: 'Grenade',
    })
    original = characterReducer(original, { type: 'ability.add', definitionId: 'spider:foresight' })
    original = characterReducer(original, {
      type: 'ability.patch',
      id: original.abilities[0].id,
      patch: { notes: '準備', used: 1 },
    })
    const result = parseCharacterFile(serializeCharacter(original))
    if (!result.ok) throw new Error(result.error)
    expect(result.character).toEqual(original)
    expect(result.character.itemUses['leech:bandolier-1']).toEqual(['', '', 'Grenade'])
  })
  it('仕事のリセット後も往復保存で状態を保持する', () => {
    let original = createDefaultCharacter('leech')
    original = characterReducer(original, {
      type: 'equipment',
      id: 'leech:bandolier-1',
      quantity: 1,
    })
    original = characterReducer(original, { type: 'score.start' })
    const result = parseCharacterFile(serializeCharacter(original))
    if (!result.ok) throw new Error(result.error)
    expect(result.character).toEqual(original)
  })
  it('v1を移行し、独自項目・旧履歴・範囲外の元値を丸ごと保管する', () => {
    const originalJson = JSON.stringify(oldSheet)
    const result = parseCharacterFile(originalJson)
    if (!result.ok) throw new Error(result.error)
    const next = result.character
    expect(next.schemaVersion).toBe(2)
    expect(next.identity.name).toBe('旧人物')
    expect(next.ratings.skirmish).toBe(3)
    expect(next.ratings.command).toBe(2)
    expect(next.ratings.hunt).toBe(0)
    expect(next.abilities.map((item) => item.definitionId)).toEqual(['cutter:mule', ''])
    expect(next.crew.name).toBe('旧クルー')
    expect(next.harm.level1).toEqual(['打撲', ''])
    expect(next.coin).toBe(4)
    expect(next.healing).toBe(4)
    expect(next.equipment['large-weapon']).toBe(1)
    expect(next.legacy[0].data).toEqual(oldSheet)
    expect(next).not.toHaveProperty('log')
    expect(JSON.stringify(oldSheet)).toBe(originalJson)
    const again = parseCharacterFile(serializeCharacter(next))
    if (!again.ok) throw new Error(again.error)
    expect(again.character).toEqual(next)
  })
  it('officialがない旧データでも名前と原データを保管する', () => {
    const next = normalizeCharacter({ basics: { name: '人物' } })
    expect(next.identity.name).toBe('人物')
    expect(next.ratings).toEqual(createDefaultCharacter().ratings)
    expect(next.legacy).toHaveLength(1)
  })
  it('旧データに傷の段階だけあっても移行後に表示を失わない', () => {
    const next = normalizeCharacter({ schemaVersion: 1, basics: {}, harm: 2 })
    expect(next.harm.level2[0]).toContain('レベル2の傷あり')
  })
  it('v1のシートに書かれた傷の各欄を独立して移行する', () => {
    const next = normalizeCharacter({
      schemaVersion: 1,
      basics: {},
      official: {
        harmNotes: { '3-0': '重傷', '2-0': '骨折', '2-1': '裂傷', '1-0': '打撲', '1-1': '疲労' },
      },
    })
    expect(next.harm.level3).toBe('重傷')
    expect(next.harm.level2).toEqual(['骨折', '裂傷'])
    expect(next.harm.level1).toEqual(['打撲', '疲労'])
  })
  it.each([
    '{ 壊れている',
    '[]',
    '123',
    '{"foo":1}',
    '{"schemaVersion":999,"identity":{},"playbookId":"cutter"}',
    '{"schemaVersion":2,"identity":{},"playbookId":"vampire"}',
    '{"schemaVersion":"2","identity":{}}',
  ])('壊れた構造・未来版・未対応プレイブックを拒否する: %s', (raw) => {
    expect(parseCharacterFile(raw).ok).toBe(false)
  })
  it('欠落・非有限数・範囲外の数値を正規化する', () => {
    const next = normalizeCharacter({
      schemaVersion: 2,
      playbookId: 'cutter',
      identity: {},
      coin: 99,
      stash: -2,
      stress: Infinity,
      ratings: { hunt: NaN, study: -1, survey: 3.5, skirmish: 0, command: -1 },
      xp: { playbook: 99 },
      customItems: [{ name: '道具', load: 2, declared: true }],
    })
    expect(next.coin).toBe(4)
    expect(next.stash).toBe(0)
    expect(next.stress).toBe(0)
    expect(next.ratings.hunt).toBe(0)
    expect(next.ratings.study).toBe(0)
    expect(next.ratings.survey).toBe(4)
    expect(next.ratings.skirmish).toBe(2)
    expect(next.ratings.command).toBe(1)
    expect(resourceValue(next, 'playbook')).toBe(8)
    expect(usedLoad(next)).toBe(2)
  })
  it('以前のv2の履歴を読み飛ばし、現在の状態と入力オブジェクトを保つ', () => {
    const source = {
      schemaVersion: 2,
      playbookId: 'cutter',
      identity: { name: '保存人物' },
      stress: 3,
      harm: { level1: ['打撲', ''] },
      log: [{ title: '以前の履歴', before: { stress: 2 }, after: { stress: 3 } }, 'wrong'],
    }
    const snapshot = JSON.stringify(source)
    const next = normalizeCharacter(source)
    expect(next).not.toHaveProperty('log')
    expect(next.identity.name).toBe('保存人物')
    expect(next.stress).toBe(3)
    expect(next.harm.level1).toEqual(['打撲', ''])
    expect(JSON.parse(serializeCharacter(next))).not.toHaveProperty('log')
    expect(JSON.stringify(source)).toBe(snapshot)
  })
})
