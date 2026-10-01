import type { ActionId, PlaybookId, RatingGroup } from '../types/character'
export interface NamedItem {
  id: string
  name: string
  ja?: string
}
export interface AbilityOption extends NamedItem {
  effect: string
  repeatable?: boolean
  choices?: NamedItem[]
  noteLabel?: string
  uses?: number
  specialArmor?: boolean
  stressBonus?: number
  loadLimits?: { light: number; normal: number; heavy: number }
  healingMinimum?: number
  xpTrigger?: string
}
export interface EquipmentOption extends NamedItem {
  load: number
  quantity: number
  uses?: number
  requires?: string
}
export interface Playbook {
  id: PlaybookId
  title: string
  descriptor: string
  initialRatings: Partial<Record<ActionId, number>>
  abilities: AbilityOption[]
  friendsTitle: string
  friends: NamedItem[]
  items: EquipmentOption[]
  xpTrigger: string
  gatherInfo: string[]
  source: string
}
export const RATING_MAX = 4
export const COIN_MAX = 4
export const STASH_MAX = 40
export const PLAYBOOK_XP_MAX = 8
export const ATTRIBUTE_XP_MAX = 6
export const HEALING_CLOCK_SEGMENTS = 4
export const STRESS_BOXES = 9
export const TRAUMA_MAX = 4
export const LOAD_LIMITS = { light: 3, normal: 5, heavy: 6 }
export const HARM_ROWS = [
  { level: 3, effect: '手助けまたは自分を追い込むことが必要', cells: 1 },
  { level: 2, effect: '判定 −1d', cells: 2 },
  { level: 1, effect: '効果が低下', cells: 2 },
]
export const ACTION_GROUPS: {
  id: RatingGroup
  name: string
  ja: string
  items: { id: ActionId; name: string; ja: string }[]
}[] = [
  {
    id: 'insight',
    name: 'INSIGHT',
    ja: '洞察',
    items: [
      { id: 'hunt', name: 'Hunt', ja: '狩り' },
      { id: 'study', name: 'Study', ja: '研究' },
      { id: 'survey', name: 'Survey', ja: '観察' },
      { id: 'tinker', name: 'Tinker', ja: '工作' },
    ],
  },
  {
    id: 'prowess',
    name: 'PROWESS',
    ja: '身体',
    items: [
      { id: 'finesse', name: 'Finesse', ja: '技巧' },
      { id: 'prowl', name: 'Prowl', ja: '隠密' },
      { id: 'skirmish', name: 'Skirmish', ja: '乱戦' },
      { id: 'wreck', name: 'Wreck', ja: '破壊' },
    ],
  },
  {
    id: 'resolve',
    name: 'RESOLVE',
    ja: '意志',
    items: [
      { id: 'attune', name: 'Attune', ja: '同調' },
      { id: 'command', name: 'Command', ja: '指揮' },
      { id: 'consort', name: 'Consort', ja: '交流' },
      { id: 'sway', name: 'Sway', ja: '説得' },
    ],
  },
]
export const ACTIONS = ACTION_GROUPS.flatMap((group) => group.items)
export interface HeritageOption extends NamedItem {
  summary: string
  description: string
}
// 公式 Player's Kit v8.2、PDF 25ページ「The Shattered Isles」の参考訳・要約。
export const HERITAGES: HeritageOption[] = [
  {
    id: 'akoros', name: 'Akoros',
    summary: '帝国発祥の地。捕鯨・鉱業で栄える港湾都市',
    description: '帝国発祥の地で、ドスコヴォルもこの地域にあります。石化した暗い森と岩がちな丘が広がり、沿岸都市は巨獣リヴァイアサンの狩猟と内陸の鉱山で富を得ています。',
  },
  {
    id: 'dagger-isles', name: 'The Dagger Isles',
    summary: '大災厄で変貌した密林に覆われる熱帯の島々',
    description: '熱帯の島々を覆う密林は、大災厄の魔法で暗く歪んだ姿になりました。幽霊から集落を守る電撃障壁なしで暮らしているとも噂されますが、その方法は謎です。',
  },
  {
    id: 'iruvia', name: 'Iruvia',
    summary: '黒い砂漠と火山の地。悪魔が権力を握るとの噂',
    description: '黒い砂漠、黒曜石の山々、激しく噴火する火山のある地域です。悪魔が公然と権力の座についているとも噂されています。',
  },
  {
    id: 'severos', name: 'Severos',
    summary: '風吹く平原。馬と暮らす自由な部族もいる',
    description: '暗い低木や棘のある植物が広がる、風の強い平原です。沿岸の帝国都市の外では、幽霊を狩る馬とともに死の荒野で物資を探す、自由な部族も暮らしています。',
  },
  {
    id: 'skovlan', name: 'Skovlan',
    summary: '寒冷な山とツンドラ。帝国支配に最後まで抵抗',
    description: '寒冷な山々と荒れたツンドラのある地域です。帝国の支配に最後まで抵抗した土地として知られています。',
  },
  {
    id: 'tycheros', name: 'Tycheros',
    summary: '帝国から隔絶した遠い地。悪魔の血筋との噂',
    description: '帝国から隔絶した遠い土地です。その人々の家系には悪魔の血が流れていると噂されています。',
  },
]
export const BACKGROUNDS: NamedItem[] = [
  { id: 'academic', name: '学者' },
  { id: 'labor', name: '労働者' },
  { id: 'law', name: '法律関係者' },
  { id: 'trade', name: '商人' },
  { id: 'military', name: '軍人' },
  { id: 'noble', name: '貴族' },
  { id: 'underworld', name: '裏社会' },
]
export const VICES: NamedItem[] = [
  { id: 'faith', name: '信仰' },
  { id: 'gambling', name: '賭博' },
  { id: 'luxury', name: '贅沢' },
  { id: 'obligation', name: '義務' },
  { id: 'pleasure', name: '快楽' },
  { id: 'stupor', name: '陶酔' },
  { id: 'weird', name: '怪異' },
]
export const TRAUMAS: NamedItem[] = [
  { id: 'cold', name: '冷酷' },
  { id: 'haunted', name: '過去の恐怖' },
  { id: 'obsessed', name: '執着' },
  { id: 'paranoid', name: '猜疑' },
  { id: 'reckless', name: '無謀' },
  { id: 'soft', name: '軟弱' },
  { id: 'unstable', name: '不安定' },
  { id: 'vicious', name: '残忍' },
]
export const PLANS = [
  { id: 'assault', name: '襲撃', prompt: '攻撃の起点' },
  { id: 'occult', name: '秘術', prompt: '秘術の力' },
  { id: 'deception', name: '欺き', prompt: '手法' },
  { id: 'social', name: '社交', prompt: 'つながり' },
  { id: 'stealth', name: '潜入', prompt: '入口' },
  { id: 'transport', name: '輸送', prompt: '経路' },
]
export const COMMON_XP_TRIGGERS = [
  '信念・動機・出自・経歴を表現した。',
  '悪癖やトラウマに起因する問題に苦しんだ。',
]
export const ALCHEMICALS: NamedItem[] = [
  'Alcahest',
  'Binding Oil',
  'Drift Oil',
  'Drown Powder',
  'Eyeblind Poison',
  'Fire Oil',
  'Grenade',
  'Quicksilver',
  'Skullfire Poison',
  'Smoke Bomb',
  'Spark (drug)',
  'Standstill Poison',
  'Trance Powder',
].map((name) => ({ id: name, name }))
export function gear(
  id: string,
  name: string,
  ja: string,
  load = 1,
  quantity = 1,
  uses?: number,
  requires?: string,
): EquipmentOption {
  return { id, name, ja, load, quantity, uses, requires }
}
export const GENERAL_ITEMS: EquipmentOption[] = [
  gear('blade', 'A Blade or Two', '短刀'),
  gear('knives', 'Throwing Knives', '投げナイフ'),
  gear('pistol', 'A Pistol', '拳銃'),
  gear('pistol2', 'A 2nd Pistol', '2丁目の拳銃'),
  gear('large-weapon', 'A Large Weapon', '大型武器', 2),
  gear('unusual-weapon', 'An Unusual Weapon', '変わった武器'),
  gear('armor', 'Armor', '鎧', 2),
  gear('armor-heavy', '+Heavy', '追加の重装', 3, 1, undefined, 'armor'),
  gear('burglary-gear', 'Burglary Gear', '窃盗具'),
  gear('climbing-gear', 'Climbing Gear', '登攀具', 2),
  gear('arcane-implements', 'Arcane Implements', '秘術具'),
  gear('documents', 'Documents', '文書'),
  gear('subterfuge-supplies', 'Subterfuge Supplies', '偽装用品'),
  gear('demolition-tools', 'Demolition Tools', '爆破工具', 2),
  gear('tinkering-tools', 'Tinkering Tools', '工作道具'),
  gear('lantern', 'Lantern', 'ランタン'),
]
function ability(
  book: PlaybookId,
  id: string,
  name: string,
  ja: string,
  effect: string,
  extra: Partial<AbilityOption> = {},
): AbilityOption {
  return { id: `${book}:${id}`, name, ja, effect, ...extra }
}
function friends(book: PlaybookId, entries: string[]): NamedItem[] {
  return entries.map((name, index) => ({ id: `${book}:friend-${index}`, name }))
}
const commonQuestions = ['相手は何をするつもりか？', 'どうすれば相手を［X］にできるか？']
const lastQuestion = 'ここで本当は何が起きているか？'
const pdf = (book: string) =>
  `https://bladesinthedark.com/sites/default/files/sheets/blades_sheets_v8_2_${book}.pdf`
// 英語版公式無料シート v8.2（2026-10-01取得）に基づく参考訳・要約。
export const PLAYBOOKS: Record<PlaybookId, Playbook> = {
  cutter: {
    id: 'cutter',
    title: 'CUTTER',
    descriptor: '戦闘と威圧を得意とする戦士',
    initialRatings: { skirmish: 2, command: 1 },
    source: pdf('Cutter'),
    abilities: [
      ability(
        'cutter',
        'battleborn',
        'Battleborn',
        '生まれながらの戦士',
        '特殊鎧を消費して戦闘の攻撃による傷に抵抗する、または戦闘中に自分を追い込む。',
        { specialArmor: true },
      ),
      ability(
        'cutter',
        'bodyguard',
        'Bodyguard',
        '護衛',
        '仲間を守るときの抵抗判定に＋1d。現在の状況で脅威を予測する情報収集は＋1効果。',
      ),
      ability(
        'cutter',
        'ghost-fighter',
        'Ghost Fighter',
        '霊との戦い',
        '素手・近接武器・道具に霊の力を込め、超常の敵に威力を発揮する。霊を掴んで拘束できる。',
      ),
      ability(
        'cutter',
        'leader',
        'Leader',
        '指揮官',
        '戦闘で指揮する集団は通常なら崩れる状況でも戦い続け、レベル3の傷でも離脱しない。＋1効果と鎧1を得る。',
      ),
      ability('cutter', 'mule', 'Mule', '荷運び', 'Load上限は軽5・標準7・重8になる。', {
        loadLimits: { light: 5, normal: 7, heavy: 8 },
      }),
      ability(
        'cutter',
        'not-to-be-trifled-with',
        'Not to Be Trifled With',
        '侮れない相手',
        '自分を追い込むと、人間離れした力業を行う、または近接戦で小集団と互角に戦うことができる。',
      ),
      ability(
        'cutter',
        'savage',
        'Savage',
        '獰猛',
        '暴力を振るうと特に恐ろしい。怯えた相手へのCommandに＋1d。',
      ),
      ability(
        'cutter',
        'vigorous',
        'Vigorous',
        '頑健',
        '治療クロックの1区画を恒久的に埋める。治療判定に＋1d。',
        { healingMinimum: 1 },
      ),
    ],
    friendsTitle: '危険な知人',
    friends: friends('cutter', [
      'Marlane — 拳闘士',
      'Chael — 荒くれ者',
      'Mercy — 冷酷な殺し屋',
      'Grace — 恐喝屋',
      'Sawtooth — 医師',
    ]),
    items: [
      gear('cutter:hand-weapon', 'Fine hand weapon', '良質な片手武器'),
      gear('cutter:heavy-weapon', 'Fine heavy weapon', '良質な重武器', 2),
      gear('cutter:scary', 'Scary weapon or tool', '恐ろしい武器・道具'),
      gear('cutter:manacles', 'Manacles & chain', '手枷と鎖', 0),
      gear('cutter:rage', 'Rage essence vial', '怒りの精髄', 0),
      gear('cutter:charm', 'Spiritbane charm', '霊除けのお守り', 0),
    ],
    xpTrigger: '暴力または強要で難題に取り組んだ。',
    gatherInfo: [
      'どうすれば相手を傷つけられるか？',
      '誰が最も私を恐れているか？',
      '誰がここで最も危険か？',
      ...commonQuestions,
      '相手は本当のことを言っているか？',
      lastQuestion,
    ],
  },
  hound: {
    id: 'hound',
    title: 'HOUND',
    descriptor: '射撃と追跡を得意とする狩人',
    initialRatings: { hunt: 2, survey: 1 },
    source: pdf('Hound'),
    abilities: [
      ability(
        'hound',
        'sharpshooter',
        'Sharpshooter',
        '名射手',
        '自分を追い込むと、武器の通常射程を超える遠距離攻撃、または連射による制圧を行える。',
      ),
      ability(
        'hound',
        'focused',
        'Focused',
        '集中',
        '特殊鎧を消費して不意打ちや精神的な傷に抵抗する、または射撃・追跡で自分を追い込む。',
        { specialArmor: true },
      ),
      ability(
        'hound',
        'ghost-hunter',
        'Ghost Hunter',
        '霊の狩人',
        '狩猟動物が超常の追跡・戦闘で威力を得る。追加取得ごとに動物の秘術能力を1つ選ぶ。',
        {
          repeatable: true,
          choices: [
            { id: 'ghost-form', name: '霊体化' },
            { id: 'mind-link', name: '精神のつながり' },
            { id: 'arrow-swift', name: '矢の速さ' },
          ],
          noteLabel: '狩猟動物の名前・特徴',
        },
      ),
      ability(
        'hound',
        'scout',
        'Scout',
        '斥候',
        '対象の居場所を探す情報収集に＋1効果。準備した場所や迷彩で隠れるとき、発見を避ける判定に＋1d。',
      ),
      ability(
        'hound',
        'survivor',
        'Survivor',
        '生存者',
        '死の荒野の毒霧に免疫を持ち、奇妙な動植物を食べて生きられる。ストレス枠＋1。',
        { stressBonus: 1 },
      ),
      ability(
        'hound',
        'tough-as-nails',
        'Tough as Nails',
        '筋金入り',
        '傷のペナルティは1段階軽くなる。ただしレベル4の傷は致命的。',
      ),
      ability(
        'hound',
        'vengeful',
        'Vengeful',
        '復讐心',
        '自分や大切な相手を傷つけた者への復讐が追加XP条件になる。仲間が協力したならクルーXPも記録する。',
        { xpTrigger: '自分や大切な相手を傷つけた者に復讐した。' },
      ),
    ],
    friendsTitle: '命取りの知人',
    friends: friends('hound', [
      'Steiner — 暗殺者',
      'Celene — 見張り',
      'Melvir — 医師',
      'Veleris — 密偵',
      'Casta — 賞金稼ぎ',
    ]),
    items: [
      gear('hound:pistols', 'Fine pair of pistols', '良質な拳銃の組'),
      gear('hound:rifle', 'Fine long rifle', '良質な長銃', 2),
      gear('hound:ammunition', 'Electroplasmic ammunition', '電霊弾薬'),
      gear('hound:pet', 'A trained hunting pet', '訓練された狩猟動物', 0),
      gear('hound:spyglass', 'Spyglass', '望遠鏡'),
      gear('hound:charm', 'Spiritbane charm', '霊除けのお守り', 0),
    ],
    xpTrigger: '追跡または暴力で難題に取り組んだ。',
    gatherInfo: [
      ...commonQuestions,
      '相手は本当はどう感じているか？',
      '相手の弱点はどこか？',
      '［X］はどこへ行ったか？',
      'どうすれば［X］を見つけられるか？',
      lastQuestion,
    ],
  },
  leech: {
    id: 'leech',
    title: 'LEECH',
    descriptor: '工作と破壊活動を得意とする技術者',
    initialRatings: { tinker: 2, wreck: 1 },
    source: pdf('Leech'),
    abilities: [
      ability(
        'leech',
        'alchemist',
        'Alchemist',
        '錬金術師',
        '錬金術的な発明・製作の判定結果が1段階向上する。特殊な処方を1つ習得して始める。',
        { noteLabel: '習得した処方' },
      ),
      ability(
        'leech',
        'analyst',
        'Analyst',
        '分析家',
        'ダウンタイムごとに、調査や処方・設計の習得に関する長期プロジェクトへ合計2区画の進行を配分できる。',
      ),
      ability(
        'leech',
        'artificer',
        'Artificer',
        '工匠',
        '電霊技術の発明・製作の判定結果が1段階向上する。特殊な設計を1つ習得して始める。',
        { noteLabel: '習得した設計' },
      ),
      ability(
        'leech',
        'fortitude',
        'Fortitude',
        '忍耐',
        '特殊鎧を消費して疲労・衰弱・薬品の結果に抵抗する、または技術や薬品を扱うとき自分を追い込む。',
        { specialArmor: true },
      ),
      ability(
        'leech',
        'ghost-ward',
        'Ghost Ward',
        '霊の結界',
        '秘術的な物質と方法で場所をWreckし、霊を遠ざけるか引き寄せるか選べる。',
      ),
      ability(
        'leech',
        'physicker',
        'Physicker',
        '医師',
        'Tinkerで治療や瀕死の安定化を行い、病気や死体をStudyできる。クルー全員の治療判定に＋1d。',
      ),
      ability(
        'leech',
        'saboteur',
        'Saboteur',
        '破壊工作員',
        'Wreckの作業音を大幅に抑え、破壊の痕跡を通常の観察から隠す。',
      ),
      ability(
        'leech',
        'venomous',
        'Venomous',
        '毒持ち',
        '弾帯の薬物・毒を1つ選んで免疫を得る。自分を追い込むと皮膚・唾液・呼気から分泌できる。',
        { choices: ALCHEMICALS },
      ),
    ],
    friendsTitle: '才知ある知人',
    friends: friends('leech', [
      'Stazia — 薬剤師',
      'Veldren — 精神世界の探究者',
      'Eckerd — 死体泥棒',
      'Jul — 血の売人',
      'Malista — 司祭',
    ]),
    items: [
      gear('leech:tinkering', 'Fine tinkering tools', '良質な工作道具'),
      gear('leech:wrecking', 'Fine wrecking tools', '良質な破壊道具', 2),
      gear('leech:blowgun', 'Blowgun & darts, syringes', '吹き矢・注射器', 0),
      gear('leech:bandolier-1', 'Bandolier (3 uses)', '弾帯1', 1, 1, 3),
      gear('leech:bandolier-2', 'Bandolier (3 uses)', '弾帯2', 1, 1, 3),
      gear('leech:gadgets', 'Gadgets', '仕掛け道具', 1, 3),
    ],
    xpTrigger: '技術または混乱を引き起こす手段で難題に取り組んだ。',
    gatherInfo: [
      ...commonQuestions,
      '相手は本当のことを言っているか？',
      'ここで何を工作できるか？',
      '［X］をしたら何が起きるか？',
      'どうすれば［X］を見つけられるか？',
      lastQuestion,
    ],
  },
  lurk: {
    id: 'lurk',
    title: 'LURK',
    descriptor: '潜入と窃盗を得意とする忍び',
    initialRatings: { prowl: 2, finesse: 1 },
    source: pdf('Lurk'),
    abilities: [
      ability(
        'lurk',
        'infiltrator',
        'Infiltrator',
        '潜入者',
        '警備を突破するとき、品質やTierの影響を受けない。',
      ),
      ability('lurk', 'ambush', 'Ambush', '待ち伏せ', '隠れた状態からの攻撃や罠の発動に＋1d。'),
      ability(
        'lurk',
        'daredevil',
        'Daredevil',
        '命知らず',
        'Desperateの判定に＋1dを得る代わりに、その行動の結果への抵抗判定は−1dになる。',
      ),
      ability(
        'lurk',
        'devils-footsteps',
        'The Devil’s Footsteps',
        '悪魔の足取り',
        '自分を追い込むと、人間離れした運動能力、または敵を混乱させて同士討ちさせる動きを追加で行える。',
      ),
      ability(
        'lurk',
        'expertise',
        'Expertise',
        '熟練',
        '指定アクションで集団行動を指揮すると、失敗者の数にかかわらず受けるストレスは最大1。',
        { choices: ACTIONS },
      ),
      ability(
        'lurk',
        'ghost-veil',
        'Ghost Veil',
        '霊の帳',
        'ストレス2で短時間半実体の影になる。持続を数分にする・透明になる・浮遊する追加効果は各ストレス1。',
        { noteLabel: '使用する追加効果' },
      ),
      ability(
        'lurk',
        'reflexes',
        'Reflexes',
        '反射神経',
        '誰が先に行動するか迷うなら自分が先。同能力同士は同時。',
      ),
      ability(
        'lurk',
        'shadow',
        'Shadow',
        '影',
        '特殊鎧を消費して発見・警備の結果に抵抗する、または運動・隠密で自分を追い込む。',
        { specialArmor: true },
      ),
    ],
    friendsTitle: '怪しい知人',
    friends: friends('lurk', [
      'Telda — 物乞い',
      'Darmot — ブルーコート',
      'Frake — 鍵師',
      'Roslyn Kellis — 貴族',
      'Petra — 市の書記',
    ]),
    items: [
      gear('lurk:lockpicks', 'Fine lockpicks', '良質な開錠具', 0),
      gear('lurk:cloak', 'Fine shadow cloak', '良質な影の外套'),
      gear('lurk:climbing', 'Light climbing gear', '軽量登攀具'),
      gear('lurk:silence', 'Silence potion vial', '静寂の薬', 0),
      gear('lurk:goggles', 'Dark-sight goggles', '暗視ゴーグル'),
      gear('lurk:charm', 'Spiritbane charm', '霊除けのお守り', 0),
    ],
    xpTrigger: '隠密または回避で難題に取り組んだ。',
    gatherInfo: [
      ...commonQuestions,
      '何に注意すべきか？',
      '最もよい侵入経路は？',
      'ここでどこに隠れられるか？',
      'どうすれば［X］を見つけられるか？',
      lastQuestion,
    ],
  },
  slide: {
    id: 'slide',
    title: 'SLIDE',
    descriptor: '欺きと対人交渉を得意とする密偵',
    initialRatings: { sway: 2, consort: 1 },
    source: pdf('Slide'),
    abilities: [
      ability(
        'slide',
        'rooks-gambit',
        'Rook’s Gambit',
        'ルークの策略',
        'ストレス2で、別の行動にも最高のアクション値を使える。技能をどう応用したか説明する。',
      ),
      ability(
        'slide',
        'cloak-and-dagger',
        'Cloak & Dagger',
        '偽装と奇襲',
        '変装などで疑念をそらす判定に＋1d。変装を解くときの驚きで先手を得る。',
      ),
      ability(
        'slide',
        'ghost-voice',
        'Ghost Voice',
        '霊への語り',
        '荒れた霊や悪魔にも通常の人間のように接し、超常との対話で威力を得る。',
      ),
      ability(
        'slide',
        'mirror',
        'Like Looking into a Mirror',
        '鏡を見るように',
        '相手が自分に嘘をついていると常に分かる。',
      ),
      ability(
        'slide',
        'something-on-the-side',
        'A Little Something on the Side',
        '副収入',
        'ダウンタイム終了ごとにStash＋2。',
      ),
      ability(
        'slide',
        'mesmerism',
        'Mesmerism',
        '催眠',
        'Swayした相手に、次に会うまでそのことを忘れさせられる。',
      ),
      ability(
        'slide',
        'subterfuge',
        'Subterfuge',
        '欺瞞',
        '特殊鎧を消費して疑念・説得の結果に抵抗する、または欺瞞で自分を追い込む。',
        { specialArmor: true },
      ),
      ability(
        'slide',
        'trust-in-me',
        'Trust in Me',
        '私を信じて',
        '親密な関係にある相手への判定に＋1d。',
      ),
    ],
    friendsTitle: '抜け目ない知人',
    friends: friends('slide', [
      'Bryl — 薬物の売人',
      'Bazso Baz — ギャングの頭',
      'Klyra — 酒場の主人',
      'Nyryx — 娼婦',
      'Harker — 囚人',
    ]),
    items: [
      gear('slide:clothes', 'Fine clothes & jewelry', '良質な衣服と宝飾品', 0),
      gear('slide:disguise', 'Fine disguise kit', '良質な変装道具'),
      gear('slide:dice', 'Fine loaded dice, trick cards', '良質な仕込み骰子とトリックカード', 0),
      gear('slide:trance', 'Trance powder', '恍惚の粉', 0),
      gear('slide:sword', 'A cane-sword', '仕込み杖'),
      gear('slide:charm', 'Spiritbane charm', '霊除けのお守り', 0),
    ],
    xpTrigger: '欺きまたは影響力で難題に取り組んだ。',
    gatherInfo: [
      ...commonQuestions,
      '相手は本当のことを言っているか？',
      '相手は本当はどう感じているか？',
      '相手が本当に大切にしているものは？',
      'ここにどう溶け込めるか？',
      lastQuestion,
    ],
  },
  spider: {
    id: 'spider',
    title: 'SPIDER',
    descriptor: '策略と計画を得意とする黒幕',
    initialRatings: { consort: 2, study: 1 },
    source: pdf('Spider'),
    abilities: [
      ability(
        'spider',
        'foresight',
        'Foresight',
        '先見',
        '仕事ごとに2回、ストレスを支払わず仲間を助けられる。どんな準備をしたか説明する。',
        { uses: 2, noteLabel: '事前の準備' },
      ),
      ability(
        'spider',
        'calculating',
        'Calculating',
        '計算ずく',
        'ダウンタイムに自分か仲間1人へ追加の活動1回を与える。',
        { noteLabel: '追加活動を受ける人物' },
      ),
      ability(
        'spider',
        'connected',
        'Connected',
        '人脈',
        'ダウンタイムの資産調達・Heat低下で判定結果が1段階向上する。',
      ),
      ability(
        'spider',
        'functioning-vice',
        'Functioning Vice',
        '悪癖の制御',
        '悪癖の判定結果を上下1または2調整できる。一緒に悪癖を満たす仲間も同様。',
      ),
      ability(
        'spider',
        'ghost-contract',
        'Ghost Contract',
        '霊の契約',
        '握手で結ぶ契約の双方に誓いの印が現れる。破ればレベル3の傷「呪い」を受ける。',
        { noteLabel: '契約の相手・内容' },
      ),
      ability(
        'spider',
        'jail-bird',
        'Jail Bird',
        '牢の常連',
        '投獄中は指名手配レベルを1低く、Tierを1高く扱う。助けた勢力への関係値＋1も得る。',
      ),
      ability(
        'spider',
        'mastermind',
        'Mastermind',
        '策士',
        '特殊鎧を消費して仲間を守る、または情報収集・長期プロジェクトで自分を追い込む。',
        { specialArmor: true },
      ),
      ability(
        'spider',
        'weaving-the-web',
        'Weaving the Web',
        '網を張る',
        '仕事の対象についてConsortで情報収集すると＋1d。その仕事のエンゲージメント判定にも＋1d。',
      ),
    ],
    friendsTitle: '抜け目ない知人',
    friends: friends('spider', [
      'Salia — 情報屋',
      'Augus — 建築の名匠',
      'Jennah — 使用人',
      'Riven — 化学者',
      'Jeren — ブルーコートの記録係',
    ]),
    items: [
      gear('spider:identity', 'Fine cover identity', '良質な偽の身分', 0),
      gear('spider:whiskey', 'Fine bottle of whiskey', '良質なウイスキー'),
      gear('spider:blueprints', 'Blueprints', '設計図'),
      gear('spider:slumber', 'Vial of slumber essence', '眠りの精髄', 0),
      gear('spider:pistol', 'Concealed palm pistol', '隠し掌中拳銃', 0),
      gear('spider:charm', 'Spiritbane charm', '霊除けのお守り', 0),
    ],
    xpTrigger: '計算または謀略で難題に取り組んだ。',
    gatherInfo: [
      '相手が最も望んでいるものは？',
      '何に注意すべきか？',
      'ここで交渉の切り札は何か？',
      'どうすれば［X］を発見できるか？',
      ...commonQuestions,
      lastQuestion,
    ],
  },
  whisper: {
    id: 'whisper',
    title: 'WHISPER',
    descriptor: '秘術と霊を扱う術者',
    initialRatings: { attune: 2, study: 1 },
    source: pdf('Whisper'),
    abilities: [
      ability(
        'whisper',
        'compel',
        'Compel',
        '使役',
        'Attuneで近くの霊を出現させ、命令に従わせる。呼び出した霊への超常の恐怖を受けない。仲間は別。',
      ),
      ability(
        'whisper',
        'ghost-mind',
        'Ghost Mind',
        '霊の感覚',
        '近くの超常存在に常に気づく。超常に関する情報収集に＋1d。',
      ),
      ability(
        'whisper',
        'iron-will',
        'Iron Will',
        '鉄の意志',
        '超常存在を見た恐怖に免疫を持つ。Resolveの抵抗判定に＋1d。',
      ),
      ability(
        'whisper',
        'occultist',
        'Occultist',
        '秘術家',
        '古の力・忘れられた神・悪魔とConsortする方法を知る。交流した存在の信奉者へのCommandに＋1d。',
        { noteLabel: '交流した存在' },
      ),
      ability(
        'whisper',
        'ritual',
        'Ritual',
        '儀式',
        'Studyで超常の効果・存在を呼ぶ儀式を習得・創作できる。儀式を1つ習得して始める。',
        { noteLabel: '習得した儀式・手順・代償' },
      ),
      ability(
        'whisper',
        'strange-methods',
        'Strange Methods',
        '奇妙な手法',
        '秘術的な発明・製作の判定結果が1段階向上する。秘術的な設計を1つ習得して始める。',
        { noteLabel: '習得した設計' },
      ),
      ability(
        'whisper',
        'tempest',
        'Tempest',
        '嵐',
        '自分を追い込むと、稲妻を武器にする、または周囲に暴風雨・霧・霜などの嵐を呼ぶことができる。',
      ),
      ability(
        'whisper',
        'warded',
        'Warded',
        '守護',
        '特殊鎧を消費して超常の結果に抵抗する、または秘術の力を扱うとき自分を追い込む。',
        { specialArmor: true },
      ),
    ],
    friendsTitle: '奇妙な知人',
    friends: friends('whisper', [
      'Nyryx — 憑依する霊',
      'Scurlock — 吸血鬼',
      'Setarra — 悪魔',
      'Quellyn — 魔女',
      'Flint — 霊の密売人',
    ]),
    items: [
      gear('whisper:hook', 'Fine lightning hook', '良質な電霊鉤', 2),
      gear('whisper:mask', 'Fine spirit mask', '良質な霊の仮面'),
      gear('whisper:electroplasm', 'Electroplasm vials', '電霊液の小瓶', 0),
      gear('whisper:bottles', 'Spirit bottles (2)', '霊の瓶2本'),
      gear('whisper:key', 'Ghost key', '霊の鍵', 0),
      gear('whisper:charm', 'Demonbane charm', '悪魔除けのお守り', 0),
    ],
    xpTrigger: '知識または秘術の力で難題に取り組んだ。',
    gatherInfo: [
      'ここで秘術的・奇妙なものは何か？',
      '霊界にどんな残響があるか？',
      'ここで隠れた・失われたものは何か？',
      '相手は何をするつもりか？',
      '相手を突き動かすものは？',
      'どうすれば［X］を明らかにできるか？',
      lastQuestion,
    ],
  },
}
export const PLAYBOOK_LIST = Object.values(PLAYBOOKS)
export const ALL_ABILITIES = PLAYBOOK_LIST.flatMap((book) => book.abilities)
export function isPlaybookId(value: unknown): value is PlaybookId {
  return typeof value === 'string' && Object.hasOwn(PLAYBOOKS, value)
}
export function findAbility(id: string) {
  return ALL_ABILITIES.find((option) => option.id === id)
}
export function equipmentFor(book: PlaybookId) {
  return [...PLAYBOOKS[book].items, ...GENERAL_ITEMS]
}
