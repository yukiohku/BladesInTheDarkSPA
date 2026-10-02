import { EFFECT_LABELS, POSITION_LABELS } from './labels'
import { COIN_MAX, HEALING_CLOCK_SEGMENTS, LOAD_LIMITS, PLANS, TRAUMA_MAX } from './playbooks'

export type SummaryChapterId = 'roll' | 'teamwork' | 'consequences' | 'score' | 'downtime'
type SummaryTable = {
  title: string
  headers: readonly [string, string]
  rows: readonly (readonly [string, string])[]
}
type SummaryBlock =
  | { kind: 'text'; title: string; paragraphs: readonly string[] }
  | { kind: 'steps'; title: string; items: readonly string[] }
  | { kind: 'table'; table: SummaryTable }
  | { kind: 'tables'; title: string; tables: readonly SummaryTable[] }
  | { kind: 'note'; title: string; text: string }
  | { kind: 'details'; title: string; paragraphs: readonly string[] }
export type SummaryChapter = {
  id: SummaryChapterId
  title: string
  description: string
  blocks: readonly SummaryBlock[]
  sources: readonly { title: string; url: string }[]
}

export const SUMMARY_LABELS = {
  title: 'ルールサマリー',
  introduction: '判定の手順と、仕事中・ダウンタイムに使う共通ルールの早見表。公式SRDに基づく非公式の参考訳・要約です。',
  contents: 'サマリーの目次',
  contentsTitle: '目次',
  sources: 'この章の原典',
  top: 'サマリーの先頭へ',
  attributionTitle: '出典と参考訳について',
  attribution: 'John Harper / One Seven Design による Blades in the Dark のSRDを、日本語に要約・再構成しています。原著者による承認・監修を示すものではありません。',
  exceptions: '特殊能力による例外は、それぞれの能力説明を確認してください。',
}

const source = (title: string, path: string) => ({ title, url: `https://bladesinthedark.com/${path}` })
const PLAN_DETAILS: Record<string, string> = {
  assault: 'どこを攻撃するか。',
  occult: 'どのような秘術の手段を使うか。',
  deception: 'どのように騙すか。',
  social: 'どのような社会的つながりを使うか。',
  stealth: 'どこから侵入するか。',
  transport: '経路と運搬手段。',
}

// 公式SRDの参考訳・要約。条件・例外の照合記録は docs/research/rules-summary.md。
export const SUMMARY_CHAPTERS: readonly SummaryChapter[] = [
  {
    id: 'roll',
    title: '判定',
    description: '目的と行動を伝え、危険と達成できる量を確認してから振る。',
    blocks: [
      {
        kind: 'steps', title: 'アクション判定の流れ',
        items: [
          'プレイヤーが、達成したい目的と具体的な行動を説明する。',
          'その行動に合う技能をプレイヤーが選ぶ。',
          'GMが判定状況（危険の程度）と効果（達成できる量）を設定する。',
          '技能の値だけダイスを用意し、援助などの追加・傷などの減少を反映する。',
          'ダイスを振り、結果と判定状況に応じてGMと何が起きたかを描く。',
        ],
      },
      {
        kind: 'note', title: '判定が必要なとき',
        text: '危険や厄介な障害がある行動で判定します。当然できる行動は判定不要です。技能は値の高さだけで選ばず、実際にどう行動するかに合わせます。',
      },
      {
        kind: 'table', table: {
          title: 'ダイスの読み方', headers: ['ダイス', '読み方'],
          rows: [
            ['1個以上', '6面ダイスをまとめて振り、最も高い出目を採用する。'],
            ['6が2個以上', 'クリティカル。同じ判定内の複数の6で成立する。'],
            ['0個以下', '2個振って低い方を採用する。両方が6でもクリティカルにはならない。'],
          ],
        },
      },
      {
        kind: 'tables', title: '判定状況別の結果',
        tables: [
          {
            title: POSITION_LABELS.controlled, headers: ['出目', '結果'],
            rows: [
              ['クリティカル', '達成し、効果が上がる。'],
              ['6', '達成する。'],
              ['4–5', '撤退して別の方法を試すか、軽い悪影響を受けて達成する。'],
              ['1–3', `ためらう。${POSITION_LABELS.risky}で続けるか、撤退して別の方法を試す。`],
            ],
          },
          {
            title: POSITION_LABELS.risky, headers: ['出目', '結果'],
            rows: [
              ['クリティカル', '達成し、効果が上がる。'],
              ['6', '達成する。'],
              ['4–5', '達成するが、傷・厄介事・効果の低下・状況の悪化などを受ける。'],
              ['1–3', '悪い結果。傷・厄介事・状況の悪化・機会の喪失などを受ける。'],
            ],
          },
          {
            title: POSITION_LABELS.desperate, headers: ['出目', '結果'],
            rows: [
              ['クリティカル', '達成し、効果が上がる。'],
              ['6', '達成する。'],
              ['4–5', '達成するが、重い傷・深刻な厄介事・効果の低下などを受ける。'],
              ['1–3', '最悪の結果。重い傷・深刻な厄介事・機会の喪失などを受ける。'],
            ],
          },
        ],
      },
      {
        kind: 'text', title: '判定状況と効果を分けて考える',
        paragraphs: [
          `判定状況は悪影響の厳しさ、効果は成功したときの達成量です。通常は${POSITION_LABELS.risky}。危険でも大きな成果が得られる行動や、安全でも成果が小さい行動があります。`,
          '悪影響は状況に応じてGMが1つ以上決めます。1–3でも行動に効果があるかはGMが判断します。',
        ],
      },
      {
        kind: 'table', table: {
          title: '効果とクロックの進行', headers: ['効果', '達成量'],
          rows: [
            [EFFECT_LABELS.limited, '部分的な成果。クロックなら通常1区画。'],
            [EFFECT_LABELS.standard, '通常期待される成果。クロックなら通常2区画。'],
            [EFFECT_LABELS.great, '通常より大きな成果。クロックなら通常3区画。'],
          ],
        },
      },
      {
        kind: 'details', title: '効果の評価と危険との交換',
        paragraphs: [
          'GMは有効性（弱点や特殊な力による効きやすさ）、規模（人数・大きさ・範囲）、品質（道具などの質）を必要に応じて考慮します。効果なしや極大効果になる場合もあります。',
          '状況に合えば、判定状況を悪くして効果を高める、または効果を抑えて判定状況を改善する提案ができます。GMと具体的な行動を相談します。',
        ],
      },
    ],
    sources: [source('Core System', 'core-system'), source('Action Roll', 'action-roll'), source('Effect', 'effect')],
  },
  {
    id: 'teamwork',
    title: '判定を有利にする方法と協力',
    description: 'ダイスを増やす方法と、仲間と一緒に障害を越える方法。',
    blocks: [
      {
        kind: 'table', table: {
          title: '追加の利益と費用', headers: ['方法', '条件・費用・効果'],
          rows: [
            ['自分を追い込む', '利益1つにつき自分がストレス2。「＋1d」「効果を1段階上げる」「行動不能でも行動する」から選ぶ。各利益は同じ行動で1回ずつ。'],
            ['悪魔の取引', 'GMや他のプレイヤーが提案する代償を受け入れて＋1d。代償は判定の成否に関係なく生じる。受け入れるかは自由。'],
            ['援助', '仲間1人が助け方を説明し、ストレス1を受けて判定者に＋1d。援助する側にも悪影響が及ぶ場合がある。'],
          ],
        },
      },
      {
        kind: 'note', title: '追加ダイスの併用',
        text: '援助と、追い込みか悪魔の取引による＋1dは併用できます。追い込みで＋1dを得ることと取引で＋1dを得ることは併用できません。効果を上げる追い込みは別の利益です。1つの判定を援助できるのは1人だけです。',
      },
      {
        kind: 'table', table: {
          title: 'チームワーク', headers: ['方法', '手順と結果'],
          rows: [
            ['集団行動を率いる', '参加者全員が同じ技能でそれぞれ判定し、最も良い判定結果を全参加者に適用する。指揮役は結果が1–3だった参加者1人につきストレス1を受ける。振らなかった人には効果が及ばない。'],
            ['かばう', '仲間が受けるはずの悪影響を、自分がどう引き受けるか説明する。引き受けた悪影響には通常どおり抵抗できる。'],
            ['布石となる行動', '後続の仲間に有利な状況を作る行動を判定する。成功すれば、その布石を活かす判定の効果を1段階上げるか、判定状況を改善する。行動に合う利益を選ぶ。'],
          ],
        },
      },
      {
        kind: 'text', title: '協力できる範囲',
        paragraphs: [
          '連絡や連携ができる状況で使います。集団行動に直接参加していない人が援助するときは、参加者のうち誰の判定に＋1dを与えるかを決めます。',
          '布石は、状況に合えば複数の仲間や集団行動にも活かせます。集団行動の指揮役は、その技能が最も得意な人である必要はありません。',
        ],
      },
      {
        kind: 'details', title: '集団行動のクリティカル',
        paragraphs: ['通常は参加者それぞれの判定結果を比べます。別々の判定に出た6を合算してクリティカルにはしません。それを許可するクルーの特殊能力などは、個別の例外です。'],
      },
    ],
    sources: [source('Action Roll', 'action-roll'), source('Stress & Trauma', 'stress-trauma'), source('Teamwork', 'teamwork'), source('Crew Playbook（協力の例外）', 'crew-playbook')],
  },
  {
    id: 'consequences',
    title: '悪影響への対処',
    description: '抵抗や鎧で被害を抑え、残った傷とストレスを記録する。',
    blocks: [
      {
        kind: 'text', title: '悪影響の種類',
        paragraphs: ['効果の低下、厄介事、機会の喪失、判定状況の悪化、傷があります。成功しても悪影響を受ける場合があります。厄介事で、成功した目的そのものを取り消すことはしません。'],
      },
      {
        kind: 'steps', title: '抵抗判定',
        items: [
          'どの悪影響に抵抗するか、振る前に宣言する。',
          'GMが悪影響の性質から、洞察・身体・意志のいずれかの属性を選ぶ。',
          'その属性値で判定する。属性値は、同じ属性で1点以上ある技能の数。技能の点数の合計ではない。',
          '「6－採用した出目」だけストレスを受ける。6なら0、クリティカルならストレスを1取り除く。0個なら2個振って低い方を採用する。',
        ],
      },
      {
        kind: 'note', title: '抵抗は成立する',
        text: '判定は抵抗の費用を決めます。悪影響を軽減するか完全に回避するかはGMが決めます。同じ悪影響への抵抗判定は1回まで。複数の悪影響は個別に選んで抵抗でき、振ってから費用を見て抵抗をやめることはできません。',
      },
      {
        kind: 'table', table: {
          title: '抵抗に使う属性', headers: ['属性', '悪影響の例'],
          rows: [
            ['洞察', '欺きや理解に関する悪影響。'],
            ['身体', '身体的な負担や負傷。'],
            ['意志', '精神的な負担や意志に関する悪影響。'],
          ],
        },
      },
      {
        kind: 'text', title: '鎧の使用',
        paragraphs: [
          'その状況に適した鎧なら、抵抗判定の代わりに使用枠を埋めて悪影響を軽減・回避できます。重装なら追加の枠を使える場合があります。使用済みの枠は回復するまで再使用できません。',
          '通常鎧・重装は次の仕事のLoad選択時に回復します。特殊鎧は対応能力を持つ場合だけ使え、対象・効果・回復時期は能力の説明に従います。',
        ],
      },
      {
        kind: 'table', table: {
          title: '傷の影響', headers: ['レベル', 'その傷が行動に当てはまるとき'],
          rows: [
            ['1', '効果が低下する。'],
            ['2', '判定に－1d。'],
            ['3', '行動不能。手助けを受けるか、自分を追い込んで行動する。'],
            ['4', '致命的な傷。抵抗などで軽減しなければ死亡する。'],
          ],
        },
      },
      {
        kind: 'note', title: '傷の記録欄が埋まっているとき',
        text: 'そのレベルに空きがなければ1つ上に記録します。レベル3も埋まっている場合は、状況に応じて身体の一部の喪失や死など、破滅的で永続的な悪影響を受けます。新しい傷を受けたら治療クロックの進行を消します。',
      },
      {
        kind: 'text', title: 'ストレスとトラウマ',
        paragraphs: [
          '最後のストレス枠が埋まるとトラウマを1つ受け、その場の行動から離脱します。後に復帰するとストレスは0で、次のダウンタイムの悪癖は満たされた扱いです。',
          `トラウマは永続的です。${TRAUMA_MAX}つ目を記録すると、通常の悪党としての活動を終えます。`,
        ],
      },
      {
        kind: 'details', title: 'シートへの記録',
        paragraphs: ['抵抗の費用、鎧の使用、傷の繰り上げ、治療の進行、トラウマは、卓で確認してシートや「編集 → 状態」に手動で記録します。サマリーの閲覧による自動適用はありません。'],
      },
    ],
    sources: [source('Consequences & Harm', 'consequences-harm'), source('Resistance & Armor', 'resistance-armor'), source('Actions & Attributes', 'actions-attributes'), source('Stress & Trauma', 'stress-trauma'), source('Character Creation', 'character-creation'), source('Downtime Activities', 'downtime-activities')],
  },
  {
    id: 'score',
    title: '仕事の準備と進行',
    description: '計画の要点を決めて仕事へ入り、必要な準備はフラッシュバックで描く。',
    blocks: [
      {
        kind: 'table', table: {
          title: '計画と必要な詳細', headers: ['計画', '決めること'],
          rows: PLANS.map((plan): [string, string] => [plan.name, PLAN_DETAILS[plan.id] ?? plan.prompt]),
        },
      },
      {
        kind: 'text', title: '初動判定',
        paragraphs: [
          '計画と詳細、各自のLoadを決めたら、GMが初動判定をして最初の障害に直面する場面へ移ります。基本1dに大きな有利・不利を加減します。大胆さ、相手の弱点、知人の協力、敵の妨害などを確認します。',
        ],
      },
      {
        kind: 'table', table: {
          title: '初動判定の結果', headers: ['出目', '仕事の開始状況'],
          rows: [
            ['クリティカル', `最初の障害を越えており、次の場面で${POSITION_LABELS.controlled}。`],
            ['6', `${POSITION_LABELS.controlled}。`],
            ['4–5', `${POSITION_LABELS.risky}。`],
            ['1–3', `${POSITION_LABELS.desperate}。`],
          ],
        },
      },
      { kind: 'note', title: '初動判定が決める範囲', text: '最初の行動の判定状況を決めます。行動順や仕事全体の成否を決める判定ではありません。その後の状況は各行動に合わせて設定し直します。' },
      {
        kind: 'table', table: {
          title: 'Loadと装備の宣言', headers: ['基本のLoad', '見た目と動き'],
          rows: [
            [`軽：1–${LOAD_LIMITS.light}`, '速く目立ちにくい。一般の人々に紛れられる。'],
            [`標準：${LOAD_LIMITS.light + 1}–${LOAD_LIMITS.normal}`, '厄介事に備えた悪党に見える。'],
            [`重：${LOAD_LIMITS.heavy}`, '動きが遅く、任務中の者に見える。'],
            ['過積載：7–9', '荷が多すぎ、ごくゆっくり動くことしかできない。'],
          ],
        },
      },
      {
        kind: 'text', title: '装備は必要になってから選べる',
        paragraphs: ['仕事前には携行量を選び、個々の装備は使う場面で宣言できます。宣言した装備のLoad合計を選んだ範囲に収めます。Load 0の装備や上限を変える能力などの例外は、その定義を確認します。'],
      },
      {
        kind: 'table', table: {
          title: 'フラッシュバックの費用', headers: ['ストレス', '過去の準備'],
          rows: [
            ['0', '普通に機会のあった行動。'],
            ['1', '複雑な行動や、起こりにくい機会を使う準備。'],
            ['2以上', '特別な機会や偶然を必要とする手の込んだ準備。'],
          ],
        },
      },
      {
        kind: 'text', title: 'フラッシュバックの扱い',
        paragraphs: [
          '現在の状況に影響する過去の行動を描き、GMが費用を決めます。費用を払った後、必要ならアクション判定や運勢判定をします。判定不要の準備もあります。',
          'ダウンタイム活動を描く場合は、ストレスの代わりにコイン1またはクルーの評判1を支払います。すでに現在に起きた出来事を取り消すことはできません。',
        ],
      },
      {
        kind: 'table', table: {
          title: '情報収集と判定の使い分け', headers: ['状況', '扱い'],
          rows: [
            ['一般的な知識', 'GMがそのまま答える。'],
            ['答えを得るのに障害がある', '具体的な調べ方を伝え、アクション判定をする。'],
            ['障害はないが成果が不確か', '運勢判定で得られる情報の程度を決める。'],
            ['一度では調べきれない', 'GMと長期プロジェクトなどを相談する。'],
          ],
        },
      },
      {
        kind: 'text', title: '運勢判定',
        paragraphs: [
          '不確定な成り行きや成果の程度を決める判定です。関係する技能・品質・階級などを基準に、大きな有利・不利を加減します。適した値がないときは基本1d、またはGMが状況に応じたダイス数を決めます。',
          '1–3は乏しい成果、4–5は部分的な成果、6は十分な成果、クリティカルは特別に良い成果です。アクション判定の悪影響表をそのまま適用するものではありません。情報収集では、効果に応じてGMが正直に答えます。',
        ],
      },
    ],
    sources: [source('Planning & Engagement', 'planning-engagement'), source('Character Creation', 'character-creation'), source('Gathering Information', 'gathering-information'), source('Fortune Roll', 'fortune-roll')],
  },
  {
    id: 'downtime',
    title: 'ダウンタイム',
    description: '仕事の合間に、回復や悪癖、次の仕事に向けた活動を行う。',
    blocks: [
      {
        kind: 'text', title: '活動回数と追加の費用',
        paragraphs: ['各PCは通常2回、戦争中は1回の活動ができます。追加1回につきコイン1またはクルーの評判1を支払います。同じ活動を複数回選べます。普通の会話や移動、情報収集などはこの活動回数で制限しません。'],
      },
      {
        kind: 'note', title: 'ダウンタイム判定を改善する',
        text: '知人や連絡先に助けてもらうと＋1d。判定後にコイン1につき結果を1段階上げられます（1–3 → 4–5 → 6 → クリティカル）。活動を追加する費用、ダイスを増やすこと、判定結果を上げることは別です。',
      },
      {
        kind: 'table', table: {
          title: '6種類の活動', headers: ['活動', '目的と手順'],
          rows: [
            ['資産調達', '道具・協力者・乗り物・サービスなどを一時的に得る。クルーの階級で判定し、品質は1–3／4–5／6／クリティカルで階級－1／同じ／＋1／＋2。必要な最低品質はGMが決める。'],
            ['長期プロジェクト', '進め方を描写して技能で判定する。GMが決めたクロックを結果に応じて進める。'],
            ['回復', '治療を受け、治療者の判定で自分の治療クロックを進める。活動を消費するのは患者側。'],
            ['注目度の低下', 'クルーへの注目を逸らす方法を描写して技能で判定し、結果に応じて注目度を減らす。'],
            ['訓練', '選んだ分野を鍛える。経験値の記録と成長はシートの経験値欄を参照。'],
            ['悪癖を満たす', '提供者を訪れて悪癖に耽り、最も低い属性値でストレス解消を判定する。'],
          ],
        },
      },
      {
        kind: 'table', table: {
          title: 'プロジェクト・回復・注目度低下の結果', headers: ['出目', '進める区画・減らす注目度'],
          rows: [['1–3', '1'], ['4–5', '2'], ['6', '3'], ['クリティカル', '5']],
        },
      },
      {
        kind: 'text', title: '回復と治療クロック',
        paragraphs: [
          `基本は${HEALING_CLOCK_SEGMENTS}区画。満たしたらすべての傷を1段階下げ、クロックを空にして余った進行を繰り越します。レベル1の傷は消えます。新しい傷を受けると進行を消します。能力による治療の例外は説明を確認します。`,
          '自分で治療するならストレス2。治療を受けずに耐えて回復を試すならストレス1を受けて0dで判定します。治療者がいない場合は資産調達で探せます。',
        ],
      },
      {
        kind: 'text', title: '悪癖とストレス解消',
        paragraphs: [
          '最も低い属性値で振り、採用した出目だけストレスを取り除きます。0dなら2個振って低い方を採用します。現在のストレスより出目が大きければ過剰耽溺です。',
          '過剰耽溺では、追加の厄介事、クルーの注目度＋2、数週間姿を消す、提供者を失う、のいずれかを選びます。姿を消したPCは別のPCでプレイし、戻ると傷も回復しています。',
          'ダウンタイムに悪癖を満たさなければ、トラウマの数だけストレスを受けます。トラウマ発生後の復帰で満たされた扱いになる場合などは、そのルールに従います。',
        ],
      },
      {
        kind: 'text', title: '個人のコインと貯蓄',
        paragraphs: [`個人の手元のコインは${COIN_MAX}までで、超えた分は使うか貯蓄やクルーの保管へ回します。持ち歩くコインは1につきLoad 1。貯蓄は暮らしと引退後の生活を表し、現金に戻すときは貯蓄2につきコイン1です。`],
      },
      {
        kind: 'details', title: '資産調達の補足',
        paragraphs: [
          '同じ資産を再調達すると＋1d。クリティカルより上の品質は、さらに階級1段階につきコイン2で上げられます。薬品・毒・爆弾・危険な小道具の調達ではクルーの注目度＋2。永続的な入手はクルーの強化や長期プロジェクトで相談します。',
          'クルーの強化や特殊能力による追加活動などは、卓の記録と能力の説明を確認してください。',
        ],
      },
    ],
    sources: [source('Downtime Activities', 'downtime-activities'), source('Vice', 'vice'), source('Coin & Stash', 'coin-stash')],
  },
]
