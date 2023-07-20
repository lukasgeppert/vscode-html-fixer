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

            editor.edit(editBuilder => {
                let firstLine = document.lineAt(0);
                let lastLine = document.lineAt(document.lineCount - 1);
                let textRange = new vscode.Range(firstLine.range.start, lastLine.range.end);
                
                editBuilder.replace(textRange, fixedHtml);
            });
        }
    });

    context.subscriptions.push(disposable);
}



export function deactivate() {}
