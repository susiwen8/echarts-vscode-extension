/**
 * Grid component
 */

import {
    CompletionItem,
    CompletionItemKind
} from 'vscode';
import { getData } from '../utils';
import { Options, Item } from '../type';

const gridOptionsName: string[] = [
    'id',
    'show',
    'zlevel',
    'z',
    'left',
    'top',
    'right',
    'bottom',
    'width',
    'height',
    'containLabel',
    'backgroundColor',
    'borderColor',
    'borderWidth',
    'shadowBlur',
    'shadowColor',
    'shadowOffsetX',
    'shadowOffsetY',
    'tooltip'
];

async function getGridOptions(lang: string): Promise<Item> {
    const jsonData: Options | undefined = await getData({ lang, option: 'GRID_URL' });
    const item = gridOptionsName.map(item => {
        let completionItem: CompletionItem;
        let insertText: string;

        switch (item) {
            case 'toopTip':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = '{\n}';
                break;

            case 'backgroundColor':
            case 'borderColor':
            case 'shadowColor':
                completionItem = new CompletionItem(item, CompletionItemKind.Color);
                insertText = '\'\'';
                break;

            case 'zlevel':
            case 'z':
            case 'borderWidth':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = '';
                break;

            default:
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = '\'\'';
        }

        completionItem.insertText = `${item}: ${insertText},`;
        completionItem.documentation = jsonData && jsonData[item];
        // completionItem.label = 'grid';
        return completionItem;
    });

    return {
        id: 'grid',
        item
    };
}

export default getGridOptions;