
export const SCHEMA_VERSION = 2
export type PlaybookId = 'cutter' | 'hound' | 'leech' | 'lurk' | 'slide' | 'spider' | 'whisper'
export type RatingGroup = 'insight' | 'prowess' | 'resolve'
export type ActionId =
  | 'hunt'
  | 'study'
  | 'survey'
  | 'tinker'
  | 'finesse'
  | 'prowl'
  | 'skirmish'
  | 'wreck'
  | 'attune'
  | 'command'
  | 'consort'
  | 'sway'
export interface ChoiceList {
  id: string
  name: string
  note: string
}
export interface Clock {
  id: string
  name: string
  filled: number
  total: number
}
export interface Friend {
  id: string
  name: string
  relation: 'neutral' | 'friend' | 'rival'
}
export interface AcquiredAbility {
  id: string
  definitionId: string
  name: string
  effect: string
  choice: string
  notes: string
  used: number
}
export interface CustomItem {
  id: string
  name: string
  load: number
  declared: boolean
  notes: string
}
export interface CrewMember {
  id: string
  name: string
  role: string
  note: string
  player: boolean
}
export interface Crew {
  name: string
  typeId: string
  typeName: string
  tier: number
  charter: string
  summary: string
  hold: number
  influence: number
  holdTotal: number
  influenceTotal: number
  territory: string
  lair: string
  liabilities: ChoiceList[]
  services: ChoiceList[]
  itemRoster: ChoiceList[]
  roster: CrewMember[]
  notes: string
}
export interface SheetState {
  playbookId: PlaybookId
  identity: {
    name: string
    look: string
    heritageId: string
    heritageDetail: string
    backgroundId: string
    backgroundDetail: string
    viceId: string
    viceDetail: string
    purveyor: string
  }
  ratings: Record<ActionId, number>
  initialActionRatings: Record<ActionId, number> | null
  xp: Record<'playbook' | RatingGroup, number>
  abilities: AcquiredAbility[]
  friends: Friend[]
  equipment: Record<string, number>
  itemUses: Record<string, string[]>
  customItems: CustomItem[]
  score: { load: 'light' | 'normal' | 'heavy'; planId: string; detail: string }
  gatherNotes: Record<string, string>
  stress: number
  traumas: string[]
  harm: { level1: [string, string]; level2: [string, string]; level3: string; fatal: string }
  healing: number
  armorUses: { armor: boolean; heavy: boolean; special: boolean }
  coin: number
  stash: number
  carriedCoin: number
  notes: string
  clocks: Clock[]
  crew: Crew
}
export interface LegacyArchive {
  title: string
  at: string
  data: unknown
}
export interface Character extends SheetState {
  schemaVersion: number
  id: string
  createdAt: string
  updatedAt: string
  legacy: LegacyArchive[]
}
