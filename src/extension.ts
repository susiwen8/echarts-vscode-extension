import * as vscode from 'vscode';
import titleOptions from './options/title';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "echarts" is now active!');

	let disposable = vscode.commands.registerCommand('extension.echarts', () => {
		vscode.window.showInformationMessage('ECharts autocomplete is up!');
	});

	const selector: vscode.DocumentSelector = {
		scheme: 'file',
		language: 'javascript'
	};

	const completion = vscode.languages.registerCompletionItemProvider(selector, {
		provideCompletionItems(
			document: vscode.TextDocument,
			position: vscode.Position
		) {
			let linePrefix = document.lineAt(position).text.substr(0, position.character);
			if (linePrefix.endsWith('title:')) {
				return titleOptions;
			}
		}
	}, ':');

	context.subscriptions.push(disposable, completion);
}

export function deactivate() {}
