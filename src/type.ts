import * as acorn from 'acorn';

export interface OptionsStruct {
    [propName: string]: {
        name: string;
        type: string[];
        valide: (string | number)[];
    }[];
}

export enum BarItemStatus {
    Loaded = 'Echarts',
    Loading = 'Echarts Loading',
    Failed = 'Echarts Failed, Click to reload',
    Deactivated = 'Echarts Deactivated, Click to activate',
}

export interface OptionsNameItem {
    prop?: string;
    arrayItemType?: string;
    type?: string | string[];
    isObject?: boolean;
    default?: string | number | boolean;
    children?: OptionsNameItem[];
}

export type Node = acorn.Node;
export interface Property extends Node {
    type: 'Property';
    key: Identifier;
    value: Literal | ObjectExpression | ArrayExpression;
}
export interface Identifier extends Node {
    type: 'Identifier';
    name: string;
}

export interface ArrayExpression extends Node {
    type: 'ArrayExpression';
    elements: Node[];
}

export interface ObjectExpression extends Node {
    type: 'ObjectExpression';
    properties: Node[];
}

interface Literal extends Node {
    type: 'Literal';
    value: string;
    raw: string;
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

export function isArrayExpression(node: Node): node is ArrayExpression {
    return node.type === 'ArrayExpression';
}

export function isObjectExpression(node: Node): node is ObjectExpression {
    return node.type === 'ObjectExpression';
}