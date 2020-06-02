import walkTSNodeRecursive, {
    checkTsCode
} from './tsUtil';
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
export default function tsParser(
    code: string,
    position: number,
    option: string,
    optionsStruct: OptionsStruct,
    diagnostic: Diagnostic
): string {
    try {
        const sourceFile = createSourceFile('Example.ts', code, ScriptTarget.Latest);
        checkTsCode(diagnostic, optionsStruct, sourceFile);
        option = walkTSNodeRecursive(sourceFile, position, position, '') || option;
        return option.replace(/.rich.(\S*)/, '.rich.<style_name>');
    } catch (error) {
        console.error('tsParse error');
        return option;
    }
}