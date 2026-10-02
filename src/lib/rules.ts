import type { Character, RatingGroup, SheetState } from '../types/character'
import {
  ACTION_GROUPS,
  ATTRIBUTE_XP_MAX,
  COIN_MAX,
  equipmentFor,
  findAbility,
  LOAD_LIMITS,
  PLAYBOOK_XP_MAX,
  STASH_MAX,
  STRESS_BOXES,
} from '../constants/playbooks'
import type { ResourceKey } from '../types/resources'
export function clamp(value: number, min: number, max: number) {
  return Number.isFinite(value) ? Math.round(Math.min(Math.max(value, min), max)) : min
}
export function abilityDefinitions(sheet: SheetState) {
  return [...new Set(sheet.abilities.map((item) => item.definitionId))].flatMap((id) => {
    const option = findAbility(id)
    return option ? [option] : []
  })
}
export function stressMax(sheet: SheetState) {
  return (
    STRESS_BOXES +
    abilityDefinitions(sheet).reduce((sum, option) => sum + (option.stressBonus ?? 0), 0)
  )
}
export function healingMinimum(sheet: SheetState) {
  return Math.max(0, ...abilityDefinitions(sheet).map((option) => option.healingMinimum ?? 0))
}
export function loadLimits(sheet: SheetState) {
  return abilityDefinitions(sheet).find((option) => option.loadLimits)?.loadLimits ?? LOAD_LIMITS
}
export function hasSpecialArmor(sheet: SheetState) {
  return abilityDefinitions(sheet).some((option) => option.specialArmor)
}
export function attributeRating(sheet: SheetState, group: RatingGroup) {
  return (
    ACTION_GROUPS.find((item) => item.id === group)?.items.filter(
      (item) => sheet.ratings[item.id] > 0,
    ).length ?? 0
  )
}
export function usedLoad(sheet: SheetState) {
  return (
    equipmentFor(sheet.playbookId).reduce(
      (sum, item) => sum + (sheet.equipment[item.id] ?? 0) * item.load,
      0,
    ) +
    sheet.customItems.reduce((sum, item) => sum + (item.declared ? item.load : 0), 0) +
    sheet.carriedCoin
  )
}
export function resourceMax(sheet: SheetState, key: ResourceKey) {
  if (key === 'stress') return stressMax(sheet)
  if (key === 'coin') return COIN_MAX
  if (key === 'stash') return STASH_MAX
  return key === 'playbook' ? PLAYBOOK_XP_MAX : ATTRIBUTE_XP_MAX
}
export function resourceValue(sheet: SheetState, key: ResourceKey) {
  return key === 'stress' || key === 'coin' || key === 'stash' ? sheet[key] : sheet.xp[key]
}
export function withResource(sheet: Character, key: ResourceKey, value: number): Character {
  const next = clamp(value, 0, resourceMax(sheet, key))
  if (key === 'coin')
    return { ...sheet, coin: next, carriedCoin: Math.min(sheet.carriedCoin, next) }
  if (key === 'stress' || key === 'stash') return { ...sheet, [key]: next }
  return { ...sheet, xp: { ...sheet.xp, [key]: next } }
}
