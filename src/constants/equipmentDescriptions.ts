import type { EquipmentOption } from './playbooks'

// 原典の参考訳・要約。出典と版の差は docs/research/equipment.md を参照。
const spiritbane = '幽霊が避けたがる小さな秘術のお守り。'
const bandolier = '薬品や爆弾を3つ収める帯。使うときに中身を選び、使用枠に記録します。'
const pistol = '単発式の重い拳銃。近距離で強力ですが、再装填に時間がかかります。'

export const EQUIPMENT_DESCRIPTIONS: Readonly<Record<string, string>> = {
  blade: 'ナイフや剣などの刃物。形や本数は人物に合わせて決められます。',
  knives: '投擲用の軽い刃物6本。',
  pistol,
  pistol2: `予備の拳銃。${pistol}`,
  'large-weapon': '両手で扱う大型武器。大斧、長柄武器、猟銃、弓など。',
  'unusual-weapon': '鞭や鎖、武器に転用した道具などの変わった武器。',
  armor: '厚い革の胴衣と補強した手袋・靴。',
  'armor-heavy': '鎖帷子や金属板、兜を通常鎧に追加。通常鎧と合わせてLoad 5。',
  'burglary-gear': '開錠具、小さなバール、蝶番の音を抑える油などの窃盗用具。',
  'climbing-gear': 'ロープ、鉤、ハーネス、鉄杭などの登攀用具。',
  'arcane-implements': '水銀、黒い塩、霊を留める石、霊の瓶、電霊液などの秘術用品。',
  documents: '名簿や地図、各種資料と筆記用具。',
  'subterfuge-supplies': '化粧道具、偽造用の白紙、衣装や偽の徽章などの偽装用品。',
  'demolition-tools': '大槌、鉄杭、大型ドリル、バールなどの解体・破壊用工具。',
  'tinkering-tools': 'ルーペ、ピンセット、ペンチなどの精密な機械作業用工具。',
  lantern: '油のランタンや電霊灯などの光源。',
  'cutter:hand-weapon': 'よく作られた片手の近接武器。',
  'cutter:heavy-weapon': '間合いと威力に優れた重い両手武器。',
  'cutter:scary': '威圧の効果を高める恐ろしい見た目の武器・道具。戦闘の傷を増やす品ではありません。',
  'cutter:manacles': '捕虜の拘束に使う頑丈な手枷と鎖。',
  'cutter:rage': '筋力と痛みへの耐性を強める精髄。敵味方の区別や攻撃を止める判断が失われる危険があります。',
  'cutter:charm': spiritbane,
  'hound:pistols': '精度に優れた二連銃身の拳銃の組。',
  'hound:rifle': '長距離射撃向けの猟銃。狭い場所では扱いづらい武器です。',
  'hound:ammunition': '霊に有効な電霊弾薬。人体には主に気絶を狙う作用があり、使用は霊の番人の注意を引きます。',
  'hound:pet': '指示に従い、行動を先読みする狩猟動物。',
  'hound:spyglass': '遠くを見るための折り畳み式望遠鏡。',
  'hound:charm': spiritbane,
  'leech:tinkering': '精密作業用の上質な工具と計測器。',
  'leech:wrecking': 'ドリルや酸、切断器などを含む破壊工作用工具。',
  'leech:blowgun': '薬品を込める吹き矢と空の注射器。',
  'leech:bandolier-1': bandolier,
  'leech:bandolier-2': bandolier,
  'leech:gadgets': '〈工作〉で製作した仕掛け道具。',
  'lurk:lockpicks': '錠前を解除する精巧な開錠具。',
  'lurk:cloak': '周囲の闇に溶け込む影の絹の外套。',
  'lurk:climbing': 'かさばらないよう作られた軽量の登攀具。',
  'lurk:silence': '飲んだ人の周囲を短時間、無音にする薬。',
  'lurk:goggles': '真っ暗な場所でも見える秘術のゴーグル。',
  'lurk:charm': spiritbane,
  'slide:clothes': '裕福な貴族を装える服と宝飾品。着替え用に携帯する場合はLoad 2として卓で扱います。',
  'slide:disguise': '人を欺くための上質な変装・化粧道具。',
  'slide:dice': '出目や配札を操作する細工をした賭博用品。',
  'slide:trance': '意識を保ったまま暗示にかかりやすくする粉。',
  'slide:sword': '貴族の杖に偽装した細身の剣。',
  'slide:charm': spiritbane,
  'spider:identity': '別人を装う書類、噂、偽の人間関係。',
  'spider:whiskey': '贈り物やもてなしで印象を与える希少な酒。',
  'spider:blueprints': '建築図面や都市計画図。必要な図面を指定します。',
  'spider:slumber': '深い眠りに誘う精髄。強く働きかければ起こせます。',
  'spider:pistol': '衣服に隠しやすい小型拳銃。射程はごく短い武器です。',
  'spider:charm': spiritbane,
  'whisper:hook': '霊を捕らえ、霊の瓶へ引き込む電霊式の鉤。',
  'whisper:mask': '訓練した使用者が超常の力を詳しく見る仮面。憑依への保護も与えます。',
  'whisper:electroplasm': '電霊液を収めた小瓶。',
  'whisper:bottles': '霊を閉じ込める秘術の容器2本。',
  'whisper:key': '霊の場に残る過去の都市への扉を開く鍵。',
  'whisper:charm': '悪魔が避けたがる秘術のお守り。',
}

export function equipmentDescriptionText(item: EquipmentOption): string | undefined {
  const description = EQUIPMENT_DESCRIPTIONS[item.id]
  if (!description) return undefined
  return item.name.startsWith('Fine ')
    ? `${description}\n良質：品質が1段階高い品です。`
    : description
}
