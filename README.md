# Blades in the Dark キャラクターシート

Blades in the Dark のキャラクターシートを日本語で管理する非公式のSPAです。
React / TypeScript / Viteで動作し、サーバーやデータベースは使いません。

## 機能

- 基本7種（Cutter・Hound・Leech・Lurk・Slide・Spider・Whisper）に対応。特殊プレイブック（Ghost・Hull・Vampire）は未対応です。
- 三列の紙面に近いプレイシートで、ストレス・傷・能力・装備・資産・XPを操作できます。
- 「編集」で初期設定（プレイブック選択、アクション初期配分、人物設定）、特殊能力、状態、装備、データを入力します。
- 「サマリー」でBlades in the Dark固有のルールを参照できます（閲覧専用）。
- ブラウザの `localStorage` に自動保存します。1キャラクターをJSONで書き出し・取り込みできます。

判定、成長、トラウマ、傷の繰り上げ・回復などの裁定は手動で処理します。

## 使い方

1. 初回はプレイブック未選択のシートが開きます。「編集 → 初期設定」で基本7種から選びます。
2. アクションは固定3点に追加4点（各最大2）を配分し、「初期配分を確定」で確定します。
3. 「特殊能力」で能力を取得し、プレイ中は「シート」で操作します。
4. 「編集 → データ」でJSONの書き出し・取り込みや、新しいキャラクターの作成ができます。

ブラウザ内だけの保存なので、重要なキャラクターはJSONでも保存してください。取り込み前・新規作成前には自動でバックアップを取ります。

## 開発

Node.jsの対応範囲は `package.json` の `engines` を参照してください。

```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
```

Windows PowerShellでスクリプト実行が制限される場合は `npm.cmd` を使います。

## 公開

`main` へpushすると `.github/workflows/deploy.yml` が品質チェックとビルドを実行し、GitHub Pagesへ公開します。
リポジトリの **Settings → Pages → Source** を **GitHub Actions** に設定してください。

## 資料と権利表記

保存形式・移行・実装の詳細は `docs/plans/`、原典の出典と照合記録は[調査資料](docs/research/README.md)にあります。
ルール・装備・特殊能力の説明文は公式資料の参考訳・要約です。

Blades in the DarkはJohn Harper / One Seven Designの著作物です。
本アプリは非公式で、原著者の承認・監修を示すものではありません。
