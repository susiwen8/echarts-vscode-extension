/**
 * @file SingleAxis component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import {getData} from '../utils';
import {Options} from '../type';

const singleAxisOptionsName: string[] = [
    'id',
    'zlevel',
    'z',
    'left',
    'right',
    'top',
    'bottom',
    'width',
    'height',
    'orient',
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
    'tooltip'
];

async function getSingleAxisOptions(lang: string): Promise<CompletionItem[]> {
    const jsonData: Options|undefined = await getData({lang, option: 'SINGLEAXIS_URL'});
    return singleAxisOptionsName.map((item: string) => {
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
            case 'tooltip':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: {$0\n},`);
                break;

            case 'data':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: [$0]`);
                break;

            case 'inverse':
            case 'silent':
            case 'scale':
            case 'triggerEvent':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false|},');
                break;

            case 'nameLocation':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: ` + '\'${1|start,middle,center,end|}\',');
                break;

            case 'boundaryGap':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false,[]|},');
                break;

            case 'left':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: ` + '${1|20,\'left\',\'center\',\'right\',\'%\'|},');
                break;
            case 'top':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: ` + '${1|20,\'top\',\'middle\',\'bottom\',\'%\'|},');
                break;
            case 'right':
            case 'bottom':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: ` + '${1|20,\'%\'|},');
                break;

            case 'orient':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|horizontal,vertical|}\',');
                break;

            case 'type':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: ` + '\'${1|value,category,time,log|}\',');
                break;

            case 'width':
            case 'height':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}:` + '${1|\'auto\',10|},');
                break;

            case 'zlevel':
            case 'z':
            case 'nameGap':
            case 'nameRotate':
            case 'splitNumber':
            case 'minInterval':
            case 'maxInterval':
            case 'interval':
            case 'logBase':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: $0,`);
                break;

            case 'min':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|1,\'dataMin\',function (value) {}|},');
                break;
            case 'max':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|1,\'dataMax\',function (value) {}|},');
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

export default getSingleAxisOptions;