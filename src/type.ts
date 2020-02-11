import * as ESTree from 'estree';
import { CompletionItem } from 'vscode';

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

export type GetDataParams = {
    lang: string,
    option: string
};

export type Node = ESTree.Node;

export interface Item {
    id: string;
    item: CompletionItem[];
}

export interface OptionsItem {
    [propName: string]: CompletionItem[];
}

export function isProperty(node: ESTree.Node): node is ESTree.Property {
    return node.type === 'Property';
}

export function isIdentifier(node: ESTree.Node): node is ESTree.Identifier {
    return node.type === 'Identifier';
}