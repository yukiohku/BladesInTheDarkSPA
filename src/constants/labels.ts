/**
 * 画面に出す日本語表記はすべてこのファイルに集約しています。
 * 用語を変えたいときはここだけを編集すれば全体に反映されます。
 *
 * 注: 公式の日本語ルールブックは存在しないため、用語は日本のコミュニティで
 * よく使われる訳語を基準にしています。
 */
import type { AttributeKey } from '../types/character'
import type { ChangeOperation, ResourceKey } from '../types/changelog'

export const APP_NAME = '刃物 in the Dark'
export const APP_SUBTITLE = 'キャラクターシート管理ツール'

export const ATTRIBUTE_LABELS: Record<AttributeKey, string> = {
  edge: '際どさ',
  hooligan: '喧嘩',
  savvy: '悪巧み',
  cool: '冷静',
  grit: '頑強',
  gumshoe: '密偵',
  charm: '魅力',
  strange: '怪異',
}

export const ATTRIBUTE_ORDER: AttributeKey[] = [
  'edge',
  'hooligan',
  'savvy',
  'cool',
  'grit',
  'gumshoe',
  'charm',
  'strange',
]

export const ATTRIBUTE_MAX = 4

export const LABELS = {
  name: '名前',
  pronouns: '呼び名・代名詞',
  heritage: '血統',
  background: '経歴',
  summary: '概要',

  drives: '動機',
  heritageAbilities: '血統の異能',
  backgroundAbilities: '経歴の異能',
  crewRole: 'クルーでの役割',
  roleAbilities: '役割の異能',
  specialAbilities: '異能',
  vices: '悪癖',

  edges: 'エッジ',
  edgesAlt: 'リリー',
  stress: 'ストレス',
  stressMax: 'ストレス上限',
  traumas: 'トラウマ',
  flaws: '欠点',
  armor: '鎧',
  armorEffect: '鎧の効果',
  harm: '傷',
  harmClocks: '傷のクロック',

  weapons: '装備',
  dramaticUnderscores: '華麗な描写',
  customMoves: 'カスタムテクニック',
  notes: 'メモ',

  crew: 'クルー',
  crewName: 'クルー名',
  crewType: 'クルーの種類',
  crewTier: 'ティア',
  crewCharter: '綱領',
  crewSummary: '概要',
  crewHold: '掌握（奪ったもの）',
  crewInfluence: '影響力',
  crewTerritory: '縄張り',
  crewLair: '隠れ家',
  crewLiabilities: '負債',
  crewServices: 'YNC（業態）',
  crewItemRoster: '品ぞろえ',
  crewRoster: 'クルーメンバー',
  crewNotes: 'クルーのメモ',

  log: '変動履歴',
} as const

export const HARM_LEVELS = ['無事', '軽傷', '重傷', '命の危機', '死亡'] as const

export interface ResourceMeta {
  key: ResourceKey
  label: string
  min: number
  max: number
  unit: string
  verbs: Record<ChangeOperation, string>
  pastTense: Record<ChangeOperation, string>
  reasons: Record<ChangeOperation, string[]>
  detailLabel: string
}

export const RESOURCES: Record<ResourceKey, ResourceMeta> = {
  edges: {
    key: 'edges',
    label: 'エッジ（リリー）',
    min: 0,
    max: 4,
    unit: 'エッジ',
    verbs: { increase: '獲得', decrease: '消費' },
    pastTense: { increase: 'エッジを獲得', decrease: 'エッジを消費' },
    reasons: {
      increase: ['大成功（クリティカル）', 'ダウンタイム行動', '特殊能力・その他'],
      decrease: ['悪癖の軽減（2）', 'その他'],
    },
    detailLabel: '内容',
  },
  stress: {
    key: 'stress',
    label: 'ストレス',
    min: 0,
    max: 9,
    unit: 'ストレス',
    verbs: { increase: '承受', decrease: '軽減' },
    pastTense: { increase: 'ストレス承受', decrease: 'ストレス軽減' },
    reasons: {
      increase: ['押して賭ける（耐える）', '支援に協力', '意志だけで抵抗', 'その他'],
      decrease: ['休憩で解消', 'ダウンタイムで解消', 'その他'],
    },
    detailLabel: '内容',
  },
  harm: {
    key: 'harm',
    label: '傷',
    min: 0,
    max: 4,
    unit: '段階',
    verbs: { increase: '発生', decrease: '回復' },
    pastTense: { increase: '傷が発生', decrease: '傷が回復' },
    reasons: {
      increase: ['判定の失敗（1〜3）', '抵抗の失敗', '事故・その他'],
      decrease: ['ダウンタイムで回復', '治療・その他'],
    },
    detailLabel: '傷の種類',
  },
  trauma: {
    key: 'trauma',
    label: 'トラウマ',
    min: 0,
    max: Infinity,
    unit: '件',
    verbs: { increase: '受入', decrease: '克服' },
    pastTense: { increase: 'トラウマを受入れ', decrease: 'トラウマを克服' },
    reasons: {
      increase: ['ストレスが上限に達した', 'その他の恐怖', 'その他'],
      decrease: ['ダウンタイムで克服'],
    },
    detailLabel: 'トラウマの内容',
  },
}

export const RESOURCE_ORDER: ResourceKey[] = ['edges', 'stress', 'harm', 'trauma']

export const MESSAGE = {
  saved: '保存しました',
  loadFailed: '保存済みのデータを読み込めませんでした。既定値で開始します。',
  importOk: '取り込みました',
  importFailed: 'JSONを読み込めませんでした',
  exportOk: '書き出しました',
  resetConfirm: '現在のキャラクターを初期化します。よろしいですか？',
  resetDone: '初期化しました',
  undoDone: '取り消しました',
  copied: 'クリップボードにコピーしました',
} as const

export const VALIDATION = {
  notObject: 'JSONの形式が正しくありません（オブジェクトではありません）。',
  badCharacter: 'キャラクターシートの構造が正しくありません。',
  futureSchema: 'より新しいバージョンのファイルです。',
} as const
