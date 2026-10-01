import type { SheetState } from './character'
export type ResourceKey =
  'stress' | 'coin' | 'stash' | 'playbook' | 'insight' | 'prowess' | 'resolve'
export type ChangeOperation = 'increase' | 'decrease'
export interface ChangeDraft {
  resource: ResourceKey
  operation: ChangeOperation
  amount: number
  reason: string
}
export interface ChangeEntry {
  id: string
  title: string
  reason: string
  at: string
  before: SheetState
  after: SheetState
}
