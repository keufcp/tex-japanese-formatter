import * as vscode from "vscode";

export class Logger {
  private static outputChannel: vscode.OutputChannel;

  static initialize() {
    if (!this.outputChannel) {
      this.outputChannel = vscode.window.createOutputChannel(
        "LaTeX Japanese Formatter"
      );
    }
  }

  static info(message: string) {
    this.initialize();
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] INFO: ${message}`;
    this.outputChannel.appendLine(logMessage);
    console.log(logMessage);
  }

  static error(message: string, error?: Error) {
    this.initialize();
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ERROR: ${message}`;
    this.outputChannel.appendLine(logMessage);

    if (error) {
      this.outputChannel.appendLine(`Error details: ${error.message}`);
      if (error.stack) {
        this.outputChannel.appendLine(`Stack trace: ${error.stack}`);
      }
    }

    console.error(logMessage, error);
  }

  static debug(message: string) {
    this.initialize();
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] DEBUG: ${message}`;
    this.outputChannel.appendLine(logMessage);
    console.debug(logMessage);
  }

  static show() {
    this.initialize();
    this.outputChannel.show();
  }

  static dispose() {
    if (this.outputChannel) {
      this.outputChannel.dispose();
    }
  }
}
