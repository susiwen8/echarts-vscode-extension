/**
 * @file TextStyle component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import {urls} from '../urls';
import {getData, Options} from '../utils';

const textStyleOptionsName: string[] = [
    'color',
    'fontStyle',
    'fontWeight',
    'fontFamily',
    'fontSize',
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

async function getTextStyleOptions(lang: string): Promise<CompletionItem[]> {
    const jsonData: Options|undefined = await getData(urls[lang].TEXTSTYLE_URL);
    return textStyleOptionsName.map((item: string) => {
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
                insertText = new SnippetString(`${item}: ` + '\'{$1|normal,italic,oblique|}\',');
                break;

            case 'fontWeight':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: ` + '{$1|\'normal\',\'bold\',\'bolder\',\'lighter\', 900|},');
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
                insertText = new SnippetString(`${item}: ` + '{$1|10,\'\'|},');
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

export default getTextStyleOptions;