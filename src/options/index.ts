import {
    VisualMapType,
    DataZoomType,
    OptionsItem
} from '../type';
import { getOptionsNames } from '../utils';
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

export default async function getAllOptions(lang = 'zh'): Promise<OptionsItem | null> {
    const optionsNames = await getOptionsNames();
    // console.log(optionsNames);
    if (!optionsNames) {
        return null;
    }

    const optionsArr = await Promise.all([
        getTitleOptions({ lang, optionsName: optionsNames.title }),
        getLegendOptions({ lang, optionsName: optionsNames.legend }),
        getGridOptions({ lang, optionsName: optionsNames.grid }),
        getxAxisOptions({ lang, optionsName: optionsNames.xAxis }),
        getyAxisOptions({ lang, optionsName: optionsNames.yAxis }),
        getPolarOptions({ lang, optionsName: optionsNames.polar }),
        getRadiusAxisOptions({ lang, optionsName: optionsNames.radiusAxis }),
        getAnglesAxisOptions({ lang, optionsName: optionsNames.angleAxis }),
        getTooltipOptions({ lang, optionsName: optionsNames.tooltip }),
        getRadarOptions({ lang, optionsName: optionsNames.radar }),
        getAxisPointerOptions({ lang, optionsName: optionsNames.axisPointer }),
        getToolboxOptions({ lang, optionsName: optionsNames.toolbox }),
        getBrushOptions({ lang, optionsName: optionsNames.brush }),
        getGeoOptions({ lang, optionsName: optionsNames.geo }),
        getParallelOptions({ lang, optionsName: optionsNames.parallel }),
        getParallelAxisOptions({ lang, optionsName: optionsNames.parallelAxis }),
        getSingleAxisOption({ lang, optionsName: optionsNames.singleAxis }),
        getTimelineOption({ lang, optionsName: optionsNames.timeline }),
        getGraphicOptions({ lang, optionsName: optionsNames.graphic }),
        getCalendarOptions({ lang, optionsName: optionsNames.calendar }),
        getDatasetOptions({ lang, optionsName: optionsNames.dataset }),
        getAriaOptions({ lang, optionsName: optionsNames.aria }),
        getTextStyleOptions({ lang, optionsName: optionsNames.textStyle }),
        getVisualMapOptions({ lang, optionsName: optionsNames.continuous, type: VisualMapType.Continuous }),
        getVisualMapOptions({ lang, optionsName: optionsNames.piecewise, type: VisualMapType.Piecewise }),
        getDataZoomOptions({ lang, optionsName: optionsNames.inside, type: DataZoomType.Inside }),
        getDataZoomOptions({ lang, optionsName: optionsNames.slider, type: DataZoomType.Slider }),
        getBarOptions({ lang, optionsName: optionsNames.bar }),
        getLineOptions({ lang, optionsName: optionsNames.line }),
        getPieOptions({ lang, optionsName: optionsNames.pie }),
        getScatterOptions({ lang, optionsName: optionsNames.scatter }),
        getEffectScatterOptions({ lang, optionsName: optionsNames.effectScatter }),
        getRadarChartOptions({ lang, optionsName: optionsNames.radar }),
        getTreeOptions({ lang, optionsName: optionsNames.tree }),
        getTreemapOptions({ lang, optionsName: optionsNames.treemap }),
        getSunburstOptions({ lang, optionsName: optionsNames.sunburst }),
        getBoxplotOptions({ lang, optionsName: optionsNames.boxplot }),
        getCandlestickOptions({ lang, optionsName: optionsNames.candlestick }),
        getHeatmapOptions({ lang, optionsName: optionsNames.heatmap }),
        getMapOptions({ lang, optionsName: optionsNames.map }),
        getParallelChartOptions({ lang, optionsName: optionsNames.seriesParallel }),
        getLinesOptions({ lang, optionsName: optionsNames.lines }),
        getGraphOptions({ lang, optionsName: optionsNames.graph }),
        getSankeyOptions({ lang, optionsName: optionsNames.sankey }),
        getFunnelOptions({ lang, optionsName: optionsNames.funnel }),
        getGaugeOptions({ lang, optionsName: optionsNames.gauge }),
        getPictorialBarOptions({ lang, optionsName: optionsNames.pictorialBar }),
        getThemeRiverOptions({ lang, optionsName: optionsNames.themeRiver }),
        getCustomOptions({ lang, optionsName: optionsNames.custom }),
        getRichOptions()
    ]);

    const optionsObj: OptionsItem = {};

    for (let i = 0, len = optionsArr.length; i < len; i++) {
        optionsObj[optionsArr[i].id] = optionsArr[i].item;
    }

    return optionsObj;
}