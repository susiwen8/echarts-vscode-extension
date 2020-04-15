import walkTSNodeRecursive from './tsUtil';
import { createSourceFile, ScriptTarget } from 'typescript';

/**
 * Base on cursor position to get option chaine
 * @param code TypeScript code string
 * @param position cursor position
 */
export default function tsParser(code: string, position: number, option: string): string {
    try {
        const sourceFile = createSourceFile('Example.ts', code, ScriptTarget.Latest);
        option = walkTSNodeRecursive(sourceFile, position, position, '') || option;
        return option.replace(/.rich.(\S*)/, '.rich.<style_name>');
    } catch (error) {
        console.error('tsParse error');
        return option;
    }
}