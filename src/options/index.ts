import { CompletionItem } from 'vscode';
import {
	VisualMapType,
	DataZoomType,
} from '../utils';
import getTitleOptions from './title';
import getLegendOptions from './legend';
import getGridOptions from './grid';
import getxAxisOptions from './xAxis';
import getyAxisOptions from './yAxis';
import getPolarOptions from './polar';
import getRadiusAxisOptions from './radiusAxis';
import getAnglesAxisOptions from './angleAxis';
import getRadarOptions from './radar';
import getTooltipOptions from './tooltip';
import getAxisPointerOptions from './axisPointer';
import getToolboxOptions from './toolbox';
import getBrushOptions from './brush';
import getGeoOptions from './geo';
import getParallelOptions from './parallel';
import getParallelAxisOptions from './parallelAxis';
import getSingleAxisOption from './singleAxis';
import getTimelineOption from './timeline';
import getGraphicOptions from './graphic';
import getCalendarOptions from './calendar';
import getDatasetOptions from './dataset';
import getAriaOptions from './aria';
import getTextStyleOptions from './textStyle';
import getVisualMapOptions from './visualMap';
import getDataZoomOptions from './dataZoom';
import getBarOptions from './seriesBar';
import getLineOptions from './seriesLine';
import getPieOptions from './seriesPie';
import getScatterOptions from './seriesScatter';
import getEffectScatterOptions from './seriesEffectScatter';
import getRadarChartOptions from './seriesRadar';
import getTreeOptions from './seriesTree';
import getTreemapOptions from './seriesTreemap';
import getSunburstOptions from './seriesSunburst';
import getBoxplotOptions from './seriesBoxplot';
import getCandlestickOptions from './seriesCandlestick';
import getHeatmapOptions from './seriesHeatmap';
import getMapOptions from './seriesMap';
import getParallelChartOptions from './seriesParallel';
import getLinesOptions from './seriesLines';
import getGraphOptions from './seriesGraph';
import getSankeyOptions from './seriesSankey';
import getFunnelOptions from './seriesFunnel';
import getGaugeOptions from './seriesGauge';
import getPictorialBarOptions from './seriesPictorialBar';
import getThemeRiverOptions from './seriesThemeRiver';
import getCustomOptions from './seriesCustom';
import getRichOptions from './rich';

export default async function getAllOptions(lang = 'zh'): Promise<CompletionItem[][]> {
	return await Promise.all([
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
		getGaugeOptions(lang), getPictorialBarOptions(lang), getThemeRiverOptions(lang), getCustomOptions(lang),
		getRichOptions()
	]);
}