import type { ResourceKey } from '../types/changelog'
export const RESOURCE_LABELS: Record<ResourceKey, string> = {
  stress: 'ストレス',
  coin: 'コイン',
  stash: '貯蓄',
  playbook: 'プレイブックXP',
  insight: 'Insight XP',
  prowess: 'Prowess XP',
  resolve: 'Resolve XP',
}
export const LABELS = {
  crewName: 'クルー名',
  crewType: 'クルーの種類',
  crewTier: 'ティア',
  crewCharter: '綱領',
  crewSummary: '概要',
  crewHold: '掌握',
  crewInfluence: '影響力',
  crewTerritory: '縄張り',
  crewLair: '隠れ家',
  crewLiabilities: '負債',
  crewServices: '業態',
  crewItemRoster: '品ぞろえ',
  crewRoster: 'クルーメンバー',
  crewNotes: 'クルーのメモ',
} as const
export const MESSAGE = {
  friendEditHint: '知人との関係の変更は「編集」→「初期設定」で行います。',
  ratingEditHint: 'アクション値の変更は「編集」→「初期設定」で行います。',
  exportOk: 'JSONを書き出しました。',
  copied: 'コピーしました。',
  copyFailed: 'コピーできませんでした。JSONをダウンロードしてください。',
  noBackup: 'バックアップを読み込めませんでした。',
  restored: '取り込み前のシートに戻しました。',
  importOk: 'JSONを読み込みました。',
  resetConfirm:
    '新しいキャラクターを作成します。現在のシートはバックアップに保存します。よろしいですか？',
  resetDone: '新しいキャラクターを作成しました。',
}
