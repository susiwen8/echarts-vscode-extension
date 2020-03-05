import * as vscode from 'vscode';
import * as acorn from 'acorn';
import { findNodeAround } from 'acorn-walk';
import {
    generateAToZArray,
    walkNodeRecursive,
    findChartType,
    getOptionsStruct
} from './utils';
import {
    isProperty,
    isLiteral,
    OptionsStruct,
    BarItemStatus
} from './type';
import Cache from './cache';
import EchartsStatusBarItem from './statusBarItem';

function addCommandInContext(
    optionsStruct: OptionsStruct | undefined,
    statusBarItem: EchartsStatusBarItem,
    context: vscode.ExtensionContext
): void {
    let option = '';

    const completion = vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'javascript' },
        {
            provideCompletionItems() {
                if (!optionsStruct) return;

                return optionsStruct[option].map(item => {
                    const completionItem = new vscode.CompletionItem(item.name, vscode.CompletionItemKind.Keyword);
                    let insertText = `${item.name}: \${1|`;
                    let type: (boolean | number | string | Function)[] = [];
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
                                type.push('\'#\'', '\'rgb()\'', '\'rgba()\'');
                                break;

                            case 'function':
                                // eslint-disable-next-line @typescript-eslint/no-empty-function
                                type.push(function () {});
                                break;

                            default:
                                type.push('{}');
                        }
                    });
                    type = type.concat(item.valide);
                    insertText += type.join(',') + '|},';
                    completionItem.insertText = new vscode.SnippetString(insertText);
                    return completionItem;
                });
            }
        },
        ...generateAToZArray()
    );

    const onDidChangeTextDocumentEvent = vscode.workspace.onDidChangeTextDocument(event => {
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
            console.error('Acorn parse error');
        }
    });

    const reload = vscode.commands.registerCommand('echarts.reload', async () => {
        statusBarItem.changeStatus(BarItemStatus.Loading);
        optionsStruct = await getOptionsStruct();
        if (!optionsStruct) {
            statusBarItem.changeStatus(BarItemStatus.Failed);
        } else {
            statusBarItem.changeStatus(BarItemStatus.Loaded);
        }
    });

    const deactivateEcharts = vscode.commands.registerCommand('echarts.deactivate', () => {
        for (let i = 0, len = context.subscriptions.length; i < len; i++) {
            context.subscriptions.pop();
        }
        console.log('done');
        // statusBarItem.hide();
    });

    const activateEcharts = vscode.commands.registerCommand('echarts.activate', () => {
        context.subscriptions.push(reload, deactivateEcharts, activateEcharts, completion, onDidChangeTextDocumentEvent);
        statusBarItem.changeStatus(BarItemStatus.Loaded);
    });

    context.subscriptions.push(reload, deactivateEcharts, activateEcharts, completion, onDidChangeTextDocumentEvent);
}

async function cacheControl(
    optionsStruct: OptionsStruct | undefined,
    statusBarItem: EchartsStatusBarItem,
    context: vscode.ExtensionContext
): Promise<void> {
    const cache = new Cache(context);
    let hasSendRequest = false;
    const cacheValue = cache.get();

    if (
        cacheValue
        && (+new Date() - cacheValue.saveTime > cacheValue.expireTime)
    ) {
        cache.erase();
    } else if (
        cacheValue
        && (+new Date() - cacheValue.saveTime < cacheValue.expireTime)
    ) {
        optionsStruct = cacheValue.value;
    }

    if (!optionsStruct) {
        optionsStruct = await getOptionsStruct();
        hasSendRequest = true;
    }

    if (!optionsStruct) {
        statusBarItem.changeStatus(BarItemStatus.Failed);
        return;
    }

    if (hasSendRequest) {
        cache.set({
            value: {
                saveTime: +new Date(),
                expireTime: 7 * 24 * 60 * 60 * 1000,
                value: optionsStruct
            }
        });
    }

    statusBarItem.changeStatus(BarItemStatus.Loaded);
}

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    let optionsStruct: OptionsStruct | undefined;
    const statusBarItem = new EchartsStatusBarItem();
    statusBarItem.addInContext(context);
    statusBarItem.show();

    addCommandInContext(optionsStruct, statusBarItem, context);
    cacheControl(optionsStruct, statusBarItem, context);
}

// export function deactivate() {}
