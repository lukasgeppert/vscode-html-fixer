import * as vscode from 'vscode';
import { JSDOM } from 'jsdom';

class HTMLFixer implements vscode.DocumentFormattingEditProvider {
  public provideDocumentFormattingEdits(
    document: vscode.TextDocument
  ): vscode.TextEdit[] {
    const text = document.getText();
    const dom = new JSDOM(text);
    const prettyText = dom.serialize();
    const range = new vscode.Range(
      document.positionAt(0),
      document.positionAt(text.length)
    );
    return [new vscode.TextEdit(range, prettyText)];
  }
}

export function activate(context: vscode.ExtensionContext) {
  const htmlFixer = new HTMLFixer();

  // register HTMLFixer as a DocumentFormattingEditProvider for HTML
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider('html', htmlFixer)
  );

  let disposable = vscode.commands.registerCommand('extension.htmlFixer', () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const document = editor.document;
      if (document.languageId === 'html') {
        const edits = htmlFixer.provideDocumentFormattingEdits(document);
        const workspaceEdit = new vscode.WorkspaceEdit();
        for (const edit of edits) {
          workspaceEdit.replace(document.uri, edit.range, edit.newText);
        }
        vscode.workspace.applyEdit(workspaceEdit)
          .then(success => {
            if (success) {
              document.save();
              vscode.window.showInformationMessage('HTML fixing is done!');
            } else {
              vscode.window.showErrorMessage('Error applying edits to document');
            }
          }, error => {
            vscode.window.showErrorMessage(`Error: ${String(error)}`);
          });
      }
    }
  });

  context.subscriptions.push(disposable);
}


export function deactivate() {}
