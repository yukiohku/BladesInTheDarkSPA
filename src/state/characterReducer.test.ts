import { describe, expect, it } from 'vitest'
import { createDefaultCharacter } from '../constants/defaults'
import { ALL_ABILITIES, GENERAL_ITEMS, PLAYBOOK_LIST } from '../constants/playbooks'
import { characterReducer } from './characterReducer'
import type { Action } from './characterReducer'
import type { Character } from '../types/character'
import { attributeRating, loadLimits, stressMax, usedLoad } from '../lib/rules'
import { initialAllocationCount, totalActionGrowth } from '../lib/actionAllocation'
const run = (actions: Action[], base = createDefaultCharacter('cutter')) =>
  actions.reduce(characterReducer, base)
const withGatherNote = (character: Character, value: string): Character => ({
  ...character,
  gatherNotes: { ...character.gatherNotes, 'cutter:0': value },
})
describe('基本7種の定義と新規作成', () => {
  it('未選択では固有データや固定点を持たず、配分と能力取得を開始しない', () => {
    const blank = createDefaultCharacter(null)
    expect(blank.playbookId).toBeNull()
    expect(Object.values(blank.ratings)).toEqual(Array(12).fill(0))
    expect(blank.friends).toEqual([])
    expect(blank.equipment).not.toHaveProperty('cutter:hand-weapon')
    expect(blank.initialActionRatings).toBeNull()
    expect(characterReducer(blank, { type: 'rating', id: 'hunt', value: 2 })).toBe(blank)
    expect(characterReducer(blank, { type: 'ratings.confirmInitial', ratings: { ...blank.ratings, hunt: 2, study: 2 } })).toBe(blank)
    expect(characterReducer(blank, { type: 'ability.add', definitionId: 'cutter:mule' })).toBe(blank)
    expect(characterReducer(blank, { type: 'ability.custom' })).toBe(blank)
    const reset = characterReducer(createDefaultCharacter('hound'), { type: 'reset' })
    expect(reset.playbookId).toBeNull()
  })
  it.each(PLAYBOOK_LIST)('未選択から$titleを選ぶと固定点を入れ、共通値を保つ', (book) => {
    const blank = run([
      { type: 'identity', patch: { name: '作成途中', heritageDetail: '港で育った' } },
      { type: 'note', value: '人物メモ' },
      { type: 'resource', resource: 'stress', value: 2 },
      { type: 'resource', resource: 'playbook', value: 1 },
      { type: 'harm', field: 'level1', index: 0, value: '打撲' },
      { type: 'equipment', id: 'armor', quantity: 1 },
      { type: 'armor', kind: 'armor' },
    ], createDefaultCharacter(null))
    const selected = characterReducer(blank, { type: 'playbook.change', playbookId: book.id })
    expect(selected.ratings).toEqual(createDefaultCharacter(book.id).ratings)
    expect(selected.initialActionRatings).toBeNull()
    expect(selected.friends).toEqual(createDefaultCharacter(book.id).friends)
    expect(selected.identity).toEqual(blank.identity)
    expect(selected.notes).toBe(blank.notes)
    expect(selected.stress).toBe(2)
    expect(selected.xp.playbook).toBe(1)
    expect(selected.harm.level1[0]).toBe('打撲')
    expect(selected.equipment.armor).toBe(1)
    expect(selected.armorUses.armor).toBe(true)
    expect(selected.legacy).toHaveLength(0)
    expect(characterReducer(selected, { type: 'playbook.change', playbookId: book.id })).toBe(selected)
  })
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
  it('選択済みから未選択へ戻すと固有データを保管し、共通値と能力補正を処理する', () => {
    const allocated = run([{ type: 'rating', id: 'hunt', value: 2 }, { type: 'rating', id: 'study', value: 2 }])
    const confirmed = characterReducer(allocated, { type: 'ratings.confirmInitial', ratings: allocated.ratings })
    const original = withGatherNote(run([
      { type: 'identity', patch: { name: '残す名前' } },
      { type: 'note', value: '残すメモ' },
      { type: 'resource', resource: 'playbook', value: 3 },
      { type: 'rating', id: 'hunt', value: 4 },
      { type: 'ability.add', definitionId: 'hound:survivor' },
      { type: 'ability.add', definitionId: 'cutter:battleborn' },
      { type: 'resource', resource: 'stress', value: 10 },
      { type: 'equipment', id: 'armor', quantity: 1 },
      { type: 'equipment', id: 'cutter:hand-weapon', quantity: 1 },
      { type: 'armor', kind: 'armor' },
      { type: 'armor', kind: 'special' },
    ], confirmed), '保管するメモ')
    const next = characterReducer(original, { type: 'playbook.change', playbookId: null })
    expect(next.playbookId).toBeNull()
    expect(Object.values(next.ratings)).toEqual(Array(12).fill(0))
    expect(next.initialActionRatings).toBeNull()
    expect(next.friends).toEqual([])
    expect(next.abilities).toEqual([])
    expect(next.gatherNotes).toEqual({})
    expect(next.equipment).not.toHaveProperty('cutter:hand-weapon')
    expect(next.equipment.armor).toBe(1)
    expect(next.identity).toEqual(original.identity)
    expect(next.notes).toBe(original.notes)
    expect(next.xp.playbook).toBe(3)
    expect(next.stress).toBe(9)
    expect(next.armorUses).toEqual({ armor: true, heavy: false, special: false })
    expect(next.legacy[0]).toMatchObject({
      title: 'CUTTER 変更前の固有データ',
      data: { ratings: original.ratings, initialActionRatings: original.initialActionRatings,
        friends: original.friends, abilities: original.abilities, equipment: original.equipment,
        gatherNotes: original.gatherNotes },
    })
    const selected = characterReducer(next, { type: 'playbook.change', playbookId: 'cutter' })
    expect(selected.ratings).toEqual(createDefaultCharacter('cutter').ratings)
    expect(selected.abilities).toEqual([])
    expect(selected.legacy).toEqual(next.legacy)
    expect(characterReducer(next, { type: 'playbook.change', playbookId: null })).toBe(next)
  })
  it('初期配分は固定点を維持し、追加4点と各上限2を守る', () => {
    const character = run([
      { type: 'rating', id: 'skirmish', value: 0 },
      { type: 'rating', id: 'command', value: -1 },
      { type: 'rating', id: 'hunt', value: 4 },
      { type: 'rating', id: 'study', value: 2 },
      { type: 'rating', id: 'tinker', value: 2 },
    ])
    expect(character.ratings.skirmish).toBe(2)
    expect(character.ratings.command).toBe(1)
    expect(character.ratings.hunt).toBe(2)
    expect(character.ratings.study).toBe(2)
    expect(character.ratings.tinker).toBe(0)
    expect(character.abilities).toHaveLength(0)
    expect(initialAllocationCount(character)).toBe(4)
    expect(character.initialActionRatings).toBeNull()
    expect(totalActionGrowth(character)).toBe(0)
  })
  it('初期配分だけを確定し、能力未取得でも成長分を追加できる', () => {
    const original = createDefaultCharacter('cutter')
    expect(characterReducer(original, { type: 'ratings.confirmInitial', ratings: original.ratings })).toBe(original)
    const allocated = run([{ type: 'rating', id: 'hunt', value: 2 }, { type: 'rating', id: 'study', value: 2 }])
    const confirmed = characterReducer(allocated, { type: 'ratings.confirmInitial', ratings: allocated.ratings })
    const next = run([{ type: 'rating', id: 'hunt', value: 4 }, { type: 'rating', id: 'skirmish', value: 4 }], confirmed)
    expect(next.abilities).toHaveLength(0)
    expect(next.initialActionRatings).toEqual(allocated.ratings)
    expect(initialAllocationCount(next)).toBe(4)
    expect(totalActionGrowth(next)).toBe(4)
    expect(attributeRating(next, 'insight')).toBe(2)
    expect(characterReducer(next, { type: 'rating', id: 'hunt', value: 0 }).ratings.hunt).toBe(2)
  })
  it('初期配分の訂正は技能ごとの成長分を維持し、上限超過や不完全な配分を拒否する', () => {
    const allocated = run([{ type: 'rating', id: 'hunt', value: 2 }, { type: 'rating', id: 'study', value: 2 }])
    const confirmed = characterReducer(allocated, { type: 'ratings.confirmInitial', ratings: allocated.ratings })
    const grown = run([{ type: 'rating', id: 'hunt', value: 4 }, { type: 'rating', id: 'tinker', value: 4 }], confirmed)
    const revised = { ...allocated.ratings, hunt: 1, survey: 1 }
    const next = characterReducer(grown, { type: 'ratings.confirmInitial', ratings: revised })
    expect(next.ratings.hunt).toBe(3)
    expect(next.ratings.survey).toBe(1)
    expect(next.ratings.tinker).toBe(4)
    expect(totalActionGrowth(next)).toBe(6)
    expect(next.initialActionRatings).toEqual(revised)
    expect(characterReducer(grown, { type: 'ratings.confirmInitial', ratings: { ...allocated.ratings, hunt: 1 } })).toBe(grown)
    expect(characterReducer(grown, { type: 'ratings.confirmInitial', ratings: { ...allocated.ratings, hunt: 1, tinker: 1 } })).toBe(grown)
  })
  it.each([
    [-1, 0],
    [0, 0],
    [1, 1],
    [2, 2],
    [3, 3],
    [4, 4],
    [99, 4],
    [Number.NaN, 0],
  ])('アクション入力 %s を0〜4の範囲で %s として記録する', (value, expected) => {
    const allocated = run([{ type: 'rating', id: 'study', value: 2 }, { type: 'rating', id: 'tinker', value: 2 }])
    const confirmed = characterReducer(allocated, { type: 'ratings.confirmInitial', ratings: allocated.ratings })
    const next = run([{ type: 'rating', id: 'hunt', value }], confirmed)
    expect(next.ratings.hunt).toBe(expected)
  })
  it('共通値を保ち、固有データと取得済み能力を置換・保管する', () => {
    const original = withGatherNote(run([
      { type: 'identity', patch: { name: 'テスト' } },
      { type: 'ability.add', definitionId: 'cutter:mule' },
      { type: 'resource', resource: 'stress', value: 6 },
      { type: 'equipment', id: 'cutter:hand-weapon', quantity: 1 },
      { type: 'equipment', id: 'blade', quantity: 1 },
    ]), '旧メモ')
    const next = characterReducer(original, {
      type: 'playbook.change',
      playbookId: 'hound',
    })
    expect(next.identity.name).toBe('テスト')
    expect(next.stress).toBe(6)
    expect(next.ratings).toEqual(createDefaultCharacter('hound').ratings)
    expect(next.initialActionRatings).toBeNull()
    expect(next.abilities).toEqual([])
    expect(next.equipment.blade).toBe(1)
    expect(next.equipment['cutter:hand-weapon']).toBeUndefined()
    expect(next.friends[0].name).toContain('Steiner')
    expect(next.gatherNotes).toEqual({})
    expect(next.legacy[0].data).toMatchObject({
      gatherNotes: { 'cutter:0': '旧メモ' },
      abilities: original.abilities,
    })
  })
  it('プレイブック変更で能力由来のストレス上限と特殊鎧使用を補正する', () => {
    const original = run([
      { type: 'ability.add', definitionId: 'hound:survivor' },
      { type: 'ability.add', definitionId: 'hound:focused' },
      { type: 'resource', resource: 'stress', value: 10 },
      { type: 'armor', kind: 'special' },
    ])
    expect(stressMax(original)).toBe(10)
    expect(original.armorUses.special).toBe(true)
    const next = characterReducer(original, {
      type: 'playbook.change',
      playbookId: 'hound',
    })
    expect(next.abilities).toEqual([])
    expect(stressMax(next)).toBe(9)
    expect(next.stress).toBe(9)
    expect(next.armorUses.special).toBe(false)
  })
  it('プレイブック変更では成長後の値と確定済み初期配分を保管し、新しい配分を開始する', () => {
    const allocated = run([{ type: 'rating', id: 'hunt', value: 2 }, { type: 'rating', id: 'study', value: 2 }])
    const confirmed = characterReducer(allocated, { type: 'ratings.confirmInitial', ratings: allocated.ratings })
    const grown = characterReducer(confirmed, { type: 'rating', id: 'hunt', value: 4 })
    const next = run([{ type: 'playbook.change', playbookId: 'whisper' }], grown)
    expect(next.ratings.attune).toBe(2)
    expect(next.ratings.skirmish).toBe(0)
    expect(next.initialActionRatings).toBeNull()
    expect(initialAllocationCount(next)).toBe(0)
    expect(totalActionGrowth(next)).toBe(0)
    expect(next.legacy[0].data).toMatchObject({ ratings: grown.ratings, initialActionRatings: grown.initialActionRatings })
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
    const base = createDefaultCharacter('cutter')
    let next = base
    for (let index = 0; index < 1000; index++) {
      next = characterReducer(next, { type: 'resource', resource: 'stress', value: index % 2 })
    }
    expect(next.stress).toBe(1)
    expect(next).not.toHaveProperty('log')
    expect(JSON.stringify(next).length).toBe(JSON.stringify(base).length)
  })
  it('親しい人物・ライバルをそれぞれ1人にする', () => {
    const base = createDefaultCharacter('cutter')
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
    const base: Character = createDefaultCharacter('cutter')
    const original = JSON.stringify(base)
    characterReducer(base, { type: 'equipment', id: 'blade', quantity: 1 })
    expect(JSON.stringify(base)).toBe(original)
  })
})
