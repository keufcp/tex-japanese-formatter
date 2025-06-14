import { Logger } from "../utils/logger";

export class TextProcessor {
  /**
   * 日本語句読点をフォーマットする
   * @param text - 処理対象のテキスト
   * @returns フォーマット済みのテキスト
   */
  static formatJapanesePunctuation(text: string): string {
    try {
      if (!this.validateText(text)) {
        Logger.debug("Invalid text provided to formatJapanesePunctuation");
        return text; // null や undefined の場合はそのまま返す
      }

      if (text.length === 0) {
        return text;
      }

      let result = text;

      // 全角読点「、」を全角カンマ「，」に変換
      result = result.replace(/、/g, "，");

      // 全角句点「。」を全角ピリオド「．」に変換
      result = result.replace(/。/g, "．");

      Logger.debug(`Text formatting completed: "${text}" -> "${result}"`);
      return result;
    } catch (error) {
      Logger.error(
        "Error in formatJapanesePunctuation",
        error instanceof Error ? error : new Error(String(error))
      );
      // エラーが発生した場合は元のテキストを返す
      return text;
    }
  }

  /**
   * テキストに日本語句読点が含まれているかチェック
   * @param text - チェック対象のテキスト
   * @returns 日本語句読点が含まれている場合true
   */
  static hasJapanesePunctuation(text: string): boolean {
    try {
      if (!this.validateText(text)) {
        Logger.debug("Invalid text provided to hasJapanesePunctuation");
        return false;
      }

      if (text.length === 0) {
        return false;
      }

      const hasJapanesePunctuation = /[、。]/.test(text);
      Logger.debug(
        `Japanese punctuation check: "${text}" -> ${hasJapanesePunctuation}`
      );
      return hasJapanesePunctuation;
    } catch (error) {
      Logger.error(
        "Error in hasJapanesePunctuation",
        error instanceof Error ? error : new Error(String(error))
      );
      return false;
    }
  }

  /**
   * テキストの妥当性を検証
   * @param text - 検証対象のテキスト
   * @returns テキストが妥当な場合true
   */
  static validateText(text: string): boolean {
    try {
      const isValid =
        text !== null && text !== undefined && typeof text === "string";
      if (!isValid) {
        Logger.debug(
          `Text validation failed: text is ${typeof text}, value: ${text}`
        );
      }
      return isValid;
    } catch (error) {
      Logger.error(
        "Error in validateText",
        error instanceof Error ? error : new Error(String(error))
      );
      return false;
    }
  }

  /**
   * 変更が必要かどうかを判定
   * @param original - 元のテキスト
   * @param formatted - フォーマット後のテキスト
   * @returns 変更が必要な場合true
   */
  static hasChanges(original: string, formatted: string): boolean {
    try {
      if (!this.validateText(original) || !this.validateText(formatted)) {
        Logger.debug("Invalid text provided to hasChanges");
        return false;
      }

      const hasChanges = original !== formatted;
      Logger.debug(
        `Change detection: "${original}" vs "${formatted}" -> ${hasChanges}`
      );
      return hasChanges;
    } catch (error) {
      Logger.error(
        "Error in hasChanges",
        error instanceof Error ? error : new Error(String(error))
      );
      return false;
    }
  }
}
