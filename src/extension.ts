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
    checkCode
} from './jsUtils';
import {
    COLOR_VALUE
} from './type';
import init from './init';
import tsParser from './tsParser';
import jsParser from './jsParser';

export function activate(context: ExtensionContext): void {
    if (!window.activeTextEditor) return;

    const initialValue = init(window.activeTextEditor, context);
    let { option, isActive } = initialValue;
    const { statusBarItem, diagnostic, activeKeys, optionsStruct } = initialValue;
    const checkCodeDebounce = debounce(checkCode, 1500);

    const onDidChangeActiveTextEditor = window.onDidChangeActiveTextEditor(editor => {
        diagnostic.clearDiagnostics();
        if (!editor) return;

        if (
            ['javascript', 'typescript'].includes(editor.document.languageId)
            && isActive
        ) {
            diagnostic.changeActiveEditor(editor.document.uri);
            checkCode(diagnostic, editor.document.getText(), optionsStruct);
        }
    });

    const deactivateEcharts = commands.registerCommand('echarts.deactivate', () => {
        isActive = false;
        statusBarItem.hide();
        diagnostic.clearDiagnostics();
    });

    const activateEcharts = commands.registerCommand('echarts.activate', () => {
        isActive = true;
        statusBarItem.show();

        statusBarItem.changeStatus();
        if (
            !window.activeTextEditor
            || window.activeTextEditor.document.languageId !== 'javascript'
        ) return;

        checkCode(diagnostic, window.activeTextEditor.document.getText(), optionsStruct);
    });

    const onDidChangeTextDocumentEvent = workspace.onDidChangeTextDocument(event => {
        if (!isActive) {
            return;
        }

        const code = event.document.getText();
        let index = 0;
        const len = event.contentChanges.length;
        for (; index < len; index++) {
            if (!event.contentChanges[index].text) continue;
            break;
        }

        const { rangeOffset, text } = event.contentChanges[index];

        if (event.document.languageId === 'typescript') {
            option = tsParser(code, rangeOffset, option);
        } else if (event.document.languageId === 'javascript') {
            option = jsParser(code, optionsStruct, rangeOffset,
                diagnostic, text,
                option, checkCodeDebounce
            );
        }
    });

    const provideCompletionItems = {
        provideCompletionItems(): CompletionItem[] {
            if (!isActive || !optionsStruct[option]) return [];

            let res = optionsStruct[option];

            if (option === 'option') {
                res = res.concat(optionsStruct['option-gl']);
            }
            if (option === 'option-gl') {
                res = res.concat(optionsStruct['option']);
            }

            return res.map(item => {
                const completionItem = new CompletionItem(item.name, CompletionItemKind.Keyword);
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
                completionItem.insertText = new SnippetString(`${item.name}: $\{1|${type.join(',')}|},`);
                completionItem.documentation = new MarkdownString(item.desc);
                return completionItem;
            });
        }
    };

    const completion = languages.registerCompletionItemProvider(
        ['javascript', 'typescript'],
        provideCompletionItems,
        ...activeKeys
    );

    context.subscriptions.push(
        deactivateEcharts,
        activateEcharts,
        onDidChangeTextDocumentEvent,
        completion,
        onDidChangeActiveTextEditor
    );
}

// export function deactivate() {}
