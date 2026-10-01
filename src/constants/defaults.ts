import type { Character, Crew, PlaybookId, SheetState } from '../types/character'
import { SCHEMA_VERSION } from '../types/character'
import { ACTIONS, equipmentFor, PLAYBOOKS } from './playbooks'
import { createId, nowIso } from '../lib/id'
export function defaultCrew(): Crew {
  return {
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
  }
}
export function defaultSheet(playbookId: PlaybookId = 'cutter'): SheetState {
  const book = PLAYBOOKS[playbookId]
  const ratings: SheetState['ratings'] = {
    hunt: 0,
    study: 0,
    survey: 0,
    tinker: 0,
    finesse: 0,
    prowl: 0,
    skirmish: 0,
    wreck: 0,
    attune: 0,
    command: 0,
    consort: 0,
    sway: 0,
  }
  for (const action of ACTIONS) ratings[action.id] = book.initialRatings[action.id] ?? 0
  return {
    playbookId,
    creationComplete: false,
    identity: {
      name: '',
      alias: '',
      look: '',
      heritageId: '',
      heritageDetail: '',
      backgroundId: '',
      backgroundDetail: '',
      viceId: '',
      viceDetail: '',
      purveyor: '',
    },
    ratings,
    xp: { playbook: 0, insight: 0, prowess: 0, resolve: 0 },
    abilities: [],
    friends: book.friends.map((friend) => ({ ...friend, relation: 'neutral' })),
    equipment: Object.fromEntries(equipmentFor(playbookId).map((item) => [item.id, 0])),
    itemUses: Object.fromEntries(
      equipmentFor(playbookId)
        .filter((item) => item.uses)
        .map((item) => [item.id, Array.from({ length: item.uses ?? 0 }, () => '')]),
    ),
    customItems: [],
    score: { load: 'normal', planId: '', detail: '' },
    gatherNotes: {},
    stress: 0,
    traumas: [],
    harm: { level1: ['', ''], level2: ['', ''], level3: '', fatal: '' },
    healing: 0,
    armorUses: { armor: false, heavy: false, special: false },
    coin: 0,
    stash: 0,
    carriedCoin: 0,
    notes: '',
    clocks: [],
    crew: defaultCrew(),
  }
}
export function createDefaultCharacter(playbookId: PlaybookId = 'cutter'): Character {
  const at = nowIso()
  return {
    ...defaultSheet(playbookId),
    schemaVersion: SCHEMA_VERSION,
    id: createId('char'),
    createdAt: at,
    updatedAt: at,
    log: [],
    legacy: [],
  }
}
