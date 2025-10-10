import * as vscode from "vscode";
import { TextProcessor } from "./textProcessor";
import { SettingsManager, IFormatterConfig } from "../config/settings";
import { Logger } from "../utils/logger";

export class TexJapaneseFormatter {
  private config: IFormatterConfig;

  constructor() {
    try {
      this.config = SettingsManager.getConfiguration();
      Logger.info("TexJapaneseFormatter initialized successfully");
    } catch (error) {
      Logger.error(
        "Failed to initialize TexJapaneseFormatter",
        error instanceof Error ? error : new Error(String(error))
      );
      throw error;
    }
  }

  updateConfiguration(): void {
    try {
      const oldConfig = { ...this.config };
      this.config = SettingsManager.getConfiguration();
      Logger.info("Configuration updated successfully");
      Logger.debug(
        `Configuration changed from ${JSON.stringify(
          oldConfig
        )} to ${JSON.stringify(this.config)}`
      );
    } catch (error) {
      Logger.error(
        "Failed to update configuration",
        error instanceof Error ? error : new Error(String(error))
      );
      throw error;
    }
  }

  /**
   * ドキュメント全体をフォーマット
   * @param document - フォーマット対象のドキュメント
   * @returns フォーマットの編集操作配列
   */
  formatDocument(document: vscode.TextDocument): vscode.TextEdit[] {
    try {
      Logger.debug(`Starting document formatting for: ${document.fileName}`);

      if (!this.shouldFormat(document)) {
        Logger.debug(
          "Document formatting skipped due to configuration settings"
        );
        return [];
      }

      return this.performFormatting(document);
    } catch (error) {
      Logger.error(
        "Fatal error during document formatting",
        error instanceof Error ? error : new Error(String(error))
      );
      throw error;
    }
  }

  /**
   * ドキュメント全体をフォーマット（手動実行用、formatOnSaveをチェックしない）
   * @param document - フォーマット対象のドキュメント
   * @returns フォーマットの編集操作配列
   */
  formatDocumentManual(document: vscode.TextDocument): vscode.TextEdit[] {
    try {
      Logger.debug(`Starting manual document formatting for: ${document.fileName}`);

      if (!this.isTargetLanguage(document)) {
        Logger.debug("Document is not a target language");
        return [];
      }

      return this.performFormatting(document);
    } catch (error) {
      Logger.error(
        "Fatal error during manual document formatting",
        error instanceof Error ? error : new Error(String(error))
      );
      throw error;
    }
  }

  /**
   * フォーマット処理を実行する共通ロジック
   * @param document - フォーマット対象のドキュメント
   * @returns フォーマットの編集操作配列
   */
  private performFormatting(document: vscode.TextDocument): vscode.TextEdit[] {
    if (!document || document.lineCount === 0) {
      Logger.debug("Document is empty or invalid");
      return [];
    }

    // 大容量ファイルの判定
    const isLargeFile = document.lineCount > 1000;
    if (isLargeFile) {
      Logger.info(
        `Large file detected (${document.lineCount} lines), using optimized processing`
      );
      return this.formatLargeDocument(document);
    }

    return this.formatSmallDocument(document);
  }

  /**
   * 小規模ドキュメントの通常フォーマット
   * @param document - フォーマット対象のドキュメント
   * @returns フォーマットの編集操作配列
   */
  private formatSmallDocument(
    document: vscode.TextDocument
  ): vscode.TextEdit[] {
    const edits: vscode.TextEdit[] = [];
    let processedLines = 0;
    let changedLines = 0;

    for (let i = 0; i < document.lineCount; i++) {
      try {
        const line = document.lineAt(i);
        const originalText = line.text;
        processedLines++;

        if (TextProcessor.hasJapanesePunctuation(originalText)) {
          const formattedText =
            TextProcessor.formatJapanesePunctuation(originalText);

          if (TextProcessor.hasChanges(originalText, formattedText)) {
            edits.push(vscode.TextEdit.replace(line.range, formattedText));
            changedLines++;
          }
        }
      } catch (error) {
        Logger.error(
          `Error processing line ${i + 1}`,
          error instanceof Error ? error : new Error(String(error))
        );
        // 一行のエラーで全体の処理を停止せず、続行する
        continue;
      }
    }

    Logger.info(
      `Document formatting completed: ${processedLines} lines processed, ${changedLines} lines changed, ${edits.length} edits created`
    );
    return edits;
  }

  /**
   * 大容量ドキュメントの最適化フォーマット
   * @param document - フォーマット対象のドキュメント
   * @returns フォーマットの編集操作配列
   */
  private formatLargeDocument(
    document: vscode.TextDocument
  ): vscode.TextEdit[] {
    const edits: vscode.TextEdit[] = [];
    let processedLines = 0;
    let changedLines = 0;
    const chunkSize = 100; // チャンクサイズ
    const startTime = Date.now();

    // チャンク処理でメモリ使用量を制御
    for (
      let chunkStart = 0;
      chunkStart < document.lineCount;
      chunkStart += chunkSize
    ) {
      const chunkEnd = Math.min(chunkStart + chunkSize, document.lineCount);

      try {
        // チャンク内の行を処理
        for (let i = chunkStart; i < chunkEnd; i++) {
          try {
            const line = document.lineAt(i);
            const originalText = line.text;
            processedLines++;

            if (TextProcessor.hasJapanesePunctuation(originalText)) {
              const formattedText =
                TextProcessor.formatJapanesePunctuation(originalText);

              if (TextProcessor.hasChanges(originalText, formattedText)) {
                edits.push(vscode.TextEdit.replace(line.range, formattedText));
                changedLines++;
              }
            }
          } catch (error) {
            Logger.error(
              `Error processing line ${i + 1}`,
              error instanceof Error ? error : new Error(String(error))
            );
            continue;
          }
        }

        // 進捗ログ出力（大容量ファイルの場合）
        const progress = Math.round((chunkEnd / document.lineCount) * 100);
        Logger.debug(
          `Processing progress: ${progress}% (${chunkEnd}/${document.lineCount} lines)`
        );

        // 処理時間が長すぎる場合は警告
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime > 5000) {
          // 5秒以上
          Logger.info(
            `Large file processing is taking longer than expected (${elapsedTime}ms elapsed)`
          );
        }
      } catch (error) {
        Logger.error(
          `Error processing chunk ${chunkStart}-${chunkEnd}`,
          error instanceof Error ? error : new Error(String(error))
        );
        continue;
      }
    }

    const totalTime = Date.now() - startTime;
    Logger.info(
      `Large document formatting completed in ${totalTime}ms: ${processedLines} lines processed, ${changedLines} lines changed, ${edits.length} edits created`
    );

    return edits;
  }

  /**
   * フォーマットを適用すべきかどうかを判定
   * @param document - 判定対象のドキュメント
   * @returns フォーマットを適用する場合true
   */
  shouldFormat(document: vscode.TextDocument): boolean {
    try {
      if (!this.config.formatOnSave) {
        Logger.debug("Format on save disabled in configuration");
        return false;
      }

      return this.isTargetLanguage(document);
    } catch (error) {
      Logger.error(
        "Error in shouldFormat check",
        error instanceof Error ? error : new Error(String(error))
      );
      return false;
    }
  }

  /**
   * ドキュメントが対象言語かどうかを判定（手動フォーマット用）
   * @param document - 判定対象のドキュメント
   * @returns 対象言語の場合true
   */
  isTargetLanguage(document: vscode.TextDocument): boolean {
    try {
      if (!this.config.enabled) {
        Logger.debug("Formatting disabled in configuration");
        return false;
      }

      if (!document) {
        Logger.debug("Document is null or undefined");
        return false;
      }

      const languageId = document.languageId;
      const isTarget = this.config.targetLanguages.includes(languageId);

      Logger.debug(
        `Target language check - Language: ${languageId}, Target languages: ${this.config.targetLanguages.join(
          ", "
        )}, Result: ${isTarget}`
      );

      return isTarget;
    } catch (error) {
      Logger.error(
        "Error in isTargetLanguage check",
        error instanceof Error ? error : new Error(String(error))
      );
      return false;
    }
  }
}
