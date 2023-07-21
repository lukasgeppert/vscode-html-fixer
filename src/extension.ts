import * as vscode from 'vscode';
import * as cheerio from 'cheerio';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.htmlFixer', function () {
        let editor = vscode.window.activeTextEditor;
        if (editor) {
            let document = editor.document;
            let text = document.getText();

            let $ = cheerio.load(text);
            let fixedHtml = $.html();
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
    });

    context.subscriptions.push(disposable);
}



export function deactivate() {}
