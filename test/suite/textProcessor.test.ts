import * as assert from "assert";
import { TextProcessor } from "../../src/formatter/textProcessor";

suite("TextProcessor Test Suite", () => {
  suite("formatJapanesePunctuation", () => {
    test("converts Japanese comma to full-width comma", () => {
      const input = "これは、テストです";
      const expected = "これは，テストです";
      const result = TextProcessor.formatJapanesePunctuation(input);
      assert.strictEqual(result, expected);
    });

    test("converts Japanese period to full-width period", () => {
      const input = "これはテストです。";
      const expected = "これはテストです．";
      const result = TextProcessor.formatJapanesePunctuation(input);
      assert.strictEqual(result, expected);
    });

    test("converts both comma and period in same text", () => {
      const input = "これは、テストです。また、実行します。";
      const expected = "これは，テストです．また，実行します．";
      const result = TextProcessor.formatJapanesePunctuation(input);
      assert.strictEqual(result, expected);
    });

    test("preserves half-width comma and period", () => {
      const input = "This is a test, with period.";
      const expected = "This is a test, with period.";
      const result = TextProcessor.formatJapanesePunctuation(input);
      assert.strictEqual(result, expected);
    });

    test("handles mixed Japanese and English punctuation", () => {
      const input = "これは、test, です。また、example.もあります。";
      const expected = "これは，test, です．また，example.もあります．";
      const result = TextProcessor.formatJapanesePunctuation(input);
      assert.strictEqual(result, expected);
    });

    test("handles empty string", () => {
      const input = "";
      const expected = "";
      const result = TextProcessor.formatJapanesePunctuation(input);
      assert.strictEqual(result, expected);
    });

    test("handles null and undefined", () => {
      assert.strictEqual(
        TextProcessor.formatJapanesePunctuation(null as any),
        null
      );
      assert.strictEqual(
        TextProcessor.formatJapanesePunctuation(undefined as any),
        undefined
      );
    });

    test("handles string with no Japanese punctuation", () => {
      const input = "This is a normal English sentence.";
      const expected = "This is a normal English sentence.";
      const result = TextProcessor.formatJapanesePunctuation(input);
      assert.strictEqual(result, expected);
    });
  });

  suite("hasJapanesePunctuation", () => {
    test("detects Japanese comma", () => {
      const input = "これは、テストです";
      const result = TextProcessor.hasJapanesePunctuation(input);
      assert.strictEqual(result, true);
    });

    test("detects Japanese period", () => {
      const input = "これはテストです。";
      const result = TextProcessor.hasJapanesePunctuation(input);
      assert.strictEqual(result, true);
    });

    test("detects both Japanese punctuation marks", () => {
      const input = "これは、テストです。";
      const result = TextProcessor.hasJapanesePunctuation(input);
      assert.strictEqual(result, true);
    });

    test("returns false for text without Japanese punctuation", () => {
      const input = "This is a test, with English punctuation.";
      const result = TextProcessor.hasJapanesePunctuation(input);
      assert.strictEqual(result, false);
    });

    test("returns false for empty string", () => {
      const input = "";
      const result = TextProcessor.hasJapanesePunctuation(input);
      assert.strictEqual(result, false);
    });
  });

  suite("validateText", () => {
    test("validates normal text", () => {
      const input = "これはテストです";
      const result = TextProcessor.validateText(input);
      assert.strictEqual(result, true);
    });

    test("validates empty string", () => {
      const input = "";
      const result = TextProcessor.validateText(input);
      assert.strictEqual(result, true);
    });

    test("rejects null", () => {
      const result = TextProcessor.validateText(null as any);
      assert.strictEqual(result, false);
    });

    test("rejects undefined", () => {
      const result = TextProcessor.validateText(undefined as any);
      assert.strictEqual(result, false);
    });
  });

  suite("hasChanges", () => {
    test("detects changes when text is different", () => {
      const original = "これは、テストです。";
      const formatted = "これは，テストです．";
      const result = TextProcessor.hasChanges(original, formatted);
      assert.strictEqual(result, true);
    });

    test("returns false when text is same", () => {
      const original = "これは，テストです．";
      const formatted = "これは，テストです．";
      const result = TextProcessor.hasChanges(original, formatted);
      assert.strictEqual(result, false);
    });

    test("handles empty strings", () => {
      const original = "";
      const formatted = "";
      const result = TextProcessor.hasChanges(original, formatted);
      assert.strictEqual(result, false);
    });
  });
});
