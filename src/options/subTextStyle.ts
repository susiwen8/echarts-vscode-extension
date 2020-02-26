/**
 * @file SubTextStyle component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import { getData } from '../utils';
import { Options, Item, Params } from '../type';

const textStyleOptionsName: string[] = [
    'color',
    'fontStyle',
    'fontWeight',
    'fontFamily',
    'fontSize',
    'align',
    'verticalAlign',
    'lineHeight',
    'width',
    'height',
    'textBorderColor',
    'textBorderWidth',
    'textShadowColor',
    'textShadowBlur',
    'textShadowOffsetX',
    'textShadowOffsetY'
];

async function getTextStyleOptions({ lang, optionsName }: Params): Promise<Item> {
    const jsonData: Options | undefined = await getData({ lang, option: 'TEXTSTYLE_URL' });
    const item = optionsName.map((item: string) => {
        let completionItem: CompletionItem;
        let insertText: SnippetString;

        switch (item) {
            case 'color':
            case 'textBorderColor':
            case 'textShadowColor':
                completionItem = new CompletionItem(item, CompletionItemKind.Color);
                insertText = new SnippetString(`${item}: ` + '\'${1|#,rgba(),rgb()|}\',');
                break;

            case 'fontStyle':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: ` + '\'${1|normal,italic,oblique|}\',');
                break;

            case 'fontWeight':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: ` + '${1|\'normal\',\'bold\',\'bolder\',\'lighter\',900|},');
                break;

            case 'align':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: ` + '\'${1|left,center,right|}\',');
                break;

            case 'verticalAlign':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: ` + '\'${1|top,middle,bottom|}\',');
                break;

            case 'fontSize':
            case 'lineHeight':
            case 'textBorderWidth':
            case 'textShadowBlur':
            case 'textShadowOffsetX':
            case 'textShadowOffsetY':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: $0`);
                break;

            case 'width':
            case 'height':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: ` + '${1|10,\'\'|},');
                break;

            default:
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: '$0',`);
        }

        completionItem.insertText = insertText;
        completionItem.documentation = jsonData && jsonData[item];
        // completionItem.label = 'textStyle';
        return completionItem;
    });

    return {
        id: 'subTextStyle',
        item
    };
}

export default getTextStyleOptions;