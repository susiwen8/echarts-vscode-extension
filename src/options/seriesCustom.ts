/**
 * @file Series-Custom component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import {urls} from '../urls';
import {utils, Options} from '../utils';

const seriesCustomOptionsName: string[] = [
    'id',
    'name',
    'legendHoverLink',
    'coordinateSystem',
    'xAxisIndex',
    'yAxisIndex',
    'polarIndex',
    'geoIndex',
    'calendarIndex',
    'renderItem',
    'itemStyle',
    'emphasis',
    'dimensions',
    'encode',
    'seriesLayoutBy',
    'datasetIndex',
    'data',
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

async function getCustomOptions(lang: string): Promise<CompletionItem[]> {
    const jsonData: Options|undefined = await utils.getData(urls[lang].SERIES_CUSTOM_URL);
    return seriesCustomOptionsName.map((item: string) => {
        let completionItem: CompletionItem;
        let insertText: SnippetString;

        switch (item) {
            case 'itemStyle':
            case 'emphasis':
            case 'tooltip':
            case 'encode':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: {$0}`);
                break;

            case 'legendHoverLink':
            case 'silent':
            case 'animation':
            case 'clip':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false|},');
                break;

            case 'zlevel':
            case 'z':
            case 'animationThreshold':
            case 'datasetIndex':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: $0`);
                break;

            case 'animationDelay':
            case 'animationDurationUpdate':
            case 'animationDelayUpdate':
            case 'animationDuration':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|1,function (idx) {}|},');
                break;

            case 'renderItem':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: function (idx) {},`);
                break;

            case 'xAxisIndex':
            case 'yAxisIndex':
            case 'polarIndex':
            case 'geoIndex':
            case 'calendarIndex':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: $0,`);
                break;

            case 'data':
            case 'dimensions':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: [$0],`);
                break;

            case 'seriesLayoutBy':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: ` + '\'${1|column,row|}\',');
                break;

            case 'coordinateSystem':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: ` + '\'${1|cartesian2d,polar,geo,none|}\',');
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

export default getCustomOptions;