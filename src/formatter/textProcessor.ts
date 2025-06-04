export class TextProcessor {
  /**
   * 日本語句読点をフォーマットする
   * @param text - 処理対象のテキスト
   * @returns フォーマット済みのテキスト
   */
  static formatJapanesePunctuation(text: string): string {
    if (!text || text.length === 0) {
      return text;
    }

    let result = text;

    // 全角読点「、」を全角カンマ「，」に変換
    result = result.replace(/、/g, "，");

    // 全角句点「。」を全角ピリオド「．」に変換
    result = result.replace(/。/g, "．");

    return result;
  }

  /**
   * テキストに日本語句読点が含まれているかチェック
   * @param text - チェック対象のテキスト
   * @returns 日本語句読点が含まれている場合true
   */
  static hasJapanesePunctuation(text: string): boolean {
    return /[、。]/.test(text);
  }

  /**
   * テキストの妥当性を検証
   * @param text - 検証対象のテキスト
   * @returns テキストが妥当な場合true
   */
  static validateText(text: string): boolean {
    return text !== null && text !== undefined;
  }

  /**
   * 変更が必要かどうかを判定
   * @param original - 元のテキスト
   * @param formatted - フォーマット後のテキスト
   * @returns 変更が必要な場合true
   */
  static hasChanges(original: string, formatted: string): boolean {
    return original !== formatted;
  }
}
