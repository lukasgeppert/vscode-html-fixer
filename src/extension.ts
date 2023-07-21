import * as vscode from 'vscode';
import * as cheerio from 'cheerio';

export class Extension {
  constructor(private readonly context: vscode.ExtensionContext) {}

  activate() {
    let disposable = vscode.commands.registerCommand('extension.htmlFixer', this.htmlFixer);

    this.context.subscriptions.push(disposable);
  }

  htmlFixer() {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    let document = editor.document;
    let text = document.getText();

    let $;
    let fixedHtml: string;
    try {
      $ = cheerio.load(text);
      fixedHtml = $.html();
    } catch (error) {
      console.error('Error parsing HTML:', error);
      vscode.window.showErrorMessage('Failed to parse HTML.');
      return;
    }

    editor.edit(editBuilder => {
      let firstLine = document.lineAt(0);
      let lastLine = document.lineAt(document.lineCount - 1);
      let textRange = new vscode.Range(firstLine.range.start, lastLine.range.end);

      // Replace the text in the editor.
      editBuilder.replace(textRange, fixedHtml);

      // Check if the text was successfully replaced.
      let originalText = document.getText(textRange);
      if (originalText !== fixedHtml) {
        vscode.window.showInformationMessage('HTML fixing complete!');
      } else {
        vscode.window.showErrorMessage('Failed to apply edit.');
      }
    });
  }
}