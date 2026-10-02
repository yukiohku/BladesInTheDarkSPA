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

アクションと属性の訳は `src/constants/playbooks.ts` の `ACTIONS` / `ACTION_GROUPS`、貯蓄は `src/constants/labels.ts` の既存ラベルに合わせています。荷重・階級・注目度・判定状況・効果の段階・古参は、英語のまま残っていた用語に今回定めた参考訳です。いずれもこのアプリの用語であり、日本語版の公式訳として扱いません。確認日：2026年10月2日。

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
| Position | 判定状況 |
| Controlled | ［優位］な状況 |
| Risky | ［リスキー］な状況 |
| Desperate | ［絶望的］な状況 |
| Effect | 効果 |
| Limited | ［限定的］な効果 |
| Standard | ［標準的］な効果 |
| Great | ［大きな］効果 |
| Result / Outcome（判定について） | 判定結果 |
| Consequence | 悪影響 |
| Complication | 厄介事 |
| Harm | 傷 |
| Fortune Roll | 運勢判定 |
| Engagement Roll | 初動判定 |
| Potency | 有効性 |
| Scale | 規模 |
| Quality | 品質 |
| Push Yourself | 自分を追い込む |
| Resistance Roll | 抵抗判定 |
| Downtime | ダウンタイム |
| Flashback | フラッシュバック |
| XP | 経験値 |
| Veteran | 古参 |

判定状況と効果の意味・文章中の表記、判定結果・悪影響・有効性などの使い分けは [判定の対訳](srd-characters.md#判定の状況と効果の対訳) を参照します。基本7種の特殊能力の本文への反映と原文照合は、以下の検証記録を参照します。

効果の条件と数値は上記の基本プレイブックPDFを参照します。共通の意味は [SRDの能力例](https://bladesinthedark.com/character-playbook)、[クルーと階級](https://bladesinthedark.com/crew)、[注目度](https://bladesinthedark.com/heat)、[判定の状況](https://bladesinthedark.com/action-roll) でも確認できます。たとえば「霊の結界」は、秘術的な物質と方法で場所を〈破壊〉し、霊を遠ざけるか引き寄せるかを選ぶ能力です。

## 特殊能力の説明の検証記録

基本7種の固有能力55種と共通の古参を、上記の公式無料シートv8.2と照合しました。確認日：2026年10月3日。53種の説明を修正し、意味が明確な荷運び・鏡を見るようにの2種は維持しています。能力名、数値補正の実装、取得・保存の仕組みは変更していません。以下は本アプリの参考訳・要約を見直した記録です。

説明は「いつ／何に対して使えるか」と「何ができるか」を文でつなぎ、短縮のために条件や対象を省かないようにしました。特に次を区別しています。

- 有効性は、特定の相手や状況で働きかけが効きやすいことを示す、効果の評価要素です。霊への語り・霊との戦い・霊の狩人では具体的な働きかけも書き、効果が必ず1段階上がるとは書きません。[Effect](https://bladesinthedark.com/effect)
- 効果の1段階上昇は、成功時に得られる成果を増やす指定です。判定結果の1段階上昇は、出目の数値に1を加える指定ではなく、1〜3→4・5のように結果の段階を上げる指定です。悪癖の制御はこれらと異なり、採用する出目そのものを1か2だけ増減します。[Effect](https://bladesinthedark.com/effect)、[Downtime Activities](https://bladesinthedark.com/downtime-activities)、[Vice](https://bladesinthedark.com/vice)
- 特殊鎧は使用枠を消費すること、対象となる悪影響、ストレスを消費せず自分を追い込める選択肢を明記します。生まれながらの戦士は傷を1段階軽減し、策士は仲間の悪影響を防ぐか軽減します。[SRDの能力例](https://bladesinthedark.com/character-playbook)
- 発明・製作の処方や設計は、取得時点で1つ習得していることを明記します。作成時だけの恩恵とは扱いません。[Crafting](https://bladesinthedark.com/crafting)

SRDの能力例は、無料シートと条件・効果が一致する部分の補足に限って使用しました。名称が異なる能力から追加条件を持ち込んではいません。たとえば霊の結界に、SRDの別名の能力だけに書かれた面積・持続時間などは追加していません。

| プレイブック | 能力 | 照合・修正の要点 |
| --- | --- | --- |
| Cutter | Battleborn / 生まれながらの戦士 | 攻撃による傷の1段階軽減と、戦闘中のストレス不要の追い込みを区別 |
| Cutter | Bodyguard / 護衛 | 仲間をかばって引き受ける悪影響への抵抗と、脅威を予測する情報収集を区別 |
| Cutter | Ghost Fighter / 霊との戦い | 手・近接武器・道具への付与、有効性、霊の拘束と捕獲を明記 |
| Cutter | Leader / 指揮官 | 〈指揮〉する配下への継戦・効果・鎧の恩恵だと明記 |
| Cutter | Mule / 荷運び | 軽5・標準7・重8を確認。説明を維持 |
| Cutter | Not to Be Trifled With / 侮れない相手 | 追い込みの通常の恩恵に加えて、力業か小集団との近接戦を選ぶ |
| Cutter | Savage / 獰猛 | 暴力が周囲に与える恐怖と、怯えた相手への〈指揮〉を分ける |
| Cutter | Vigorous / 頑健 | 恒久的な治療1区画と、自分が治療を受ける判定への＋1d |
| Hound | Sharpshooter / 名射手 | 追い込みの通常の恩恵に加えて、遠距離攻撃か連射による制圧を選ぶ |
| Hound | Focused / 集中 | 不意・恐怖・混乱・見失いなどへの抵抗と、射撃戦・追跡の追い込み |
| Hound | Ghost Hunter / 霊の狩人 | 狩猟動物の有効性、初回から秘術能力を1つ得ること、追加取得を明記 |
| Hound | Scout / 斥候 | 居場所の情報収集の効果と、準備した場所・迷彩での発見回避を区別 |
| Hound | Survivor / 生存者 | 荒野の瘴気への免疫、現地の動植物による生存、ストレス上限＋1 |
| Hound | Tough as Nails / 筋金入り | 軽減するのはペナルティで、傷のレベル自体は変わらない。レベル4は致命的 |
| Hound | Vengeful / 復讐心 | 個人の追加経験値条件と、クルーが協力した場合のクルー経験値 |
| Leech | Alchemist / 錬金術師 | 錬金術の発明・製作の判定結果1段階上昇と、取得時の処方 |
| Leech | Analyst / 分析家 | 調査・新しい処方や設計の習得に関するクロックへ合計2区画を配分 |
| Leech | Artificer / 工匠 | 電霊技術の発明・製作の判定結果1段階上昇と、取得時の設計 |
| Leech | Fortitude / 忍耐 | 疲労・衰弱・薬品による悪影響と、技術作業・薬品を扱う際の追い込み |
| Leech | Ghost Ward / 霊の結界 | 秘術の物質・手法を使う〈破壊〉で、霊が避ける場所か引き寄せられる場所にする |
| Leech | Physicker / 医師 | 〈工作〉による身体への処置、病気・死体の〈研究〉、クルー全員の治療 |
| Leech | Saboteur / 破壊工作員 | 作業音が小さく、損傷が簡単な目視では見つかりにくい |
| Leech | Venomous / 毒持ち | 選んだ薬物・毒への免疫と、追い込んだ際の分泌・蒸気としての呼出 |
| Lurk | Infiltrator / 潜入者 | 警備突破の効果が、相手の高い品質・階級によって下がらない |
| Lurk | Ambush / 待ち伏せ | 隠れた状態からの攻撃、または罠の作動の判定に＋1d |
| Lurk | Daredevil / 命知らず | ［絶望的］な状況での＋1dは、その行動の悪影響への抵抗すべてを−1dにすることが条件 |
| Lurk | The Devil’s Footsteps / 悪魔の足取り | 追い込みに加える恩恵を、人間離れした運動か同士討ちから選ぶ |
| Lurk | Expertise / 熟練 | 選んだ技能の集団行動で、指揮役が失敗判定から受けるストレスを最大1にする |
| Lurk | Ghost Veil / 霊の帳 | 基本のストレス2と、延長・透明化・浮遊の各ストレス1を区別 |
| Lurk | Reflexes / 反射神経 | 行動順が問題になる場面で先行。同能力の者同士は同時 |
| Lurk | Shadow / 影 | 発見・警備による悪影響への抵抗と、運動・隠密行動の追い込み |
| Slide | Rook’s Gambit / ルークの策略 | ストレス2で別の技能の判定に最高のアクション値を使い、応用方法を説明 |
| Slide | Cloak & Dagger / 偽装と奇襲 | 変装などによる惑わせ・疑いの回避と、正体を明かす驚きによる先手 |
| Slide | Ghost Voice / 霊への語り | 凶暴な霊・悪魔とも人間のようにやり取りでき、対話の有効性で有利になる |
| Slide | Like Looking into a Mirror / 鏡を見るように | 自分への嘘が常に分かることを確認。説明を維持 |
| Slide | A Little Something on the Side / 副収入 | ダウンタイム終了時に貯蓄が2増える |
| Slide | Mesmerism / 催眠 | 〈説得〉のやり取りを忘れさせ、次のやり取りで記憶が戻る。「会う」に限定しない |
| Slide | Subterfuge / 欺瞞 | 疑われる・説得されることによる悪影響と、人を欺く行動の追い込み |
| Slide | Trust in Me / 私を信じて | 親密な相手への＋1dは対人交渉以外にも適用 |
| Spider | Foresight / 先見 | 仕事ごとに2回、ストレス不要で判定を援助。準備の説明が必要 |
| Spider | Calculating / 計算ずく | 自分かクルーの1人を選んで、ダウンタイム活動を1回増やす |
| Spider | Connected / 人脈 | 資産調達・注目度低下の判定結果1段階上昇を明記 |
| Spider | Functioning Vice / 悪癖の制御 | 回復量に使う出目を1か2増減。一緒に悪癖を満たす仲間も対象 |
| Spider | Ghost Contract / 霊の契約 | 人間以外とも握手で契約。双方に印が現れ、破った側がレベル3の傷を受ける |
| Spider | Jail Bird / 牢の常連 | 投獄時の指名手配・クルー階級補正と、投獄判定とは別の勢力関係値＋1 |
| Spider | Mastermind / 策士 | 仲間への悪影響の防止・軽減と、情報収集・長期プロジェクトの追い込み |
| Spider | Weaving the Web / 網を張る | 標的の情報を〈交流〉で集める判定と、その仕事の初動判定に＋1d |
| Whisper | Compel / 使役 | 霊界への〈同調〉による出現・命令と、自分だけへの恐怖免除 |
| Whisper | Ghost Mind / 霊の感覚 | 近くの超常的な存在への気づきと、超常についての情報収集に＋1d |
| Whisper | Iron Will / 鉄の意志 | 目にした存在が引き起こす恐怖への免疫と、意志の抵抗判定に＋1d |
| Whisper | Occultist / 秘術家 | 神・悪魔などとの〈交流〉を条件に、その信奉者への〈指揮〉に＋1d |
| Whisper | Ritual / 儀式 | 現象・存在を呼ぶ儀式の〈研究〉・創作・実行と、取得時に習得済みの1つ |
| Whisper | Strange Methods / 奇妙な手法 | 秘術の発明・製作の判定結果1段階上昇と、取得時の設計 |
| Whisper | Tempest / 嵐 | 追い込んだ際、稲妻の攻撃かすぐ近くの天候変化を選ぶ |
| Whisper | Warded / 守護 | 超常的な悪影響への抵抗と、秘術の力への対処・利用の追い込み |
| 共通 | Veteran / 古参 | 他の出典の能力を選ぶ。アプリは他の基本プレイブックの取得と自由記入で対応し、既存の案内を維持 |

自動反映する補正と手動で裁定する内容の境界は従来どおりです。説明を詳しくしても、判定・傷の軽減・ダウンタイムの成果などを新たに自動処理する変更は行っていません。

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
