import {
    window,
    ExtensionContext,
    commands,
    workspace,
    languages,
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import * as acorn from 'acorn';
import { findNodeAround } from 'acorn-walk';
import {
    generateAToZArray,
    walkNodeRecursive,
    findChartType,
    checkCode
} from './utils';
import {
    isProperty,
    isLiteral,
    OptionsStruct,
    BarItemStatus
} from './type';
import cacheControl from './cache';
import EchartsStatusBarItem from './statusBarItem';
import Diagnostic from './diagnostic';

export async function activate(context: ExtensionContext): Promise<void> {
    let isActive = true; // TODO

    if (!isActive || !window.activeTextEditor) return;

    let optionsStruct: OptionsStruct | undefined;
    let option = '';
    const diagnostic = new Diagnostic(window.activeTextEditor.document.uri);
    const statusBarItem = new EchartsStatusBarItem();
    statusBarItem.addInContext(context);
    statusBarItem.show();
    !optionsStruct && (optionsStruct = await cacheControl(optionsStruct, context));
    optionsStruct ? statusBarItem.changeStatus(BarItemStatus.Loaded)
        : statusBarItem.changeStatus(BarItemStatus.Failed);

    if (optionsStruct) {
        checkCode(diagnostic, window.activeTextEditor.document.getText(), optionsStruct);
    }

    const reload = commands.registerCommand('echarts.reload', async () => {
        statusBarItem.changeStatus(BarItemStatus.Loading);

        !optionsStruct && (optionsStruct = await cacheControl(optionsStruct, context));

        optionsStruct ? statusBarItem.changeStatus(BarItemStatus.Loaded)
            : statusBarItem.changeStatus(BarItemStatus.Failed);
    });

    const deactivateEcharts = commands.registerCommand('echarts.deactivate', () => {
        isActive = false;
        statusBarItem.hide();
        statusBarItem.changeStatus(BarItemStatus.Loading);
        diagnostic.clearDiagnostics();
    });

    const activateEcharts = commands.registerCommand('echarts.activate', async () => {
        isActive = true;
        statusBarItem.show();

        !optionsStruct && (optionsStruct = await cacheControl(optionsStruct, context));

        optionsStruct ? statusBarItem.changeStatus(BarItemStatus.Loaded)
            : statusBarItem.changeStatus(BarItemStatus.Failed);
        if (!optionsStruct || !window.activeTextEditor) return;
        checkCode(diagnostic, window.activeTextEditor.document.getText(), optionsStruct);
    });

    const onDidChangeTextDocumentEvent = workspace.onDidChangeTextDocument(event => {
        if (!isActive) {
            return;
        }

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

    const completion = languages.registerCompletionItemProvider({ scheme: 'file', language: 'javascript' },
        {
            provideCompletionItems() {
                if (!optionsStruct || !isActive) return;

                return optionsStruct[option].map(item => {
                    const completionItem = new CompletionItem(item.name, CompletionItemKind.Keyword);
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
                    completionItem.insertText = new SnippetString(insertText);
                    return completionItem;
                });
            }
        },
        ...generateAToZArray()
    );

    context.subscriptions.push(reload, deactivateEcharts, activateEcharts, onDidChangeTextDocumentEvent, completion);
}

// export function deactivate() {}
