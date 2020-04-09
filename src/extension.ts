import {
    window,
    ExtensionContext,
    commands,
    workspace,
    languages,
    CompletionItem,
    CompletionItemKind,
    SnippetString,
    MarkdownString
} from 'vscode';
import * as acorn from 'acorn';
import { findNodeAround } from 'acorn-walk';
import debounce from 'lodash/debounce';
import {
    generateAToZArray,
    walkNodeRecursive,
    findChartType,
    checkCode,
    getOptionsStruct
} from './utils';
import {
    isProperty,
    isLiteral,
    BarItemStatus,
    COLOR_VALUE
} from './type';
import init from './init';

export function activate(context: ExtensionContext): void {
    if (!window.activeTextEditor) return;

    const initialValue = init(window.activeTextEditor, context);
    let { option, optionsStruct, isActive } = initialValue;
    const { statusBarItem, diagnostic } = initialValue;
    const checkCodeDebounce = debounce(checkCode, 1500);

    const reload = commands.registerCommand('echarts.reload', () => {
        statusBarItem.changeStatus(BarItemStatus.Loading);

        !optionsStruct && (optionsStruct = getOptionsStruct());

        optionsStruct ? statusBarItem.changeStatus(BarItemStatus.Loaded)
            : statusBarItem.changeStatus(BarItemStatus.Failed);

        if (!optionsStruct || !window.activeTextEditor) return;
        checkCode(diagnostic, window.activeTextEditor.document.getText(), optionsStruct);
    });

    const onDidChangeActiveTextEditor = window.onDidChangeActiveTextEditor(editor => {
        diagnostic.clearDiagnostics();
        if (!editor) return;

        if (editor.document.languageId === 'javascript' && isActive && optionsStruct) {
            diagnostic.changeActiveEditor(editor.document.uri);
            checkCode(diagnostic, editor.document.getText(), optionsStruct);
        }
    });

    const deactivateEcharts = commands.registerCommand('echarts.deactivate', () => {
        isActive = false;
        statusBarItem.hide();
        statusBarItem.changeStatus(BarItemStatus.Loading);
        diagnostic.clearDiagnostics();
    });

    const activateEcharts = commands.registerCommand('echarts.activate', () => {
        isActive = true;
        statusBarItem.show();

        !optionsStruct && (optionsStruct = getOptionsStruct());

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
            const ast = acorn.parse(text, { locations: true });
            optionsStruct && checkCodeDebounce(diagnostic, text, optionsStruct, ast);

            if (!event.contentChanges[0]) return;

            const position = event.contentChanges[0].rangeOffset;
            const literal = findNodeAround(ast, position, 'Literal');
            const property = findNodeAround(ast, position, 'Property');

            // input is in Literal, then don't show completion
            if (literal && isLiteral(literal.node)) {
                option = '';
                return;
            }

            // Hit enter and input is in series/visualMap/dataZoom
            if (
                event.contentChanges[0].text.includes('\n')
                && property && isProperty(property.node)
                && ['series', 'visualMap', 'dataZoom'].includes(property.node.key.name)
            ) {
                option = `${property.node.key.name}.${findChartType(property.node.value, position)}`;
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
            console.error('onDidChangeTextDocument error');
        }
    });

    const completion = languages.registerCompletionItemProvider({ scheme: 'file', language: 'javascript' },
        {
            provideCompletionItems() {
                if (!optionsStruct || !isActive || !optionsStruct[option]) return;

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
                                type.push('\'#\'', '\'rgb()\'', '\'rgba()\'', ...(COLOR_VALUE.map(item => `'${item}'`)));
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
                    completionItem.documentation = new MarkdownString(item.desc);
                    return completionItem;
                });
            }
        },
        ...generateAToZArray()
    );

    context.subscriptions.push(
        reload,
        deactivateEcharts,
        activateEcharts,
        onDidChangeTextDocumentEvent,
        completion,
        onDidChangeActiveTextEditor
    );
}

// export function deactivate() {}
