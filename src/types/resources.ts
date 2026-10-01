export type ResourceKey =
  'stress' | 'coin' | 'stash' | 'playbook' | 'insight' | 'prowess' | 'resolve'
export interface ResourceAdjustment {
  resource: ResourceKey
  operation: 'increase' | 'decrease'
  amount: number
}
