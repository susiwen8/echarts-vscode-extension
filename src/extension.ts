import * as vscode from 'vscode';
import {
    generateAToZArray,
    walkNodeRecursive,
    findChartType
} from './utils';
import {
    isProperty,
    isLiteral,
    CHART_TYPE
} from './type';
import getAllOptions from './options/index';
import * as acorn from 'acorn';
import { findNodeAround } from 'acorn-walk';

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    const optionsStruct = await getAllOptions();

    if (!optionsStruct) {
        vscode.window.showErrorMessage('Echarts extension failed');
        return;
    }

    vscode.window.showInformationMessage('Echarts extension up');

    const selector: vscode.DocumentSelector = {
        scheme: 'file',
        language: 'javascript'
    };

    let option = '';

    const completion = vscode.languages.registerCompletionItemProvider(selector,
        {
            provideCompletionItems() {
                // TODO
                console.log(optionsStruct[option]);
            }
        },
        ...generateAToZArray()
    );

    vscode.workspace.onDidChangeTextDocument(event => {
        try {
            const text = event.document.getText();
            const position = event.contentChanges[0].rangeOffset;
            const ast = acorn.parse(text);
            const literal = findNodeAround(ast, position, 'Literal');
            const property = findNodeAround(ast, position, 'Property');

            if (
                property
                && isProperty(property.node)
                && event.contentChanges[0].text.includes('\n')
            ) {
                option = `${walkNodeRecursive(ast, property.node, position)}.${property?.node?.key?.name}`;
                option = option.replace(/.rich.(\S*)/, '.rich.<style_name>');
                console.log(option);
                return;
            }

            // Literal value is one of chart types and Property is type
            // Then we know right now input is in series option
            if (
                literal && isLiteral(literal.node)
                && CHART_TYPE.includes(literal.node.value)
                && property && isProperty(property.node)
                && property.node.key.name === 'type'
            ) {
                option = `type${literal.node.value}`;
                return;
            }

            // input is in Literal, then don't show completion
            if (literal && isLiteral(literal.node)) {
                option = '';
                return;
            }

            // Hit enter and input is in series
            if (
                event.contentChanges[0].text.includes('\n')
                && property && isProperty(property.node)
                && property.node.key.name === 'series'
            ) {
                // input at 'Property', which should give CompletionItem
                // option = property?.node?.key?.name;
                option = `type${findChartType(property?.node.value, position)}`;
                return;
            }

            // Hit enter and input is not in series
            if (
                event.contentChanges[0].text.includes('\n')
                && property && isProperty(property.node)
                && property.node.key.name !== 'series'
            ) {
                // input at 'Property', which should give CompletionItem
                option = property?.node?.key?.name;
                return;
            }

        } catch (error) {
            // In the case of parse error
            // downgrade to use position line
            option = 'error';
            console.error('Parse error');
        }
    });

    context.subscriptions.push(completion);
}

// export function deactivate() {}
