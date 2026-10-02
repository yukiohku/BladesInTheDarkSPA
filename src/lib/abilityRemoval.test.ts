import { describe, expect, it } from 'vitest'
import { createDefaultCharacter } from '../constants/defaults'
import { characterReducer } from '../state/characterReducer'
import { abilityRemovalConfirmation } from './abilityRemoval'

describe('能力取り消しの影響表示', () => {
  it('補正のない能力には不要な影響を表示しない', () => {
    const character = characterReducer(createDefaultCharacter('cutter'), { type: 'ability.add', definitionId: 'cutter:leader' })
    const message = abilityRemovalConfirmation(character, character.abilities[0].id, 'Leader')
    expect(message).toContain('Leaderの取得を取り消しますか？')
    expect(message).toContain('選択内容・メモ・使用回数')
    expect(message).not.toMatch(/上限|特殊鎧|治療クロック/)
  })
  it('Load超過になる場合は宣言済み装備が保持されることを表示する', () => {
    let character = characterReducer(createDefaultCharacter('cutter'), { type: 'ability.add', definitionId: 'cutter:mule' })
    character = characterReducer(character, { type: 'customItem.add' })
    character = characterReducer(character, { type: 'customItem.patch', id: character.customItems[0].id, patch: { load: 6, declared: true } })
    const message = abilityRemovalConfirmation(character, character.abilities[0].id, 'Mule')
    expect(message).toContain('変更後の上限を超えます')
    expect(message).toContain('装備の宣言は保持します')
  })
  it('特殊鎧を付与する最後の能力を取り消すときだけ使用不可を表示する', () => {
    let character = characterReducer(createDefaultCharacter('cutter'), { type: 'ability.add', definitionId: 'cutter:battleborn' })
    const id = character.abilities[0].id
    expect(abilityRemovalConfirmation(character, id, 'Battleborn')).toContain('特殊鎧が使用できなくなり')
    character = characterReducer(character, { type: 'ability.add', definitionId: 'hound:focused' })
    expect(abilityRemovalConfirmation(character, id, 'Battleborn')).not.toContain('特殊鎧')
  })
  it('治療の恒久区画がなくなる場合も進捗を保持することを説明する', () => {
    const character = characterReducer(createDefaultCharacter('cutter'), { type: 'ability.add', definitionId: 'cutter:vigorous' })
    const message = abilityRemovalConfirmation(character, character.abilities[0].id, 'Vigorous')
    expect(message).toContain('治療クロックの恒久区画がなくなります')
    expect(message).toContain('現在の治療クロックは保持')
  })
  it('ストレスが新上限以下なら現在値の切り下げは表示しない', () => {
    const character = characterReducer(createDefaultCharacter('cutter'), { type: 'ability.add', definitionId: 'hound:survivor' })
    const message = abilityRemovalConfirmation(character, character.abilities[0].id, 'Survivor')
    expect(message).toContain('ストレス上限：10 → 9')
    expect(message).not.toContain('現在のストレス')
  })
})
