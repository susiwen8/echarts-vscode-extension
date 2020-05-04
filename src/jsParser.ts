import * as acorn from 'acorn';
import { findNodeAround } from 'acorn-walk';
import {
    isProperty,
    isLiteral,
    OptionsStruct
} from './type';
import {
    walkNodeRecursive,
    findChartType
} from './jsUtils';
import Diagnostic from './diagnostic';
import { TextDocumentChangeEvent } from 'vscode';
import { Cancelable } from 'lodash/index';

/**
 * Base on cursor position to get option chaine
 * @param code javascript code string
 * @param optionsStruct option structure
 * @param position cursor position
 * @param diagnostic check result
 * @param event Text editor change event
 * @param checkCodeDebounce check option and value function
 * @param index index of real contentChanges
 */
export default function jsParse(
    code: string,
    optionsStruct: OptionsStruct,
    position: number,
    diagnostic: Diagnostic,
    event: TextDocumentChangeEvent,
    option: string,
    checkCodeDebounce: ((diagnostic: Diagnostic, code: string, optionsStruct: OptionsStruct, AST?: acorn.Node) => void) & Cancelable,
    index: number
): string {
    try {
        const ast = acorn.parse(code, { locations: true });
        checkCodeDebounce(diagnostic, code, optionsStruct, ast);

        if (!event.contentChanges[index]) return '';

        const literal = findNodeAround(ast, position, 'Literal');
        const property = findNodeAround(ast, position, 'Property');

        // input is in Literal, then don't show completion
        if (literal && isLiteral(literal.node)) {
            return '';
        }

        // Hit enter and input is in series/visualMap/dataZoom
        if (
            event.contentChanges[index].text.includes('\n')
            && property && isProperty(property.node)
            && ['series', 'visualMap', 'dataZoom'].includes(property.node.key.name)
        ) {
            return `${property.node.key.name}.${findChartType(property.node.value, position)}`;
        }

        // input at somewhere other than series
        if (
            property
            && isProperty(property.node)
            && event.contentChanges[index].text.includes('\n')
        ) {
            const { prevNodeName } = walkNodeRecursive(ast, property.node, position);
            return `${prevNodeName}${prevNodeName ? '.' : ''}${property.node.key.name}`.replace(/.rich.(\S*)/, '.rich.<style_name>');
        }

        return property ? option : 'option';
    } catch (error) {
        console.error('jsParse error');
        return option;
    }
}