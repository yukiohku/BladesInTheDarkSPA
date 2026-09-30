export type ResourceKey = 'edges' | 'stress' | 'harm' | 'trauma'

export type ChangeOperation = 'increase' | 'decrease'

export interface ChangeEntry {
  id: string
  resource: ResourceKey
  operation: ChangeOperation
  amount: number
  reason: string
  detail: string
  before: number
  after: number
  at: string
}

export interface ChangeDraft {
  resource: ResourceKey
  operation: ChangeOperation
  amount: number
  reason: string
  detail?: string
}
