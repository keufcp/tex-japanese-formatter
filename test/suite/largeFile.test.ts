import * as assert from "assert";
import * as path from "path";
import * as fs from "fs";
import { TextProcessor } from "../../src/formatter/textProcessor";

suite("Large File Test Suite", () => {
  const fixturesPath = path.resolve(__dirname, "../../../test/fixtures");

  suite("File-based Comparison Tests", () => {
    test("comprehensive.tex matches expected output exactly", () => {
      // 1. ファイルパスの設定
      const originalFile = path.join(fixturesPath, "comprehensive.tex");
      const expectedFile = path.join(
        fixturesPath,
        "comprehensive-expected.tex"
      );

      // ファイルの存在確認
      assert.ok(
        fs.existsSync(originalFile),
        "Original comprehensive.tex should exist"
      );
      assert.ok(
        fs.existsSync(expectedFile),
        "Expected comprehensive-expected.tex should exist"
      );

      // 2. ファイルの読み込み
      const originalContent = fs.readFileSync(originalFile, "utf8");
      const expectedContent = fs.readFileSync(expectedFile, "utf8");

      // 3. フォーマット実行
      const actualContent =
        TextProcessor.formatJapanesePunctuation(originalContent);

      // 4. 期待結果との完全一致確認
      assert.strictEqual(
        actualContent.trim(),
        expectedContent.trim(),
        "Formatted content should exactly match expected content"
      );
    });

    test("processes copy of comprehensive.tex without affecting original", () => {
      const originalFile = path.join(fixturesPath, "comprehensive.tex");
      const copyFile = path.join(fixturesPath, "comprehensive-copy.tex");
      const expectedFile = path.join(
        fixturesPath,
        "comprehensive-expected.tex"
      );

      try {
        // 2. サンプルファイルのコピー作成
        const originalContent = fs.readFileSync(originalFile, "utf8");
        fs.writeFileSync(copyFile, originalContent, "utf8");

        // コピーファイルの存在確認
        assert.ok(fs.existsSync(copyFile), "Copy file should be created");

        // 3. コピーファイルにフォーマット適用
        const copyContent = fs.readFileSync(copyFile, "utf8");
        const formattedContent =
          TextProcessor.formatJapanesePunctuation(copyContent);

        // フォーマット後のコピーファイルを作成
        fs.writeFileSync(copyFile, formattedContent, "utf8");

        // 4. 理想形との比較
        const expectedContent = fs.readFileSync(expectedFile, "utf8");
        const actualContent = fs.readFileSync(copyFile, "utf8");

        assert.strictEqual(
          actualContent.trim(),
          expectedContent.trim(),
          "Formatted copy should match expected content"
        );

        // 元ファイルが変更されていないことを確認
        const currentOriginalContent = fs.readFileSync(originalFile, "utf8");
        assert.strictEqual(
          currentOriginalContent,
          originalContent,
          "Original file should remain unchanged"
        );
      } finally {
        // クリーンアップ：コピーファイルを削除
        if (fs.existsSync(copyFile)) {
          fs.unlinkSync(copyFile);
        }
      }
    });

    test("handles large file performance with repeated content", () => {
      const originalFile = path.join(fixturesPath, "comprehensive.tex");
      const largeFile = path.join(fixturesPath, "large-test.tex");
      const expectedFile = path.join(
        fixturesPath,
        "comprehensive-expected.tex"
      );

      try {
        // 大規模ファイル作成（内容を10回繰り返し）
        const originalContent = fs.readFileSync(originalFile, "utf8");
        const largeContent = originalContent.repeat(10);
        fs.writeFileSync(largeFile, largeContent, "utf8");

        // パフォーマンス測定
        const startTime = Date.now();
        const largeContentToFormat = fs.readFileSync(largeFile, "utf8");
        const formattedLargeContent =
          TextProcessor.formatJapanesePunctuation(largeContentToFormat);
        const endTime = Date.now();

        const processingTime = endTime - startTime;

        // パフォーマンス確認（5秒以内）
        assert.ok(
          processingTime < 5000,
          `Large file processing should complete within 5 seconds, took ${processingTime}ms`
        );

        // 期待結果の作成（expectedContentを10回繰り返し）
        const expectedContent = fs.readFileSync(expectedFile, "utf8");
        const expectedLargeContent = expectedContent.repeat(10);

        // 結果の一致確認
        assert.strictEqual(
          formattedLargeContent.trim(),
          expectedLargeContent.trim(),
          "Large formatted content should match expected pattern"
        );
      } finally {
        // クリーンアップ
        if (fs.existsSync(largeFile)) {
          fs.unlinkSync(largeFile);
        }
      }
    });

    test("preserves file encoding and line endings", () => {
      const originalFile = path.join(fixturesPath, "comprehensive.tex");
      const testFile = path.join(fixturesPath, "encoding-test.tex");

      try {
        // UTF-8エンコーディングでファイル操作
        const originalContent = fs.readFileSync(originalFile, "utf8");
        const formattedContent =
          TextProcessor.formatJapanesePunctuation(originalContent);

        // ファイルに書き出し
        fs.writeFileSync(testFile, formattedContent, "utf8");

        // 読み戻し
        const readBackContent = fs.readFileSync(testFile, "utf8");

        // 内容が保持されていることを確認
        assert.strictEqual(
          readBackContent,
          formattedContent,
          "File encoding should be preserved"
        );

        // 日本語文字が正しく処理されていることを確認
        assert.ok(
          readBackContent.includes("，"),
          "Full-width comma should be present"
        );
        assert.ok(
          readBackContent.includes("．"),
          "Full-width period should be present"
        );
      } finally {
        if (fs.existsSync(testFile)) {
          fs.unlinkSync(testFile);
        }
      }
    });

    test("handles edge cases with file operations", () => {
      const emptyFile = path.join(fixturesPath, "empty-test.tex");
      const punctuationFile = path.join(
        fixturesPath,
        "punctuation-only-test.tex"
      );

      try {
        // 空ファイルテスト
        fs.writeFileSync(emptyFile, "", "utf8");
        const emptyContent = fs.readFileSync(emptyFile, "utf8");
        const formattedEmpty =
          TextProcessor.formatJapanesePunctuation(emptyContent);
        assert.strictEqual(
          formattedEmpty,
          "",
          "Empty file should remain empty"
        );

        // 句読点のみファイルテスト
        const punctuationOnlyContent = "、。、。";
        fs.writeFileSync(punctuationFile, punctuationOnlyContent, "utf8");
        const punctuationContent = fs.readFileSync(punctuationFile, "utf8");
        const formattedPunctuation =
          TextProcessor.formatJapanesePunctuation(punctuationContent);
        assert.strictEqual(
          formattedPunctuation,
          "，．，．",
          "Punctuation-only file should be converted"
        );
      } finally {
        // クリーンアップ
        [emptyFile, punctuationFile].forEach((file) => {
          if (fs.existsSync(file)) {
            fs.unlinkSync(file);
          }
        });
      }
    });
  });

  suite("Memory and Resource Management", () => {
    test("handles very large files without memory issues", () => {
      const originalFile = path.join(fixturesPath, "comprehensive.tex");

      // 非常に大きなファイル作成（100回繰り返し）
      const originalContent = fs.readFileSync(originalFile, "utf8");
      const veryLargeContent = originalContent.repeat(100);

      // メモリ使用量測定開始
      const startMemory = process.memoryUsage().heapUsed;

      // フォーマット実行
      const startTime = Date.now();
      const formattedContent =
        TextProcessor.formatJapanesePunctuation(veryLargeContent);
      const endTime = Date.now();

      const endMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = endMemory - startMemory;
      const processingTime = endTime - startTime;

      // パフォーマンス確認
      assert.ok(
        processingTime < 10000,
        `Very large file processing should complete within 10 seconds, took ${processingTime}ms`
      );

      // メモリ使用量確認（200MB以下）
      assert.ok(
        memoryIncrease < 200 * 1024 * 1024,
        `Memory usage should be reasonable, increased by ${Math.round(
          memoryIncrease / 1024 / 1024
        )}MB`
      );

      // 結果の妥当性確認
      assert.ok(
        formattedContent.length > 0,
        "Very large file should produce valid output"
      );
      assert.ok(
        !formattedContent.includes("、"),
        "No Japanese commas should remain"
      );
      assert.ok(
        !formattedContent.includes("。"),
        "No Japanese periods should remain"
      );
    });
  });
});
