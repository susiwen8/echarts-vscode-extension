/**
 * @file Series-Sunburst component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import { getData } from '../utils';
import { Options, Item } from '../type';

const seriesSunburstOptionsName: string[] = [
    'id',
    'name',
    'zlevel',
    'z',
    'center',
    'radius',
    'data',
    'label',
    'itemStyle',
    'highlightPolicy',
    'nodeClick',
    'sort',
    'renderLabelForZeroData',
    'emphasis',
    'highlight',
    'downplay',
    'levels',
    'animation',
    'animationThreshold',
    'animationDuration',
    'animationEasing',
    'animationDelay',
    'animationDurationUpdate',
    'animationEasingUpdate',
    'animationDelayUpdate'
];

async function getSunburstOptions(lang: string): Promise<Item> {
    const jsonData: Options | undefined = await getData({ lang, option: 'SERIES_SUNBURST_URL' });
    const item = seriesSunburstOptionsName.map((item: string) => {
        let completionItem: CompletionItem;
        let insertText: SnippetString;

        switch (item) {
            case 'label':
            case 'itemStyle':
            case 'emphasis':
            case 'highlight':
            case 'downplay':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: {$0}`);
                break;

            case 'renderLabelForZeroData':
            case 'animation':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false|},');
                break;

            case 'zlevel':
            case 'z':
            case 'animationThreshold':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: $0`);
                break;

            case 'highlightPolicy':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|descendant,ancestor,self,none|}\',');
                break;

            case 'animationDelay':
            case 'animationDurationUpdate':
            case 'animationDelayUpdate':
            case 'animationDuration':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|1,function (idx) {}|},');
                break;

            case 'sort':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|\'desc\',\'asc\',null,function (value, params) {}|},');
                break;

            case 'center':
            case 'data':
            case 'radius':
            case 'levels':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: [$0],`);
                break;

            default:
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: '$0',`);
        }

        completionItem.insertText = insertText;
        completionItem.documentation = jsonData && jsonData[item];
        // completionItem.label = 'seriesSunburst';
        return completionItem;
    });

    return {
        id: 'typesunburst',
        item
    };
}

export default getSunburstOptions;