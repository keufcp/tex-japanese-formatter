import * as vscode from "vscode";
import { TexJapaneseFormatter } from "./formatter/texFormatter";
import { SettingsManager } from "./config/settings";
import { Logger } from "./utils/logger";

let formatter: TexJapaneseFormatter;

export function activate(context: vscode.ExtensionContext) {
  Logger.initialize();
  Logger.info("LaTeX Japanese Formatter is now active!");

  try {
    formatter = new TexJapaneseFormatter();

    // 保存前イベントの登録
    const saveListener = vscode.workspace.onWillSaveTextDocument((event) => {
      try {
        const edits = formatter.formatDocument(event.document);

        if (edits.length > 0) {
          const edit = new vscode.WorkspaceEdit();
          edit.set(event.document.uri, edits);
          event.waitUntil(vscode.workspace.applyEdit(edit));
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        Logger.error(
          "Error during save formatting",
          error instanceof Error ? error : new Error(String(error))
        );
        vscode.window.showErrorMessage(
          `LaTeX Japanese Formatter error: ${errorMessage}`
        );
      }
    });

    // 設定変更の監視
    const configListener = SettingsManager.onConfigurationChanged(() => {
      try {
        formatter.updateConfiguration();
      } catch (error) {
        Logger.error(
          "Error updating configuration",
          error instanceof Error ? error : new Error(String(error))
        );
      }
    });

    // 手動フォーマットコマンドの登録
    const formatCommand = vscode.commands.registerCommand(
      "texJapaneseFormatter.format",
      async () => {
        try {
          const editor = vscode.window.activeTextEditor;
          if (!editor) {
            vscode.window.showWarningMessage("No active text editor found.");
            return;
          }

          const document = editor.document;

          if (!formatter.isTargetLanguage(document)) {
            const targetLanguages = formatter.getConfiguration().targetLanguages;
            if (targetLanguages.length === 0) {
              vscode.window.showWarningMessage(
                "No target languages configured. Please add languages to texJapaneseFormatter.targetLanguages setting."
              );
            } else {
              const targetLangs = targetLanguages.join(", ");
              vscode.window.showWarningMessage(
                `This formatter only works with files of type: ${targetLangs}. Current file type: ${document.languageId}`
              );
            }
            return;
          }

          Logger.info(`Manual formatting requested for: ${document.fileName}`);

          // 大容量ファイルの場合は進捗表示
          if (document.lineCount > 1000) {
            await vscode.window.withProgress(
              {
                location: vscode.ProgressLocation.Notification,
                title: "Formatting LaTeX document...",
                cancellable: false,
              },
              async (progress) => {
                progress.report({
                  increment: 0,
                  message: "Processing large file...",
                });

                const edits = formatter.formatDocumentManual(document);

                if (edits.length > 0) {
                  progress.report({
                    increment: 50,
                    message: "Applying changes...",
                  });
                  const edit = new vscode.WorkspaceEdit();
                  edit.set(document.uri, edits);
                  await vscode.workspace.applyEdit(edit);
                  progress.report({ increment: 100, message: "Completed!" });

                  vscode.window.showInformationMessage(
                    `Japanese punctuation formatted! (${edits.length} changes applied)`
                  );
                } else {
                  progress.report({
                    increment: 100,
                    message: "No changes needed",
                  });
                  vscode.window.showInformationMessage(
                    "No Japanese punctuation found to format."
                  );
                }
              }
            );
          } else {
            // 小容量ファイルの場合は通常処理
            const edits = formatter.formatDocumentManual(document);

            if (edits.length > 0) {
              const edit = new vscode.WorkspaceEdit();
              edit.set(document.uri, edits);
              await vscode.workspace.applyEdit(edit);
              vscode.window.showInformationMessage(
                `Japanese punctuation formatted! (${edits.length} changes applied)`
              );
            } else {
              vscode.window.showInformationMessage(
                "No Japanese punctuation found to format."
              );
            }
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          Logger.error(
            "Error during manual formatting",
            error instanceof Error ? error : new Error(String(error))
          );
          vscode.window.showErrorMessage(`Formatting failed: ${errorMessage}`);
        }
      }
    );

    context.subscriptions.push(saveListener, configListener, formatCommand);

    // Loggerのクリーンアップを登録
    context.subscriptions.push({
      dispose: () => Logger.dispose(),
    });

    Logger.info("LaTeX Japanese Formatter activation completed successfully");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    Logger.error(
      "Error activating LaTeX Japanese Formatter",
      error instanceof Error ? error : new Error(String(error))
    );
    vscode.window.showErrorMessage(
      `Failed to activate LaTeX Japanese Formatter: ${errorMessage}`
    );
  }
}

export function deactivate() {
  Logger.info("LaTeX Japanese Formatter deactivated");
  Logger.dispose();
}
