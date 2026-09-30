import type { ChoiceList, Character } from '../types/character'
import { SCHEMA_VERSION } from '../types/character'
import { createId, nowIso } from '../lib/id'

function emptyList(count: number, label: string): ChoiceList[] {
  return Array.from({ length: count }, () => ({ id: createId('pick'), name: '', note: label }))
}

export function createDefaultCharacter(): Character {
  const timestamp = nowIso()
  return {
    schemaVersion: SCHEMA_VERSION,
    id: createId('char'),
    createdAt: timestamp,
    updatedAt: timestamp,

    basics: {
      name: '',
      pronouns: '',
      heritageId: '',
      heritageName: '',
      backgroundId: '',
      backgroundName: '',
      summary: '',
    },

    attributes: {
      edge: 2,
      hooligan: 2,
      savvy: 2,
      cool: 2,
      grit: 2,
      gumshoe: 2,
      charm: 0,
      strange: 0,
    },

    drives: emptyList(3, '動機を記入'),
    heritageAbilities: emptyList(2, '血統の異能を記入'),
    backgroundAbilities: emptyList(3, '経歴の異能を記入'),
    crewRole: '',
    roleAbilities: emptyList(1, '役割の異能を記入'),
    specialAbilities: emptyList(1, '異能を記入'),
    vices: emptyList(3, '悪癖を記入'),

    crew: {
      name: '',
      typeId: '',
      typeName: '',
      tier: 1,
      charter: '',
      summary: '',
      hold: 0,
      influence: 0,
      holdTotal: 6,
      influenceTotal: 6,
      territory: '',
      lair: '',
      liabilities: [],
      services: [],
      itemRoster: [],
      roster: [],
      notes: '',
    },

    edges: 0,
    stress: 0,
    stressMax: 9,
    traumas: [],
    flaws: emptyList(3, '欠点を記入'),
    armor: 0,
    armorEffect: 0,
    harm: 0,
    harmClocks: [],

    weapons: [],
    dramaticUnderscores: [],
    customMoves: [],
    notes: '',
    log: [],
  }
}
