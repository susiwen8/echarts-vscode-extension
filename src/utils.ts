/**
 * @file util functions
 */

import axios from 'axios';
import {urls} from './urls';

export interface Options {
    [propName: string]: string;
}

export enum VisualMapType {
    Continuous = 'continuous',
    Piecewise = 'piecewise'
}

export enum DataZoomType {
    Inside = 'inside',
    Slider = 'slider'
}

export enum ChartType {
    Bar = 'bar',
    Line = 'line',
    Pie = 'pie',
    Scatter = 'scatter',
    EffectScatter = 'effectScatter',
    Radar = 'radar',
    Tree = 'tree',
    TreeMap = 'treemap',
    SunBurst = 'sunburst',
    BoxPlot = 'boxplot',
    CandleStick = 'candlestick',
    HeatMap = 'heatmap',
    Map = 'map',
    Parallel = 'parallel',
    Lines = 'lines',
    Graph = 'graph',
    Sankey = 'sankey',
    Funnel = 'funnel',
    Gauge = 'gauge',
    PictorialBar = 'pictorialBar',
    ThemeRiver = 'themeRiver',
    Custom = 'custom',
}

type GetDataParams = {
    lang: string,
    option: string
};

/**
 * Axios request
 * @param url request url
 */
export async function getData({lang, option}: GetDataParams): Promise<Options|undefined> {
    const api = urls[lang][option];
    try {
        const res = await axios.get(api, {
            timeout: 2000
        });
        for (const key in res.data) {
            res.data[key] = res.data[key].replace(/<[^>]+>/g, '').trim();
        }
        return res.data;
    } catch (error) {
        console.log(`${error.code}, ${api}: `);
    }
}

/**
 * Generate an arry from a-z
 */
export function generateAToZArray(): string[] {
    const arr: string[] = [];
    for (let i = 65; i <= 122; i++) {
        if (i > 90 && i < 97) {
            continue;
        }
        arr.push(String.fromCharCode(i));
    }

    return arr;
}