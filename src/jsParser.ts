import {
    OptionsStruct
} from './type';
import {
    parseJSCode,
    getOption
} from './jsUtils';
import Diagnostic from './diagnostic';

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function jsParser<T extends (...args: any) => any>(
    code: string,
    optionsStruct: OptionsStruct,
    position: number,
    diagnostic: Diagnostic,
    text: string,
    option: string,
    checkCodeDebounce: T
): string {
    const { ast, literal, property } = parseJSCode(code, position)!;
    if (!ast && !literal && !property) {
        return option;
    }

    checkCodeDebounce(diagnostic, code, optionsStruct, ast);
    return getOption(literal, property, text, position, ast, option);
}