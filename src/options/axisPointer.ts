
/**
 * @file AxisPointer component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import { getData } from '../utils';
import { Options, Item } from '../type';

const axisPointerOptionsName: string[] = [
    'id',
    'show',
    'type',
    'snap',
    'z',
    'label',
    'lineStyle',
    'shadowStyle',
    'triggerTooltip',
    'value',
    'status',
    'handle',
    'link',
    'triggerOn'
];

async function getAxisPointerOptions(lang: string): Promise<Item> {
    const jsonData: Options | undefined = await getData({ lang, option: 'AXISPOINTER_URL' });
    const item = axisPointerOptionsName.map((item: string) => {
        let completionItem: CompletionItem;
        let insertText: SnippetString;

        switch (item) {
            case 'label':
            case 'lineStyle':
            case 'shadowStyle':
            case 'handle':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: {$0\n},`);
                break;

            case 'show':
            case 'triggerTooltip':
            case 'snap':
            case 'status':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false|},');
                break;


            case 'z':
            case 'value':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: $0,`);
                break;

            case 'type':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|line,shadow,none|}\',');
                break;

            case 'triggerOn':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|mousemove,click,none|}\',');
                break;

            case 'link':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '[$0],');
                break;


            default:
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: '$0',`);
        }

        completionItem.insertText = insertText;
        completionItem.documentation = jsonData && jsonData[item];
        // completionItem.label = 'axisPointer';
        return completionItem;
    });

    return {
        id: 'axisPointer',
        item
    };
}

export default getAxisPointerOptions;