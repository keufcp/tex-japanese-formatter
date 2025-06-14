# VS Code 用 LaTeX 日本語句読点フォーマッター設計書

## 1. プロジェクト概要

### 目的

- LaTeX（\*.tex）ファイルにおける日本語句読点の学術論文用形式への自動変換
- VS Code 拡張機能として提供

### 機能要件

- **対象ファイル**: `*.tex`拡張子のファイル
- **変換ルール**:
  - 全角読点「、」→ 全角カンマ「，」
  - 全角句点「。」→ 全角ピリオド「．」
- **保持ルール**: 半角カンマ`,`およびピリオド`.`はそのまま維持
- **実行タイミング**: 保存時（Ctrl+S 等）に 1 回のみ実行
- **設定機能**: ON/OFF の切り替え可能
- **品質保証**: 包括的な単体テストによるバグ予防

## 2. 技術仕様

### 開発環境

- **言語**: TypeScript
- **フレームワーク**: VS Code Extension API
- **テストフレームワーク**: Mocha + @vscode/test-electron
- **主要 API**:
  - `onWillSaveTextDocument`（保存イベント）
  - `workspace.getConfiguration`（設定管理）

### 依存関係

- **開発依存関係**:
  - `@types/vscode`: ^1.70.0
  - `@types/mocha`: ^10.0.0
  - `@vscode/test-electron`: ^2.3.0
  - `mocha`: ^10.2.0
  - `typescript`: ^4.9.0
  - `eslint`: ^8.0.0

## 3. アーキテクチャ設計

### ディレクトリ構造

```
tex-japanese-formatter/
├── src/
│   ├── extension.ts              # メインエントリーポイント
│   ├── formatter/
│   │   ├── texFormatter.ts       # フォーマッター本体
│   │   └── textProcessor.ts      # テキスト処理ロジック
│   ├── config/
│   │   └── settings.ts           # 設定管理
│   └── utils/
│       └── logger.ts             # ログ機能
├── test/
│   ├── suite/
│   │   ├── textProcessor.test.ts # テキスト処理テスト
│   │   └── largeFile.test.ts     # 大型ファイルテスト
│   └── runTest.ts                # テスト実行設定
├── package.json
├── tsconfig.json
└── .vscode/
    ├── launch.json               # デバッグ設定
    └── settings.json             # ワークスペース設定
```

### クラス設計

#### 設定管理

- **[`IFormatterConfig`](../src/config/settings.ts)**: 設定項目の型定義
  - `enabled`: フォーマッター有効/無効
  - `formatOnSave`: 保存時自動実行
  - `targetLanguages`: 対象ファイルタイプ

#### メインクラス構成

- **[`activate`](../src/extension.ts)**: 拡張機能のエントリーポイント関数

  - アクティベーション処理
  - イベントハンドラー登録
  - リソース管理

- **[`TexJapaneseFormatter`](../src/formatter/texFormatter.ts)**: フォーマット処理クラス

  - ドキュメント全体のフォーマット実行
  - フォーマット対象判定

- **[`TextProcessor`](../src/formatter/textProcessor.ts)**: テキスト処理ユーティリティ

  - 句読点変換ロジック
  - テキスト検証機能

- **[`SettingsManager`](../src/config/settings.ts)**: 設定管理クラス
  - VS Code 設定の読み込み
  - 設定変更の監視

## 4. 実装手順

### Step 1: プロジェクト初期化

- VS Code Extension Generator を使用して TypeScript 拡張機能プロジェクトを作成
- 必要な依存関係をインストール
- [`package.json`](../package.json)で拡張機能の基本情報と設定項目を定義

### Step 2: 設定管理システム実装

- [`src/config/settings.ts`](../src/config/settings.ts)に設定管理クラスを実装
- VS Code 設定の読み込み機能
- 設定変更の監視機能

### Step 3: テキスト処理ロジック実装

- [`src/formatter/textProcessor.ts`](../src/formatter/textProcessor.ts)にコア変換ロジックを実装
- 日本語句読点の検出と変換
- テキスト検証機能

### Step 4: フォーマッター実装

- [`src/formatter/texFormatter.ts`](../src/formatter/texFormatter.ts)にメインフォーマッターを実装
- ドキュメント全体の処理
- フォーマット対象の判定

### Step 5: 拡張機能メイン実装

- [`src/extension.ts`](../src/extension.ts)にエントリーポイントを実装
- 保存前イベントの登録
- 手動フォーマットコマンドの実装
- エラーハンドリング

## 5. テスト戦略

### テスト環境

- **フレームワーク**: Mocha + @vscode/test-electron
- **テスト実行**: VSCode 統合テスト環境
- **CI/CD**: GitHub Actions で自動テスト実行

### テスト項目

- **単体テスト**:
  - [`test/suite/textProcessor.test.ts`](../test/suite/textProcessor.test.ts): テキスト処理ロジック
  - [`test/suite/largeFile.test.ts`](../test/suite/largeFile.test.ts): 大型ファイルの処理性能
- **統合テスト**:
  - 拡張機能全体の動作確認
  - 設定変更時の動作確認

### テストケース

- **基本変換**:
  - 全角読点「、」→ 全角カンマ「，」
  - 全角句点「。」→ 全角ピリオド「．」
- **エッジケース**:
  - 空文字列、null、undefined
  - 混在テキスト（日本語＋英語）
  - LaTeX コマンド内の句読点
- **パフォーマンス**:
  - 大型ファイルの処理時間
  - メモリ使用量

## 6. 品質保証

### コード品質

- **ESLint**: TypeScript 用ルールセット適用
- **型安全性**: 厳密な TypeScript 設定
- **エラーハンドリング**: すべての処理で例外処理を実装

### テスト品質

- **テスト網羅性**: 全主要機能をテストでカバー
- **機能テスト**: VS Code 統合環境での動作確認
- **CI/CD**: プルリクエスト時の自動テスト実行

### 継続的インテグレーション

- **GitHub Actions**: 自動テスト実行設定
- **自動テスト**: プッシュ・プルリクエスト時
- **品質チェック**: リント、テスト実行

## 7. デプロイメント

### パッケージング

- `vsce package`で VSIX ファイル生成
- バージョン管理: セマンティックバージョニング
- リリースノート: 変更点の明確化

### 公開

- Visual Studio Code Marketplace への公開
- `vsce publish`コマンドで自動公開
- CI/CD パイプラインでの自動リリース

## 8. 運用・メンテナンス

### モニタリング

- 拡張機能のアクティベーション時間
- フォーマット処理の実行時間
- エラー発生率の監視
- ユーザー設定の利用状況

### トラブルシューティング

- ログ出力の充実
- エラーレポート機能
- 設定診断コマンド
- デバッグモードの提供

### 継続的改善

- **パフォーマンス監視**: 大きなファイルでの処理時間測定
- **ユーザーフィードバック**: GitHub Issues でのバグレポート収集
- **機能拡張**: 他の日本語句読点スタイルへの対応
- **国際化**: 多言語対応の検討
