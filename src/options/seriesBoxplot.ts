/**
 * @file Series-Boxplot component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import { getData } from '../utils';
import { Options, Item, Params } from '../type';

const seriesBoxplotOptionsName: string[] = [
    'id',
    'coordinateSystem',
    'xAxisIndex',
    'yAxisIndex',
    'name',
    'legendHoverLink',
    'hoverAnimation',
    'layout',
    'boxWidth',
    'itemStyle',
    'emphasis',
    'dimensions',
    'encode',
    'data',
    'markPoint',
    'markLine',
    'markArea',
    'zlevel',
    'z',
    'silent',
    'animationDuration',
    'animationEasing',
    'animationDelay',
    'tooltip'
];

async function getBoxplotOptions({ lang, optionsName }: Params): Promise<Item> {
    const jsonData: Options | undefined = await getData({ lang, option: 'SERIES_BOXPLOT_URL' });
    const item = optionsName.map((item: string) => {
        let completionItem: CompletionItem;
        let insertText: SnippetString;

        switch (item) {
            case 'itemStyle':
            case 'emphasis':
            case 'encode':
            case 'markPoint':
            case 'markLine':
            case 'markArea':
            case 'tooltip':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: {$0}`);
                break;

            case 'legendHoverLink':
            case 'silent':
            case 'hoverAnimation':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false|},');
                break;

            case 'zlevel':
            case 'z':
            case 'xAxisIndex':
            case 'yAxisIndex':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: $0`);
                break;

            case 'layout':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|horizontal,vertical|}\',');
                break;

            case 'animationDelay':
            case 'animationDuration':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|1000,function (idx) {}|},');
                break;

            case 'dimensions':
            case 'data':
            case 'boxWidth':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: [$0],`);
                break;

            case 'coordinateSystem':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: 'cartesian2d',`);
                break;

            default:
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: '$0',`);
        }

        completionItem.insertText = insertText;
        completionItem.documentation = jsonData && jsonData[item];
        // completionItem.label = 'seriesBoxplot';
        return completionItem;
    });

    return {
        id: 'typeboxplot',
        item
    };
}

export default getBoxplotOptions;