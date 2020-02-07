/**
 * @file Tooltip component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import {getData} from '../utils';
import {Options} from '../type';

const tooltipOptionsName: string[] = [
    'show',
    'trigger',
    'axisPointer',
    'showContent',
    'alwaysShowContent',
    'triggerOn',
    'showDelay',
    'hideDelay',
    'enterable',
    'renderMode',
    'confine',
    'transitionDuration',
    'position',
    'formatter',
    'backgroundColor',
    'borderColor',
    'borderWidth',
    'padding',
    'textStyle',
    'extraCssText'
];

async function getTooltipOptions(lang: string): Promise<CompletionItem[]> {
    const jsonData: Options|undefined = await getData({lang, option: 'TOOLTIP_URL'});
    return tooltipOptionsName.map((item: string) => {
        let completionItem: CompletionItem;
        let insertText: SnippetString;

        switch (item) {
            case 'textStyle':
            case 'axisPointer':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: {$0\n},`);
                break;

            // TODO: open color picker
            case 'backgroundColor':
            case 'borderColor':
                completionItem = new CompletionItem(item, CompletionItemKind.Color);
                insertText = new SnippetString(`${item}: ` + '\'${1|#,rgba(),rgb()|}\',');
                break;

            case 'show':
            case 'showContent':
            case 'alwaysShowContent':
            case 'enterable':
            case 'confine':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false|},');
                break;

            case 'padding':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: ` + '${1|5,[]|},');
                break;

            case 'borderWidth':
            case 'showDelay':
            case 'hideDelay':
            case 'transitionDuration':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: $0,`);
                break;

            case 'trigger':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|item,axis,none|}\',');
                break;

            case 'position':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '${1|\'inside\',\'top\',\'left\',\'right\',\'bottom\',[],function (point, params, dom, rect, size) {}|},');
                break;

            case 'formatter':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '${1|\'\',function (params, ticket, callback) {}|},');
                break;

            case 'renderMode':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|html,richText|}\',');
                break;

            case 'triggerOn':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|mousemove,click,none|}\',');
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

export default getTooltipOptions;