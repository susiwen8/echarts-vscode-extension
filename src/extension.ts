import * as vscode from 'vscode';
import {
    generateAToZArray,
    walkNodeRecursive,
    findChartType
} from './utils';
import {
    isProperty,
    isLiteral
} from './type';
import getAllOptions from './index';
import * as acorn from 'acorn';
import { findNodeAround } from 'acorn-walk';

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    const optionsStruct = await getAllOptions();

    if (!optionsStruct) {
        vscode.window.showErrorMessage('Echarts extension failed');
        return;
    }

    // vscode.window.showInformationMessage('Echarts extension up');

    const selector: vscode.DocumentSelector = {
        scheme: 'file',
        language: 'javascript'
    };

    let option = '';

    const completion = vscode.languages.registerCompletionItemProvider(selector,
        {
            provideCompletionItems() {
                console.log(option);
                const completionItems = optionsStruct[option].map(item => {
                    const completionItem = new vscode.CompletionItem(item.name, vscode.CompletionItemKind.Keyword);
                    let insertText = `${item.name}: \${1|`;
                    const type: any = [];
                    item.type.map(i => {
                        switch (i.toLocaleLowerCase()) {
                            case 'string':
                                type.push('\'\'');
                                break;

                            case 'number':
                                type.push(1);
                                break;

                            case 'boolean':
                                type.push(true, false);
                                break;

                            case 'array':
                                type.push('[]');
                                break;

                            case 'color':
                                type.push('#', 'rgb()', 'rgba()');
                                break;

                            case 'function':
                                // eslint-disable-next-line @typescript-eslint/no-empty-function
                                type.push(function () {});
                                break;

                            default:
                                type.push('{}');
                        }
                    });
                    insertText += type.join(',') + '|},';
                    completionItem.insertText = new vscode.SnippetString(insertText);
                    return completionItem;
                });

                return completionItems;
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
                option = `series.${findChartType(property?.node.value, position)}`;
                return;
            }

            // input at somewhere other than series
            if (
                property
                && isProperty(property.node)
                && event.contentChanges[0].text.includes('\n')
            ) {
                const recursiveName = walkNodeRecursive(ast, property.node, position);
                option = `${recursiveName}${recursiveName ? '.' : ''}${property?.node?.key?.name}`;
                option = option.replace(/.rich.(\S*)/, '.rich.<style_name>');
                return;
            }

        } catch (error) {
            option = '';
            console.error('Parse error');
        }
    });

    context.subscriptions.push(completion);
}

// export function deactivate() {}
