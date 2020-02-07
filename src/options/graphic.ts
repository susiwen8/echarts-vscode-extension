/**
 * @file Graphic component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import {getData} from '../utils';
import {Options} from '../type';

const graphicOptionsName: string[] = [
    'id',
    'elements'
];

async function getGraphicOptions(lang: string): Promise<CompletionItem[]> {
    const jsonData: Options|undefined = await getData({lang, option: 'GRAPHIC_URL'});
    return graphicOptionsName.map((item: string) => {
        let completionItem: CompletionItem;
        let insertText: SnippetString;

        switch (item) {
            case 'elements':
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

export default getGraphicOptions;