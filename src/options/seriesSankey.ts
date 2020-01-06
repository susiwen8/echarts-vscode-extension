/**
 * @file Series-Sankey component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import {urls} from '../urls';
import {utils, Options} from '../utils';

const seriesSankeyOptionsName: string[] = [
    'id',
    'zlevel',
    'z',
    'left',
    'top',
    'right',
    'bottom',
    'width',
    'height',
    'nodeWidth',
    'nodeGap',
    'nodeAlign',
    'layoutIterations',
    'orient',
    'draggable',
    'focusNodeAdjacency',
    'levels',
    'label',
    'itemStyle',
    'lineStyle',
    'emphasis',
    'data',
    'nodes',
    'name',
    'legendHoverLink',
    'links',
    'edges',
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

async function getSankyOptions(lang: string): Promise<CompletionItem[]> {
    const jsonData: Options|undefined = await utils.getData(urls[lang].SERIES_SANKEY_URL);
    return seriesSankeyOptionsName.map((item: string) => {
        let completionItem: CompletionItem;
        let insertText: SnippetString;

        switch (item) {
            case 'label':
            case 'itemStyle':
            case 'lineStyle':
            case 'emphasis':
            case 'tooltip':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: {$0}`);
                break;

            case 'legendHoverLink':
            case 'silent':
            case 'animation':
            case 'draggable':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false|},');
                break;

            case 'focusNodeAdjacency':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false,\'allEdges\',\'outEdges\',\'inEdges\'|},');
                break;

            case 'nodeAlign':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|justify,left,right|}\',');
                break;

            case 'zlevel':
            case 'z':
            case 'animationThreshold':
            case 'nodeWidth':
            case 'nodeGap':
            case 'layoutIterations':
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

            case 'data':
            case 'nodes':
            case 'links':
            case 'edges':
            case 'levels':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: [$0],`);
                break;

            case 'orient':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: ` + '\'${1|horizontal,vertical|}\',');
                break;
    
            default:
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: \'$0\',`);
        }
    
        completionItem.insertText = insertText;
        completionItem.documentation = jsonData && jsonData[item];
        return completionItem;
    });
}

export default getSankyOptions;