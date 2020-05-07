import {
    isProperty,
    isLiteral,
    OptionsStruct,
    Node
} from './type';
import {
    parseJSCode,
    getOption
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
export default function jsParser(
    code: string,
    optionsStruct: OptionsStruct,
    position: number,
    diagnostic: Diagnostic,
    event: TextDocumentChangeEvent,
    option: string,
    checkCodeDebounce: ((diagnostic: Diagnostic, code: string, optionsStruct: OptionsStruct, AST?: Node) => void) & Cancelable,
    index: number
): string {
    if (!event.contentChanges[index]) return '';

    const { ast, literal, property } = parseJSCode(code, position)!;
    if (!ast && !literal && !property) {
        return option;
    }

    checkCodeDebounce(diagnostic, code, optionsStruct, ast);
    return getOption(literal, property, event.contentChanges[index].text, position, ast, option);
}