import type { ChangeEntry } from './changelog'

export const SCHEMA_VERSION = 1

export type AttributeKey =
  | 'edge'
  | 'hooligan'
  | 'savvy'
  | 'cool'
  | 'grit'
  | 'gumshoe'
  | 'charm'
  | 'strange'

export type Attributes = Record<AttributeKey, number>

export interface SheetChoice {
  id: string
  name: string
}

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

export interface CrewMember {
  id: string
  name: string
  role: string
  note: string
  player: boolean
}

export interface Weapon {
  id: string
  name: string
  range: string
  damage: string
  load: string
  effect: string
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

export interface Character {
  schemaVersion: number
  id: string
  createdAt: string
  updatedAt: string

  basics: {
    name: string
    pronouns: string
    heritageId: string
    heritageName: string
    backgroundId: string
    backgroundName: string
    summary: string
  }

  attributes: Attributes
  drives: ChoiceList[]
  heritageAbilities: ChoiceList[]
  backgroundAbilities: ChoiceList[]
  crewRoleId: string
  roleAbilities: ChoiceList[]
  specialAbilities: ChoiceList[]
  vices: ChoiceList[]

  crew: Crew

  edges: number
  stress: number
  stressMax: number
  traumas: ChoiceList[]
  flaws: ChoiceList[]
  armor: number
  armorEffect: number
  harm: number
  harmClocks: Clock[]

  weapons: Weapon[]
  dramaticUnderscores: string[]
  customMoves: string[]
  notes: string
  log: ChangeEntry[]
}
