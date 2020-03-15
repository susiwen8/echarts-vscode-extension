/**
 * @file util functions
 */

import axios from 'axios';
import { findNodeAround, Found } from 'acorn-walk';
import {
    OptionsStruct,
    Node,
    Property,
    OptionsNameItem,
    isProperty,
    isLiteral,
    isArrayExpression,
    isObjectExpression
} from './type';

const OPTION_OUTLINE = 'https://echarts.apache.org/zh/documents/option-parts/option-outline.json';
const OPTION_GL_OUTLINE = 'https://echarts.apache.org/zh/documents/option-gl-parts/option-gl-outline.json';
// const OPTION_OUTLINE = 'https://loving-goldstine-32d8e8.netlify.com/public/en/documents/option-parts/option-outline.json';
// const OPTION_GL_OUTLINE = 'https://loving-goldstine-32d8e8.netlify.com/public/en/documents/option-gl-parts/option-gl-outline.json';

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
            return findChartTypeInObject(element.properties);
        }
    }

    return '';
}

/**
 * Flatten object
 * @param optionChain chain of option names
 * @param children child options
 * @param optionsNames final result
 */
function flatObject(optionChain: string, children: OptionsNameItem[], optionsNames: OptionsStruct): void {
    children.map(item => {
        if (item.children) {
            flatObject(`${optionChain}.${item.prop || item.arrayItemType || ''}`, item.children, optionsNames);
        }

        if (!optionsNames[optionChain]) {
            optionsNames[optionChain] = [];
        }

        let type: string[] = [];
        let valide: (string | number)[] = [];
        item.type = item.type === '*' ? 'object' : (item.type ? item.type : typeof item.default);
        if (typeof item.type === 'string') {
            type = [item.type];
        } else {
            type = item.type;
        }

        if (typeof item.default === 'string' && item.default.length) {
            item.default = item.default.replace(/,/g, '\',\'');
            valide = item.default.split(',');
        } else if (item.default === '') {
            valide = [''];
        } else if (typeof item.default === 'number') {
            valide = [item.default];
        }

        optionsNames[optionChain].push({
            type,
            valide,
            name: item.prop || item.arrayItemType || '',
        });
    });
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

// get option structure
export async function getOptionsStruct(): Promise<OptionsStruct | undefined> {
    try {
        const optionsNames: OptionsStruct = {};

        const res = await Promise.all([axios.get(OPTION_OUTLINE), axios.get(OPTION_GL_OUTLINE)]);

        res.map(item => {
            item.data.children.map((i: OptionsNameItem) => {
                if (i.children) {
                    flatObject(i.prop || i.arrayItemType || '', i.children, optionsNames);
                }
            });
        });


        return optionsNames;
    } catch (error) {
        console.error(`getOptionsStruct: ${error}`);
    }

}

// Generate an arry from a-z
export function generateAToZArray(): string[] {
    const arr: string[] = [];
    for (let i = 65; i <= 122; i++) {
        if (i > 90 && i < 97) {
            continue;
        }
        arr.push(String.fromCharCode(i));
    }

    arr.push('\n');
    return arr;
}

/**
 * find current node's ancestor nodes
 * @param ast AST tree
 * @param node current node
 */
export function walkNodeRecursive(ast: Node, node: Node, position: number): {
    prevNodeName: string,
    prevNode: Found<unknown> | undefined
} {
    let nodes = '';
    let prevNode: Found<unknown> | undefined;
    if (isProperty(node)) {
        prevNode = findNodeAround(ast, node.end + 1, 'Property');
        if (prevNode && isProperty(prevNode.node)) {
            if (prevNode.node.key.name === 'series') {
                prevNode.node.key.name += `.${findChartType(prevNode.node.value, position)}`;
            }
            nodes += prevNode.node.key.name;
            const { prevNodeName } = walkNodeRecursive(ast, prevNode.node, position);
            return {
                prevNodeName: `${prevNodeName}${prevNodeName ? '.' : ''}${nodes}`,
                prevNode
            };
        }
    }

    return {
        prevNodeName: nodes,
        prevNode
    };
}

function getObjectProperties(properties: Node[], propertyNames: string[]): void {
    properties.map(item => {
        if (isProperty(item)) {
            propertyNames.push(item.key.name);
        }
    });
}

export function getOptionProperties(node: Found<unknown> | undefined, position: number): string[] | undefined {
    if (!node) {
        return;
    }

    const propertyNames: string[] = [];
    if (isProperty(node.node) && isObjectExpression(node.node.value)) {
        getObjectProperties(node.node.value.properties, propertyNames);
    }

    if (isProperty(node.node) && isArrayExpression(node.node.value)) {
        node.node.value.elements.map(item => {
            if (
                isObjectExpression(item)
                && position > item.start
                && position < item.end
            ) {
                getObjectProperties(item.properties, propertyNames);
            }
        });
    }
    return propertyNames;
}