/**
 * @file option description request url
 */

const ZH_HOST: string = 'https://echarts.apache.org/zh/documents/option-parts/';
const EN_HOST: string = 'https://echarts.apache.org/en/documents/option-parts/';

interface Url {
    [propName: string]: string;
}
interface Urls {
    [propName: string]: Url;
}

export const urls: Urls = {
    zh: {
        TITLE_URL: `${ZH_HOST}option.title.json?`,
        LEGEND_URL: `${ZH_HOST}option.legend.json?`,
        GRID_URL: `${ZH_HOST}option.grid.json`,
        XAXIS_URL: `${ZH_HOST}option.xAxis.json`,
        YAXIS_URL: `${ZH_HOST}option.yAxis.json`,
        POLAR_URL: `${ZH_HOST}option.polar.json`,
        RADIUSAXIS_URL: `${ZH_HOST}option.radiusAxis.json`,
        ANGLEAXIS_URL: `${ZH_HOST}option.angleAxis.json`,
        RADAR_URL: `${ZH_HOST}option.radar.json`,
        VISUALMAP: `${ZH_HOST}option.visualMap.json`,
        TOOLTIP_URL: `${ZH_HOST}option.tooltip.json`,
        AXISPOINTER_URL: `${ZH_HOST}option.axisPointer.json`,
        TOOLBOX_URL: `${ZH_HOST}option.toolbox.json`,
        BRUSH_URL: `${ZH_HOST}option.brush.json`,
        GEO_URL: `${ZH_HOST}option.geo.json`,
        PARALLEL_URL: `${ZH_HOST}option.parallel.json`,
        PARALLELAXIS_URL: `${ZH_HOST}option.parallelAxis.json`,
        SINGLEAXIS_URL: `${ZH_HOST}option.singleAxis.json`,
        TIMELINE_URL: `${ZH_HOST}option.timeline.json`,
        GRAPHIC_URL: `${ZH_HOST}option.graphic.json`,
        CALENDAR_URL: `${ZH_HOST}option.calendar.json`,
        DATASET_URL: `${ZH_HOST}option.dataset.json`,
        ARIA_URL: `${ZH_HOST}option.aria.json`,
        TEXTSTYLE_URL: `${ZH_HOST}option.textStyle.json`,
    },
    en: {
        TITLE_URL: `${EN_HOST}option.title.json?`,
        LEGEND_URL: `${EN_HOST}option.legend.json?`,
        GRID_URL: `${EN_HOST}option.grid.json`,
        XAXIS_URL: `${EN_HOST}option.xAxis.json`,
        YAXIS_URL: `${EN_HOST}option.yAxis.json`,
        POLAR_URL: `${EN_HOST}option.polar.json`,
        RADIUSAXIS_URL: `${EN_HOST}option.radiusAxis.json`,
        ANGLEAXIS_URL: `${EN_HOST}option.angleAxis.json`,
        RADAR_URL: `${EN_HOST}option.radar.json`,
        VISUALMAP: `${EN_HOST}option.visualMap.json`,
        TOOLTIP_URL: `${EN_HOST}option.tooltip.json`,
        AXISPOINTER_URL: `${EN_HOST}option.axisPointer.json`,
        TOOLBOX_URL: `${EN_HOST}option.toolbox.json`,
        BRUSH_URL: `${EN_HOST}option.brush.json`,
        GEO_URL: `${EN_HOST}option.geo.json`,
        PARALLEL_URL: `${EN_HOST}option.parallel.json`,
        PARALLELAXIS_URL: `${EN_HOST}option.parallelAxis.json`,
        SINGLEAXIS_URL: `${EN_HOST}option.singleAxis.json`,
        TIMELINE_URL: `${EN_HOST}option.timeline.json`,
        GRAPHIC_URL: `${EN_HOST}option.graphic.json`,
        CALENDAR: `${EN_HOST}option.calendar.json`,
        DATASET_URL: `${EN_HOST}option.dataset.json`,
        ARIA_URL: `${EN_HOST}option.aria.json`,
        TEXTSTYLE_URL: `${EN_HOST}option.textStyle.json`,

    }
};