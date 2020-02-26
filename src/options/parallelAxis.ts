/**
 * @file parallelAxis component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import { getData } from '../utils';
import { Options, Item, Params } from '../type';

const parallelAxisOptionsName: string[] = [
    'id',
    'dim',
    'parallelIndex',
    'realtime',
    'areaSelectStyle',
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
    'data'
];

async function getParallelAxisOptions({ lang, optionsName }: Params): Promise<Item> {
    const jsonData: Options | undefined = await getData({ lang, option: 'PARALLELAXIS_URL' });
    const item = optionsName.map((item: string) => {
        let completionItem: CompletionItem;
        let insertText: SnippetString;

        switch (item) {
            case 'nameTextStyle':
            case 'axisLine':
            case 'axisTick':
            case 'minorTick':
            case 'axisLabel':
            case 'areaSelectStyle':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: {$0\n},`);
                break;

            case 'realtime':
            case 'inverse':
            case 'silent':
            case 'scale':
            case 'triggerEvent':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false|},');
                break;

            case 'type':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '\'${1|value,category,time,log|}\',');
                break;

            case 'nameLocation':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: ` + '\'${1|start,middle,center,end|}\',');
                break;

            case 'boundaryGap':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false,[]|},');
                break;

            case 'data':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: [$0]`);
                break;

            case 'dim':
            case 'parallelIndex':
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

            default:
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: '$0',`);
        }

        completionItem.insertText = insertText;
        completionItem.documentation = jsonData && jsonData[item];
        // completionItem.label = 'parallelAxis';
        return completionItem;
    });

    return {
        id: 'parallelAxis',
        item
    };
}

export default getParallelAxisOptions;