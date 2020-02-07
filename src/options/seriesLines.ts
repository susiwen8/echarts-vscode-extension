/**
 * @file Series-Lines component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import { getData } from '../utils';
import { Options } from '../type';

const seriesLinesOptionsName: string[] = [
    'id',
    'name',
    'coordinateSystem',
    'xAxisIndex',
    'yAxisIndex',
    'geoIndex',
    'polyline',
    'effect',
    'large',
    'largeThreshold',
    'symbol',
    'symbolSize',
    'lineStyle',
    'label',
    'emphasis',
    'progressive',
    'progressiveThreshold',
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
    'animationDelayUpdate'
];

async function getLinesOptions(lang: string): Promise<CompletionItem[]> {
    const jsonData: Options | undefined = await getData({ lang, option: 'SERIES_LINES_URL' });
    return seriesLinesOptionsName.map((item: string) => {
        let completionItem: CompletionItem;
        let insertText: SnippetString;

        switch (item) {
            case 'label':
            case 'lineStyle':
            case 'emphasis':
            case 'markPoint':
            case 'markLine':
            case 'markArea':
            case 'effect':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: {$0}`);
                break;

            case 'polyline':
            case 'large':
            case 'clip':
            case 'silent':
            case 'animation':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false|},');
                break;

            case 'largeThreshold':
            case 'progressive':
            case 'progressiveThreshold':
            case 'zlevel':
            case 'z':
            case 'animationThreshold':
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

            case 'symbol':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|\'emptyCircle\',\'circle\',\'rect\',\'roundRect\',\'triangle\',\'diamond\',\'pin\',\'arrow\',\'none\',\'image://\',function (value, params) {}|},');
                break;

            case 'symbolSize':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|4,[]|},');
                break;

            case 'xAxisIndex':
            case 'yAxisIndex':
            case 'geoIndex':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: $0,`);
                break;

            case 'data':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: [$0],`);
                break;

            case 'coordinateSystem':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: ` + '\'${1|cartesian2d,geo|}\',');
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

export default getLinesOptions;