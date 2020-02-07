/**
 * @file Series-Line component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import {getData} from '../utils';
import {Options} from '../type';

const seriesLineOptionsName: string[] = [
    'id',
    'name',
    'coordinateSystem',
    'xAxisIndex',
    'yAxisIndex',
    'polarIndex',
    'symbol',
    'symbolSize',
    'symbolRotate',
    'symbolKeepAspect',
    'symbolOffset',
    'showSymbol',
    'showAllSymbol',
    'hoverAnimation',
    'legendHoverLink',
    'stack',
    'cursor',
    'connectNulls',
    'clip',
    'step',
    'label',
    'itemStyle',
    'lineStyle',
    'areaStyle',
    'emphasis',
    'smooth',
    'smoothMonotone',
    'sampling',
    'dimensions',
    'encode',
    'seriesLayoutBy',
    'datasetIndex',
    'data',
    'markPoint',
    'markLine',
    'markArea',
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

async function getLineOptions(lang: string): Promise<CompletionItem[]> {
    const jsonData: Options|undefined = await getData({lang, option: 'SERIES_LINE_URL'});
    return seriesLineOptionsName.map((item: string) => {
        let completionItem: CompletionItem;
        let insertText: SnippetString;

        switch (item) {
            case 'label':
            case 'itemStyle':
            case 'lineStyle':
            case 'areaStyle':
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
            case 'clip':
            case 'silent':
            case 'animation':
            case 'symbolKeepAspect':
            case 'showSymbol':
            case 'hoverAnimation':
            case 'connectNulls':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false|},');
                break;

            case 'showAllSymbol':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|\'auto\',true,false|},');
                break;

            case 'smooth':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|0.5,true,false|},');
                break;

            case 'step':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '${1|\'start\',\'middle\',\'end\'true,false|},');
                break;

            case 'smoothMonotone':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|x,y|}\',');
                break;

            case 'sampling':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|average,max,min,sum|}\',');
                break;

            case 'datasetIndex':
            case 'zlevel':
            case 'z':
            case 'animationThreshold':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: $0`);
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

            case 'symbol':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|\'emptyCircle\',\'circle\',\'rect\',\'roundRect\',\'triangle\',\'diamond\',\'pin\',\'arrow\',\'none\',\'image://\',function (value, params) {}|},');
                break;

            case 'symbolSize':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|4,[],function (value, params) {}|},');
                break;

            case 'xAxisIndex':
            case 'yAxisIndex':
            case 'polarIndex':
            case 'symbolRotate':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: $0,`);
                break;

            case 'dimensions':
            case 'data':
            case 'symbolOffset':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: [$0],`);
                break;

            case 'coordinateSystem':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: ` + '\'${1|cartesian2d,polar|}\',');
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

export default getLineOptions;