/**
 * 公式キャラクターシート（Blades in the Dark v8.2）に基づく playbook データ。
 *
 * 構造と名称は公式PDF（blades_sheets_v8_2_Cutter.pdf）から読み取ったもの。
 * 効果文は参考訳です。確定した解釈はルールブックで確認してください。
 * 用語を変えたい場合はここだけを編集すればシート全体に反映されます。
 */

export interface NamedItem {
  id: string
  /** 英語名（公式の表記） */
  name: string
  /** 日本語訳。あれば「日本語 + 英語」の順で表示する */
  ja?: string
}

export interface AbilityOption {
  id: string
  name: string
  ja?: string
  effect: string
}

export interface PlanningOption {
  id: string
  name: string
  prompt: string
}

export interface Playbook {
  id: string
  title: string
  descriptor: string

  heritages: NamedItem[]
  backgrounds: NamedItem[]
  vices: NamedItem[]
  traumas: NamedItem[]

  insight: NamedItem[]
  prowess: NamedItem[]
  resolve: NamedItem[]

  abilities: AbilityOption[]
  friends: string[]

  itemsGeneral: NamedItem[]
  itemsPlaybook: NamedItem[]

  loadLimits: { light: number; normal: number; heavy: number }

  teamwork: NamedItem[]
  planning: PlanningOption[]
  gatherInfo: string[]
}

/**
 * 傷の行ごとの効果と欄数。
 * 官方のシートではレベル3は1欄、レベル2と1は2欄（縦線で分かれている）。
 */
export const HARM_ROWS: { level: number; effect: string; cells: number }[] = [
  { level: 3, effect: '手助けが必要', cells: 1 },
  { level: 2, effect: '−1d', cells: 2 },
  { level: 1, effect: '効果 −1', cells: 2 },
]

/**
 * 血統名は，显 عشの固有名詞なので英語のまま残しています。
 * 日本語訳を当てるより原文に忠実なほうが安全です。
 */
export const CUTTER: Playbook = {
  id: 'cutter',
  title: 'CUTTER',
  descriptor: 'A DANGEROUS & INTIMIDATING FIGHTER',

  heritages: [
    { id: 'akoros', name: 'Akoros' },
    { id: 'dagger-isles', name: 'The Dagger Isles' },
    { id: 'iruvia', name: 'Iruvia' },
    { id: 'severos', name: 'Severos' },
    { id: 'skovlan', name: 'Skovlan' },
    { id: 'tycheros', name: 'Tycheros' },
  ],

  backgrounds: [
    { id: 'academic', name: '学者' },
    { id: 'labor', name: '労働' },
    { id: 'law', name: '法律' },
    { id: 'military', name: '軍人' },
    { id: 'noble', name: '貴族' },
    { id: 'underworld', name: '裏社会' },
  ],

  vices: [
    { id: 'faith', name: '信仰' },
    { id: 'gambling', name: '賭' },
    { id: 'luxury', name: '贅沢' },
    { id: 'obligation', name: '義務' },
    { id: 'pleasure', name: '快楽' },
    { id: 'stupor', name: '陶酔' },
    { id: 'weird', name: '怪異' },
  ],

  traumas: [
    { id: 'cold', name: '冷酷' },
    { id: 'haunted', name: '憑依' },
    { id: 'obsessed', name: '執念' },
    { id: 'paranoid', name: '妄執' },
    { id: 'reckless', name: '無鉄砲' },
    { id: 'soft', name: '軟弱' },
    { id: 'unstable', name: '不安定' },
    { id: 'vicious', name: '悪性' },
  ],

  insight: [
    { id: 'hunt', name: 'Hunt', ja: '狩り' },
    { id: 'study', name: 'Study', ja: '研究' },
    { id: 'survey', name: 'Survey', ja: '踏査' },
    { id: 'tinker', name: 'Tinker', ja: '工作' },
  ],

  prowess: [
    { id: 'finesse', name: 'Finesse', ja: '技巧' },
    { id: 'prowl', name: 'Prowl', ja: '忍び' },
    { id: 'skirmish', name: 'Skirmish', ja: '遭遇戦' },
    { id: 'wreck', name: 'Wreck', ja: '破壊' },
  ],

  resolve: [
    { id: 'attune', name: 'Attune', ja: '調律' },
    { id: 'command', name: 'Command', ja: '指揮' },
    { id: 'consort', name: 'Consort', ja: '慰安' },
    { id: 'sway', name: 'Sway', ja: '扇動' },
  ],

  abilities: [
    {
      id: 'battleborn',
      name: 'Battleborn',
      ja: '天生の戦士',
      effect: '特殊鎧を使い切って、攻撃の傷を軽減できる。戦いの途中で自分を追い込むこともできる。',
    },
    {
      id: 'bodyguard',
      name: 'Bodyguard',
      ja: '護衛',
      effect: '仲間を守る判定で +1d。状況の脅威を探って情報を集めるなら +1効果。',
    },
    {
      id: 'ghost-fighter',
      name: 'Ghost Fighter',
      ja: '幽霊の戦士',
      effect: '素手・近接武器・道具に霊の力を込める。超常のものとの戦いで威力が上がる。霊を掴んで捕らえられます。',
    },
    {
      id: 'leader',
      name: 'Leader',
      ja: '指揮官',
      effect: '戦いで群衆を指揮すると、崩れかけた組織が戦いを続けます（傷3を受けても倒れない）。その組織は +1効果と鎧1を得る。',
    },
    {
      id: 'mule',
      name: 'Mule',
      ja: '驢馬',
      effect: '負荷の上限が上がる。軽5 / 標準7 / 重8。',
    },
    {
      id: 'not-to-be-trifled-with',
      name: 'Not to Be Trifled With',
      ja: '舐められる柄ではない',
      effect: '自分を追い込んで、普通人には及ばない력을1つだけ使える：小さなグループと互角に戦える。',
    },
    {
      id: 'savage',
      name: 'Savage',
      ja: '野獣',
      effect: '暴力を行うときは、強く怯えさせることができる。怯えている対象を指揮するなら +1d。',
    },
    {
      id: 'vigorous',
      name: 'Vigorous',
      ja: '逞しい',
      effect: '傷の回復が速い。治療クロックを1つ恒久的に埋める。治療判定で +1d。',
    },
  ],

  friends: ['Marlane', 'Chael', 'Mercy', 'Grace', 'Sawtooth'],

  itemsGeneral: [
    { id: 'blade', name: 'A Blade or Two', ja: '短刀' },
    { id: 'knives', name: 'Throwing Knives', ja: '投げナイフ' },
    { id: 'pistol', name: 'A Pistol', ja: '拳銃' },
    { id: 'pistol2', name: 'A 2nd Pistol', ja: '拳銃2丁' },
    { id: 'unusual-weapon', name: 'An Unusual Weapon', ja: '変わった武器' },
    { id: 'documents', name: 'Documents', ja: '文書' },
  ],

  itemsPlaybook: [
    { id: 'large-weapon', name: 'A Large Weapon', ja: '大型武器' },
    { id: 'armor', name: 'Armor', ja: '鎧' },
    { id: 'armor-heavy', name: '+Heavy', ja: '＋重装' },
    { id: 'burglary-gear', name: 'Burglary Gear', ja: '窃盗具' },
    { id: 'climbing-gear', name: 'Climbing Gear', ja: '登攀具' },
    { id: 'arcane-implements', name: 'Arcane Implements', ja: '魔術具' },
    { id: 'subterfuge-supplies', name: 'Subterfuge Supplies', ja: '偽装用品' },
    { id: 'demolition-tools', name: 'Demolition Tools', ja: '爆破工具' },
    { id: 'tinkering-tools', name: 'Tinkering Tools', ja: '工作道具' },
    { id: 'lantern', name: 'Lantern', ja: 'ランタン' },
  ],

  loadLimits: { light: 3, normal: 5, heavy: 6 },

  teamwork: [
    { id: 'assist', name: '仲間を助ける' },
    { id: 'lead', name: '集団行動を指揮する' },
    { id: 'protect', name: '仲間を守る' },
    { id: 'set-up', name: '仲間を仕掛ける' },
  ],

  planning: [
    { id: 'assault', name: 'Assault', prompt: '攻撃の起点' },
    { id: 'occult', name: 'Occult', prompt: '秘術の力' },
    { id: 'deception', name: 'Deception', prompt: '手法' },
    { id: 'social', name: 'Social', prompt: 'つながり' },
    { id: 'stealth', name: 'Stealth', prompt: '入口' },
    { id: 'transport', name: 'Transport', prompt: '経路' },
  ],

  gatherInfo: [
    'どうやればあの人たちにダメージを与えられない？',
    '誰が最も私を恐れている？',
    '誰が最もここでの危険か？',
    'あの人たちは何をするつもりなのか？',
    'どうやればあの人たちを［X］にできる？',
    'あの人たちは本当のことを言っているのか？',
    'ここでの本当は何なのか？',
  ],
}

export const PLAYBOOKS: Record<string, Playbook> = {
  [CUTTER.id]: CUTTER,
}

export const VETERAN_SLOTS = 3
export const RATING_MAX = 4
export const COIN_MAX = 9
export const XP_TRACK_MAX = 6
export const HEALING_CLOCK_SEGMENTS = 6
export const HARM_MAX = 3
export const STRESS_BOXES = 9
