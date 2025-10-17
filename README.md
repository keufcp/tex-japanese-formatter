# LaTeX Japanese Punctuation Formatter

LaTeX（\*.tex）ファイルにおいて，日本語の句読点を学術論文用の形式に自動変換する VS Code 拡張機能です．

## 機能

- **自動変換**: 保存時（Ctrl+S 等）に以下の変換を実行
  - 全角読点`、`→ 全角カンマ`，`
  - 全角句点`。`→ 全角ピリオド`．`
- **保持機能**: 半角カンマ`,`およびピリオド`.`はそのまま維持
- **設定可能**: 拡張機能の ON/OFF 切り替えが可能
- **対象ファイル**: `*.tex`拡張子のファイルおよび指定したファイル形式が対象

## インストール

1. VS Code Marketplace から「LaTeX Japanese Punctuation Formatter」をインストール
2. または、手動でインストール ※ `x.x.x`はバージョンに置き換えてください
   ```bash
   code --install-extension tex-japanese-formatter-x.x.x.vsix
   ```

## 使用方法

### 自動フォーマット

1. `.tex`ファイルを開く
2. 日本語の句読点を含むテキストを編集
3. ファイルを保存（Ctrl+S）すると自動的にフォーマットが適用される

### 手動フォーマット

1. コマンドパレット（Ctrl+Shift+P）を開く
2. 「Format Japanese Punctuation」を選択

## 設定

以下の設定項目が利用可能です：

### `texJapaneseFormatter.enabled`

- **型**: boolean
- **デフォルト**: true
- **説明**: 拡張機能を有効にするかどうか

### `texJapaneseFormatter.formatOnSave`

- **型**: boolean
- **デフォルト**: true
- **説明**: 保存時に自動フォーマットを実行するかどうか

### `texJapaneseFormatter.targetLanguages`

- **型**: array
- **デフォルト**: ["latex"]
- **説明**: フォーマットを適用するファイルタイプ

### 設定例

```json
{
  "texJapaneseFormatter.enabled": true,
  "texJapaneseFormatter.formatOnSave": true,
  "texJapaneseFormatter.targetLanguages": ["latex"]
}
```

### カスタムファイルタイプの指定

LaTeX 以外のファイルタイプにもフォーマットを適用したい場合：

```json
{
  "texJapaneseFormatter.targetLanguages": ["latex", "plaintext", "markdown"]
}
```

## 変換例

### 変換前

```latex
\documentclass{article}
\begin{document}
これは、LaTeXの文書です。日本語の句点、読点を使用しています。
\end{document}
```

### 変換後

```latex
\documentclass{article}
\begin{document}
これは，LaTeXの文書です．日本語の句点，読点を使用しています．
\end{document}
```

## 開発

### 前提条件

- Node.js (16.x 以上)
- VS Code
- TypeScript

### セットアップ

```bash
# 依存関係のインストール
npm install

# コンパイル
npm run compile

# 監視モードでコンパイル
npm run watch

# テスト実行
npm test

# リント実行
npm run lint

# パッケージング
npm run package
```

### デバッグ

1. VS Code でプロジェクトを開く
2. F5 キーを押して拡張機能開発ホストを起動
3. 新しいウィンドウで`.tex`ファイルを作成してテスト

## ライセンス

MIT License

## 貢献

プルリクエストやイシューの報告を歓迎します

## 変更履歴

### 1.2.0

- **修正**: `targetLanguages` 設定が正しく適用されない問題を修正

### 1.1.0

- **改善**: ロギングとエラーハンドリングの大幅な強化
  - より詳細なデバッグ情報の出力
  - エラー発生時の詳細な情報提供
  - フォーマッタとテキストプロセッサの処理状況の可視化
- **修正**: package.json の URL 情報を修正
- **改善**: README の表現を改善
- **改善**: テスト戦略の最適化
  - 不要なテストカバレッジスクリプトの削除
  - テスト環境の詳細情報更新

### 1.0.0

- 初回リリース
- 基本的な句読点変換機能
- 保存時自動フォーマット
- 設定管理機能
- 包括的なテストスイート
