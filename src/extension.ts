import * as vscode from 'vscode';
import {
	generateAToZArray
} from './utils';
import {
	VisualMapType,
	DataZoomType,
	ChartType,
	Node,
	isProperty,
	isIdentifier
} from './type';
import getAllOptions from './options/index';
import * as acorn from 'acorn';
import * as walk from 'acorn-walk';

export async function activate(context: vscode.ExtensionContext): Promise<void> {
	const [titleOption, legendOption, gridOption, xAxisOption, yAxisOption, polarOption,
	radiusAxisOption, angleAxisOption, radarOption, tooltipOption, axisPointerOption,
	toolboxOption, brushOption, geoOption, parallelOption, parallelAxisOption,
	singleAxisOption, timelineOption, graphicOption, calendarOption, datasetOption,
	ariaOption, textStyleOption, visualMapContinuousOption, visualMapPiecewiseOption,
	dataZoomSliderOption, dataZoomInsideOption, seriesBarOption, seriesLineOption,
	seriesPieOption, seriesScatterOption, seriesEffectScatterOption, seriesRadarOption,
	seriesTreeOption, seriesTreemapOption, seriesSunburstOption, seriesBoxplotOption,
	seriesCandlestickOption, seriesHeatmapOption, seriesMapOption, seriesParallelOption,
	seriesLinesOption, seriesGraphOption, seriesSankeyOption, seriesFunnelOption,
	seriesGaugeOption, seriesPictorialBarOption, seriesThemeRiverOption, seriesCustomOption,
	richOption] = await getAllOptions();

	const active = vscode.commands.registerCommand('extension.echarts', () => {
		getAllOptions();
		vscode.window.showInformationMessage('ECharts 中文版补全已开启!');
	});

	const activeEn = vscode.commands.registerCommand('extension.echarts.en', () => {
		getAllOptions('en');
		vscode.window.showInformationMessage('ECharts english autocomplete is up!');
	});

	const activeZh = vscode.commands.registerCommand('extension.echarts.zh', () => {
		getAllOptions();
		vscode.window.showInformationMessage('ECharts 中文版补全已开启!');
	});

	const selector: vscode.DocumentSelector = {
		scheme: 'file',
		language: 'javascript'
	};

	let prevLine = -1;
	let prevOption: vscode.CompletionItem[];

	const completion: vscode.Disposable = vscode.languages.registerCompletionItemProvider(selector,
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				let line = position.line;
				let linePrefix = document.lineAt(line).text;

				// Optimization
				// TODO: update return option by block not line
				if (line === prevLine) {
					return prevOption;
				}
				prevLine = line;

				while (line >= 0 && linePrefix.indexOf('}') === -1) {
					linePrefix = document.lineAt(line).text;
					if (linePrefix.indexOf('title: {') !== -1) {
						prevOption = titleOption;
						return titleOption;
					}

					if (linePrefix.indexOf('legend: {') !== -1) {
						prevOption = legendOption;
						return legendOption;
					}

					if (linePrefix.indexOf('grid: {') !== -1) {
						prevOption = gridOption;
						return gridOption;
					}

					if (linePrefix.indexOf('xAxis: {') !== -1) {
						prevOption = xAxisOption;
						return xAxisOption;
					}

					if (linePrefix.indexOf('yAxis: {') !== -1) {
						prevOption = yAxisOption;
						return yAxisOption;
					}

					if (linePrefix.indexOf('polar: {') !== -1) {
						prevOption = polarOption;
						return polarOption;
					}

					if (linePrefix.indexOf('radiusAxis: {') !== -1) {
						prevOption = radiusAxisOption;
						return radiusAxisOption;
					}

					if (linePrefix.indexOf('angleAxis: {') !== -1) {
						prevOption = angleAxisOption;
						return angleAxisOption;
					}

					if (linePrefix.indexOf('radar: {' ) !== -1) {
						prevOption = radarOption;
						return radarOption;
					}

					if (linePrefix.indexOf('axisPointer: {' ) !== -1) {
						prevOption = axisPointerOption;
						return axisPointerOption;
					}

					if (linePrefix.indexOf('tooltip: {' ) !== -1) {
						prevOption = tooltipOption;
						return tooltipOption;
					}

					if (linePrefix.indexOf('toolbox: {' ) !== -1) {
						prevOption = toolboxOption;
						return toolboxOption;
					}

					if (linePrefix.indexOf('brush: {' ) !== -1) {
						prevOption = brushOption;
						return brushOption;
					}

					if (linePrefix.indexOf('geo: {' ) !== -1) {
						prevOption = geoOption;
						return geoOption;
					}

					if (linePrefix.indexOf('parallel: {') !== -1) {
						prevOption = parallelOption;
						return parallelOption;
					}

					if (linePrefix.indexOf('parallelAxis: {') !== -1) {
						prevOption = parallelAxisOption;
						return parallelAxisOption;
					}

					if (linePrefix.indexOf('singleAxis: {') !== -1) {
						prevOption = singleAxisOption;
						return singleAxisOption;
					}

					if (linePrefix.indexOf('timeline: {') !== -1) {
						prevOption = timelineOption;
						return timelineOption;
					}

					if (linePrefix.indexOf('graphic: {') !== -1) {
						prevOption = graphicOption;
						return graphicOption;
					}

					if (linePrefix.indexOf('calendar: {') !== -1) {
						prevOption = calendarOption;
						return calendarOption;
					}

					if (linePrefix.indexOf('dataset: {') !== -1) {
						prevOption = datasetOption;
						return datasetOption;
					}

					if (linePrefix.indexOf('aria: {') !== -1) {
						prevOption = ariaOption;
						return ariaOption;
					}

					if (linePrefix.indexOf('textStyle: {') !== -1) {
						prevOption = textStyleOption;
						return textStyleOption;
					}

					if (linePrefix.indexOf('rich: {') !== -1) {
						prevOption = richOption;
						return richOption;
					}

					if (linePrefix.indexOf(VisualMapType.Continuous) !== -1) {
						prevOption = visualMapContinuousOption;
						return visualMapContinuousOption;
					}

					if (linePrefix.indexOf(VisualMapType.Piecewise) !== -1) {
						prevOption = visualMapPiecewiseOption;
						return visualMapPiecewiseOption;
					}

					if (linePrefix.indexOf(DataZoomType.Inside) !== -1) {
						prevOption = dataZoomInsideOption;
						return dataZoomInsideOption;
					}

					if (linePrefix.indexOf(DataZoomType.Slider) !== -1) {
						prevOption = dataZoomSliderOption;
						return dataZoomSliderOption;
					}

					if (linePrefix.indexOf(ChartType.Bar) !== -1) {
						prevOption = seriesBarOption;
						return seriesBarOption;
					}

					if (linePrefix.indexOf(ChartType.Line) !== -1) {
						prevOption = seriesLineOption;
						return seriesLineOption;
					}

					if (linePrefix.indexOf(ChartType.Pie) !== -1) {
						prevOption = seriesPieOption;
						return seriesPieOption;
					}

					if (linePrefix.indexOf(ChartType.Scatter) !== -1) {
						prevOption = seriesScatterOption;
						return seriesScatterOption;
					}

					if (linePrefix.indexOf(ChartType.EffectScatter) !== -1) {
						prevOption = seriesEffectScatterOption;
						return seriesEffectScatterOption;
					}

					if (linePrefix.indexOf(ChartType.Radar) !== -1) {
						prevOption = seriesRadarOption;
						return seriesRadarOption;
					}

					if (linePrefix.indexOf(ChartType.Tree) !== -1) {
						prevOption = seriesTreeOption;
						return seriesTreeOption;
					}

					if (linePrefix.indexOf(ChartType.TreeMap) !== -1) {
						prevOption = seriesTreemapOption;
						return seriesTreemapOption;
					}

					if (linePrefix.indexOf(ChartType.SunBurst) !== -1) {
						prevOption = seriesSunburstOption;
						return seriesSunburstOption;
					}

					if (linePrefix.indexOf(ChartType.BoxPlot) !== -1) {
						prevOption = seriesBoxplotOption;
						return seriesBoxplotOption;
					}

					if (linePrefix.indexOf(ChartType.CandleStick) !== -1) {
						prevOption = seriesCandlestickOption;
						return seriesCandlestickOption;
					}

					if (linePrefix.indexOf(ChartType.HeatMap) !== -1) {
						prevOption = seriesHeatmapOption;
						return seriesHeatmapOption;
					}

					if (linePrefix.indexOf(ChartType.Map) !== -1) {
						prevOption = seriesMapOption;
						return seriesMapOption;
					}

					if (linePrefix.indexOf(ChartType.Parallel) !== -1) {
						prevOption = seriesParallelOption;
						return seriesParallelOption;
					}

					if (linePrefix.indexOf(ChartType.Lines) !== -1) {
						prevOption = seriesLinesOption;
						return seriesLinesOption;
					}

					if (linePrefix.indexOf(ChartType.Graph) !== -1) {
						prevOption = seriesGraphOption;
						return seriesGraphOption;
					}

					if (linePrefix.indexOf(ChartType.Sankey) !== -1) {
						prevOption = seriesSankeyOption;
						return seriesSankeyOption;
					}

					if (linePrefix.indexOf(ChartType.Funnel) !== -1) {
						prevOption = seriesFunnelOption;
						return seriesFunnelOption;
					}

					if (linePrefix.indexOf(ChartType.Gauge) !== -1) {
						prevOption = seriesGaugeOption;
						return seriesGaugeOption;
					}

					if (linePrefix.indexOf(ChartType.PictorialBar) !== -1) {
						prevOption = seriesPictorialBarOption;
						return seriesPictorialBarOption;
					}

					if (linePrefix.indexOf(ChartType.ThemeRiver) !== -1) {
						prevOption = seriesThemeRiverOption;
						return seriesThemeRiverOption;
					}

					if (linePrefix.indexOf(ChartType.Custom) !== -1) {
						prevOption = seriesCustomOption;
						return seriesCustomOption;
					}

					line -= 1;
				}
			}
		},
		...generateAToZArray()
	);

    vscode.workspace.onDidChangeTextDocument(event => {
		const text = event.document.getText();
		try {
			walk.ancestor(acorn.parse(text), {
				Property(node: Node, ancestors: Node[]) {
					const arr: string[] = [];
					if (node.type === 'Property') {
						ancestors.map(item => {
							if (isProperty(item) && isIdentifier(item.key) ) {
								arr.push(item.key.name);
							}
							if (item.type === 'Program') {
								arr.push('option');
							}
						})
						console.log(arr)
					}
				}
			});

		} catch (error) {
			console.log(error);
		}
    });

	context.subscriptions.push(active, activeEn, activeZh, completion);
}

// export function deactivate() {}
