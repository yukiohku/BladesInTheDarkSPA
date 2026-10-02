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
  importOk: 'JSONを読み込みました。',
  resetConfirm:
    '新しいキャラクターを作成します。現在のシートはバックアップに保存します。よろしいですか？',
  resetDone: '新しいキャラクターを作成しました。',
}
export const SETUP_LABELS = {
  heritageDetailPlaceholder: '例：港で荷運びをする一家。祖父母が移住し、自分はドスコヴォルで育った。',
}
export const PLAYBOOK_LABELS = {
  unselected: '未選択',
  sheetTitle: 'WHO ARE YOU?',
  sheetHint: 'プレイブック未選択。「編集」→「初期設定」で選びます。',
  selectFirst: '「初期設定」でプレイブックを選んでください。',
  friends: '知人',
  friendsHint: 'プレイブックを選ぶと知人が表示されます。',
  items: '固有装備',
  itemsHint: 'プレイブックを選ぶと固有装備が表示されます。',
  abilitiesHint: 'プレイブックを選ぶと特殊能力を取得できます。',
  allocationHint: 'プレイブックを選ぶと固定点が入り、追加4点を配分できます。',
  gatherHint: 'プレイブックを選ぶと質問例が表示されます。',
}
export const EQUIPMENT_LABELS = {
  loadExceeded: '選択した上限を超えています。卓の裁定を確認してください。',
}
export const ACTION_ALLOCATION_LABELS = {
  region: 'アクションの配分',
  initial: '初期配分',
  growth: '成長分',
  confirm: '初期配分を確定',
  revise: '初期配分を修正',
  cancel: '訂正をやめる',
  allocating: '追加4点を配分します。各アクションは最大2。',
  growthHint: '確定した初期点を保ち、各アクションを4まで記録できます。',
  revisionHint: '初期配分だけを訂正します。確定時に反映し、成長分は保持します。',
  capacityHint: '成長分を含めて4を超える点は追加できません。',
  manualHint: '能力や卓の裁定による追加点も、確定後に成長分へ記録できます。',
  fixedLegend: '固定点',
  initialLegend: '初期配分',
  growthLegend: '成長分',
  initialLocked: '初期配分・修正で変更',
  unavailable: '初期配分は追加4点・各最大2。成長分を含めた上限は4です。',
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
