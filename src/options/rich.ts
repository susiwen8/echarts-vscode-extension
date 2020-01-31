/**
 * @file rich text
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';

const richOptionsName: string[] = [
    'color',
    'fontStyle',
    'fontWeight',
    'fontFamily',
    'fontSize',
    'align',
    'verticalAlign',
    'lineHeight',
    'backgroundColor',
    'borderColor',
    'borderWidth',
    'borderRadius',
    'padding',
    'shadowColor',
    'shadowBlur',
    'shadowOffsetX',
    'shadowOffsetY',
    'width',
    'height',
    'textBorderColor',
    'textBorderWidth',
    'textShadowColor',
    'textShadowBlur',
    'textShadowOffsetX',
    'textShadowOffsetY'
];

function getRichOptions(): Promise<CompletionItem[]> {
    return new Promise(resolve => {
        const richOptions = richOptionsName.map((item: string) => {
            let completionItem: CompletionItem;
            let insertText: SnippetString;

            switch (item) {
                case 'color':
                case 'borderColor':
                case 'shadowColor':
                case 'textBorderColor':
                case 'textShadowColor':
                    completionItem = new CompletionItem(item, CompletionItemKind.Color);
                    insertText = new SnippetString(`${item}: ` + '\'#$0\'');
                    break;

                case 'fontStyle':
                    completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                    insertText = new SnippetString(`${item}: ` + '\'${1|normal,bold,bolder,lighter}\',');
                    break;

                case 'align':
                    completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                    insertText = new SnippetString(`${item}: ` + '\'${1|left,center,right}\',');
                    break;

                case 'verticalAlign':
                    completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                    insertText = new SnippetString(`${item}: ` + '\'${1|top,middle,bottom}\',');
                    break;

                case 'backgroundColor':
                    completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                    insertText = new SnippetString(`${item}: ` + '\'${1|#,\'\',rgba(),{image: \'\'}}\',');
                    break;

                case 'borderRadius':
                case 'padding':
                    completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                    insertText = new SnippetString(`${item}: ` + '${1|5,[]|},');
                    break;

                case 'fontSize':
                case 'lineHeight':
                case 'borderWidth':
                case 'shadowBlur':
                case 'shadowOffsetX':
                case 'shadowOffsetY':
                case 'textBorderWidth':
                case 'textShadowBlur':
                case 'textShadowOffsetX':
                case 'textShadowOffsetY':
                    completionItem = new CompletionItem(item, CompletionItemKind.Value);
                    insertText = new SnippetString(`${item}: $0,`);
                    break;

                default:
                    completionItem = new CompletionItem(item, CompletionItemKind.Text);
                    insertText = new SnippetString(`${item}: '$0',`);
            }

            completionItem.insertText = insertText;
            return completionItem;
        });
        resolve(richOptions);
    });
}

export default getRichOptions;