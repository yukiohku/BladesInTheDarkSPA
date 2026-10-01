import type { ResourceKey } from '../types/resources'
export const RESOURCE_LABELS: Record<ResourceKey, string> = {
  stress: 'ストレス',
  coin: 'コイン',
  stash: '貯蓄',
  playbook: 'プレイブックXP',
  insight: 'Insight XP',
  prowess: 'Prowess XP',
  resolve: 'Resolve XP',
}
export const MESSAGE = {
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
