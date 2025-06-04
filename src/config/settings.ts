import * as vscode from "vscode";

export interface IFormatterConfig {
  enabled: boolean;
  formatOnSave: boolean;
  targetLanguages: string[];
}

export class SettingsManager {
  private static readonly CONFIGURATION_SECTION = "texJapaneseFormatter";

  static getConfiguration(): IFormatterConfig {
    const config = vscode.workspace.getConfiguration(
      this.CONFIGURATION_SECTION
    );

    return {
      enabled: config.get<boolean>("enabled", true),
      formatOnSave: config.get<boolean>("formatOnSave", true),
      targetLanguages: config.get<string[]>("targetLanguages", ["latex"]),
    };
  }

  static onConfigurationChanged(callback: () => void): vscode.Disposable {
    return vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration(this.CONFIGURATION_SECTION)) {
        callback();
      }
    });
  }
}
