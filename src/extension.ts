import * as vscode from 'vscode';
import {
	generateAToZArray,
	VisualMapType,
	DataZoomType,
	ChartType
} from './utils';
import getTitleOptions from './options/title';
import getLegendOptions from './options/legend';
import getGridOptions from './options/grid';
import getxAxisOptions from './options/xAxis';
import getyAxisOptions from './options/yAxis';
import getPolarOptions from './options/polar';
import getRadiusAxisOptions from './options/radiusAxis';
import getAnglesAxisOptions from './options/angleAxis';
import getRadarOptions from './options/radar';
import getTooltipOptions from './options/tooltip';
import getAxisPointerOptions from './options/axisPointer';
import getToolboxOptions from './options/toolbox';
import getBrushOptions from './options/brush';
import getGeoOptions from './options/geo';
import getParallelOptions from './options/parallel';
import getParallelAxisOptions from './options/parallelAxis';
import getSingleAxisOption from './options/singleAxis';
import getTimelineOption from './options/timeline';
import getGraphicOptions from './options/graphic';
import getCalendarOptions from './options/calendar';
import getDatasetOptions from './options/dataset';
import getAriaOptions from './options/aria';
import getTextStyleOptions from './options/textStyle';
import getVisualMapOptions from './options/visualMap';
import getDataZoomOptions from './options/dataZoom';
import getBarOptions from './options/seriesBar';
import getLineOptions from './options/seriesLine';
import getPieOptions from './options/seriesPie';
import getScatterOptions from './options/seriesScatter';
import getEffectScatterOptions from './options/seriesEffectScatter';
import getRadarChartOptions from './options/seriesRadar';
import getTreeOptions from './options/seriesTree';
import getTreemapOptions from './options/seriesTreemap';
import getSunburstOptions from './options/seriesSunburst';
import getBoxplotOptions from './options/seriesBoxplot';
import getCandlestickOptions from './options/seriesCandlestick';
import getHeatmapOptions from './options/seriesHeatmap';
import getMapOptions from './options/seriesMap';
import getParallelChartOptions from './options/seriesParallel';
import getLinesOptions from './options/seriesLines';
import getGraphOptions from './options/seriesGraph';
import getSankeyOptions from './options/seriesSankey';
import getFunnelOptions from './options/seriesFunnel';
import getGaugeOptions from './options/seriesGauge';
import getPictorialBarOptions from './options/seriesPictorialBar';
import getThemeRiverOptions from './options/seriesThemeRiver';
import getCustomOptions from './options/seriesCustom';

const actionArray: string[] = generateAToZArray();
let lang = 'zh';
let titleOption: vscode.CompletionItem[], legendOption: vscode.CompletionItem[],
	gridOption: vscode.CompletionItem[], xAxisOption: vscode.CompletionItem[],
	yAxisOption: vscode.CompletionItem[], polarOption: vscode.CompletionItem[],
	radiusAxisOption: vscode.CompletionItem[], angleAxisOption: vscode.CompletionItem[],
	radarOption: vscode.CompletionItem[], tooltipOption: vscode.CompletionItem[],
	axisPointerOption: vscode.CompletionItem[], toolboxOption: vscode.CompletionItem[],
	brushOption: vscode.CompletionItem[], geoOption: vscode.CompletionItem[],
	parallelOption: vscode.CompletionItem[], parallelAxisOption: vscode.CompletionItem[],
	singleAxisOption: vscode.CompletionItem[], timelineOption: vscode.CompletionItem[],
	graphicOption: vscode.CompletionItem[], calendarOption: vscode.CompletionItem[],
	datasetOption: vscode.CompletionItem[], ariaOption: vscode.CompletionItem[],
	textStyleOption: vscode.CompletionItem[], visualMapContinuousOption: vscode.CompletionItem[],
	visualMapPiecewiseOption: vscode.CompletionItem[], dataZoomSliderOption: vscode.CompletionItem[],
	dataZoomInsideOption: vscode.CompletionItem[], seriesBarOption: vscode.CompletionItem[],
	seriesLineOption: vscode.CompletionItem[], seriesPieOption: vscode.CompletionItem[],
	seriesScatterOption: vscode.CompletionItem[], seriesEffectScatterOption: vscode.CompletionItem[],
	seriesRadarOption: vscode.CompletionItem[], seriesTreeOption: vscode.CompletionItem[],
	seriesTreemapOption: vscode.CompletionItem[], seriesSunburstOption: vscode.CompletionItem[],
	seriesBoxplotOption: vscode.CompletionItem[], seriesCandlestickOption: vscode.CompletionItem[],
	seriesHeatmapOption: vscode.CompletionItem[], seriesMapOption: vscode.CompletionItem[],
	seriesParallelOption: vscode.CompletionItem[], seriesLinesOption: vscode.CompletionItem[],
	seriesGraphOption: vscode.CompletionItem[], seriesSankeyOption: vscode.CompletionItem[],
	seriesFunnelOption: vscode.CompletionItem[], seriesGaugeOption: vscode.CompletionItem[],
	seriesPictorialBarOption: vscode.CompletionItem[], seriesThemeRiverOption: vscode.CompletionItem[],
	seriesCustomOption: vscode.CompletionItem[];

// TODO: no internet connection
async function getAllOptions(lang: string): Promise<void> {
	[
		titleOption, legendOption, gridOption, xAxisOption, yAxisOption, polarOption, radiusAxisOption,
		angleAxisOption, tooltipOption, radarOption, axisPointerOption, toolboxOption, brushOption,
		geoOption, parallelOption, parallelAxisOption, singleAxisOption, timelineOption, graphicOption,
		calendarOption, datasetOption, ariaOption, textStyleOption, visualMapContinuousOption,
		visualMapPiecewiseOption, dataZoomInsideOption, dataZoomSliderOption, seriesBarOption,
		seriesLineOption, seriesPieOption, seriesScatterOption, seriesEffectScatterOption,
		seriesRadarOption, seriesTreeOption, seriesTreemapOption, seriesSunburstOption,
		seriesBoxplotOption, seriesCandlestickOption, seriesHeatmapOption, seriesMapOption,
		seriesParallelOption, seriesLinesOption, seriesGraphOption, seriesSankeyOption,
		seriesFunnelOption, seriesGaugeOption, seriesPictorialBarOption, seriesThemeRiverOption,
		seriesCustomOption
	] = await Promise.all([
		getTitleOptions(lang), getLegendOptions(lang), getGridOptions(lang), getxAxisOptions(lang),
		getyAxisOptions(lang), getPolarOptions(lang), getRadiusAxisOptions(lang), getAnglesAxisOptions(lang),
		getTooltipOptions(lang), getRadarOptions(lang), getAxisPointerOptions(lang), getToolboxOptions(lang),
		getBrushOptions(lang), getGeoOptions(lang), getParallelOptions(lang), getParallelAxisOptions(lang),
		getSingleAxisOption(lang), getTimelineOption(lang), getGraphicOptions(lang), getCalendarOptions(lang),
		getDatasetOptions(lang), getAriaOptions(lang), getTextStyleOptions(lang), getVisualMapOptions(lang, VisualMapType.Continuous),
		getVisualMapOptions(lang, VisualMapType.Piecewise), getDataZoomOptions(lang, DataZoomType.Inside),
		getDataZoomOptions(lang, DataZoomType.Slider), getBarOptions(lang), getLineOptions(lang),
		getPieOptions(lang), getScatterOptions(lang), getEffectScatterOptions(lang), getRadarChartOptions(lang),
		getTreeOptions(lang), getTreemapOptions(lang), getSunburstOptions(lang), getBoxplotOptions(lang),
		getCandlestickOptions(lang), getHeatmapOptions(lang), getMapOptions(lang), getParallelChartOptions(lang),
		getLinesOptions(lang), getGraphOptions(lang), getSankeyOptions(lang), getFunnelOptions(lang),
		getGaugeOptions(lang), getPictorialBarOptions(lang), getThemeRiverOptions(lang), getCustomOptions(lang)
	]);
}

getAllOptions(lang);

export function activate(context: vscode.ExtensionContext): void {

	console.log('Congratulations, your extension "echarts" is now active!');

	const active = vscode.commands.registerCommand('extension.echarts', () => {
		lang = 'zh';
		getAllOptions(lang);
		vscode.window.showInformationMessage('ECharts 中文版补全已开启!');
	});

	const activeEn = vscode.commands.registerCommand('extension.echarts.en', () => {
		lang = 'en';
		getAllOptions(lang);
		vscode.window.showInformationMessage('ECharts english autocomplete is up!');
	});

	const activeZh = vscode.commands.registerCommand('extension.echarts.zh', () => {
		lang = 'zh';
		getAllOptions(lang);
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
			provideCompletionItems(document: vscode.TextDocument) {
				const {activeTextEditor} = vscode.window;
				let line: number = activeTextEditor?.selection.active.line || 0;
				// console.log(document.getText().replace(/\s/g, ''));
				let linePrefix: string = document.lineAt(line).text;

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

					if (linePrefix.indexOf(VisualMapType.Continuous) !== -1) {
						prevOption = visualMapContinuousOption;
						return visualMapContinuousOption;
					}

					if (linePrefix.indexOf(VisualMapType.Piecewise) !== -1) {
						prevOption = visualMapPiecewiseOption;
						return visualMapPiecewiseOption;
					}

					// TODO: same with slider
					if (linePrefix.indexOf(DataZoomType.Inside) !== -1) {
						prevOption = dataZoomInsideOption;
						return dataZoomInsideOption;
					}

					// TODO: this affect timeline option
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
		...actionArray
	);

	context.subscriptions.push(active, activeEn, activeZh, completion);
}

// export function deactivate() {}
