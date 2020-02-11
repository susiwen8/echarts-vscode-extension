/**
 * @file Dataset component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import { getData } from '../utils';
import { Options, Item } from '../type';

const datasetOptionsName: string[] = [
    'id',
    'source',
    'dimensions',
    'sourceHeader'
];

async function getDatasetOptions(lang: string): Promise<Item> {
    const jsonData: Options | undefined = await getData({ lang, option: 'DATASET_URL' });
    const item = datasetOptionsName.map((item: string) => {
        let completionItem: CompletionItem;
        let insertText: SnippetString;

        switch (item) {
            case 'source':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: ` + '{$1|{},[]|},');
                break;

            case 'dimensions':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: [$0],`);
                break;

            case 'sourceHeader':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|false,true,null,undefined|}\',');
                break;

            default:
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: '$0',`);
        }

        completionItem.insertText = insertText;
        completionItem.documentation = jsonData && jsonData[item];
        // completionItem.label = 'dataset';
        return completionItem;
    });

    return {
        id: 'dataset',
        item
    };
}

export default getDatasetOptions;