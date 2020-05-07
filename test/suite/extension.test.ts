import * as assert from 'assert';
import {
    parseJSCode,
    getOption
} from '../../src/jsUtils';

const jscode = `
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
        const { ast, literal, property } = parseJSCode(jscode, position)!;
        const option = getOption(literal, property, '\n', position, ast, '');
        assert.strictEqual('title', option);
    });
});
