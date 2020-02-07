/**
 * @file Parallel component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import { getData } from '../utils';
import { Options } from '../type';

const parallelOptionsName: string[] = [
    'id',
    'zlevel',
    'z',
    'left',
    'top',
    'right',
    'bottom',
    'width',
    'height',
    'layout',
    'axisExpandable',
    'axisExpandCenter',
    'axisExpandCount',
    'axisExpandWidth',
    'axisExpandTriggerOn',
    'parallelAxisDefault'
];

async function getParallelOptions(lang: string): Promise<CompletionItem[]> {
    const jsonData: Options | undefined = await getData({ lang, option: 'PARALLEL_URL' });
    return parallelOptionsName.map((item: string) => {
        let completionItem: CompletionItem;
        let insertText: SnippetString;

        switch (item) {
            case 'parallelAxisDefault':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: {$0\n},`);
                break;

            case 'axisExpandable':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false|},');
                break;

            case 'left':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: ` + '${1|80,\'left\',\'center\',\'right\',\'%\'|},');
                break;
            case 'top':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: ` + '${1|60,\'top\',\'middle\',\'bottom\',\'%\'|},');
                break;
            case 'right':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: ` + '${1|80,\'%\'|},');
                break;
            case 'bottom':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: ` + '${1|60,\'%\'|},');
                break;

            case 'width':
            case 'height':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}:` + '${1|\'auto\',10|},');
                break;

            case 'zlevel':
            case 'z':
            case 'axisExpandCenter':
            case 'axisExpandCount':
            case 'axisExpandWidth':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: $0,`);
                break;

            case 'layout':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|horizontal,vertical|},');
                break;

            case 'axisExpandTriggerOn':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|click,mousemove|},');
                break;

            default:
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: '$0',`);
        }

        completionItem.insertText = insertText;
        completionItem.documentation = jsonData && jsonData[item];
        return completionItem;
    });
}

export default getParallelOptions;