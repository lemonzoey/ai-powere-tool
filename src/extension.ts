// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import OpenAI from 'openai';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('ai-power-tool.explainCode', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showInformationMessage('没有活动的编辑器。');
			return;
		}

		const selection = editor.selection;
		const selectedText = editor.document.getText(selection);

		if (!selectedText) {
			vscode.window.showInformationMessage('请先选择一段代码后再试。');
			return;
		}

		const apiKey = vscode.workspace.getConfiguration('aiPowerTool').get('deepseek.apiKey');
		if (!apiKey || typeof apiKey !== 'string') {
			vscode.window.showInformationMessage('请在设置中配置DeepSeek的API Key。');
			return;
		}

		try {
			const openai = new OpenAI({
				apiKey: apiKey,
				baseURL: 'https://api.deepseek.com/v1'
			});

			await vscode.window.withProgress({
				location: vscode.ProgressLocation.Notification,
				title: "AI正在解析代码...",
				cancellable: true
			}, async (progress, token) => {
				token.onCancellationRequested(() => {
					console.log("用户取消了操作");
				});

				const chatCompletion = await openai.chat.completions.create({
					model: "deepseek-coder",
					messages: [
						{ role: "system", content: "你是一个代码解释助手。" },
						{ role: "user", content: `请解释以下代码: \n\n${selectedText}` }
					],
				});

				const explanation = chatCompletion.choices[0].message.content;

				// 创建一个新的文档来显示结果
				const newDocument = await vscode.workspace.openTextDocument({
					content: explanation || "未能获取到解释。",
					language: 'markdown'
				});
				await vscode.window.showTextDocument(newDocument, vscode.ViewColumn.Beside);
			});

		} catch (error) {
			if (error instanceof Error) {
				vscode.window.showErrorMessage(`调用AI服务失败: ${error.message}`);
			} else {
				vscode.window.showErrorMessage('调用AI服务时发生未知错误。');
			}
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}