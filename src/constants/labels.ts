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
export const ABILITY_LABELS = {
  remove: '取得を取り消す',
  confirmRemoval: '取り消しを確定',
  cancel: 'キャンセル',
  acquired: '取得済み',
  acquire: '取得',
  acquireAgain: '追加取得',
  editHint: '入力訂正は、各能力の「取得を取り消す」から行えます。',
}
export const ABILITY_MESSAGES = {
  removeTitle: (name: string) => `${name}の取得を取り消しますか？`,
  removeData: 'この能力に記録した内容（名前・効果・選択内容・メモ・使用回数）も削除します。',
  stressLimit: (before: number, after: number) => `ストレス上限：${before} → ${after}。`,
  stressValue: (before: number, after: number) => `現在のストレス：${before} → ${after}（上限に合わせます）。`,
  loadLimit: (before: string, after: string) => `Load上限（軽／中／重）：${before} → ${after}。`,
  loadExceeded: '宣言済み装備のLoadが変更後の上限を超えます。装備の宣言は保持します。',
  specialArmor: '特殊鎧が使用できなくなり、使用済みの記録も解除します。',
  healing: '治療クロックの恒久区画がなくなります。現在の治療クロックは保持し、訂正は手動で行います。',
}
