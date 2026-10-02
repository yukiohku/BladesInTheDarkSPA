import type { ActionId } from '../types/character'

// 公式SRD Actions & Attributes の参考訳・要約。使用例は用途を限定しない。
// https://bladesinthedark.com/actions-attributes
export const ACTION_DESCRIPTIONS: Record<ActionId, {
  summary: string
  examples: string
  comparison: string
}> = {
  hunt: {
    summary: '標的を追跡し、居場所を突き止めたり、狙いを定めて仕留めたりする技能。',
    examples: '逃げた相手の足跡を追う、待ち伏せを準備する、離れた場所から狙撃する。',
    comparison: '目の前で入り乱れて戦うなら〈乱戦〉が向くこともあります。',
  },
  study: {
    summary: '細部をじっくり調べ、証拠や情報の意味を読み解く技能。',
    examples: '帳簿や手紙を調べる、専門的な知識を調査する、相手の表情を分析して嘘を見抜く。',
    comparison: 'その場の状況を広く見渡して判断するなら〈観察〉が向くこともあります。',
  },
  survey: {
    summary: '周囲の状況を見渡し、危険や好機、この先の展開を見極める技能。',
    examples: '異変の兆候に気づく、警備の隙を探す、相手の意図や次の動きを読む。',
    comparison: '資料や人物の細部を掘り下げて分析するなら〈研究〉が向くこともあります。',
  },
  tinker: {
    summary: '道具や機械の仕組みに手を加え、作成・改造・解除する技能。',
    examples: '小道具を作る、錠前や金庫を開ける、警報や罠を解除する。',
    comparison: '乗り物そのものを巧みに操縦するなら〈技巧〉が向くこともあります。',
  },
  finesse: {
    summary: '器用な手さばきや繊細な動き、さりげない注意の誘導を使う技能。',
    examples: '財布をすり取る、乗り物や乗騎を操る、洗練された剣術で決闘する。',
    comparison: '錠前の仕組みを扱うなら〈工作〉、混戦で戦うなら〈乱戦〉が向くこともあります。',
  },
  prowl: {
    summary: '静かに、または身軽に移動し、気づかれずに行動する技能。',
    examples: '見張りの横を忍び抜ける、影に隠れる、屋根を走って飛び移る、物陰から襲う。',
    comparison: 'すでに始まった混戦の中で相手を襲うなら〈乱戦〉が向くこともあります。',
  },
  skirmish: {
    summary: '相手が簡単には逃れられない距離で、直接ぶつかり合って戦う技能。',
    examples: '殴り合う、組みつく、刃物で切り結ぶ、戦いの中で持ち場を確保する。',
    comparison: '作法に沿った剣術の決闘なら〈技巧〉が向くこともあります。',
  },
  wreck: {
    summary: '荒々しい力や破壊工作で、障害を壊したり混乱を起こしたりする技能。',
    examples: '大槌で扉や壁を砕く、爆薬で吹き飛ばす、破壊工作で騒ぎを起こす。',
    comparison: '相手と直接やり合う戦闘なら〈乱戦〉が向くこともあります。',
  },
  attune: {
    summary: '心を開いて神秘的な力に触れ、霊や目に見えないものと関わる技能。',
    examples: '幽霊と意思を通わせる、通常の視覚を超えて周囲を知覚する。',
    comparison: '目に見える状況から手がかりをつかむなら〈観察〉が向くこともあります。',
  },
  command: {
    summary: '威圧や命令、指導によって、相手をすぐに従わせる技能。',
    examples: '脅して道を空けさせる、集団行動で一団を率いる、強い態度で指示を通す。',
    comparison: '親しい関係や人付き合いを通じて働きかけるなら〈交流〉が向くこともあります。',
  },
  consort: {
    summary: '友人や知人と付き合い、人脈や親しさを通じて協力や情報を得る技能。',
    examples: '知人から情報や紹介を得る、好印象を与える、新しい友人を作る。',
    comparison: '相手を言葉で誘導したり、嘘で操ったりするなら〈説得〉が向くこともあります。',
  },
  sway: {
    summary: '嘘、魅力、筋の通った議論で、相手の考えや行動を変える技能。',
    examples: 'もっともらしい嘘をつく、頼みを聞くよう口説く、反論しにくい理屈で納得させる。',
    comparison: '親交を深めるなら〈交流〉、すぐに従わせるなら〈指揮〉が向くこともあります。',
  },
}

export function actionDescriptionText(id: ActionId): string {
  const description = ACTION_DESCRIPTIONS[id]
  return `${description.summary}\n使用例：${description.examples}\n${description.comparison}`
}
