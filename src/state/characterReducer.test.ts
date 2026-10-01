import { describe, expect, it } from 'vitest'
import { createDefaultCharacter } from '../constants/defaults'
import { ALL_ABILITIES, GENERAL_ITEMS, PLAYBOOK_LIST } from '../constants/playbooks'
import { characterReducer } from './characterReducer'
import type { Action } from './characterReducer'
import type { Character } from '../types/character'
import { attributeRating, creationRemaining, loadLimits, stressMax, usedLoad } from '../lib/rules'
const run = (actions: Action[], base = createDefaultCharacter()) =>
  actions.reduce(characterReducer, base)
describe('基本7種の定義と新規作成', () => {
  it.each([
    ['cutter', 'skirmish', 'command'],
    ['hound', 'hunt', 'survey'],
    ['leech', 'tinker', 'wreck'],
    ['lurk', 'prowl', 'finesse'],
    ['slide', 'sway', 'consort'],
    ['spider', 'consort', 'study'],
    ['whisper', 'attune', 'study'],
  ])('%sの印刷済み初期値と固有データを持つ', (id, two, one) => {
    const book = PLAYBOOK_LIST.find((item) => item.id === id)
    if (!book) throw new Error('missing book')
    const character = createDefaultCharacter(book.id)
    expect(Object.entries(character.ratings).filter(([, value]) => value > 0)).toEqual(
      expect.arrayContaining([
        [two, 2],
        [one, 1],
      ]),
    )
    expect(Object.values(character.ratings).reduce((sum, value) => sum + value, 0)).toBe(3)
    expect(creationRemaining(character)).toBe(4)
    expect(character.friends).toHaveLength(5)
    expect(book.items).toHaveLength(6)
    expect(book.gatherInfo).toHaveLength(7)
    expect(book.xpTrigger).toBeTruthy()
  })
  it('能力・装備のIDは重複しない', () => {
    expect(new Set(ALL_ABILITIES.map((item) => item.id)).size).toBe(55)
    expect(
      new Set(
        [...GENERAL_ITEMS, ...PLAYBOOK_LIST.flatMap((book) => book.items)].map((item) => item.id),
      ).size,
    ).toBe(58)
  })
})
describe('characterReducer', () => {
  it('作成中は初期値を減らせず、追加4点と各上限2を守る', () => {
    const character = run([
      { type: 'rating', id: 'skirmish', value: 0 },
      { type: 'rating', id: 'hunt', value: 4 },
      { type: 'rating', id: 'study', value: 2 },
      { type: 'rating', id: 'tinker', value: 2 },
    ])
    expect(character.ratings.skirmish).toBe(2)
    expect(character.ratings.hunt).toBe(2)
    expect(character.ratings.study).toBe(2)
    expect(character.ratings.tinker).toBe(0)
    expect(creationRemaining(character)).toBe(0)
  })
  it('配分と能力取得が済んでから作成を完了し、成長を入力できる', () => {
    expect(run([{ type: 'creation.complete' }]).creationComplete).toBe(false)
    const next = run([
      { type: 'rating', id: 'hunt', value: 2 },
      { type: 'rating', id: 'study', value: 2 },
      { type: 'ability.add', definitionId: 'cutter:mule' },
      { type: 'creation.complete' },
      { type: 'rating', id: 'hunt', value: 99 },
    ])
    expect(next.creationComplete).toBe(true)
    expect(next.ratings.hunt).toBe(4)
    expect(attributeRating(next, 'insight')).toBe(2)
  })
  it('共通値と能力を保ち、固有データを置換・保管する', () => {
    const original = run([
      { type: 'identity', patch: { name: 'テスト' } },
      { type: 'ability.add', definitionId: 'cutter:mule' },
      { type: 'resource', resource: 'stress', value: 6 },
      { type: 'equipment', id: 'cutter:hand-weapon', quantity: 1 },
      { type: 'equipment', id: 'blade', quantity: 1 },
      { type: 'gather', key: 'cutter:0', value: '旧メモ' },
    ])
    const next = characterReducer(original, {
      type: 'playbook.change',
      playbookId: 'hound',
      resetRatings: false,
    })
    expect(next.identity.name).toBe('テスト')
    expect(next.stress).toBe(6)
    expect(next.ratings).toEqual(original.ratings)
    expect(next.abilities).toEqual(original.abilities)
    expect(next.equipment.blade).toBe(1)
    expect(next.equipment['cutter:hand-weapon']).toBeUndefined()
    expect(next.friends[0].name).toContain('Steiner')
    expect(next.gatherNotes).toEqual({})
    expect(next.legacy[0].data).toMatchObject({ gatherNotes: { 'cutter:0': '旧メモ' } })
  })
  it('明示した初期値の再設定だけがレートを置き換える', () => {
    const next = run([{ type: 'playbook.change', playbookId: 'whisper', resetRatings: true }])
    expect(next.ratings.attune).toBe(2)
    expect(next.ratings.skirmish).toBe(0)
  })
  it('能力は複数取得でき、通常能力の二重取得を防ぐ', () => {
    const next = run([
      { type: 'ability.add', definitionId: 'cutter:mule' },
      { type: 'ability.add', definitionId: 'cutter:mule' },
      { type: 'ability.add', definitionId: 'hound:survivor' },
    ])
    expect(next.abilities).toHaveLength(2)
    expect(loadLimits(next).heavy).toBe(8)
    expect(stressMax(next)).toBe(10)
    expect(next.playbookId).toBe('cutter')
  })
  it('追加取得の選択内容を個別に保存する', () => {
    let next = run([
      { type: 'ability.add', definitionId: 'hound:ghost-hunter' },
      { type: 'ability.add', definitionId: 'hound:ghost-hunter' },
    ])
    next = characterReducer(next, {
      type: 'ability.patch',
      id: next.abilities[0].id,
      patch: { choice: 'ghost-form' },
    })
    next = characterReducer(next, {
      type: 'ability.patch',
      id: next.abilities[1].id,
      patch: { choice: 'mind-link' },
    })
    expect(next.abilities.map((item) => item.choice)).toEqual(['ghost-form', 'mind-link'])
  })
  it('能力削除時の上限変更でストレスが整合する', () => {
    let next = run([
      { type: 'ability.add', definitionId: 'hound:survivor' },
      { type: 'resource', resource: 'stress', value: 10 },
    ])
    const acquiredId = next.abilities[0].id
    next = characterReducer(next, { type: 'ability.remove', id: acquiredId })
    expect(next.stress).toBe(9)
    expect(stressMax(next)).toBe(9)
  })
  it('Vigorousの恒久区画はリセットできない', () => {
    const next = run([
      { type: 'ability.add', definitionId: 'cutter:vigorous' },
      { type: 'healing', value: 0 },
    ])
    expect(next.healing).toBe(1)
  })
  it('XPと個人資産の上限を別々に扱う', () => {
    const next = run([
      { type: 'resource', resource: 'playbook', value: 99 },
      { type: 'resource', resource: 'insight', value: 99 },
      { type: 'resource', resource: 'coin', value: 99 },
      { type: 'resource', resource: 'stash', value: 99 },
    ])
    expect(next.xp.playbook).toBe(8)
    expect(next.xp.insight).toBe(6)
    expect(next.coin).toBe(4)
    expect(next.stash).toBe(40)
  })
  it('0 Load、連結欄、複数個、携帯コインを集計する', () => {
    const next = run(
      [
        { type: 'equipment', id: 'leech:blowgun', quantity: 1 },
        { type: 'equipment', id: 'leech:wrecking', quantity: 1 },
        { type: 'equipment', id: 'leech:gadgets', quantity: 3 },
        { type: 'resource', resource: 'coin', value: 2 },
        { type: 'carriedCoin', value: 2 },
      ],
      createDefaultCharacter('leech'),
    )
    expect(usedLoad(next)).toBe(7)
  })
  it('重装は鎧が必要で、鎧を外すと重装の宣言も外れる', () => {
    let next = run([{ type: 'equipment', id: 'armor-heavy', quantity: 1 }])
    expect(next.equipment['armor-heavy']).toBe(0)
    next = run(
      [
        { type: 'equipment', id: 'armor', quantity: 1 },
        { type: 'equipment', id: 'armor-heavy', quantity: 1 },
        { type: 'equipment', id: 'armor', quantity: 0 },
      ],
      next,
    )
    expect(next.equipment['armor-heavy']).toBe(0)
  })
  it('弾帯の空の使用枠の位置を保ち、次の仕事で使用状況をリセットする', () => {
    const next = run(
      [
        { type: 'equipment', id: 'leech:bandolier-1', quantity: 1 },
        { type: 'item.use', id: 'leech:bandolier-1', index: 2, value: 'Grenade' },
      ],
      createDefaultCharacter('leech'),
    )
    expect(next.itemUses['leech:bandolier-1']).toEqual(['', '', 'Grenade'])
    const reset = characterReducer(next, { type: 'score.start' })
    expect(reset.equipment['leech:bandolier-1']).toBe(0)
    expect(reset.itemUses['leech:bandolier-1']).toEqual(['', '', ''])
  })
  it('通常鎧と特殊鎧のリセット時期を区別する', () => {
    let next = run([
      { type: 'ability.add', definitionId: 'cutter:battleborn' },
      { type: 'equipment', id: 'armor', quantity: 1 },
      { type: 'armor', kind: 'armor' },
      { type: 'armor', kind: 'special' },
    ])
    next = characterReducer(next, { type: 'score.start' })
    expect(next.armorUses).toEqual({ armor: false, heavy: false, special: true })
    next = characterReducer(next, { type: 'specialArmor.reset' })
    expect(next.armorUses.special).toBe(false)
  })
  it('同レベルの傷を別々に入力・訂正できる', () => {
    let next = run([
      { type: 'harm', field: 'level1', index: 0, value: '打撲' },
      { type: 'harm', field: 'level1', index: 1, value: '疲労' },
    ])
    expect(next.harm.level1).toEqual(['打撲', '疲労'])
    next = characterReducer(next, { type: 'harm', field: 'level1', index: 1, value: '' })
    expect(next.harm.level1).toEqual(['打撲', ''])
  })
  it('4つを超えるトラウマを防ぎ、入力訂正で解除できる', () => {
    const next = run(
      ['cold', 'haunted', 'obsessed', 'soft', 'vicious'].map((name): Action => ({
        type: 'trauma',
        name,
      })),
    )
    expect(next.traumas).toHaveLength(4)
    const corrected = characterReducer(next, { type: 'trauma', name: 'cold' })
    expect(corrected.traumas).toEqual(['haunted', 'obsessed', 'soft'])
  })
  it('繰り返し操作しても履歴を蓄積しない', () => {
    const base = createDefaultCharacter()
    let next = base
    for (let index = 0; index < 1000; index++) {
      next = characterReducer(next, { type: 'resource', resource: 'stress', value: index % 2 })
    }
    expect(next.stress).toBe(1)
    expect(next).not.toHaveProperty('log')
    expect(JSON.stringify(next).length).toBe(JSON.stringify(base).length)
  })
  it('親しい人物・ライバルをそれぞれ1人にする', () => {
    const base = createDefaultCharacter()
    const next = run(
      [
        { type: 'friend.patch', id: base.friends[0].id, patch: { relation: 'friend' } },
        { type: 'friend.patch', id: base.friends[1].id, patch: { relation: 'friend' } },
      ],
      base,
    )
    expect(next.friends.filter((friend) => friend.relation === 'friend')).toHaveLength(1)
  })
  it('元の状態を直接変更しない', () => {
    const base: Character = createDefaultCharacter()
    const original = JSON.stringify(base)
    characterReducer(base, { type: 'equipment', id: 'blade', quantity: 1 })
    expect(JSON.stringify(base)).toBe(original)
  })
})
