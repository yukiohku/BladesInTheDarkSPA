/**
 * 選択肢の一覧データ。
 *
 * 効果の文章はルールブックを参照する前提なので、ここでは名称のみを保持し、
 * シート側のメモ欄で各自が書き込めるようにしています。
 * 名称を変えたいときはここだけを編集すれば全体に反映されます。
 */

export interface Option {
  id: string
  name: string
}

/** 血統（2つ選択） */
export const HERITAGES: Option[] = [
  { id: 'blood-feud', name: '血の争い' },
  { id: 'black-market-contact', name: '闇市' },
  { id: 'eye-for-detail', name: '観察眼' },
  { id: 'pressure', name: '圧力' },
  { id: 'pull-of-the-dark', name: '闇の引力' },
  { id: 'spirit-animal', name: '精霊因子' },
  { id: 'street-snarf', name: '匂い' },
  { id: 'the-fall', name: '堕落' },
]

/**
 * 血統の異能は、ルールブックでは「血統名 + 番号」で記載されています。
 * 血統の一覧から機械的に生成します。
 */
export const HERITAGE_ABILITIES: Option[] = HERITAGES.flatMap((heritage) => [
  { id: `${heritage.id}-a1`, name: `${heritage.name} 1` },
  { id: `${heritage.id}-a2`, name: `${heritage.name} 2` },
])

/** 経歴（3つ選択） */
export const BACKGROUNDS: Option[] = [
  { id: 'academic', name: '学者' },
  { id: 'alchemist', name: '錬金術師' },
  { id: 'bravado', name: '虚勢' },
  { id: 'criminal-contact', name: '犯罪者の知人' },
  { id: 'crime-boss', name: '犯罪帝王' },
  { id: 'cult-member', name: 'カルト' },
  { id: 'driven', name: '野心家' },
  { id: 'eye-of-the-storm', name: '嵐の目' },
  { id: 'fence', name: '盗品' },
  { id: 'fixer', name: '仲介人' },
  { id: 'ghost', name: '亡霊' },
  { id: 'hand-of-the-lord', name: '主の右手' },
  { id: 'head-hunter', name: '首狩り' },
  { id: 'hound', name: '猟犬' },
  { id: 'jack-of-all-trades', name: '万能' },
  { id: 'mark-of-the-beast', name: '獣の印' },
  { id: 'pickpocket', name: 'すり' },
  { id: 'poisoner', name: '毒' },
  { id: 'politician', name: '外交' },
  { id: 'prowler', name: '野伏' },
  { id: 'psychic', name: 'サイコ' },
  { id: 'red-right-hand', name: '赤の右手' },
  { id: 'right-hand', name: '右腕' },
  { id: 'sharp', name: '目星' },
  { id: 'slide', name: '諜報' },
  { id: 'sneak', name: '忍び' },
  { id: 'street-dealer', name: '薬' },
  { id: 'surgeon', name: '外科' },
  { id: 'surveyor', name: '測量' },
  { id: 'sworn-brother', name: '義兄弟' },
  { id: 'the-faith', name: '信仰' },
  { id: 'underworld-connections', name: '人脈' },
  { id: 'veterinary', name: '獣医' },
  { id: 'weaponmaster', name: '武術' },
]

/** クルーでの役割（1つ選択） */
export const CREW_ROLES: Option[] = [
  { id: 'assistant', name: '補佐' },
  { id: 'captain', name: '頭領' },
  { id: 'lieutenant', name: '副頭領' },
  { id: 'monster', name: '怪物' },
  { id: 'veteran', name: '古株' },
]

/** 役割の異能は、ルールブックでは役割ごとに1つずつ記載されています。 */
export const ROLE_ABILITIES: Option[] = CREW_ROLES.map((role) => ({
  id: `${role.id}-ability`,
  name: role.name,
}))

/**
 * 異能（各ティアで1つずつ選択）。
 * 固有名詞のため英語表記のまま保持しています。
 */
export const SPECIAL_ABILITIES: Option[] = [
  'Alchemist',
  'Angst',
  'Attack Response',
  'Book Smart',
  'Capable',
  'Cast Iron',
  'Charitable',
  'Chokehold',
  'Close-Ups',
  'Cool Headed',
  'Craze',
  'Crazy Idea',
  'Creator',
  'Do You Feel Lucky?',
  'Eye of the Storm',
  'Fast Friends',
  'First Blood',
  'Formation Fighting',
  'Ghost Legion',
  'Heart of Gold',
  'Hidden Agenda',
  'In The Blood',
  'Insect Sense',
  'Killer Instinct',
  'Manual of Arms',
  'Meticulous',
  'Midas Touch',
  'Occult Talent',
  'Overcharge',
  'Pulling Rank',
  'Puppeteer',
  'Resistance Fighter',
  'Right Hand',
  'Sharing the Load',
  'Skilled',
  'Slide',
  'Stonewalled',
  'Storyteller',
  'Strict',
  'Stylish',
  'Subterranean',
  'Survivalist',
  'Takedown',
  'Team Player',
  'Underworld Guide',
  'Wanderer',
].map((name) => ({ id: slug(name), name }))

/** 悪癖（3つ選択） */
export const VICES: Option[] = [
  { id: 'alcohol', name: '酒' },
  { id: 'gambling', name: '賭' },
  { id: 'opium', name: '阿片' },
  { id: 'morpheus', name: '睡眠薬' },
  { id: 'cocaine', name: 'コカイン' },
  { id: 'violence', name: '殺し' },
  { id: 'theft', name: '窃盗' },
  { id: 'sex', name: '性的行為' },
  { id: 'smuggling', name: '密輸' },
  { id: 'extortion', name: '恐喝' },
]

/** トラウマ（1つ選択） */
export const TRAUMAS: Option[] = [
  { id: 'charismatic', name: 'Extract' },
  { id: 'cold', name: '冷' },
  { id: 'cruel', name: '残酷' },
  { id: 'deaf', name: '聾' },
  { id: 'disorderly', name: '乱暴' },
  { id: 'drugged', name: '麻薬' },
  { id: 'haunted', name: '憑依' },
  { id: 'injured', name: '負傷' },
  { id: 'mad', name: '狂' },
  { id: 'oathbreaker', name: '誓' },
  { id: 'paralyzed', name: '麻痺' },
  { id: 'reckless', name: '無鉄砲' },
  { id: 'skittish', name: '臆病' },
  { id: 'sleeper', name: '寝坊' },
  { id: 'spooked', name: '弱腰' },
  { id: 'stubborn', name: '頑固' },
  { id: 'unstable', name: '不安定' },
  { id: 'vicious', name: '悪性' },
  { id: 'weakened', name: '弱体' },
]

/** 欠点（3つ選択） */
export const FLAWS: Option[] = [
  { id: 'broke', name: '金欠如' },
  { id: 'distinctive', name: '顔立ち' },
  { id: 'fined', name: '罰金' },
  { id: 'hunted', name: '追手' },
  { id: 'illiterate', name: '無学' },
  { id: 'injured', name: '傷' },
  { id: 'lever', name: '不利' },
  { id: 'obvious', name: '露見' },
  { id: 'rattled', name: '動揺' },
  { id: 'sleeper', name: '睡眠' },
  { id: 'stiff', name: '硬直' },
  { id: 'troubled', name: '問題視' },
  { id: 'unstable', name: '不安定' },
  { id: 'wanted', name: '指名' },
  { id: 'wary', name: '用心' },
]

/** クルーの種類 */
export const CREW_TYPES: Option[] = [
  { id: 'assassins', name: '暗殺' },
  { id: 'criminal', name: '犯罪' },
  { id: 'cult', name: 'カルト' },
  { id: 'smugglers', name: '密輸' },
  { id: 'hawkers', name: '行商' },
  { id: 'mercenaries', name: '傭兵' },
]

/** クルーメンバーの役割 */
export const CREW_MEMBER_ROLES: Option[] = [
  '頭領',
  '副頭領',
  '補佐',
  '古株',
  '傭兵',
  '協力者',
  'その他',
].map((name, index) => ({ id: `role-${index}`, name }))

export function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
