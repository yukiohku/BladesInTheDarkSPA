# 公式無料プレイブックの調査

[公式Downloads](https://bladesinthedark.com/downloads) のキャラクター用PDFを整理しました。基本7種類、Unquiet Deadの3種類、白紙シートの計11件を保存しています。各PDFは1ページです。確認日：2026年10月1日。

## 基本プレイブックの違い

表の初期値は各PDFに印刷された黒丸を画像で確認したものです。ここにキャラクター作成時の追加4点を配分します。記載のないアクションの印刷済み初期値は0です。XP条件はプレイブック固有の条件のみを日本語で要約しています。

| プレイブックと出典 | 特徴の参考訳 | 印刷済み初期値 | 固有のXP条件の要約 |
| --- | --- | --- | --- |
| [Cutter](https://bladesinthedark.com/sites/default/files/sheets/blades_sheets_v8_2_Cutter.pdf) | 戦闘と威圧 | Skirmish 2、Command 1 | 暴力または強要で難題に取り組む |
| [Hound](https://bladesinthedark.com/sites/default/files/sheets/blades_sheets_v8_2_Hound.pdf) | 射撃と追跡 | Hunt 2、Survey 1 | 追跡または暴力で難題に取り組む |
| [Leech](https://bladesinthedark.com/sites/default/files/sheets/blades_sheets_v8_2_Leech.pdf) | 工作と破壊活動 | Tinker 2、Wreck 1 | 技術または混乱を引き起こす手段で難題に取り組む |
| [Lurk](https://bladesinthedark.com/sites/default/files/sheets/blades_sheets_v8_2_Lurk.pdf) | 潜入と窃盗 | Prowl 2、Finesse 1 | 隠密または回避で難題に取り組む |
| [Slide](https://bladesinthedark.com/sites/default/files/sheets/blades_sheets_v8_2_Slide.pdf) | 欺きと対人交渉 | Sway 2、Consort 1 | 欺きまたは影響力で難題に取り組む |
| [Spider](https://bladesinthedark.com/sites/default/files/sheets/blades_sheets_v8_2_Spider.pdf) | 策略と計画 | Consort 2、Study 1 | 計算または謀略で難題に取り組む |
| [Whisper](https://bladesinthedark.com/sites/default/files/sheets/blades_sheets_v8_2_Whisper.pdf) | 秘術と霊への対処 | Attune 2、Study 1 | 知識または秘術の力で難題に取り組む |

能力の効果全文、NPCの設定、装備の説明は原本で確認します。以下は実装時に差を確認するための例です。

- **Cutter**：MuleはLoadの上限を変更し、Vigorousは回復に影響します。固有装備には良質な片手武器・重武器などがあります。装備欄は共通装備と分かれています。[出典](https://bladesinthedark.com/sites/default/files/sheets/blades_sheets_v8_2_Cutter.pdf)
- **Hound**：Survivorはストレス欄を1つ増やします。Ghost Hunterには追加取得の欄があります。狩猟動物や遠距離用武器を扱うため、能力を一度だけ選ぶ形式では足りない場合があります。[出典](https://bladesinthedark.com/sites/default/files/sheets/blades_sheets_v8_2_Hound.pdf)
- **Leech**：薬品を選ぶ弾帯が2つあり、それぞれ3回使用できます。Gadgetsにも複数の欄があります。装備の有無に加えて使用回数・選んだ薬品を記録する候補になります。[出典](https://bladesinthedark.com/sites/default/files/sheets/blades_sheets_v8_2_Leech.pdf)
- **Lurk**：Expertiseでは対象アクションを指定します。Ghost Veilには追加のストレス消費で効果を選ぶ仕組みがあります。能力名だけでなく選択内容も残せると便利です。[出典](https://bladesinthedark.com/sites/default/files/sheets/blades_sheets_v8_2_Lurk.pdf)
- **Slide**：Rook's Gambitはストレスを消費して別のアクション値を利用します。対人関係が能力や装備に関係します。[出典](https://bladesinthedark.com/sites/default/files/sheets/blades_sheets_v8_2_Slide.pdf)
- **Spider**：Foresightには仕事ごとの使用回数があります。Calculatingはダウンタイム活動数に影響します。使用済みの回数とリセットする時点を確認する必要があります。[出典](https://bladesinthedark.com/sites/default/files/sheets/blades_sheets_v8_2_Spider.pdf)
- **Whisper**：Ritualでは習得済み儀式を記録する余地が必要です。秘術に関する固有装備もあります。[出典](https://bladesinthedark.com/sites/default/files/sheets/blades_sheets_v8_2_Whisper.pdf)

「記録する候補」「便利」「必要」は調査からの実装提案で、原典が特定のUIを要求しているという意味ではありません。

## 特殊能力の説明に使う対訳

能力の説明本文は日本語で書き、アクション名（技能名）を参照するときは〈破壊〉のように〈〉で括ります。普通の動詞や属性名にはこの括弧を付けません。能力名やシート見出しの英日併記、判定のダイス数を表す「＋1d」「−1d」は維持します。

アクションと属性の訳は `src/constants/playbooks.ts` の `ACTIONS` / `ACTION_GROUPS`、貯蓄は `src/constants/labels.ts` の既存ラベルに合わせています。荷重・階級・注目度・窮地・古参は、英語のまま残っていた用語に今回定めた参考訳です。いずれもこのアプリの用語であり、日本語版の公式訳として扱いません。確認日：2026年10月2日。

| 原語 | 本文での表記 |
| --- | --- |
| Hunt | 〈狩り〉 |
| Study | 〈研究〉 |
| Survey | 〈観察〉 |
| Tinker | 〈工作〉 |
| Finesse | 〈技巧〉 |
| Prowl | 〈隠密〉 |
| Skirmish | 〈乱戦〉 |
| Wreck | 〈破壊〉 |
| Attune | 〈同調〉 |
| Command | 〈指揮〉 |
| Consort | 〈交流〉 |
| Sway | 〈説得〉 |
| Insight | 洞察 |
| Prowess | 身体 |
| Resolve | 意志 |
| Load | 荷重 |
| Stash | 貯蓄 |
| Tier | 階級 |
| Heat | 注目度 |
| Desperate | 窮地 |
| XP | 経験値 |
| Veteran | 古参 |

効果の条件と数値は上記の基本プレイブックPDFを参照します。共通の意味は [SRDの能力例](https://bladesinthedark.com/character-playbook)、[クルーと階級](https://bladesinthedark.com/crew)、[注目度](https://bladesinthedark.com/heat)、[判定の状況](https://bladesinthedark.com/action-roll) でも確認できます。たとえば「霊の結界」は、秘術的な物質と方法で場所を〈破壊〉し、霊を遠ざけるか引き寄せるかを選ぶ能力です。

## 共通部分と差が出る部分

基本7種類のPDFは、身元情報、ストレスとトラウマ、傷、鎧の使用、治療、Coin・Stash、12アクション、XP、装備、チームワーク、計画の欄を共有しています。能力、初期アクション値、NPCの知人一覧、固有装備、XP条件、情報収集の質問がプレイブックごとに異なります。[基本各PDFの保存先](originals/playbooks/)

基本シートの視覚確認ではストレス9枠、トラウマ4枠、治療4分割、プレイブックXP8枠、属性XP各6枠です。能力による例外は別途扱います。基本のLoad上限は軽3・標準5・重6ですが、Muleなどで変わります。[Cutter原本](https://bladesinthedark.com/sites/default/files/sheets/blades_sheets_v8_2_Cutter.pdf)、[SRD Character Creation](https://bladesinthedark.com/character-creation)

装備はチェック欄の連結でLoadの大きさが分かり、斜体の装備はLoadに数えません。単に「1項目＝Load 1」としてデータ化すると原本の意味を失います。[SRD Character Creation](https://bladesinthedark.com/character-creation)

## Unquiet Deadと白紙シート

以下も収集しました。基本プレイブックと状態欄や能力の扱いが異なるため、対応を進める際には追加調査を行います。ここでは入手先と主な相違を記録します。

| 資料と出典 | 原本で確認できる主な相違 |
| --- | --- |
| [Ghost](https://bladesinthedark.com/sites/default/files/sheets/blades_sheets_v8_2_Ghost.pdf) | DrainとGloom、生命力へのNeed、憑依や霊体の能力 |
| [Hull](https://bladesinthedark.com/sites/default/files/sheets/blades_sheets_v8_2_Hull.pdf) | DrainとWear、Functions、機械のFrameとその機能 |
| [Vampire](https://bladesinthedark.com/sites/default/files/sheets/blades_sheets_v8_2_Vampire.pdf) | Undead、Dark Talent、特殊なトラウマ条件、生命力を求めるVice、Strictures |
| [Blank Character Sheet](https://bladesinthedark.com/sites/default/files/sheets/blades_sheets_v8_2_Blank_Character_Sheet.pdf) | 固有の能力・装備・知人を記入する白紙のキャラクターシート |

## SRDのプレイブック項目との関係

[SRD Character Playbook](https://bladesinthedark.com/character-playbook) はプレイブックを設計するための汎用ひな形と能力例です。基本7種類の完成済みデータ一覧としては扱いません。たとえばSRDの能力例ではArcane fighter、Supernatural Ward、Arcane mindという名称がありますが、配布シートにはGhost Fighter、Ghost Ward、Ghost Mindがあります。名称だけで自動対応させず、内容と出典を一緒に確認します。

## 補助PDF

- [Full Player's Kit](https://bladesinthedark.com/sites/default/files/blades_playerkit_v8_2.pdf)：32ページ。キャラクター・クルー作成とルール参照などをまとめた配布資料。
- [Core Play Sheets](https://bladesinthedark.com/sites/default/files/blades_core_playsheets.pdf)：3ページ。プレイ手順を確認するための参照資料。

これらは取得とPDFとしての読込を確認しましたが、全ページの詳細な要約は今回作成していません。
