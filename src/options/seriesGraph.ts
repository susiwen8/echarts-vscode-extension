/**
 * @file Series-Graph component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import {urls} from '../urls';
import {getData, Options} from '../utils';

const seriesGraphOptionsName: string[] = [
    'id',
    'name',
    'legendHoverLink',
    'coordinateSystem',
    'xAxisIndex',
    'yAxisIndex',
    'polarIndex',
    'geoIndex',
    'calendarIndex',
    'hoverAnimation',
    'layout',
    'circular',
    'force',
    'roam',
    'nodeScaleRatio',
    'draggable',
    'focusNodeAdjacency',
    'symbol',
    'symbolSize',
    'symbolRotate',
    'symbolKeepAspect',
    'symbolOffset',
    'edgeSymbol',
    'edgeSymbolSize',
    'cursor',
    'itemStyle',
    'lineStyle',
    'label',
    'edgeLabel',
    'emphasis',
    'categories',
    'data',
    'nodes',
    'links',
    'edges',
    'markPoint',
    'markLine',
    'markArea',
    'zlevel',
    'z',
    'left',
    'top',
    'right',
    'bottom',
    'width',
    'height',
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

async function getGraphOptions(lang: string): Promise<CompletionItem[]> {
    const jsonData: Options|undefined = await getData(urls[lang].SERIES_GRAPH_URL);
    return seriesGraphOptionsName.map((item: string) => {
        let completionItem: CompletionItem;
        let insertText: SnippetString;

        switch (item) {
            case 'label':
            case 'itemStyle':
            case 'lineStyle':
            case 'emphasis':
            case 'markPoint':
            case 'markLine':
            case 'markArea':
            case 'tooltip':
            case 'circular':
            case 'force':
            case 'edgeLabel':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: {$0}`);
                break;

            case 'legendHoverLink':
            case 'silent':
            case 'animation':
            case 'symbolKeepAspect':
            case 'hoverAnimation':
            case 'draggable':
            case 'focusNodeAdjacency':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false|},');
                break;

            case 'roam':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false,\'scale\',\'move\'|},');
                break;

            case 'layout':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|none,circular,force|}\',');
                break;

            case 'zlevel':
            case 'z':
            case 'animationThreshold':
            case 'nodeScaleRatio':
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

            case 'left':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: ` + '${1|80,\'left\',\'center\',\'right\',\'%\'|},');
                break;
            case 'top':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: ` + '${1|60,\'top\',\'middle\',\'bottom\',\'%\'|},');
                break;
            case 'right':
            case 'bottom':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: ` + '${1|20,\'auto\',\'%\'|},');
                break;

            case 'width':
            case 'height':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}:` + '${1|\'auto\',10|},');
                break;

            case 'symbol':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|\'emptyCircle\',\'circle\',\'rect\',\'roundRect\',\'triangle\',\'diamond\',\'pin\',\'arrow\',\'none\',\'image://\',function (value, params) {}|},');
                break;

            case 'symbolSize':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|4,[],function (value, params) {}|},');
                break;

            case 'edgeSymbol':
            case 'edgeSymbolSize':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|\'\',[ , ]|},');
                break;

            case 'xAxisIndex':
            case 'yAxisIndex':
            case 'polarIndex':
            case 'geoIndex':
            case 'calendarIndex':
            case 'symbolRotate':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: $0,`);
                break;

            case 'data':
            case 'symbolOffset':
            case 'categories':
            case 'nodes':
            case 'links':
            case 'edges':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: [$0],`);
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

export default getGraphOptions;