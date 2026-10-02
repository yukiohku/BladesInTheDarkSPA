import type { ActionId, SheetState } from '../types/character'
import {
  ACTIONS,
  INITIAL_ALLOCATION_POINTS,
  INITIAL_RATING_MAX,
  PLAYBOOKS,
  RATING_MAX,
} from '../constants/playbooks'

export function initialAllocationCount(sheet: SheetState, ratings = sheet.initialActionRatings ?? sheet.ratings) {
  const book = sheet.playbookId ? PLAYBOOKS[sheet.playbookId] : null
  return ACTIONS.reduce(
    (sum, action) => sum + ratings[action.id] - (book?.initialRatings[action.id] ?? 0),
    0,
  )
}

export function actionGrowth(sheet: SheetState, id: ActionId) {
  return sheet.initialActionRatings ? sheet.ratings[id] - sheet.initialActionRatings[id] : 0
}

export function totalActionGrowth(sheet: SheetState) {
  return ACTIONS.reduce((sum, action) => sum + actionGrowth(sheet, action.id), 0)
}

export function initialAllocationMax(sheet: SheetState, ratings: SheetState['ratings'], id: ActionId) {
  if (!sheet.playbookId) return 0
  return Math.min(
    INITIAL_RATING_MAX,
    ratings[id] + Math.max(0, INITIAL_ALLOCATION_POINTS - initialAllocationCount(sheet, ratings)),
    RATING_MAX - actionGrowth(sheet, id),
  )
}

export function canConfirmInitialAllocation(sheet: SheetState, ratings: SheetState['ratings']) {
  const book = sheet.playbookId ? PLAYBOOKS[sheet.playbookId] : null
  return (
    book !== null &&
    initialAllocationCount(sheet, ratings) === INITIAL_ALLOCATION_POINTS &&
    ACTIONS.every((action) => {
      const value = ratings[action.id]
      return (
        Number.isInteger(value) &&
        value >= (book.initialRatings[action.id] ?? 0) &&
        value <= INITIAL_RATING_MAX &&
        value + actionGrowth(sheet, action.id) <= RATING_MAX
      )
    })
  )
}
