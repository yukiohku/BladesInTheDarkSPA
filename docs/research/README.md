# Blades in the Dark キャラクターシート改善のための資料

公式無料プレイブックと公式SRDを調べ、キャラクターシートの改善に必要な情報を整理する場所です。確認日は **2026年10月1日**。原本の公開日や最終更新日を意味する日付ではありません。

まず [プレイブック一覧](playbooks.md) でキャラクターごとの差を確認し、[SRDのキャラクター関連ルール](srd-characters.md) で共通の仕組みを読むと、[現行アプリとの比較](app-comparison.md) の改善候補を検討できます。日本語の説明はこのプロジェクト用の要約・参考訳です。

## 資料の構成

| 場所 | 内容 |
| --- | --- |
| [playbooks.md](playbooks.md) | 基本7種類の初期アクション、XP条件、特徴。特殊3種類と白紙シートの位置づけ |
| [srd-characters.md](srd-characters.md) | 作成、判定、ストレス、傷、回復、成長、悪癖、資産の要点と出典 |
| [heritages.md](heritages.md) | 出自6地域の特徴、入力欄の意味、アプリの注釈と出典 |
| [app-comparison.md](app-comparison.md) | 原典と実装の対応、相違点、改善候補 |
| [sources.json](sources.json) | 全30資料のURL、取得日、保存先、SHA-256、サイズ、PDFページ数 |
| `originals/playbooks/` | 公式配布のキャラクターシートPDF 11件 |
| `originals/reference/` | Player's Kit と Core Play Sheets のPDF 2件 |
| `originals/srd/` | SRD本文15ページと配布・ライセンスページのHTML 17件 |
| `originals/previews/` | プレイブックを画像化した確認用PNG |

原本はこの作業でローカルに保存済みです。`originals/` はこのフォルダの `.gitignore` でGit管理から除外しているため、別の環境へのcloneには含まれません。Gitには要約と取得記録を残します。ファイル名の `v8_2` は配布ファイルの名称で、SRD全体のバージョンではありません。

## 収集元と対象範囲

- [公式Downloads](https://bladesinthedark.com/downloads) に掲載された英語版を使用。Cutter、Hound、Leech、Lurk、Slide、Spider、Whisper、Ghost、Hull、Vampire、Blank Character Sheet を取得しました。
- 補助資料として Full Player's Kit と Core Play Sheets を取得しました。Player's Kitにはクルーや地図も含まれますが、今回の要約の中心はキャラクターです。
- [公式SRDのThe Characters](https://bladesinthedark.com/characters) とキャラクター作成・プレイブックの項目を中心に、プレイ中の操作に関係するページも取得しました。
- クルー専用PDF、Large Print版、Deep Cuts、Blades '68、ファン制作資料、日本語版資料の収集は今回の対象に含めていません。

## 出典と利用区分

SRDの利用案内は [公式Licensing](https://bladesinthedark.com/licensing) と [CC BY 3.0 Unported](https://creativecommons.org/licenses/by/3.0/) を参照してください。公式サイトはSRDの内容をこのライセンスで案内しています。公式無料PDFに含まれる設定・NPC・図版などの全内容がSRDに含まれるとは扱いません。無料で取得できることと、同じ条件で再配布・製品に組み込めることは区別します。

このフォルダのSRD要約は、John Harper が執筆・開発した One Seven Design の [Blades in the Dark](https://bladesinthedark.com/) のSRDに基づき、[Creative Commons Attribution 3.0 Unported](https://creativecommons.org/licenses/by/3.0/) のもとで作成しました。原文から日本語への要約、項目の再構成、アプリとの比較を加えています。非公式の資料で、原著者による承認・監修を示すものではありません。

## 追加調査の残し方

1. 公式配布ページから資料をたどり、URLと取得日を記録する。
2. 原本を `originals/` 内に保存し、`sources.json` にサイズとSHA-256を追加する。更新された資料は以前の取得記録と区別する。
3. 要約に直接の出典を付ける。SRD・プレイブック原本・アプリの実装・改善提案を区別する。
4. 初期値の黒丸、装備の連結チェック欄、斜体のような見た目に意味がある箇所はPDF画像でも確認する。テキスト抽出だけで判定しない。

原本を再取得する場合は `sources.json` の各 `url` から `local_path` へ保存してください。ハッシュは2026年10月1日に取得した内容の識別用で、公式が提供した署名ではありません。
