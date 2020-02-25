/**
 * @file util functions
 */

import axios from 'axios';
import { urls } from './urls';
import { findNodeAround } from 'acorn-walk';
import {
    GetDataParams,
    Options,
    Node,
    Property,
    isProperty,
    isLiteral,
    isArrayExpression,
    isObjectExpression
} from './type';

/**
 * series option is object, find which chart type it is
 * @param properties Object's properties
 */
function findChartTypeInObject(properties: Node[]): string {
    let chartType = '';
    for (let i = 0, len = properties.length; i < len; i++) {
        const property = properties[i];
        if (
            isProperty(property)
            && property.key.name === 'type'
            && isLiteral(property.value)
        ) {
            chartType = property.value.value;
        }
    }

    return chartType;
}

/**
 * series option is array, find input at which chart type
 * @param elements Array elements
 * @param position input postion
 */
function findChartTypeInArray(elements: Node[], position: number): string {
    for (let i = 0, len = elements.length; i < len; i++) {
        const element = elements[i];
        if (
            position >= element.start
            && position < element.end
            && isObjectExpression(element)
        ) {
            return findChartTypeInObject(element.properties)
        }
    }

    return ''
}

/**
 * Axios request
 * @param url request url
 */
export async function getData({ lang, option }: GetDataParams): Promise<Options | undefined> {
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

/**
 * find current node's ancestor nodes
 * @param ast AST tree
 * @param node current node
 */
export function walkNodeRecursive(ast: Node, node: Node): string {
    let nodes = '';
    if (isProperty(node)) {
        const prevNode = findNodeAround(ast, node.end + 1, 'Property')
        if (prevNode && isProperty(prevNode.node)) {
            nodes += prevNode.node.key.name;
            return `${nodes}.${walkNodeRecursive(ast, prevNode.node) || ''}`;
        }
    }

    return nodes;
}

/**
 * find out input at which chart type
 * @param values series option value
 * @param position input position
 */
export function findChartType(values: Property['value'], position: number): string {
    if (isObjectExpression(values)) {
        return findChartTypeInObject(values.properties);
    }

    if (isArrayExpression(values)) {
        return findChartTypeInArray(values.elements, position);
    }

    return '';
}