/**
 * @file Title component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import {getData, Options} from '../utils';

const titleOptionsName: string[] = [
    'id',
    'show',
    'text',
    'link',
    'target',
    'textStyle',
    'subtext',
    'sublink',
    'subtarget',
    'subtextStyle',
    'textAlign',
    'textVerticalAlign',
    'triggerEvent',
    'padding',
    'itemGap',
    'zlevel',
    'z',
    'left',
    'top',
    'right',
    'bottom',
    'backgroundColor',
    'borderColor',
    'borderWidth',
    'borderRadius',
    'shadowBlur',
    'shadowColor',
    'shadowOffsetX',
    'shadowOffsetY'
];

async function getTitleOptions(lang: string): Promise<CompletionItem[]> {
    const jsonData: Options|undefined = await getData({lang, option: 'TITLE_URL'});
    return titleOptionsName.map((item: string) => {
        let completionItem: CompletionItem;
        let insertText: SnippetString;

        switch (item) {
            case 'textStyle':
            case 'subtextStyle':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: {$0\n},`);
                break;

            // TODO: open color picker
            case 'backgroundColor':
            case 'borderColor':
            case 'shadowColor':
                completionItem = new CompletionItem(item, CompletionItemKind.Color);
                insertText = new SnippetString(`${item}: ` + '\'${1|#,rgba(),rgb()|}\',');
                break;

            case 'show':
            case 'triggerEvent':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false|},');
                break;

            case 'padding':
            case 'borderRadius':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: ` + '${1|5,[]|},');
                break;

            case 'left':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: ` + '${1|\'auto\',\'left\',\'center\',\'right\',20,\'%\'|},');
                break;
            case 'top':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: ` + '${1|\'auto\',\'top\',\'middle\',\'bottom\',20,\'%\'|},');
                break;
            case 'right':
            case 'bottom':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: ` + '${1|\'auto\',20,\'%\'|},');
                break;

            case 'itemGap':
            case 'zlevel':
            case 'z':
            case 'borderWidth':
            case 'shadowBlur':
            case 'shadowOffsetX':
            case 'shadowOffsetY':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: $0,`);
                break;

            case 'target':
            case 'subtarget':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|blank,self|}\',');
                break;

            case 'textAlign':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|auto,left,right,center|}\',');
                break;

            case 'textVerticalAlign':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|auto,top,bottom,middle|}\',');
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

export default getTitleOptions;