// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('ai-power-tool.explainCode', () => {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const selection = editor.selection;

			// Get the word within the selection
			const selectedText = document.getText(selection);

			if (selectedText) {
				// For now, just show the selected text in a message
				vscode.window.showInformationMessage(`您选中的代码是: ${selectedText}`);
			} else {
				vscode.window.showInformationMessage('请先选择一段代码后再试。');
			}
		} else {
			vscode.window.showInformationMessage('没有活动的编辑器。');
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}