import * as vscode from 'vscode';
import titleOptions from './options/title';
import legendOptions from './options/legend';
import gridOptions from './options/grid';
import {utils} from './utils';

const actionArray: string[] = utils.generateAToZArray();

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "echarts" is now active!');

	let disposable = vscode.commands.registerCommand('extension.echarts', () => {
		vscode.window.showInformationMessage('ECharts autocomplete is up!');
	});

	const selector: vscode.DocumentSelector = {
		scheme: 'file',
		language: 'javascript'
	};

	const completion: vscode.Disposable = vscode.languages.registerCompletionItemProvider(selector,
		{
			provideCompletionItems(document: vscode.TextDocument) {
				const {activeTextEditor} = vscode.window;
				let line: number = activeTextEditor?.selection.active.line || 0;
				let linePrefix: string = document.lineAt(line).text;
				while (line >= 0) {
					linePrefix = document.lineAt(line).text;
					if (linePrefix.indexOf('title: {') !== -1) {
						return titleOptions;
					}

					if (linePrefix.indexOf('legend: {') !== -1) {
						return legendOptions;
					}

					if (linePrefix.indexOf('grid: {') !== -1) {
						return gridOptions;
					}

					line -= 1;
				}
			}
		},
		...actionArray
	);
	context.subscriptions.push(disposable, completion);
}

export function deactivate() {}
