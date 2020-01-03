import * as vscode from 'vscode';
import getTitleOptions from './options/title';
import getLegendOptions from './options/legend';
import getGridOptions from './options/grid';
import {utils} from './utils';

const actionArray: string[] = utils.generateAToZArray();
let globalLanguage: string = 'zh';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "echarts" is now active!');

	let active = vscode.commands.registerCommand('extension.echarts', () => {
		vscode.window.showInformationMessage('ECharts english autocomplete is up!');
		globalLanguage = 'zh';
	});

	let activeEn = vscode.commands.registerCommand('extension.echarts.en', () => {
		vscode.window.showInformationMessage('ECharts english autocomplete is up!');
		globalLanguage = 'en';
	});

	let activeZh = vscode.commands.registerCommand('extension.echarts.zh', () => {
		vscode.window.showInformationMessage('ECharts english autocomplete is up!');
		globalLanguage = 'zh';
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

				while (line >= 0 && linePrefix.indexOf('}') === -1) {
					linePrefix = document.lineAt(line).text;
					if (linePrefix.indexOf('title: {') !== -1) {
						return getTitleOptions(globalLanguage);
					}

					if (linePrefix.indexOf('legend: {') !== -1) {
						return getLegendOptions(globalLanguage);
					}

					if (linePrefix.indexOf('grid: {') !== -1) {
						return getGridOptions(globalLanguage);
					}

					line -= 1;
				}
			}
		},
		...actionArray
	);

	context.subscriptions.push(active, activeEn, activeZh, completion);
}

export function deactivate() {}
