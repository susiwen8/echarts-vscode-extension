/**
 * @file yAxis component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import { getData } from '../utils';
import { Options } from '../type';

const yAxisOptionsName: string[] = [
    'id',
    'show',
    'gridIndex',
    'position',
    'offset',
    'type',
    'name',
    'nameLocation',
    'nameTextStyle',
    'nameGap',
    'nameRotate',
    'inverse',
    'boundaryGap',
    'min',
    'max',
    'scale',
    'splitNumber',
    'minInterval',
    'maxInterval',
    'interval',
    'logBase',
    'silent',
    'triggerEvent',
    'axisLine',
    'axisTick',
    'minorTick',
    'axisLabel',
    'splitLine',
    'minorSplitLine',
    'splitArea',
    'data',
    'axisPointer',
    'zlevel',
    'z'
];

async function getyAxisOptions(lang: string): Promise<CompletionItem[]> {
    const jsonData: Options | undefined = await getData({ lang, option: 'YAXIS_URL' });
    return yAxisOptionsName.map((item: string) => {
        let completionItem: CompletionItem;
        let insertText: SnippetString;

        switch (item) {
            case 'nameTextStyle':
            case 'axisLine':
            case 'axisTick':
            case 'minorTick':
            case 'axisLabel':
            case 'splitLine':
            case 'minorSplitLine':
            case 'splitArea':
            case 'axisPointer':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: {$0\n},`);
                break;

            case 'nameLocation':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: ` + '\'${1|start,middle,center,end|}\',');
                break;

            case 'boundaryGap':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false,[]|},');
                break;

            case 'min':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|1,\'dataMin\',function (value) {}|},');
                break;
            case 'max':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|1,\'dataMax\',function (value) {}|},');
                break;

            case 'itemGap':
            case 'zlevel':
            case 'z':
            case 'borderWidth':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: $0,`);
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

export default getyAxisOptions;