/**
 * @file toolbox component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import { getData } from '../utils';
import { Options, Item, Params } from '../type';

const toolboxOptionsName: string[] = [
    'id',
    'show',
    'orient',
    'itemSize',
    'itemGap',
    'showTitle',
    'feature',
    'iconStyle',
    'emphasis',
    'zlevel',
    'z',
    'left',
    'top',
    'right',
    'bottom',
    'width',
    'height',
    'tooltip'
];

async function getToolboxOptions({ lang, optionsName }: Params): Promise<Item> {
    const jsonData: Options | undefined = await getData({ lang, option: 'TOOLBOX_URL' });
    const item = optionsName.map((item: string) => {
        let completionItem: CompletionItem;
        let insertText: SnippetString;

        switch (item) {
            case 'feature':
            case 'iconStyle':
            case 'emphasis':
            case 'tooltip':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: {$0\n},`);
                break;

            case 'show':
            case 'showTitle':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false|},');
                break;

            case 'left':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: ` + '${1|\'auto\',\'left\',\'center\',\'right\',20,\'%\'|},');
                break;
            case 'top':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: ` + '${1|\'auto\',\'top\',\'middle\',\'bottom\',20,\'%\'|},');
                break;
            case 'right':
            case 'bottom':
            case 'width':
            case 'height':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: ` + '${1|\'auto\',20,\'%\'|},');
                break;

            case 'itemSize':
            case 'itemGap':
            case 'zlevel':
            case 'z':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: $0,`);
                break;

            case 'orient':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|horizontal,vertical|}\',');
                break;

            default:
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: '$0',`);
        }

        completionItem.insertText = insertText;
        completionItem.documentation = jsonData && jsonData[item];
        // completionItem.label = 'toolbox';
        return completionItem;
    });

    return {
        id: 'toolbox',
        item
    };
}

export default getToolboxOptions;