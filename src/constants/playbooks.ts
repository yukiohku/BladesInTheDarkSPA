import type { ActionId, PlaybookId, RatingGroup } from '../types/character'
import { POSITION_LABELS } from './labels'
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
export const INITIAL_RATING_MAX = 2
export const INITIAL_ALLOCATION_POINTS = 4
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
export interface DescribedItem extends NamedItem {
  description: string
}
export interface HeritageOption extends DescribedItem {
  summary: string
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
// 経歴はクルーに入る前の活動。具体例はアプリ独自の入力補助。
export const BACKGROUNDS: DescribedItem[] = [
  { id: 'academic', name: '学者', description: '学問や研究に携わっていた経歴です。例：大学の学生、研究者、教師。専門分野や、学びの場を離れた事情を詳細に記入できます。' },
  { id: 'labor', name: '労働者', description: '肉体労働で生計を立てていた経歴です。例：鉱夫、港の荷運び、船員。働いていた場所や、そこでの暮らしを詳細に記入できます。' },
  { id: 'law', name: '法律関係者', description: '法律や治安に関わる仕事をしていた経歴です。例：衛兵、捜査官、法律家。所属や、扱っていた事件を詳細に記入できます。' },
  { id: 'trade', name: '商人', description: '商売や取引に携わっていた経歴です。例：店主、行商人、仲買人。扱っていた品や、取引相手を詳細に記入できます。' },
  { id: 'military', name: '軍人', description: '軍務に就いていた経歴です。例：兵士、将校、軍医。所属部隊や、従軍した経験を詳細に記入できます。' },
  { id: 'noble', name: '貴族', description: '貴族の家や上流社会で暮らしていた経歴です。例：名家の後継者、没落した一族の一員。家柄や、現在の立場を詳細に記入できます。' },
  { id: 'underworld', name: '裏社会', description: '犯罪や非合法の仕事に関わっていた経歴です。例：盗賊、密輸業者、賭場の用心棒。以前の仲間や、関わった仕事を詳細に記入できます。' },
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
        '特殊鎧の使用枠を消費して、戦闘中の攻撃による傷を1段階軽減できる。または、戦闘中にストレスを消費せず自分を追い込める。',
        { specialArmor: true },
      ),
      ability(
        'cutter',
        'bodyguard',
        'Bodyguard',
        '護衛',
        '仲間をかばって悪影響を引き受けるとき、その悪影響への抵抗判定に＋1d。今の状況に潜む脅威を予測するための情報収集では、効果が1段階上がる。',
      ),
      ability(
        'cutter',
        'ghost-fighter',
        'Ghost Fighter',
        '霊との戦い',
        '手や近接武器、道具に霊の力を込められる。超常的な敵との戦闘では、攻撃が効きやすくなる（効果を判断する際、有効性の面で有利になる）。霊をつかみ、拘束して捕らえることもできる。',
      ),
      ability(
        'cutter',
        'leader',
        'Leader',
        '指揮官',
        '戦闘で配下の集団を〈指揮〉すると、その集団は通常なら戦意を失う状況でも戦い続け、レベル3の傷を受けても離脱しない。その集団の効果が1段階上がり、鎧の使用枠を1つ得る。',
      ),
      ability('cutter', 'mule', 'Mule', '荷運び', '荷重の上限は軽5・標準7・重8になる。', {
        loadLimits: { light: 5, normal: 7, heavy: 8 },
      }),
      ability(
        'cutter',
        'not-to-be-trifled-with',
        'Not to Be Trifled With',
        '侮れない相手',
        '自分を追い込むと、通常の恩恵に加えて、人間離れした力業を行うか、近接戦で小集団と互角に戦うことができる。どちらか1つを選ぶ。',
      ),
      ability(
        'cutter',
        'savage',
        'Savage',
        '獰猛',
        'あなたが暴力を振るう姿は、周囲に強い恐怖を与える。怯えている相手に〈指揮〉で命令するとき、判定に＋1d。',
      ),
      ability(
        'cutter',
        'vigorous',
        'Vigorous',
        '頑健',
        '傷の回復が早い。治療クロックは常に1区画が埋まった状態になり、自分が治療を受ける判定に＋1d。',
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
        '自分を追い込むと、通常の恩恵に加えて、武器の通常射程を超える遠距離攻撃を行うか、連射で敵の動きや攻撃を抑え込むことができる。どちらか1つを選ぶ。',
      ),
      ability(
        'hound',
        'focused',
        'Focused',
        '集中',
        '特殊鎧の使用枠を消費して、不意を突かれたことによる悪影響や、恐怖・混乱・追跡対象の見失いなどに抵抗できる。または、射撃戦や追跡でストレスを消費せず自分を追い込める。',
        { specialArmor: true },
      ),
      ability(
        'hound',
        'ghost-hunter',
        'Ghost Hunter',
        '霊の狩人',
        '狩猟動物に霊の力が宿る。超常的な存在の追跡や戦闘では、その働きがより効果を発揮する（効果を判断する際、有効性の面で有利になる）。初回取得時に「霊体化」「精神のつながり」「矢の速さ」から秘術能力を1つ選ぶ。追加取得するたびに、さらに1つ選べる。',
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
        '対象の居場所を探す情報収集では、効果が1段階上がる。あらかじめ準備した場所に隠れるか、迷彩を使うとき、発見を避ける判定に＋1d。',
      ),
      ability(
        'hound',
        'survivor',
        'Survivor',
        '生存者',
        '死の荒野に漂う毒の瘴気の影響を受けず、そこに生息する奇妙な動植物を食べて生き延びられる。ストレスの上限が1増える。',
        { stressBonus: 1 },
      ),
      ability(
        'hound',
        'tough-as-nails',
        'Tough as Nails',
        '筋金入り',
        '傷によるペナルティを、1つ下のレベルのものとして扱う。レベル1の傷はペナルティがなくなるが、傷そのもののレベルは変わらない。レベル4の傷は通常どおり致命的。',
      ),
      ability(
        'hound',
        'vengeful',
        'Vengeful',
        '復讐心',
        '「自分や大切な相手を傷つけた者に復讐した」が、経験値を得る追加条件になる。クルーが復讐に協力した場合は、クルーの経験値も記録する。',
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
        '錬金術を用いた品の発明・製作では、判定結果が1段階上がる（例：1〜3を4・5として扱う）。この能力を取得した時点で、特殊な処方を1つ習得している。',
        { noteLabel: '習得した処方' },
      ),
      ability(
        'leech',
        'analyst',
        'Analyst',
        '分析家',
        'ダウンタイムごとに、調査や新しい処方・設計の習得に関する長期プロジェクトのクロックを、合計2区画進められる。複数の対象に振り分けてもよい。',
      ),
      ability(
        'leech',
        'artificer',
        'Artificer',
        '工匠',
        '電霊技術を用いた品の発明・製作では、判定結果が1段階上がる（例：1〜3を4・5として扱う）。この能力を取得した時点で、特殊な設計を1つ習得している。',
        { noteLabel: '習得した設計' },
      ),
      ability(
        'leech',
        'fortitude',
        'Fortitude',
        '忍耐',
        '特殊鎧の使用枠を消費して、疲労・衰弱・薬品による悪影響に抵抗できる。または、技術を使う作業や錬金術の薬品を扱う際、ストレスを消費せず自分を追い込める。',
        { specialArmor: true },
      ),
      ability(
        'leech',
        'ghost-ward',
        'Ghost Ward',
        '霊の結界',
        '秘術の物質と手法を使って場所を〈破壊〉し、霊が避ける場所、または霊が引き寄せられる場所に変えられる。どちらにするか選ぶ。',
      ),
      ability(
        'leech',
        'physicker',
        'Physicker',
        '医師',
        '〈工作〉で身体に処置を施し、傷を治療したり、瀕死の者の容体を安定させたりできる。病気や死体を〈研究〉することもできる。自分を含むクルー全員が、治療を受ける判定に＋1d。',
      ),
      ability(
        'leech',
        'saboteur',
        'Saboteur',
        '破壊工作員',
        '〈破壊〉するとき、通常よりはるかに静かに作業できる。壊した箇所も、ざっと見ただけでは気づかれにくい。',
      ),
      ability(
        'leech',
        'venomous',
        'Venomous',
        '毒持ち',
        '弾帯で扱う薬物か毒を1つ選ぶ。その薬物・毒の影響を受けなくなる。自分を追い込むと、選んだものを皮膚や唾液から分泌するか、蒸気として吐き出せる。',
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
        '警備や防犯の仕組みを突破するとき、その品質や相手の階級が高くても、効果を下げられずに行動できる。',
      ),
      ability('lurk', 'ambush', 'Ambush', '待ち伏せ', '隠れた状態から攻撃するか、仕掛けた罠を作動させるとき、判定に＋1d。'),
      ability(
        'lurk',
        'daredevil',
        'Daredevil',
        '命知らず',
        `${POSITION_LABELS.desperate}でのアクション判定に＋1dを得られる。ただし、その行動で受ける悪影響への抵抗判定を、すべて−1dにすることが条件。`,
      ),
      ability(
        'lurk',
        'devils-footsteps',
        'The Devil’s Footsteps',
        '悪魔の足取り',
        '自分を追い込むと、通常の恩恵に加えて、人間離れした跳躍・登攀などを行うか、敵を翻弄して誤って同士討ちさせることができる。どちらか1つを選ぶ。',
      ),
      ability(
        'lurk',
        'expertise',
        'Expertise',
        '熟練',
        '技能を1つ選ぶ。その技能を使う集団行動を率いるとき、失敗した判定の数にかかわらず、指揮役として受けるストレスは最大1になる。',
        { choices: ACTIONS },
      ),
      ability(
        'lurk',
        'ghost-veil',
        'Ghost Veil',
        '霊の帳',
        'ストレス2を受けると、霊界に半ば入り込み、少しの間、影のように実体が薄くなる。さらに、持続時間を数分に延ばす・透明になる・霊のように空中を漂う、の各効果をストレス1ずつで追加できる。',
        { noteLabel: '使用する追加効果' },
      ),
      ability(
        'lurk',
        'reflexes',
        'Reflexes',
        '反射神経',
        '誰が先に行動するか判断が分かれる場面では、あなたが先に行動する。この能力を持つ者同士は同時に行動する。',
      ),
      ability(
        'lurk',
        'shadow',
        'Shadow',
        '影',
        '特殊鎧の使用枠を消費して、発見されたことや警備・防犯の仕組みによる悪影響に抵抗できる。または、跳躍・登攀などの運動や隠密行動で、ストレスを消費せず自分を追い込める。',
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
        'ストレス2を受けると、別の技能で行う判定にも、自分の最も高いアクション値を使える。得意な技能をその行動にどう応用するのか説明する。',
      ),
      ability(
        'slide',
        'cloak-and-dagger',
        'Cloak & Dagger',
        '偽装と奇襲',
        '変装などで正体や意図を隠し、相手を惑わせたり疑いをそらしたりする判定に＋1d。変装を解いて正体を明かすと、その驚きを利用して先手を取れる。',
      ),
      ability(
        'slide',
        'ghost-voice',
        'Ghost Voice',
        '霊への語り',
        'どれほど凶暴な霊や悪魔とも、人間を相手にするようにやり取りできる。超常的な存在との対話では、言葉による働きかけが効きやすくなる（効果を判断する際、有効性の面で有利になる）。',
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
        'ダウンタイムが終わるたびに、副収入として貯蓄が2増える。',
      ),
      ability(
        'slide',
        'mesmerism',
        'Mesmerism',
        '催眠',
        '相手を〈説得〉したとき、そのやり取りがあったことを忘れさせられる。次にあなたとやり取りすると、相手は記憶を取り戻す。',
      ),
      ability(
        'slide',
        'subterfuge',
        'Subterfuge',
        '欺瞞',
        '特殊鎧の使用枠を消費して、疑いをかけられたり説得されたりすることによる悪影響に抵抗できる。または、人を欺く行動でストレスを消費せず自分を追い込める。',
        { specialArmor: true },
      ),
      ability(
        'slide',
        'trust-in-me',
        'Trust in Me',
        '私を信じて',
        '親密な関係にある相手に対して行動するとき、判定に＋1d。対人交渉以外の行動にも適用される。',
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
        '仕事ごとに2回、ストレスを消費せずに仲間の判定を援助し、＋1dを与えられる。その援助のために、どんな準備をしていたのか説明する。',
        { uses: 2, noteLabel: '事前の準備' },
      ),
      ability(
        'spider',
        'calculating',
        'Calculating',
        '計算ずく',
        'ダウンタイムごとに、自分かクルーの仲間1人を選び、その人物のダウンタイム活動を1回増やせる。',
        { noteLabel: '追加活動を受ける人物' },
      ),
      ability(
        'spider',
        'connected',
        'Connected',
        '人脈',
        'ダウンタイムに資産を調達するか、注目度を下げる活動を行うとき、判定結果が1段階上がる（例：1〜3を4・5として扱う）。',
      ),
      ability(
        'spider',
        'functioning-vice',
        'Functioning Vice',
        '悪癖の制御',
        '悪癖を満たす判定で、採用する出目を1か2だけ増減できる。その出目でストレスの回復量を決める。あなたと一緒に悪癖を満たす仲間も、同じように調整できる。',
      ),
      ability(
        'spider',
        'ghost-contract',
        'Ghost Contract',
        '霊の契約',
        '握手で契約を交わすと、あなたと相手の双方に誓いの印が現れる。相手は人間でなくてもよい。契約を破った側は、レベル3の傷「呪い」を受ける。',
        { noteLabel: '契約の相手・内容' },
      ),
      ability(
        'spider',
        'jail-bird',
        'Jail Bird',
        '牢の常連',
        '投獄されたとき、指名手配レベルを1低く、クルーの階級を1高く扱う。さらに、投獄判定の結果による変化に加えて、獄中で手助けした勢力との関係値が1上がる。',
      ),
      ability(
        'spider',
        'mastermind',
        'Mastermind',
        '策士',
        '特殊鎧の使用枠を消費して、仲間が受ける悪影響を防ぐか軽減できる。または、情報収集や長期プロジェクトの作業で、ストレスを消費せず自分を追い込める。',
        { specialArmor: true },
      ),
      ability(
        'spider',
        'weaving-the-web',
        'Weaving the Web',
        '網を張る',
        '仕事の標的について〈交流〉で情報収集するとき、判定に＋1d。その仕事を始める際の初動判定にも＋1d。',
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
        '霊界に〈同調〉し、近くの霊を強制的に出現させ、命令に従わせられる。自分が呼び出したり使役したりする霊による超常的な恐怖を受けないが、仲間は恐怖を受けることがある。',
      ),
      ability(
        'whisper',
        'ghost-mind',
        'Ghost Mind',
        '霊の感覚',
        '近くに超常的な存在がいれば、常にその存在に気づく。超常的なものについて情報収集するとき、判定に＋1d。',
      ),
      ability(
        'whisper',
        'iron-will',
        'Iron Will',
        '鉄の意志',
        '超常的な存在を目にしたとき、それが引き起こす恐怖の影響を受けない。意志を使う抵抗判定に＋1d。',
      ),
      ability(
        'whisper',
        'occultist',
        'Occultist',
        '秘術家',
        '古の力を持つ存在や忘れられた神、悪魔と〈交流〉する秘法を知っている。一度でも交流した存在を崇拝する信奉者に〈指揮〉で命令するとき、判定に＋1d。',
        { noteLabel: '交流した存在' },
      ),
      ability(
        'whisper',
        'ritual',
        'Ritual',
        '儀式',
        '超常的な現象を起こしたり、超常的な存在を呼び出したりする儀式を〈研究〉して習得・創作し、執り行える。この能力を取得した時点で、儀式を1つ習得している。',
        { noteLabel: '習得した儀式・手順・代償' },
      ),
      ability(
        'whisper',
        'strange-methods',
        'Strange Methods',
        '奇妙な手法',
        '秘術を用いた品の発明・製作では、判定結果が1段階上がる（例：1〜3を4・5として扱う）。この能力を取得した時点で、秘術を用いた設計を1つ習得している。',
        { noteLabel: '習得した設計' },
      ),
      ability(
        'whisper',
        'tempest',
        'Tempest',
        '嵐',
        '自分を追い込むと、稲妻を放って攻撃するか、すぐ近くに豪雨・暴風・濃霧・霜や雪などを引き起こせる。どちらか1つを選ぶ。',
      ),
      ability(
        'whisper',
        'warded',
        'Warded',
        '守護',
        '特殊鎧の使用枠を消費して、超常的な力による悪影響に抵抗できる。または、秘術の力に対処したり利用したりするとき、ストレスを消費せず自分を追い込める。',
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
export function equipmentFor(book: PlaybookId | null) {
  return [...(book ? PLAYBOOKS[book].items : []), ...GENERAL_ITEMS]
}
