# サマリー画面の原典照合

確認日：2026年10月3日。サマリー画面の5章を、公式英語SRDの該当節と照合した記録。日本語は本アプリの参考訳・要約であり、日本語版の公式訳ではない。

画面本文は [rulesSummary.ts](../../src/constants/rulesSummary.ts)、画面は [RulesSummaryView.tsx](../../src/summary/RulesSummaryView.tsx) に置く。原典リンクは下表に集約し、画面には末尾の著作者・ライセンスのみ表示する。各章末尾の出典一覧と先頭へ戻るボタンは掲載しない。今回の原典確認は公開ページの閲覧によるもので、原本ファイルの追加保存や既存の取得ハッシュの更新は行っていない。

## 掲載項目と確認した節

| 掲載項目 | 公式SRDと該当節 | 確認内容 |
| --- | --- | --- |
| ダイスの基本 | [Core System](https://bladesinthedark.com/core-system) の Rolling the Dice | 最大の出目、複数の6、0個以下のときの2個の低い方、0個でクリティカル不可 |
| 判定の手順と結果 | [Action Roll](https://bladesinthedark.com/action-roll) の6手順と Action Roll | 技能の選択はプレイヤー、状況・効果の設定はGM。状況ごとの4–5と1–3を別々に要約 |
| 効果 | [Effect](https://bladesinthedark.com/effect) の効果表、Assessing Factors、Trading Position for Effect | 3段階とクロックの1／2／3区画。効果を決める要素は相手の弱点・人数や大きさ・道具の質で説明し、危険を増やして効果を高める交換は具体例で示す。効果なし・極大効果と逆方向の交換は画面から省く |
| 追い込みと追加ダイス | [Stress & Trauma](https://bladesinthedark.com/stress-trauma) の Pushing Yourself、[Action Roll](https://bladesinthedark.com/action-roll) の Add Bonus Dice | 利益ごとにストレス2、各利益1回。＋1dの追い込みと取引を併用しない。援助は別枠 |
| 協力 | [Teamwork](https://bladesinthedark.com/teamwork) の Assist、Lead a group action、Protect、Set up | 援助1人・ストレス1。集団行動は同じ技能の最良の判定結果を使い、指揮役が1–3の参加者ごとにストレス1。かばう・布石の対象と効果 |
| 集団行動の例外 | [Crew Playbook](https://bladesinthedark.com/crew-playbook) の Synchronized | 別々の判定の6を合算できる能力が明示される。通常の集団行動の規則とこの例外を区別 |
| 悪影響と傷 | [Consequences & Harm](https://bladesinthedark.com/consequences-harm) の冒頭と Harm | 悪影響は判定結果や敵の行動で生じる傷・問題として短く説明し、5分類と厄介事の裁定上の注意は省く。傷のペナルティは行動に該当するとき。空きがない場合は上段へ、レベル3満杯時は破滅的な結果 |
| 抵抗と鎧 | [Resistance & Armor](https://bladesinthedark.com/resistance-armor) の Resistance Roll、Armor、Death | 抵抗は成立し、軽減・回避範囲はGM。費用は6－採用した出目、クリティカルでストレス1解消。同じ悪影響は1回、複数の悪影響には別々に抵抗可能 |
| 属性値 | [Actions & Attributes](https://bladesinthedark.com/actions-attributes) の Attribute Ratings | 最初の点が埋まっている技能数を数え、技能値を合計しない。属性の日本語は既存シートに合わせる |
| 特殊鎧 | [Character Creation](https://bladesinthedark.com/character-creation) の Special Armor | 対応能力を持つ場合のみ使用。回復時期はアプリの能力定義と原典の個別説明に従い、共通の鎧リセットと混同しない |
| トラウマ | [Stress & Trauma](https://bladesinthedark.com/stress-trauma) の Trauma | 最後のストレス枠、離脱、復帰時0、次の悪癖充足、永続性、4つ目で通常の悪党としての活動終了 |
| 計画と初動判定 | [Planning & Engagement](https://bladesinthedark.com/planning-engagement) の計画一覧、Item Loadouts、Engagement Roll、How long does it last | 6つの計画と詳細、基本1dと有利・不利、開始時の状況。クリティカルでは最初の障害を越える |
| Load | [Character Creation](https://bladesinthedark.com/character-creation) の Loadout | 軽1–3、標準4–5、重6、過積載7–9、必要になってから装備宣言、Load 0や上限補正の例外 |
| フラッシュバック | [Planning & Engagement](https://bladesinthedark.com/planning-engagement) の Flashbacks、Limits of flashbacks | 0／1／2以上のストレス。必要な判定は別に解決。ダウンタイム活動はコイン1か評判1。既成事実を取り消さない |
| 情報収集（画面では省略） | [Gathering Information](https://bladesinthedark.com/gathering-information) の本文、Investigation、Gather Information | 一般知識・障害あり・障害なしの扱い、GMの正直な回答、複雑な調査は長期プロジェクトを確認。手順・判定の使い分け・質問例は画面に掲載しない |
| 運勢判定 | [Fortune Roll](https://bladesinthedark.com/fortune-roll) の本文と Fortune Roll | 値を基準に有利・不利で増減、適した値がない場合、結果は成果の程度。アクション判定の悪影響表と区別 |
| ダウンタイム | [Downtime Activities](https://bladesinthedark.com/downtime-activities) の本文と6活動 | 通常2回・戦争中1回・追加費用、知人の＋1d、コインで結果の段階上昇、活動と普通の行動の区別 |
| 資産調達 | 同ページの Acquire asset | 一時利用、階級に対する品質－1／0／＋1／＋2、最低品質、再調達、クリティカル超の費用、危険な品の注目度、恒久入手 |
| プロジェクトと注目度 | 同ページの Long-term project、Reduce heat | 手段に合う技能を振り、結果1–3／4–5／6／クリティカルで進行・低下1／2／3／5 |
| 回復 | 同ページの Recover と治療クロックの説明 | 基本4区画、全傷を1段階下げ、進行繰り越し、新しい傷で進行消去。活動を消費するのは患者。自己治療と無治療の費用を区別 |
| 悪癖 | [Vice](https://bladesinthedark.com/vice) の Vice Roll、Overindulgence、Ignoring your vice | 最も低い属性と出目による解消、現在値を上回った場合、過剰耽溺4種類と姿を消した場合の回復、未充足時のトラウマ数のストレス |
| 個人資産 | [Coin & Stash](https://bladesinthedark.com/coin-stash) の Coin、Stash & Retirement、Removing coin from your stash | 手元4、携帯コインのLoad、暮らしと引退、貯蓄2から現金1。クルー保管の詳細表は扱わない |

## 参考訳と省略の扱い

活動回数は1回のダウンタイムごとの回数と明記する。Downtime Activities の追加活動の費用と再照合し、「コイン1またはクルーの評判1を支払うと、活動を1回追加できる」と、支払いによって回数を増やせる関係を明記する。

ダウンタイム判定の＋1dは Downtime Activities の “a friend or contact” による協力と再照合した。[Crew Playbook の Contacts](https://bladesinthedark.com/crew-playbook) はクルーとつながりのある人物の一覧なので、contact を「連絡先」と訳さず、画面では「自分やクルーの知人」と説明する。人物から助けてもらう条件と、ダウンタイムの判定への補正であることを維持する。

判定手順は見出しと番号付きリストを省き、「プレイヤーが技能を選ぶ → GMが判定状況・効果を決める → 技能値に補正を加えた数のd6を振る」の一文で表示する。担当とダイス数が読み取れる文量を保つ。ダイスの読み方と効果のクロック進行は表に集約し、「判定状況と効果」の説明段落は省く。

判定状況別の結果は、3表の同時表示から小さなタブでの切り替えに変更した。各状況の結果本文は維持し、初期表示はリスキー。ダイス・状況・効果の表を画面幅に応じて3列・2列・1列にまとめる。タブ操作は保存データを変更しない。

フラッシュバックの費用表と扱いの説明は、「フラッシュバック」の一つの見出しにまとめる。過去の準備の宣言、ストレスの費用表、必要な判定、ダウンタイム活動の支払い、既成事実を取り消せない制限の順に表示する。ルール内容は維持する。

冒頭は、必要になった場面で「過去に準備していた」ことにでき、GMが内容に応じて支払うストレスを決める、と説明する。Flashbacksの過去の行動を現在の状況に反映する手順と再照合し、事前に宣言しておいた準備だけを使う仕組みと誤読されにくい表現にする。必要な判定と既成事実を取り消せない制限は続く本文に維持する。

Loadの表と装備を選ぶタイミングの説明も、「Loadと装備の宣言」の一つの見出しにまとめる。仕事前の携行量の選択、Loadの表、使う場面での装備宣言とLoad合計・Load 0の説明の順に表示する。

情報収集の表と運勢判定内の情報収集への補足は、プレイヤー向けサマリーの掲載範囲から外す。代わりの説明は追加せず、ダウンタイムの活動回数で制限しない行動の例からも情報収集を省く。運勢判定のダイス数・結果と、ダウンタイムの長期プロジェクトの説明は維持する。

読者はD&DなどのTRPGを長く遊んだプレイヤーを想定する。画面全体と各章の導入、目的・行動の説明を促す一般論、判定不要な行動や一般知識の説明、アプリへの手動記録案内を削除した。技能選択の担当、判定状況と効果、抵抗、Load、フラッシュバック、活動回数など、Blades in the Dark固有の手順・数値・条件は残す。能力説明を参照するだけの注意書きは省き、出典・著作者・ライセンスは末尾に維持する。この編集では新しいルールや自動処理を追加しない。

判定状況・効果・悪影響などの用語は [srd-characters.md](srd-characters.md#判定の状況と効果の対訳) に合わせる。布石となる行動は Set up、悪魔の取引は Devil's Bargain の参考訳として使う。計画名は既存の [playbooks.ts](../../src/constants/playbooks.ts) の `PLANS` に合わせる。

クルーの状態を参照するための用語は、Heatを「注目度」、Repを「評判」、Tierを「階級」とする参考訳。クルー管理は追加せず、必要な値は卓の記録で確認する。入力欄や自動計算として扱わない。

［優位］な状況の4–5と1–3は、撤退・別の方法・より危険な機会を選ぶ余地を残した。結果表は代表的な悪影響を短く示し、全ての列挙や原典の長い例を掲載しない。

追い込みの＋1dと取引の＋1dが排他であることは Action Roll、追い込みで選べる利益が別々であることは Stress & Trauma に基づく。効果を上げる追い込みまで取引と排他であるようには説明しない。

集団行動への援助は Teamwork の Assist と再照合し、集団行動の判定を振らない仲間が援助し、＋1dの対象は参加者1人だけであることを明記する。「協力できる範囲」という曖昧な見出しを改め、指揮役の技能値に関する補足はサマリーから省く。

集団行動のクリティカルは「参加者の誰かがクリティカルを出せば、その結果を全員に適用します。」の一文に絞る。Teamwork の最良の判定結果を採用する規則と、Crew Playbook の Synchronized を再照合した。別々の判定の6に関する具体例と、特殊能力による例外の一般的な注意書きは画面から省く。

抵抗は悪影響を抑える処理として説明する。行動の失敗そのものを成功に置き換える説明はしない。一方、機会の喪失も悪影響なので、抵抗できないと一律に断定しない。

「悪影響」の説明に、軽減・回避するために抵抗判定を行えることを加える。「抵抗判定」は番号付きの4手順を、振るダイスとストレスの計算の2段落にまとめる。「抵抗に失敗はない」という独立見出しは設けず、宣言した時点で抵抗に成功することを、ストレスを受ける説明につなげる。「成立」「費用」という抽象的な表現は避ける。GMが決める軽減・回避の範囲はダイスの説明に添える。同じ悪影響への回数制限、複数の悪影響に個別に抵抗できること、判定後に取りやめられない条件の注釈は画面から省く。属性値の数え方も、シートに抵抗値を表示しているため画面から省く。0個以下の扱いは「判定」章の「ダイスの読み方」に集約する。

特殊能力・クルーの強化による例外を網羅しない。全能力・全装備の再掲載、報酬・厄介事・派閥の詳細表、キャラクター作成の詳細手順は対象外。経験値条件と成長は既存シートに集約し、訓練は活動名と参照案内に留める。

## 出典と実装の責務

要約と画面への再構成は本アプリによる変更。SRDの著作者・利用区分は [資料フォルダの案内](README.md#出典と利用区分) と [公式Licensing](https://bladesinthedark.com/licensing) を参照する。

サマリーは保存データを変更しない静的な参照画面。シートの紙色・罫線・インクのCSS変数を共有するが、シートの入力部品や保存処理は変更しない。ルール本文の変更時はこの照合表、画面本文、関連する表示・操作テストを一緒に確認する。
