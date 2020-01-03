import * as vscode from 'vscode';
import {utils} from './utils';
import getTitleOptions from './options/title';
import getLegendOptions from './options/legend';
import getGridOptions from './options/grid';
import getxAxisOptions from './options/xAxis';
import getyAxisOptions from './options/yAxis';

const actionArray: string[] = utils.generateAToZArray();
let lang: string = 'zh';
let titleOption: vscode.CompletionItem[],
	legendOption: vscode.CompletionItem[],
	gridOption: vscode.CompletionItem[],
	xAxisOption: vscode.CompletionItem[],
	yAxisOption: vscode.CompletionItem[],
	polarOption: vscode.CompletionItem[],
	radiusAxisOption: vscode.CompletionItem[],
	angleAxisOption: vscode.CompletionItem[],
	radarOption: vscode.CompletionItem[],
	dataZoom: vscode.CompletionItem[],
	visualMapOption: vscode.CompletionItem[],
	tooltipOption: vscode.CompletionItem[],
	axisPointerOption: vscode.CompletionItem[],
	toolboxOption: vscode.CompletionItem[],
	brushOption: vscode.CompletionItem[],
	geoOption: vscode.CompletionItem[],
	parallelOption: vscode.CompletionItem[],
	parallelAxisOption: vscode.CompletionItem[],
	singleAxisOption: vscode.CompletionItem[],
	timelineOption: vscode.CompletionItem[],
	graphicOption: vscode.CompletionItem[],
	calendarOption: vscode.CompletionItem[],
	datasetOption: vscode.CompletionItem[],
	ariaOption: vscode.CompletionItem[],
	seriesOption: vscode.CompletionItem[],
	colorOption: vscode.CompletionItem,
	backgroundColorOption: vscode.CompletionItem,
	textStyleOption: vscode.CompletionItem[],
	animation: vscode.CompletionItem,
	animationThreshold: vscode.CompletionItem,
	animationDuration: vscode.CompletionItem,
	animationEasing: vscode.CompletionItem,
	animationDelay: vscode.CompletionItem,
	animationDurationUpdate: vscode.CompletionItem,
	animationEasingUpdate: vscode.CompletionItem,
	animationDelayUpdate: vscode.CompletionItem,
	blendMode: vscode.CompletionItem,
	hoverLayerThreshold: vscode.CompletionItem,
	useUTC: vscode.CompletionItem;

async function getAllOptions(lang: string): Promise<void> {
	[
		titleOption,
		legendOption,
		gridOption,
		xAxisOption,
		yAxisOption
	] = await Promise.all([
		getTitleOptions(lang),
		getLegendOptions(lang),
		getGridOptions(lang),
		getxAxisOptions(lang),
		getyAxisOptions(lang)
	]);
}

getAllOptions(lang);

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "echarts" is now active!');

	let active = vscode.commands.registerCommand('extension.echarts', () => {
		vscode.window.showInformationMessage('ECharts 中文版补全已开启!');
		lang = 'zh';
		getAllOptions(lang);
	});

	let activeEn = vscode.commands.registerCommand('extension.echarts.en', () => {
		vscode.window.showInformationMessage('ECharts english autocomplete is up!');
		lang = 'en';
		getAllOptions(lang);
	});

	let activeZh = vscode.commands.registerCommand('extension.echarts.zh', () => {
		vscode.window.showInformationMessage('ECharts 中文版补全已开启!');
		lang = 'zh';
		getAllOptions(lang);
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
						return titleOption;
					}

					if (linePrefix.indexOf('legend: {') !== -1) {
						return legendOption;
					}

					if (linePrefix.indexOf('grid: {') !== -1) {
						return gridOption;
					}

					if (linePrefix.indexOf('xAxis: {') !== -1) {
						return xAxisOption;
					}

					if (linePrefix.indexOf('yAxis: {') !== -1) {
						return yAxisOption;
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
