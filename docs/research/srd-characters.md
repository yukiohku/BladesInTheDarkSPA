# SRDのキャラクター関連ルール

キャラクターシートの項目と操作を検討するため、公式SRDの要点を日本語で整理しました。確認日：2026年10月1日。日本語の用語は参考訳で、詳細や裁定は各出典を確認してください。出典・ライセンス表記は [資料フォルダの案内](README.md) にまとめています。

## キャラクター作成

[The Characters](https://bladesinthedark.com/characters) は、どのPCも各種のアクションを試みられることを説明しています。プレイブックは専門分野を表しますが、行動を特定の職業だけに制限する仕組みではありません。[Character Creation](https://bladesinthedark.com/character-creation)

作成の手順は以下の8項目です。

1. プレイブックを選ぶ。
2. Heritageを選び、家族や出自の詳細を書く。
3. Backgroundを選び、加入前の経歴の詳細を書く。
4. 印刷済み3点に追加4点を配分する。出自と経歴に対応する各1点、自由な2点。作成時は通常各アクション最大2。
5. 特殊能力を1つ選ぶ。
6. 知人一覧から親しい人物を1人、ライバルを別の1人選ぶ。
7. Viceを選び、その内容と提供者の名前・場所を書く。
8. 名前、偽名、外見を書く。

成長後のアクション上限は通常3、クルーのMasteryがあれば4になります。特殊能力の例外は別に確認します。[出典](https://bladesinthedark.com/character-creation)

## プレイブックの項目

[Character Playbook](https://bladesinthedark.com/character-playbook) は短い紹介、XP条件、初期アクション、初期ビルド例、友人・ライバル、能力例、固有装備を持つ汎用ひな形です。友人・ライバルの候補は5人の記載例があります。基本7プレイブックの完成版は [配布PDF](playbooks.md) を参照します。

特殊能力には、使用する特殊鎧、追加のLoad、指定するアクション、ダウンタイムの追加活動など、名前以外に記録・確認する情報があります。SRDの例とPDFで名称や内容が違う場合は両方の出典を残します。[出典](https://bladesinthedark.com/character-playbook)

## アクションと属性

アクション値は0から4。属性値は、その属性に属するアクションで最初の1点が埋まっている種類の数です。たとえば同じ属性内に値2と値1のアクションがあれば、属性値は3ではなく2です。[Actions & Attributes](https://bladesinthedark.com/actions-attributes)

| 属性 | 所属するアクション | 属性値が使われる抵抗の例 |
| --- | --- | --- |
| Insight | Hunt、Study、Survey、Tinker | 欺きや理解に関する結果 |
| Prowess | Finesse、Prowl、Skirmish、Wreck | 身体的負担や負傷 |
| Resolve | Attune、Command、Consort、Sway | 精神的負担や意志 |

属性のまとまりは [Actions & Attributes](https://bladesinthedark.com/actions-attributes)、抵抗の分類は [Resistance & Armor](https://bladesinthedark.com/resistance-armor) に基づきます。プレイヤーが行動内容からアクションを選び、状況への適合は判定状況や効果に影響します。

アプリのシートの属性見出しでは、Insightに「洞察」、Prowessに「身体」、Resolveに「意志」を併記します。これらは本アプリの参考訳です。

### シートの技能説明

シートの12技能のツールチップは、[Actions & Attributes の Actions 節](https://bladesinthedark.com/actions-attributes)を用途・使用例・似た技能との違いに整理した参考訳・要約です。確認日：2026年10月2日。本文は `src/constants/actionDescriptions.ts` に集約しています。〈研究〉は細部や証拠の分析、〈観察〉は周囲の状況と展開の把握、〈交流〉は人脈や親交、〈説得〉は嘘・魅力・議論による働きかけとして区別します。

使用例は行動の用途を限定しません。原典では複数のアクションの用途が重なり、プレイヤーが具体的な行動に合わせてアクションを選び、GMが判定状況と効果を判断します。原著者・ライセンス表記は[資料フォルダの案内](README.md#出典と利用区分)を参照してください。

## 判定の状況と効果の対訳

判定周りでは以下の参考訳を使います。日本語版の公式訳として扱いません。確認日：2026年10月2日。技能名は〈破壊〉などの〈〉、状況や効果の段階名は［優位］［限定的］などの［］で示します。「な」を含め、文章に自然に組み込める形を `src/constants/labels.ts` の `POSITION_LABELS` / `EFFECT_LABELS` に定義します。

**判定状況（Position）** は、行動に伴う危険と、不利益が生じたときの厳しさを表します。GMが設定し、通常は［リスキー］な状況です。［優位］な状況でも危険がなくなるわけではありません。[Action Roll](https://bladesinthedark.com/action-roll)

| 原語 | 本文での表記 | 意味 |
| --- | --- | --- |
| Controlled | ［優位］な状況 | 主導権や明確な有利さを活かして行動する |
| Risky | ［リスキー］な状況 | 相手との対抗や危険を伴う、通常の判定状況 |
| Desperate | ［絶望的］な状況 | 自分の能力を超える挑戦や重大な危険に直面する |

**効果（Effect）** は、成功した行動でどれだけ達成できるかを表します。判定状況とは別に設定します。[Effect](https://bladesinthedark.com/effect)

| 原語 | 本文での表記 | 意味 |
| --- | --- | --- |
| Limited | ［限定的］な効果 | 部分的な成果を得る |
| Standard | ［標準的］な効果 | その行動で通常期待される成果を得る |
| Great | ［大きな］効果 | 通常より大きな成果を得る |

本文では「［リスキー］な状況で〈破壊〉を判定する」「成功すると［標準的］な効果を得る」のように書きます。能力説明の「＋1効果」は、GMが設定した効果を1段階上げる意味です。たとえば［限定的］な効果から［標準的］な効果へ上がります。通常の3段階の外に、効果なし（Zero）と極大効果（Extreme）もあります。[Effect](https://bladesinthedark.com/effect)

### その他の判定用語と使い分け

以下も本アプリの参考訳として揃えます。既存の「自分を追い込む」「抵抗判定」「ダウンタイム」「フラッシュバック」は維持します。追加した対訳は、既存の説明文を修正するときの基準です。

| 原語と出典 | 本文での表記 | 意味・使い分け |
| --- | --- | --- |
| [Result / Outcome](https://bladesinthedark.com/action-roll) | 判定結果 | 判定に関して、出目や行動の成否を示す。一般的な出来事の結果は文脈に合わせて訳す |
| [Consequence](https://bladesinthedark.com/consequences-harm) | 悪影響 | キャラクターが受ける不利益。成功しても受けることがあり、傷・厄介事・効果の低下などを含む |
| [Complication](https://bladesinthedark.com/consequences-harm) | 厄介事 | 増援や火災、新しい脅威などが生じる種類の悪影響 |
| [Harm](https://bladesinthedark.com/consequences-harm) | 傷 | 持続的な障害。身体的な負傷だけでなく精神面の傷も含む |
| [Fortune Roll](https://bladesinthedark.com/fortune-roll) | 運勢判定 | 不確定な成り行きや成果の程度を決める判定 |
| [Engagement Roll](https://bladesinthedark.com/planning-engagement) | 初動判定 | 仕事開始時、最初の障害に直面する判定状況を決める。行動順を決める判定ではない |
| [Potency](https://bladesinthedark.com/effect) | 有効性 | 弱点や特殊な力などによる効きやすさ。戦闘以外にも使う効果の評価要素 |
| [Scale](https://bladesinthedark.com/effect) | 規模 | 人数・大きさ・影響範囲など、効果の評価要素 |
| [Quality](https://bladesinthedark.com/effect) | 品質 | 道具・武器・資源の質。階級を基準に評価することが多い |
| [Push Yourself](https://bladesinthedark.com/action-roll) | 自分を追い込む | ストレスを受けて追加の利益を得る操作。特殊能力の発動条件にもなる |
| [Resistance Roll](https://bladesinthedark.com/resistance-armor) | 抵抗判定 | 悪影響に抵抗するときに受けるストレスを決める。抵抗による軽減・回避は成立し、その範囲はGMが決める |
| [Downtime](https://bladesinthedark.com/downtime) | ダウンタイム | 仕事の合間に回復・長期プロジェクトなどを行う期間 |
| [Flashback](https://bladesinthedark.com/planning-engagement) | フラッシュバック | 現在に影響する過去の行動や準備を描く。すでに起きた出来事を取り消すものではない |

たとえば「薬品の結果に抵抗する」は、原文が薬品による Consequence を指すなら「薬品による悪影響に抵抗する」と書きます。「結果」「威力」は通常の意味でも使うため、原文の用語と文脈を確認して訳し分けます。

## ストレスとトラウマ

- 自分を追い込む場合、選ぶ利益ごとにストレス2を受けます。同じ行動で各利益は1回ずつ。利益は判定のダイス追加、効果の向上、重傷でも行動することです。
- 最後のストレス枠が埋まるとトラウマを1つ受け、その場の行動から離脱します。復帰時はストレス0で、次のダウンタイムの悪癖は満たされた扱いになります。
- 基本のトラウマは永続的です。4つ目を記録したPCは、通常の悪党としての活動を終えます。

基本条件の英語名はCold、Haunted、Obsessed、Paranoid、Reckless、Soft、Unstable、Vicious。原文のHauntedは過去の恐怖の再体験などを説明しており、名称をそのまま霊による「憑依」と断定しないようにします。[Stress & Trauma](https://bladesinthedark.com/stress-trauma)

## 抵抗と鎧

抵抗の効果は自動的に成立し、軽減か完全回避かはGMが判断します。判定は受けるストレスを決め、基本は「6－最大のダイス結果」、クリティカルならストレス1を取り除きます。同じ結果に対する抵抗判定は1回です。[Resistance & Armor](https://bladesinthedark.com/resistance-armor)

状況に適した鎧があれば、使用欄を記録して結果を軽減・回避できます。使用済みの鎧は次の仕事のLoadを選ぶときに回復する説明があります。一方、能力例の特殊鎧はダウンタイム開始時に回復する説明もあるため、リセット操作を設計するときは対象能力の説明を確認します。[Resistance & Armor](https://bladesinthedark.com/resistance-armor)、[Character Playbook](https://bladesinthedark.com/character-playbook)

特殊鎧欄は、それを使う能力がなければ使えません。[Character Creation](https://bladesinthedark.com/character-creation)

## 傷と回復

傷は種類を文章で記録し、その傷が現在の行動に当てはまる場合にペナルティを適用します。[Consequences & Harm](https://bladesinthedark.com/consequences-harm)

| レベル | 基本シートの記録欄 | 基本の影響 |
| --- | --- | --- |
| 1 | 2欄 | 効果が低下 |
| 2 | 2欄 | 判定に－1d |
| 3 | 1欄 | 手助けまたは自分を追い込むことが必要 |
| 4 | 通常の記入行なし | 致命的な傷 |

欄数は [Cutter PDF](https://bladesinthedark.com/sites/default/files/sheets/blades_sheets_v8_2_Cutter.pdf)、影響と致命的な傷は [SRD](https://bladesinthedark.com/consequences-harm) を参照。該当レベルの欄が満杯なら上のレベルに記録し、最上段も埋まっていれば破滅的で永続的な結果になります。

回復は治療を受けて治療クロックを進めます。基本は4分割で、満たすとすべての傷が1段階下がり、クロックを空にして超過分を繰り越します。新しい傷を受けた場合は治療クロックの進行を消します。治療結果1–3／4–5／6／クリティカルによる進行は1／2／3／5です。[Downtime Activities のRecover](https://bladesinthedark.com/downtime-activities)

## XPと成長

［絶望的］な状況でのアクション判定では、該当属性にXP1を記録します。セッション終了時は、固有のXP条件、信念・動機・出自・経歴の表現、悪癖・トラウマに起因する問題を振り返り、各条件につきXP1、何度も起きたならXP2です。成功だけを条件にしません。[Advancement](https://bladesinthedark.com/advancement)

終了時のXPはプレイブックまたはいずれかの属性へ入れられます。トラックが満たされると成長し、プレイブックでは能力追加、属性では所属アクションに1点追加します。訓練は同じトラックにつき1ダウンタイムに1回です。[出典](https://bladesinthedark.com/advancement)

## 悪癖とダウンタイム

悪癖によるストレス解消は最も低い属性値で判定し、最大のダイス結果だけストレスを取り除きます。現在のストレスを上回る結果は過剰耽溺です。悪癖を満たさなかった場合はトラウマ数だけストレスを受けます。[Vice](https://bladesinthedark.com/vice)

過剰耽溺には追加の厄介事、Heat増加、しばらく姿を消すこと、提供者を失うことがあります。単なる数値の減算では記録しきれない結果です。[出典](https://bladesinthedark.com/vice)

ダウンタイム活動は通常2回、戦争中は1回。追加は1回につきCoinまたはRepを1支払います。種類は資産調達、長期プロジェクト、回復、Heat低下、訓練、悪癖です。能力による追加も確認します。[Downtime Activities](https://bladesinthedark.com/downtime-activities)

## 装備とLoad

仕事の前にLoadを選び、実際の装備は仕事中に必要になってから宣言できます。基本は軽1–3、標準4–5、重6。7–9は過積載で、行動が大きく制限されます。連結された2欄の装備はLoad 2、斜体の装備はLoad 0です。特殊能力に例外があります。[Character Creation のLoadout](https://bladesinthedark.com/character-creation)

計画とその詳細を決めてから、各PCのLoadを選ぶ手順があります。[Planning & Engagement](https://bladesinthedark.com/planning-engagement)

## CoinとStash

Coinは現金・流動資産の抽象的な単位です。個人が手元に置く4を超える分は、使用するかStashへ移します。Stashは生活水準と引退後の暮らしに関係し、10ずつの段階で40まであります。Stashを取り崩すと2につきCoin 1を得ます。[Coin & Stash](https://bladesinthedark.com/coin-stash)

個人の資産とクルーの保管資産は別の概念です。Coinを携帯すると1単位がLoad 1になります。[出典](https://bladesinthedark.com/coin-stash)

## プレイ中に参照する関連ページ

| 出典 | このツールで使う際の確認点 |
| --- | --- |
| [Progress Clocks](https://bladesinthedark.com/progress-clocks) | 長期プロジェクトなどの名前、分割数、進行。治療専用クロックとは区別する |
| [Gathering Information](https://bladesinthedark.com/gathering-information) | 質問と得られた情報。各プレイブックの質問例とあわせて参照する |
| [Teamwork](https://bladesinthedark.com/teamwork) | Assist、Lead、Protect、Set upの4種類。Assistはストレス1で味方に＋1d |
| [Planning & Engagement](https://bladesinthedark.com/planning-engagement) | 6種類の計画とその詳細、Load選択、フラッシュバックの消費 |

この表の「確認点」はアプリ開発向けの整理です。リンク先ページの全ルールの翻訳ではありません。
