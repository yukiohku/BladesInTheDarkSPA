import { ABILITY_MESSAGES } from '../constants/labels'
import type { SheetState } from '../types/character'
import { hasSpecialArmor, healingMinimum, loadLimits, stressMax, usedLoad } from './rules'

export function abilityRemovalConfirmation(sheet: SheetState, id: string, name: string): string {
  const next = { ...sheet, abilities: sheet.abilities.filter((item) => item.id !== id) }
  const messages = [ABILITY_MESSAGES.removeTitle(name), ABILITY_MESSAGES.removeData]
  const beforeStress = stressMax(sheet)
  const afterStress = stressMax(next)
  if (beforeStress !== afterStress) {
    messages.push(ABILITY_MESSAGES.stressLimit(beforeStress, afterStress))
    if (sheet.stress > afterStress)
      messages.push(ABILITY_MESSAGES.stressValue(sheet.stress, afterStress))
  }
  const beforeLoad = loadLimits(sheet)
  const afterLoad = loadLimits(next)
  if (
    beforeLoad.light !== afterLoad.light ||
    beforeLoad.normal !== afterLoad.normal ||
    beforeLoad.heavy !== afterLoad.heavy
  ) {
    messages.push(
      ABILITY_MESSAGES.loadLimit(
        `${beforeLoad.light}／${beforeLoad.normal}／${beforeLoad.heavy}`,
        `${afterLoad.light}／${afterLoad.normal}／${afterLoad.heavy}`,
      ),
    )
    if (usedLoad(next) > afterLoad[next.score.load]) messages.push(ABILITY_MESSAGES.loadExceeded)
  }
  if (hasSpecialArmor(sheet) && !hasSpecialArmor(next))
    messages.push(ABILITY_MESSAGES.specialArmor)
  if (healingMinimum(sheet) > healingMinimum(next)) messages.push(ABILITY_MESSAGES.healing)
  return messages.join('\n\n')
}
