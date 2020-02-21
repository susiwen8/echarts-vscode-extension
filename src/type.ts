import * as acorn from 'acorn';
import { Found } from 'acorn-walk';
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

export const CHART_TYPE = [
    'bar',
    'line',
    'pie',
    'scatter',
    'effectScatter',
    'radar',
    'tree',
    'treemap',
    'sunburst',
    'boxplot',
    'candlestick',
    'heatmap',
    'map',
    'parallel',
    'lines',
    'graph',
    'sankey',
    'funnel',
    'gauge',
    'pictorialBar',
    'themeRiver',
    'custom'
];

export type GetDataParams = {
    lang: string,
    option: string
};

export type Node = acorn.Node;
interface Property extends Node {
    type: 'Property';
    key: Identifier;
}
interface Identifier extends Node {
    type: 'Identifier';
    name: string;
}

interface Literal extends Found<Node> {
    type: 'Literal';
    value: string;
    raw: string;
    start: number;
    end: number;
}

export interface Item {
    id: string;
    item: CompletionItem[];
}

export interface OptionsItem {
    [propName: string]: CompletionItem[];
}

export function isProperty(node: Node): node is Property {
    return node.type === 'Property';
}

export function isIdentifier(node: Node): node is Identifier {
    return node.type === 'Identifier';
}

export function isLiteral(node: Node): node is Literal {
    return node.type === 'Literal';
}