import * as vscode from "vscode";
import { TexJapaneseFormatter } from "./formatter/texFormatter";
import { SettingsManager } from "./config/settings";

let formatter: TexJapaneseFormatter;

export function activate(context: vscode.ExtensionContext) {
  console.log("LaTeX Japanese Formatter is now active!");

  try {
    formatter = new TexJapaneseFormatter();

    // 保存前イベントの登録
    const saveListener = vscode.workspace.onWillSaveTextDocument((event) => {
      try {
        if (event.document.languageId === "latex") {
          const edits = formatter.formatDocument(event.document);

          if (edits.length > 0) {
            const edit = new vscode.WorkspaceEdit();
            edit.set(event.document.uri, edits);
            event.waitUntil(vscode.workspace.applyEdit(edit));
          }
        }
      } catch (error) {
        console.error("Error during save formatting:", error);
        vscode.window.showErrorMessage(
          `LaTeX Japanese Formatter error: ${error}`
        );
      }
    });

    // 設定変更の監視
    const configListener = SettingsManager.onConfigurationChanged(() => {
      try {
        formatter.updateConfiguration();
      } catch (error) {
        console.error("Error updating configuration:", error);
      }
    });

    // 手動フォーマットコマンドの登録
    const formatCommand = vscode.commands.registerCommand(
      "texJapaneseFormatter.format",
      async () => {
        try {
          const editor = vscode.window.activeTextEditor;
          if (editor && editor.document.languageId === "latex") {
            const edits = formatter.formatDocument(editor.document);

            if (edits.length > 0) {
              const edit = new vscode.WorkspaceEdit();
              edit.set(editor.document.uri, edits);
              await vscode.workspace.applyEdit(edit);
              vscode.window.showInformationMessage(
                "Japanese punctuation formatted!"
              );
            } else {
              vscode.window.showInformationMessage(
                "No Japanese punctuation found to format."
              );
            }
          } else {
            vscode.window.showWarningMessage(
              "Please open a LaTeX (.tex) file to use this formatter."
            );
          }
        } catch (error) {
          console.error("Error during manual formatting:", error);
          vscode.window.showErrorMessage(`Formatting failed: ${error}`);
        }
      }
    );

    context.subscriptions.push(saveListener, configListener, formatCommand);
  } catch (error) {
    console.error("Error activating LaTeX Japanese Formatter:", error);
    vscode.window.showErrorMessage(
      `Failed to activate LaTeX Japanese Formatter: ${error}`
    );
  }
}

export function deactivate() {
  console.log("LaTeX Japanese Formatter deactivated");
}
