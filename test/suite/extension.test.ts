import * as assert from 'assert';
import {
    parseJSCode,
    getOption
} from '../../src/jsUtils';
import { walkTSNodeRecursive } from '../../src/tsUtils';
import { getOptionsStruct } from '../../src/option';
import * as ts from 'typescript';

const code = `
const option = {
    title: {
        backgroundColor: 123,
        borderColor: false,
    }
};
`;

suite('Extension Test Suite', () => {
    test('Get option by postion', () => {
        const position = 38;
        const { ast, literal, property } = parseJSCode(code, position)!;
        assert.strictEqual('title', getOption(literal, property, '\n', position, ast, ''));
        assert.strictEqual('title', walkTSNodeRecursive(ts.createSourceFile('expample.ts', code, ts.ScriptTarget.Latest), position, position, ''));
    });

    test('Description is empty', () => {
        const optionsStruct = getOptionsStruct();
        for (const key in optionsStruct) {
            optionsStruct[key].forEach(item => {
                if (!item.desc) {
                    console.log(`${key}.${item.name}`);
                }
            });
        }
    });
});
