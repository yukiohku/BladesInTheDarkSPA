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

export interface OfficialFriend {
  id: string
  name: string
  up: boolean
  down: boolean
}

export interface PlanningSlot {
  detail: string
  load: string
}

/**
 * 公式キャラクターシート（横1ページ）に対応するデータ。
 *
 * 傷・ストレス・トラウマ・エッジは character 側と共有する。
 * 「変動を記録」で変えた値がそのままシートへ反映される。
 */
export interface OfficialSheet {
  playbookId: string

  crewName: string
  look: string

  heritageIds: string[]
  backgroundIds: string[]
  viceIds: string[]

  /** 傷の行ごとの書き込み。キーは '1' '2' '3' */
  harmNotes: Record<string, string>
  healingFilled: number
  armorUses: { armor: boolean; heavy: boolean; special: boolean }

  /** クルーのコイン（STASH / COIN） */
  stash: number
  coin: number

  /** 公式では無題の行。1行目はエッジ表示に使うので、書き換え用は2行目だけ */
  extraLabel: string
  extraCheck: boolean
  extraFilled: number

  playbookXp: number
  insightXp: number
  prowessXp: number
  resolveXp: number
  /** アクションレート。キーは 'insight.hunt' のような形式 */
  ratings: Record<string, number>

  abilityId: string
  /** 3つまで。別のソースから選ぶ枠 */
  veteranSlots: string[]

  friends: OfficialFriend[]
  generalItems: Record<string, boolean>
  playbookItems: Record<string, boolean>

  teamwork: Record<string, boolean>
  planning: Record<string, PlanningSlot>
  gatherInfo: string[]
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
  official: OfficialSheet
  drives: ChoiceList[]
  heritageAbilities: ChoiceList[]
  backgroundAbilities: ChoiceList[]
  crewRole: string
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
