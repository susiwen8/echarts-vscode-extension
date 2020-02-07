/**
 * @file Timeline component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import { getData } from '../utils';
import { Options } from '../type';

const timelineOptionsName: string[] = [
    'show',
    'type',
    'axisType',
    'currentIndex',
    'autoPlay',
    'rewind',
    'loop',
    'playInterval',
    'realtime',
    'controlPosition',
    'zlevel',
    'z',
    'left',
    'top',
    'right',
    'bottom',
    'padding',
    'orient',
    'inverse',
    'symbol',
    'symbolSize',
    'symbolRotate',
    'symbolKeepAspect',
    'symbolOffset',
    'lineStyle',
    'label',
    'itemStyle',
    'checkpointStyle',
    'controlStyle',
    'emphasis',
    'data'
];

async function getTimelineOptions(lang: string): Promise<CompletionItem[]> {
    const jsonData: Options | undefined = await getData({ lang, option: 'TIMELINE_URL' });
    return timelineOptionsName.map((item: string) => {
        let completionItem: CompletionItem;
        let insertText: SnippetString;

        switch (item) {
            case 'lineStyle':
            case 'label':
            case 'itemStyle':
            case 'checkpointStyle':
            case 'controlStyle':
            case 'emphasis':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: {$0\n},`);
                break;

            case 'data':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: [$0]`);
                break;

            case 'inverse':
            case 'show':
            case 'autoPlay':
            case 'rewind':
            case 'loop':
            case 'symbolKeepAspect':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false|},');
                break;

            case 'left':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: ` + '${1|20,\'auto\',\'left\',\'center\',\'right\',\'%\'|},');
                break;
            case 'top':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: ` + '${1|20,\'auto\',\'top\',\'middle\',\'bottom\',\'%\'|},');
                break;
            case 'right':
            case 'bottom':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: ` + '${1|20,\'auto\',\'%\'|},');
                break;

            case 'padding':
            case 'symbolSize':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: ` + '${1|5,[]|},');
                break;

            case 'axisType':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|time,value,category|}\',');
                break;

            case 'orient':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|horizontal,vertical|}\',');
                break;

            case 'controlPosition':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|left,right|}\',');
                break;

            case 'type':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: slider,`);
                break;

            case 'zlevel':
            case 'z':
            case 'currentIndex':
            case 'playInterval':
            case 'symbolRotate':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: $0,`);
                break;

            case 'symbol':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}:` + '\'${|circle,rect,roundRect,triangle,diamond,pin,arrow,none,image://|}\',');
                break;

            case 'symbolOffset':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: [$0],`);
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

export default getTimelineOptions;