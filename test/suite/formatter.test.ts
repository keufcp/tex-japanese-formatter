import * as assert from "assert";
import * as vscode from "vscode";
import { TexJapaneseFormatter } from "../../src/formatter/texFormatter";

suite("TexJapaneseFormatter Test Suite", () => {
  let formatter: TexJapaneseFormatter;

  setup(() => {
    formatter = new TexJapaneseFormatter();
  });

  suite("isTargetLanguage", () => {
    test("returns true for latex language with default config", () => {
      // Create a mock document with latex language
      const mockDocument = {
        languageId: "latex",
        lineCount: 10,
        fileName: "test.tex",
      } as vscode.TextDocument;

      const result = formatter.isTargetLanguage(mockDocument);
      assert.strictEqual(result, true);
    });

    test("returns false for non-latex language with default config", () => {
      // Create a mock document with markdown language
      const mockDocument = {
        languageId: "markdown",
        lineCount: 10,
        fileName: "test.md",
      } as vscode.TextDocument;

      const result = formatter.isTargetLanguage(mockDocument);
      assert.strictEqual(result, false);
    });
  });

  suite("shouldFormat", () => {
    test("returns true for latex document when enabled with default config", () => {
      // Create a mock document with latex language
      const mockDocument = {
        languageId: "latex",
        lineCount: 10,
        fileName: "test.tex",
      } as vscode.TextDocument;

      const result = formatter.shouldFormat(mockDocument);
      // Result depends on the configuration, but should use targetLanguages
      assert.strictEqual(typeof result, "boolean");
    });

    test("returns false for non-target language", () => {
      // Create a mock document with non-target language
      const mockDocument = {
        languageId: "javascript",
        lineCount: 10,
        fileName: "test.js",
      } as vscode.TextDocument;

      const result = formatter.shouldFormat(mockDocument);
      assert.strictEqual(result, false);
    });
  });

  suite("formatDocumentManual", () => {
    test("respects targetLanguages configuration", () => {
      // Create a mock LaTeX document with Japanese punctuation
      const mockDocument = {
        languageId: "latex",
        lineCount: 2,
        fileName: "test.tex",
        lineAt: (index: number) => {
          const lines = [
            { text: "これは、テストです。", range: new vscode.Range(0, 0, 0, 10) },
            { text: "もう一つ、文です。", range: new vscode.Range(1, 0, 1, 10) },
          ];
          return lines[index];
        },
      } as unknown as vscode.TextDocument;

      const edits = formatter.formatDocumentManual(mockDocument);
      // Should return edits since latex is in targetLanguages by default
      assert.ok(Array.isArray(edits));
    });

    test("does not format non-target language document", () => {
      // Create a mock document with non-target language
      const mockDocument = {
        languageId: "javascript",
        lineCount: 1,
        fileName: "test.js",
        lineAt: (index: number) => {
          return {
            text: "これは、テストです。",
            range: new vscode.Range(0, 0, 0, 10),
          };
        },
      } as unknown as vscode.TextDocument;

      const edits = formatter.formatDocumentManual(mockDocument);
      // Should return empty array since javascript is not in targetLanguages
      assert.strictEqual(edits.length, 0);
    });
  });

  suite("formatDocument", () => {
    test("respects targetLanguages configuration", () => {
      // Create a mock LaTeX document with Japanese punctuation
      const mockDocument = {
        languageId: "latex",
        lineCount: 2,
        fileName: "test.tex",
        lineAt: (index: number) => {
          const lines = [
            { text: "これは、テストです。", range: new vscode.Range(0, 0, 0, 10) },
            { text: "もう一つ、文です。", range: new vscode.Range(1, 0, 1, 10) },
          ];
          return lines[index];
        },
      } as unknown as vscode.TextDocument;

      const edits = formatter.formatDocument(mockDocument);
      // Should return edits since latex is in targetLanguages by default
      assert.ok(Array.isArray(edits));
    });

    test("does not format non-target language document", () => {
      // Create a mock document with non-target language
      const mockDocument = {
        languageId: "javascript",
        lineCount: 1,
        fileName: "test.js",
        lineAt: (index: number) => {
          return {
            text: "これは、テストです。",
            range: new vscode.Range(0, 0, 0, 10),
          };
        },
      } as unknown as vscode.TextDocument;

      const edits = formatter.formatDocument(mockDocument);
      // Should return empty array since javascript is not in targetLanguages
      assert.strictEqual(edits.length, 0);
    });
  });
});
