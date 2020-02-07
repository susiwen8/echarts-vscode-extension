/**
 * @file Series-Treemap component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import {getData} from '../utils';
import {Options} from '../type';

const seriesTreemapOptionsName: string[] = [
    'id',
    'name',
    'zlevel',
    'z',
    'left',
    'top',
    'right',
    'bottom',
    'width',
    'height',
    'squareRatio',
    'leafDepth',
    'drillDownIcon',
    'roam',
    'nodeClick',
    'zoomToNodeRatio',
    'levels',
    'visualDimension',
    'visualMin',
    'visualMax',
    'colorAlpha',
    'colorSaturation',
    'colorMappingBy',
    'visibleMin',
    'childrenVisibleMin',
    'label',
    'upperLabel',
    'itemStyle',
    'emphasis',
    'breadcrumb',
    'data',
    'silent',
    'animationDuration',
    'animationEasing',
    'animationDelay',
    'tooltip'
];

async function getTreemapOptions(lang: string): Promise<CompletionItem[]> {
    const jsonData: Options|undefined = await getData({lang, option: 'SERIES_TREEMAP_URL'});
    return seriesTreemapOptionsName.map((item: string) => {
        let completionItem: CompletionItem;
        let insertText: SnippetString;

        switch (item) {
            case 'label':
            case 'upperLabel':
            case 'itemStyle':
            case 'emphasis':
            case 'tooltip':
            case 'breadcrumb':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: {$0}`);
                break;

            case 'silent':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false|},');
                break;

            case 'roam':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false,\'scale\',\'zoom\',\'pan\',\'move\'|},');
                break;

            case 'nodeClick':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false,\'zoomToNode\',\'link\'|},');
                break;

            case 'zlevel':
            case 'z':
            case 'zoomToNodeRatio':
            case 'squareRatio':
            case 'leafDepth':
            case 'visualDimension':
            case 'visualMin':
            case 'visualMax':
            case 'colorSaturation':
            case 'visibleMin':
            case 'childrenVisibleMin':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: $0`);
                break;

            case 'colorMappingBy':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|value,index,id|}\',');
                break;

            case 'animationDuration':
            case 'animationDelay':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|1500,function (idx) {}|},');
                break;

            case 'levels':
            case 'colorAlpha':
            case 'data':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: [$0],`);
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
                insertText = new SnippetString(`${item}: ` + '${1|20,\'\',\'%\'|},');
                break;

            case 'width':
            case 'height':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}:` + '${1|\'\',10|},');
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

export default getTreemapOptions;