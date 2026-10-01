# 原典と現行キャラクターシートの比較

2026年10月1日の公式資料と現在のコードを比較し、改善を検討するための候補を整理しました。今回は資料収集のみで、アプリの動作や保存データは変更していません。以下は実装提案であり、すべてを自動化する仕様決定ではありません。

## 調査から見つかった相違

| 項目 | 原典で確認したこと | 現行実装で確認したこと | 改善候補 |
| --- | --- | --- | --- |
| プレイブック | 基本7種類と特殊3種類が配布されている。[一覧](playbooks.md) | `PLAYBOOKS` はCutterのみ | まず基本7種類の定義と切り替えを検討する |
| 初期アクション | CutterはSkirmish 2、Command 1。そこに4点追加する。[PDF](https://bladesinthedark.com/sites/default/files/sheets/blades_sheets_v8_2_Cutter.pdf)、[SRD](https://bladesinthedark.com/character-creation) | `defaultOfficial().ratings` は空 | 新規作成の初期値と追加配分を支援する。既存キャラクターに自動加算しない |
| 治療クロック | 基本4分割。[Recover](https://bladesinthedark.com/downtime-activities) | `HEALING_CLOCK_SEGMENTS = 6` がUIとJSON正規化に使われる | 基本値と能力による例外を分ける。保存済み進行をどう移すか決める |
| XPの長さ | Cutter原本はプレイブック8枠、各属性6枠。[PDF](https://bladesinthedark.com/sites/default/files/sheets/blades_sheets_v8_2_Cutter.pdf) | 共通の `XP_TRACK_MAX = 6` をすべてに使う | プレイブックと属性を別の上限にする |
| 個人資産 | Coinは手元4まで、Stashは40までの段階。[SRD](https://bladesinthedark.com/coin-stash) | `COIN_MAX = 9` をCoinとStashに共用。型のコメントはクルーのコインと記載 | 個人とクルーの資産、CoinとStashの意味と上限を区別する |
| Cutter装備 | 固有の良質な武器など6項目がある。[PDF](https://bladesinthedark.com/sites/default/files/sheets/blades_sheets_v8_2_Cutter.pdf) | `itemsPlaybook` は大型武器・鎧・工具など共通装備の一部。原本の固有装備6項目を含まない | 共通装備と固有装備を原本に合わせて分類する |
| 装備のLoad | 連結欄と斜体に意味があり、0や2などのLoadがある。[SRD](https://bladesinthedark.com/character-creation) | `NamedItem` はid・name・jaのみ、所持チェックはboolean | 装備ごとのLoad値・使用回数と仕事ごとの上限を記録する |
| 傷の記録 | レベル1・2は各2欄、レベル3は1欄。[PDF](https://bladesinthedark.com/sites/default/files/sheets/blades_sheets_v8_2_Cutter.pdf) | `HARM_ROWS` は欄数を持つが、`harmNotes` は各レベルにつき1文字列 | 同じレベルの傷を別々に管理する場合の保存形式を検討する |
| 特殊能力の成長 | 成長時に能力を追加する。[SRD](https://bladesinthedark.com/advancement) | 公式欄の `abilityId` は単一。別に自由入力の `specialAbilities` がある | 所有する複数能力とプレイ中に表示する能力の関係を整理する |
| 身元の詳細 | 偽名、出自・経歴の詳細、悪癖の提供者と場所を記す。[SRD](https://bladesinthedark.com/character-creation) | 名前・外見や選択IDはあるが、専用の偽名・提供者のフィールドはない | 名前だけでなく人物像と提供者の情報を保持する |
| Background | PDFの選択肢にTradeがある。[PDF](https://bladesinthedark.com/sites/default/files/sheets/blades_sheets_v8_2_Cutter.pdf) | `CUTTER.backgrounds` は6件でTradeがない | 原本と照合して選択肢を補う |
| トラウマ | 基本ルールでは永続的。[SRD](https://bladesinthedark.com/stress-trauma) | READMEにはトラウマの「克服」、UIには増減や記録の取り消しがある | 入力訂正・履歴取り消しと、ルール上の回復を区別する |

## 参照したコード

- [src/constants/playbooks.ts](../../src/constants/playbooks.ts)：プレイブック、装備、選択肢、各上限。
- [src/constants/defaults.ts](../../src/constants/defaults.ts)：新規作成時の初期値。
- [src/types/character.ts](../../src/types/character.ts)：保存する項目と `official` の構造。
- [src/lib/serialize.ts](../../src/lib/serialize.ts)：読み込み時の正規化と数値の上限。
- [src/sheet/parts.tsx](../../src/sheet/parts.tsx)：Coin、XP、治療クロックの描画。
- [src/sheet/OfficialSheetView.tsx](../../src/sheet/OfficialSheetView.tsx)：能力、装備、傷の欄の参照方法。
- [README.md](../../README.md)：ツールの説明と独自項目の扱い。

## 原典の項目と独自項目

現行の `attributes` にある8種類の値や `edges` は、SRDの12アクション・3属性とそのまま対応する項目ではありません。動機・欠点のリスト、武器の数値的なダメージ欄、独自ムーブなども、今回の基本プレイブックと同じ形式とは扱いません。原典にある信念や動機への言及と、アプリ独自の専用リストの構造は分けて検討します。

`official` と既存の編集用フィールドには似た項目がありますが、保存形式と参照箇所が異なります。原典との差を見つけたことだけを理由に既存項目を削除しません。

## 改善を進める順序の案

1. Cutterの初期値、装備、XP・回復・資産の基本値を原典と照合して確定する。
2. 複数プレイブックに必要なデータを整理する。共通項目、初期値、固有能力・装備、能力で変わる上限を分ける。
3. キャラクター作成の入力と、仕事中に使う操作を整える。
4. ダウンタイム、成長、特殊プレイブックを必要に応じて拡張する。

保存形式を変更する場合は、型・初期値・reducer・JSON正規化・UIを同時に確認し、旧JSONを読めるようにします。治療やXPの上限修正でも既存値が切り捨てられる可能性があるため、移行方針を先に決める必要があります。
