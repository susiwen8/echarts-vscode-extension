/**
 * @file Series-Tree component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import { getData } from '../utils';
import { Options } from '../type';

const seriesTreeOptionsName: string[] = [
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
    'layout',
    'orient',
    'symbol',
    'symbolSize',
    'symbolRotate',
    'symbolKeepAspect',
    'symbolOffset',
    'roam',
    'expandAndCollapse',
    'initialTreeDepth',
    'itemStyle',
    'label',
    'lineStyle',
    'emphasis',
    'leaves',
    'data',
    'tooltip'
];

async function getTreeOptions(lang: string): Promise<CompletionItem[]> {
    const jsonData: Options | undefined = await getData({ lang, option: 'SERIES_TREE_URL' });
    return seriesTreeOptionsName.map((item: string) => {
        let completionItem: CompletionItem;
        let insertText: SnippetString;

        switch (item) {
            case 'label':
            case 'itemStyle':
            case 'lineStyle':
            case 'emphasis':
            case 'leaves':
            case 'tooltip':
            case 'data':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: {$0}`);
                break;

            case 'symbolKeepAspect':
            case 'expandAndCollapse':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false|},');
                break;

            case 'roam':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false,\'scale\',\'move\'|},');
                break;

            case 'zlevel':
            case 'z':
            case 'symbolRotate':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: $0`);
                break;

            case 'layout':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|orthogonal,radial|}\',');
                break;

            case 'orient':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|LR,RL,TB,BT,horizontal,vertical|}\',');
                break;

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
                insertText = new SnippetString(`${item}: ` + '${1|10,[],function (value, params) {}|},');
                break;

            case 'symbolOffset':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: [$0],`);
                break;

            case 'coordinateSystem':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: 'cartesian2d',`);
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

export default getTreeOptions;