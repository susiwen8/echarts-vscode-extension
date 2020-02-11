/**
 * @file Graphic component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import { getData } from '../utils';
import { Options, Item } from '../type';

const graphicOptionsName: string[] = [
    'id',
    'elements'
];

async function getGraphicOptions(lang: string): Promise<Item> {
    const jsonData: Options | undefined = await getData({ lang, option: 'GRAPHIC_URL' });
    const item = graphicOptionsName.map((item: string) => {
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
        // completionItem.label = 'graphic';
        return completionItem;
    });

    return {
        id: 'graphic',
        item
    };
}

export default getGraphicOptions;