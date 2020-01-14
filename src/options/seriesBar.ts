/**
 * @file Series-Bar component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import {getData, Options} from '../utils';

const seriesBarOptionsName: string[] = [
    'id',
    'name',
    'legendHoverLink',
    'coordinateSystem',
    'xAxisIndex',
    'yAxisIndex',
    'roundCap',
    'label',
    'itemStyle',
    'emphasis',
    'stack',
    'cursor',
    'barWidth',
    'barMaxWidth',
    'barMinWidth',
    'barMinHeight',
    'barGap',
    'barCategoryGap',
    'large',
    'largeThreshold',
    'progressive',
    'progressiveThreshold',
    'progressiveChunkMode',
    'dimensions',
    'encode',
    'seriesLayoutBy',
    'datasetIndex',
    'data',
    'markPoint',
    'markLine',
    'markArea',
    'clip',
    'zlevel',
    'z',
    'silent',
    'animation',
    'animationThreshold',
    'animationDuration',
    'animationEasing',
    'animationDelay',
    'animationDurationUpdate',
    'animationEasingUpdate',
    'animationDelayUpdate',
    'tooltip'
];

async function getBarOptions(lang: string): Promise<CompletionItem[]> {
    const jsonData: Options|undefined = await getData({lang, option: 'SERIES_BAR_URL'});
    return seriesBarOptionsName.map((item: string) => {
        let completionItem: CompletionItem;
        let insertText: SnippetString;

        switch (item) {
            case 'label':
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
            case 'roundCap':
            case 'large':
            case 'clip':
            case 'silent':
            case 'animation':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false|},');
                break;

            case 'barWidth':
            case 'barMaxWidth':
            case 'barMinWidth':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: ` + '${1|5,\'\'|},');
                break;

            case 'barMinHeight':
            case 'largeThreshold':
            case 'progressive':
            case 'progressiveThreshold':
            case 'datasetIndex':
            case 'zlevel':
            case 'z':
            case 'animationThreshold':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: $0`);
                break;

            case 'progressiveChunkMode':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|sequential,mod|}\',');
                break;

            case 'seriesLayoutBy':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|column,row|}\',');
                break;

            case 'animationDelay':
            case 'animationDurationUpdate':
            case 'animationDelayUpdate':
            case 'animationDuration':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|1,function (idx) {}|},');
                break;

            case 'xAxisIndex':
            case 'yAxisIndex':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: $0,`);
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

export default getBarOptions;