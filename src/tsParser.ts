import walkTSNodeRecursive from './tsUtils';
import { createSourceFile, ScriptTarget } from 'typescript';
import {
    OptionsStruct
} from './type';
import Diagnostic from './diagnostic';

/**
 * Base on cursor position to get option chaine
 * @param code TypeScript code string
 * @param position cursor position
 */
export default function tsParser<T extends (...args: any) => any>(
    code: string,
    position: number,
    option: string,
    optionsStruct: OptionsStruct,
    diagnostic: Diagnostic,
    checkTsCodeDebounce: T
): string {
    try {
        const sourceFile = createSourceFile('Example.ts', code, ScriptTarget.Latest);
        checkTsCodeDebounce(diagnostic, optionsStruct, code, sourceFile);
        option = walkTSNodeRecursive(sourceFile, position, position, '') || option;
        return option.replace(/.rich.(\S*)/, '.rich.<style_name>');
    } catch (error) {
        console.error('tsParse error');
        return option;
    }
}