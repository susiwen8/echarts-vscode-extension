/**
 * @file util functions
 */

import {
    findNodeAround,
    simple,
    Found
} from 'acorn-walk';
import * as acorn from 'acorn';
import {
    OptionsStruct,
    Node,
    Property,
    PropertyLoc,
    OptionLoc,
    isProperty,
    isLiteral,
    isArrayExpression,
    isObjectExpression,
    COLOR_VALUE
} from './type';
import Diagnostic from './diagnostic';
import {
    Range,
    DiagnosticSeverity,
    Position
} from 'vscode';

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
function findChartTypeInArray(
    elements: Node[],
    position: number
): string {
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
 * find out input at which chart type
 * @param values series option value
 * @param position input position
 */
export function findChartType(
    values: Property['value'],
    position: number
): string {
    if (isObjectExpression(values)) {
        return findChartTypeInObject(values.properties);
    }

    if (isArrayExpression(values)) {
        return findChartTypeInArray(values.elements, position);
    }

    return '';
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
export function walkNodeRecursive(
    ast: Node,
    node: Node,
    position: number
): {
    prevNodeName: string,
    prevNode: Found<unknown> | undefined
} {
    let nodes = '';
    let prevNode: Found<unknown> | undefined;
    if (isProperty(node)) {
        prevNode = findNodeAround(ast, node.end + 1, 'Property');
        if (prevNode && isProperty(prevNode.node)) {
            if (['series', 'visualMap', 'dataZoom'].includes(prevNode.node.key.name)) {
                nodes += `${prevNode.node.key.name}.${findChartType(prevNode.node.value, position)}`;
            } else {
                nodes += prevNode.node.key.name;
            }

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

function getObjectProperties(
    properties: Node[],
    propertyNames: PropertyLoc[]
): void {
    properties.map(item => {
        if (isProperty(item) && item.loc) {
            const optionLoc: PropertyLoc = {
                name: item.key.name,
                loc: item.loc,
                value: item.value
            };
            propertyNames.push(optionLoc);
        }
    });
}

function getOptionProperties(
    node: Found<unknown>,
    position: number
): PropertyLoc[] {
    const propertyNames: PropertyLoc[] = [];
    if (isProperty(node.node) && isObjectExpression(node.node.value)) {
        if (node.node.key.name === 'rich') {
            node.node.value.properties = node.node.value.properties.map(item => {
                if (isProperty(item)) {
                    item.key.name = '<style_name>';
                }
                return item;
            });
        }
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

function checkOption(
    optionsLoc: OptionLoc,
    optionsStruct: OptionsStruct,
    diagnostic: Diagnostic
): void {
    for (const [key, value] of Object.entries(optionsLoc)) {
        if (!key || !value || !optionsStruct[key]) continue;
        const valideOption = optionsStruct[key].map(item => item.name);
        const optionsInCode = value.map(item => item.name);
        value.forEach(item => {
            const option = optionsStruct[key][valideOption.indexOf(item.name)];
            // Find those options which are not legal option
            if (valideOption.indexOf(item.name) < 0) {
                diagnostic.createDiagnostic(
                    new Range(
                        new Position(item.loc.start.line - 1, item.loc.start.column),
                        new Position(item.loc.end.line - 1, item.loc.end.column)
                    ),
                    `${item.name} doesn't exist`,
                    DiagnosticSeverity.Error
                );
            } else if (option.require) {// option requires another options
                option.require.split(',').forEach((require, index) => {
                    // require option is not present
                    if (optionsInCode.indexOf(require) < 0) {
                        diagnostic.createDiagnostic(
                            new Range(
                                new Position(item.loc.start.line - 1, item.loc.start.column),
                                new Position(item.loc.end.line - 1, item.loc.end.column)
                            ),
                            `${item.name} requires ${require}`,
                            DiagnosticSeverity.Information
                        );
                    } else if (option.requireCondition) {
                        // require other option has specify value for this option
                        const requireValue = value[optionsInCode.indexOf(require)];
                        if (isLiteral(requireValue.value)) {
                            const requireConditionArr = option.requireCondition.split(',');
                            if (
                                (
                                    requireConditionArr[index].indexOf('!==') > -1
                                    && requireConditionArr[index] === `!== ${requireValue.value.value}`
                                )
                                || (
                                    requireConditionArr[index].indexOf('!==') < 0
                                    && requireConditionArr[index] !== `${requireValue.value.value}`
                                )
                            ) {
                                diagnostic.createDiagnostic(
                                    new Range(
                                        new Position(requireValue.loc.start.line - 1, requireValue.loc.start.column),
                                        new Position(requireValue.loc.end.line - 1, requireValue.loc.end.column)
                                    ),
                                    `${item.name} requires ${require} value is ${requireConditionArr[index]}`,
                                    DiagnosticSeverity.Information
                                );
                            }
                        }
                    }
                });
            }
        });
    }
}

function checkOptionValue(
    optionsStruct: OptionsStruct,
    option: string,
    node: Property,
    value: unknown,
    diagnostic: Diagnostic
): void {
    for (let i = 0, len = optionsStruct[option].length; i < len; i++) {
        if (
            node.value.type === 'ArrayExpression'
            && optionsStruct[option][i].name === node.key.name
            && optionsStruct[option][i].type.includes('Array')) {
            continue;
        }

        if (
            optionsStruct[option][i].type.includes('number')
            && typeof value === 'number'
            && optionsStruct[option][i].range
            && (
                value < optionsStruct[option][i].range[0]
                || value > optionsStruct[option][i].range[1]
            )
        ) {
            diagnostic.createDiagnostic(
                new Range(
                    new Position(node.value.loc.start.line - 1, node.value.loc.start.column),
                    new Position(node.value.loc.end.line - 1, node.value.loc.end.column)
                ),
                `${node.key.name} value is out of range, value should at ${optionsStruct[option][i].range}`
            );
        }

        if (optionsStruct[option][i].name === node.key.name
            && !optionsStruct[option][i].type.includes(typeof value)) {
            // Check color value
            if (
                optionsStruct[option][i].type.includes('Color')
                && typeof value === 'string'
                && !(/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(value))
                && !(/^rgb/.test(value))
                && !(/^rgba/.test(value))
                && !(COLOR_VALUE.includes(value))
            ) {
                diagnostic.createDiagnostic(
                    new Range(
                        new Position(node.value.loc.start.line - 1, node.value.loc.start.column),
                        new Position(node.value.loc.end.line - 1, node.value.loc.end.column)
                    ),
                    `wrong value for ${node.key.name}`
                );
            } else if (
                optionsStruct[option][i].type.includes('Color')
                && typeof value === 'string'
                && (
                    /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(value)
                    || /^rgb/.test(value)
                    || /^rgba/.test(value)
                    || COLOR_VALUE.includes(value)
                )
            ) {
                continue;
            }

            diagnostic.createDiagnostic(
                new Range(
                    new Position(node.value.loc.start.line - 1, node.value.loc.start.column),
                    new Position(node.value.loc.end.line - 1, node.value.loc.end.column)
                ),
                `wrong type for ${node.key.name}, valide type are ${optionsStruct[option][i].type.join(',')}`
            );

        }
    }
}

export function checkCode(
    diagnostic: Diagnostic,
    code: string,
    optionsStruct: OptionsStruct,
    AST?: Node
): void {
    try {
        diagnostic.clearDiagnostics();
        const ast = AST || acorn.parse(code, {
            locations: true,
            sourceType: 'module'
        });
        const optionsLoc: OptionLoc = {};

        simple(ast, {
            Property(property) {
                if (isProperty(property)) {
                    let option = '';
                    const {
                        prevNodeName,
                        prevNode
                    } = walkNodeRecursive(ast, property, property.start);
                    option = prevNodeName.replace(/.rich.(\S*)/, '.rich.<style_name>');
                    if (!optionsLoc[option] && prevNode) {
                        optionsLoc[option] = getOptionProperties(prevNode, property.start);
                    }
                }
            },
            Literal(literal) {
                const property = findNodeAround(ast, literal.start, 'Property');
                if (property && isProperty(property.node) && isLiteral(literal)) {
                    let option = '';
                    const {
                        prevNodeName
                    } = walkNodeRecursive(ast, property.node, literal.start);
                    option = prevNodeName;
                    option = option.replace(/.rich.(\S*)/, '.rich.<style_name>');
                    if (!optionsStruct[option]) {
                        return;
                    }
                    checkOptionValue(
                        optionsStruct, option, property.node,
                        literal.value, diagnostic
                    );
                }
            }
        });

        checkOption(optionsLoc, optionsStruct, diagnostic);
        diagnostic.showError();
    } catch (error) {
        console.error('checkCode error');
    }
}

export function parseJSCode<T extends Found<unknown>>(
    code: string,
    position: number
): {
    ast: acorn.Node,
    literal: T
    property: T
} | undefined {
    try {
        const ast = acorn.parse(code, {
            locations: true,
            sourceType: 'module'
        });
        const literal = findNodeAround(ast, position, 'Literal')! as T;
        const property = findNodeAround(ast, position, 'Property')! as T;
        return { ast, literal, property };
    } catch (error) {
        console.error('jsParse error');
    }
}

export function getOption<T extends Found<unknown>>(
    literal: T,
    property: T,
    text: string,
    position: number,
    ast: Node,
    option: string
): string {
    // input is in Literal, then don't show completion
    if (literal && isLiteral(literal.node)) {
        return '';
    }

    // Hit enter and input is in series/visualMap/dataZoom
    if (
        text.includes('\n')
        && property && isProperty(property.node)
        && ['series', 'visualMap', 'dataZoom'].includes(property.node.key.name)
    ) {
        return `${property.node.key.name}.${findChartType(property.node.value, position)}`;
    }

    // input at somewhere other than series
    if (
        property
        && isProperty(property.node)
        && text.includes('\n')
    ) {
        const { prevNodeName } = walkNodeRecursive(ast, property.node, position);
        return `${prevNodeName}${prevNodeName ? '.' : ''}${property.node.key.name}`.replace(/.rich.(\S*)/, '.rich.<style_name>');
    }

    return property ? option : 'option';
}