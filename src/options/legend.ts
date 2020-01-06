/**
 * @file Legend component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import {urls} from '../urls';
import {utils, Options} from '../utils';

const legendOptionsName: string[] = [
    'type',
    'id',
    'show',
    'zlevel',
    'z',
    'left',
    'top',
    'right',
    'bottom',
    'width',
    'height',
    'orient',
    'align',
    'padding',
    'itemGap',
    'itemWidth',
    'itemHeight',
    'symbolKeepAspect',
    'formatter',
    'selectedMode',
    'inactiveColor',
    'selected',
    'textStyle',
    'tooltip',
    'icon',
    'data',
    'backgroundColor',
    'borderColor',
    'borderWidth',
    'borderRadius',
    'shadowBlur',
    'shadowColor',
    'shadowOffsetX',
    'shadowOffsetY',
    'scrollDataIndex',
    'pageButtonItemGap',
    'pageButtonGap',
    'pageButtonPosition',
    'pageFormatter',
    'pageIcons',
    'pageIconColor',
    'pageIconInactiveColor',
    'pageIconSize',
    'pageTextStyle',
    'animation',
    'animationDurationUpdate',
    'selector',
    'selectorLabel',
    'selectorPosition',
    'selectorItemGap',
    'selectorButtonGap'
];

async function getLegendOptions(lang: string): Promise<CompletionItem[]> {
    const jsonData: Options|undefined = await utils.getData(urls[lang].LEGEND_URL);
    return legendOptionsName.map(item => {
        let completionItem: CompletionItem;
        let insertText: SnippetString;

        switch (item) {
            case 'selected':
            case 'textStyle':
            case 'tooltip':
            case 'pageIcons':
            case 'pageTextStyle':
            case 'selectorLabel':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: {$0\n},`);
                break;

            case 'show':
            case 'symbolKeepAspect':
            case 'animation':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false|},');
                break;

            case 'selector':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false,[]|},');
                break;

            case 'selectedMode':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}:` + '${1|true,false,\'single\',\'multiple\'|},');
                break;

            case 'data':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: ` + '[$0],');
                break;

            case 'borderRadius':
            case 'padding':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: ` + '${1|5,[]|},');
                break;
            case 'pageIconSize':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: ` + '${1|15,[]|},');
                break;

            case 'backgroundColor':
            case 'borderColor':
            case 'shadowColor':
            case 'inactiveColor':
                completionItem = new CompletionItem(item, CompletionItemKind.Color);
                insertText = new SnippetString(`${item}: ` + '\'${1|#,rgba(),rgb()|}\',');
                break;

            case 'pageFormatter':
                completionItem = new CompletionItem(item, CompletionItemKind.Method);
                insertText = new SnippetString(`${item}: ` + '${1|\'{current}/{total}\',function (params) {}|},');
                break;
            case 'formatter':
                completionItem = new CompletionItem(item, CompletionItemKind.Method);
                insertText = new SnippetString(`${item}: ` + '${1|\'\',function (name) {}|},');
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
            case 'width':
            case 'height':
            case 'itemWidth':
            case 'itemHeight':
            case 'shadowBlur':
            case 'shadowOffsetX':
            case 'shadowOffsetY':
            case 'scrollDataIndex':
            case 'pageButtonItemGap':
            case 'pageButtonGap':
            case 'animationDurationUpdate':
            case 'selectorItemGap':
            case 'selectorButtonGap':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: $0,`);
                break;

            case 'selectorPosition':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|auto,end,start|}\',');
                break;

            case 'pageButtonPosition':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|end,start|}\',');
                break;

            case 'align':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|auto,left,right|}\',');
                break;

            case 'orient':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|horizontal,vertical|}\',');
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

export default getLegendOptions;