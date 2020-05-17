import * as assert from 'assert';
import {
    parseJSCode,
    getOption
} from '../../src/jsUtils';
import tsParser from '../../src/tsParser';
import { getOptionsStruct } from '../../src/option';

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
        assert.strictEqual('title', tsParser(code, position, ''));
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
