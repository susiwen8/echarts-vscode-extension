import * as vscode from 'vscode';
import * as acorn from 'acorn';
import { findNodeAround, simple } from 'acorn-walk';
import {
    generateAToZArray,
    walkNodeRecursive,
    findChartType,
    getOptionProperties
} from './utils';
import {
    isProperty,
    isLiteral,
    OptionsStruct,
    BarItemStatus,
    OptionLoc
} from './type';
import cacheControl from './cache';
import EchartsStatusBarItem from './statusBarItem';
import Diagnostic from './diagnostic';

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    let optionsStruct: OptionsStruct | undefined;
    let option = '';
    let isActive = false;
    let diagnostic: Diagnostic;
    const statusBarItem = new EchartsStatusBarItem();
    statusBarItem.addInContext(context);

    isActive = true;
    statusBarItem.show();

    !optionsStruct && (optionsStruct = await cacheControl(optionsStruct, context));

    optionsStruct ? statusBarItem.changeStatus(BarItemStatus.Loaded)
        : statusBarItem.changeStatus(BarItemStatus.Failed);

    if (vscode.window.activeTextEditor && optionsStruct) {
        const code = vscode.window.activeTextEditor.document.getText();
        const ast = acorn.parse(code, {
            locations: true
        });
        const optionsLoc: OptionLoc = {};
        simple(ast, {
            Property(property) {
                if (isProperty(property)) {
                    let option = '';
                    const { prevNodeName, prevNode } = walkNodeRecursive(ast, property, property.start);
                    option = prevNodeName.replace(/.rich.(\S*)/, '.rich.<style_name>');
                    if (!optionsLoc[option]) {
                        optionsLoc[option] = getOptionProperties(prevNode, property.start);
                    }
                }
            }
        });

        diagnostic = new Diagnostic(vscode.window.activeTextEditor.document.uri);
        diagnostic.clearDiagnostics();
        diagnostic.checkOption(optionsLoc, optionsStruct);
        diagnostic.showError();
    }

    const reload = vscode.commands.registerCommand('echarts.reload', async () => {
        statusBarItem.changeStatus(BarItemStatus.Loading);

        !optionsStruct && (optionsStruct = await cacheControl(optionsStruct, context));

        optionsStruct ? statusBarItem.changeStatus(BarItemStatus.Loaded)
            : statusBarItem.changeStatus(BarItemStatus.Failed);
    });

    const deactivateEcharts = vscode.commands.registerCommand('echarts.deactivate', () => {
        isActive = false;
        statusBarItem.hide();
        statusBarItem.changeStatus(BarItemStatus.Loading);
        // TODO value check
    });

    const activateEcharts = vscode.commands.registerCommand('echarts.activate', async () => {
        isActive = true;
        statusBarItem.show();

        !optionsStruct && (optionsStruct = await cacheControl(optionsStruct, context));

        optionsStruct ? statusBarItem.changeStatus(BarItemStatus.Loaded)
            : statusBarItem.changeStatus(BarItemStatus.Failed);
        // TODO value check
    });

    const onDidChangeTextDocumentEvent = vscode.workspace.onDidChangeTextDocument(event => {
        if (!isActive) {
            return;
        }

        !diagnostic && (diagnostic = new Diagnostic(event.document.uri));
        try {
            const text = event.document.getText();
            const position = event.contentChanges[0].rangeOffset;
            const ast = acorn.parse(text);
            const literal = findNodeAround(ast, position, 'Literal');
            const property = findNodeAround(ast, position, 'Property');

            // input is in Literal, then don't show completion
            if (literal && isLiteral(literal.node) && property && isProperty(property.node)) {
                if (optionsStruct) {
                    const prevNodeName = walkNodeRecursive(ast, property.node, position);
                    option = `${prevNodeName}${prevNodeName ? '.' : ''}${property.node.key.name}`;
                    option = option.replace(/.rich.(\S*)/, '.rich.<style_name>');
                    for (let i = 0, len = optionsStruct[option].length; i < len; i++) {
                        if (optionsStruct[option][i].name === property.node.key.name
                            && !optionsStruct[option][i].type.includes(typeof literal.node.value)) {
                            diagnostic.clearDiagnostics();
                            diagnostic.createDiagnostic(event.contentChanges[0].range, `wrong type for ${property.node.key.name}`);
                            diagnostic.showError();
                        }
                    }

                }
                option = '';
                return;
            }

            // Hit enter and input is in series
            if (
                event.contentChanges[0].text.includes('\n')
                && property && isProperty(property.node)
                && property.node.key.name === 'series'
            ) {
                option = `series.${findChartType(property.node.value, position)}`;
                return;
            }

            // input at somewhere other than series
            if (
                property
                && isProperty(property.node)
                && event.contentChanges[0].text.includes('\n')
            ) {
                const { prevNodeName } = walkNodeRecursive(ast, property.node, position);
                option = `${prevNodeName}${prevNodeName ? '.' : ''}${property.node.key.name}`;
                option = option.replace(/.rich.(\S*)/, '.rich.<style_name>');
                return;
            }

        } catch (error) {
            console.error('Acorn parse error');
        }
    });

    const completion = vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'javascript' },
        {
            provideCompletionItems() {
                if (!optionsStruct || !isActive) return;

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

    context.subscriptions.push(reload, deactivateEcharts, activateEcharts, onDidChangeTextDocumentEvent, completion);
}

// export function deactivate() {}
