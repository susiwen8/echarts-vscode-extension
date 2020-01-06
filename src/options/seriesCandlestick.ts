/**
 * @file Series-Candlestick component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import {urls} from '../urls';
import {utils, Options} from '../utils';

const seriesCandlestickOptionsName: string[] = [
    'id',
    'coordinateSystem',
    'xAxisIndex',
    'yAxisIndex',
    'name',
    'legendHoverLink',
    'hoverAnimation',
    'layout',
    'barWidth',
    'barMinWidth',
    'barMaxWidth',
    'itemStyle',
    'emphasis',
    'large',
    'largeThreshold',
    'progressive',
    'progressiveThreshold',
    'progressiveChunkMode',
    'dimensions',
    'encode',
    'data',
    'markPoint',
    'markLine',
    'markArea',
    'clip',
    'zlevel',
    'z',
    'silent',
    'animationDuration',
    'animationEasing',
    'animationDelay',
    'tooltip'
];

async function getCandlestickOptions(lang: string): Promise<CompletionItem[]> {
    const jsonData: Options|undefined = await utils.getData(urls[lang].SERIES_CANDLESTICK_URL);
    return seriesCandlestickOptionsName.map((item: string) => {
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
            case 'large':
            case 'clip':
            case 'silent':
            case 'hoverAnimation':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false|},');
                break;

            case 'largeThreshold':
            case 'progressive':
            case 'progressiveThreshold':
            case 'zlevel':
            case 'z':
            case 'xAxisIndex':
            case 'yAxisIndex':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: $0`);
                break;

            case 'barWidth':
            case 'barMinWidth':
            case 'barMaxWidth':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: ` + '${1|10,\'%\'|}');
                break;

            case 'layout':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|horizontal,vertical|}\',');
                break;

            case 'progressiveChunkMode':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|sequential,mod|}\',');
                break;

            case 'animationDelay':
            case 'animationDuration':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|1,function (idx) {}|},');
                break;

            case 'dimensions':
            case 'data':
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
        return completionItem;
    });
}

export default getCandlestickOptions;