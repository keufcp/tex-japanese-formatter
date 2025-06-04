import * as vscode from "vscode";
import { TextProcessor } from "./textProcessor";
import { SettingsManager, IFormatterConfig } from "../config/settings";

export class TexJapaneseFormatter {
  private config: IFormatterConfig;

  constructor() {
    this.config = SettingsManager.getConfiguration();
  }

  updateConfiguration(): void {
    this.config = SettingsManager.getConfiguration();
  }

  /**
   * ドキュメント全体をフォーマット
   * @param document - フォーマット対象のドキュメント
   * @returns フォーマットの編集操作配列
   */
  formatDocument(document: vscode.TextDocument): vscode.TextEdit[] {
    if (!this.shouldFormat(document)) {
      return [];
    }

    const edits: vscode.TextEdit[] = [];

    for (let i = 0; i < document.lineCount; i++) {
      const line = document.lineAt(i);
      const originalText = line.text;

      if (TextProcessor.hasJapanesePunctuation(originalText)) {
        const formattedText =
          TextProcessor.formatJapanesePunctuation(originalText);

        if (TextProcessor.hasChanges(originalText, formattedText)) {
          edits.push(vscode.TextEdit.replace(line.range, formattedText));
        }
      }
    }

    return edits;
  }

  /**
   * フォーマットを適用すべきかどうかを判定
   * @param document - 判定対象のドキュメント
   * @returns フォーマットを適用する場合true
   */
  shouldFormat(document: vscode.TextDocument): boolean {
    if (!this.config.enabled || !this.config.formatOnSave) {
      return false;
    }

    const languageId = document.languageId;
    return this.config.targetLanguages.includes(languageId);
  }
}
