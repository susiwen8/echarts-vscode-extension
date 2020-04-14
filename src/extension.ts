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
import debounce from 'lodash/debounce';
import {
    checkCode,
    getOptionsStruct
} from './utils';
import {
    BarItemStatus,
    COLOR_VALUE
} from './type';
import init from './init';
import tsParser from './tsParser';
import jsParser from './jsParser';

export function activate(context: ExtensionContext): void {
    if (!window.activeTextEditor) return;

    const initialValue = init(window.activeTextEditor, context);
    let { option, optionsStruct, isActive } = initialValue;
    const { statusBarItem, diagnostic, activeKeys } = initialValue;
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

        if (
            ['javascript', 'typescript'].includes(editor.document.languageId)
            && isActive && optionsStruct
        ) {
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
        if (
            !optionsStruct
            || !window.activeTextEditor
            || window.activeTextEditor.document.languageId !== 'javascript'
        ) return;

        checkCode(diagnostic, window.activeTextEditor.document.getText(), optionsStruct);
    });

    const onDidChangeTextDocumentEvent = workspace.onDidChangeTextDocument(event => {
        if (!isActive) {
            return;
        }

        const code = event.document.getText();
        const position = event.contentChanges[0].rangeOffset;

        if (event.document.languageId === 'typescript') {
            option = tsParser(code, position, option);
        } else if (event.document.languageId === 'javascript') {
            option = jsParser(
                code,
                optionsStruct,
                position,
                diagnostic,
                event,
                option,
                checkCodeDebounce
            );
        }
    });

    const provideCompletionItems = {
        provideCompletionItems(): CompletionItem[] | undefined {
            if (!optionsStruct || !isActive || !optionsStruct[option]) return;

            let res = optionsStruct[option];

            if (option === 'option') {
                res = res.concat(optionsStruct['option-gl']);
            }
            if (option === 'option-gl') {
                res = res.concat(optionsStruct['option']);
            }

            return res.map(item => {
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
    };

    const jsCompletion = languages.registerCompletionItemProvider(
        { scheme: 'file', language: 'javascript' },
        provideCompletionItems,
        ...activeKeys
    );

    const tsCompletion = languages.registerCompletionItemProvider(
        { scheme: 'file', language: 'typescript' },
        provideCompletionItems,
        ...activeKeys
    );

    context.subscriptions.push(
        reload,
        deactivateEcharts,
        activateEcharts,
        onDidChangeTextDocumentEvent,
        jsCompletion,
        tsCompletion,
        onDidChangeActiveTextEditor
    );
}

// export function deactivate() {}
