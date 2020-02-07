/**
 * @file Geo component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import { getData } from '../utils';
import { Options } from '../type';

const geoOptionsName: string[] = [
    'id',
    'show',
    'map',
    'roam',
    'center',
    'aspectScale',
    'boundingCoords',
    'zoom',
    'scaleLimit',
    'nameMap',
    'label',
    'itemStyle',
    'emphasis',
    'zlevel',
    'z',
    'left',
    'top',
    'right',
    'bottom',
    'layoutCenter',
    'layoutSize',
    'regions',
    'silent'
];

async function getGeoOptions(lang: string): Promise<CompletionItem[]> {
    const jsonData: Options | undefined = await getData({ lang, option: 'GEO_URL' });
    return geoOptionsName.map((item: string) => {
        let completionItem: CompletionItem;
        let insertText: SnippetString;

        switch (item) {
            case 'nameMap':
            case 'scaleLimit':
            case 'label':
            case 'itemStyle':
            case 'emphasis':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: {$0\n},`);
                break;

            case 'show':
            case 'roam':
            case 'silent':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false|},');
                break;

            case 'center':
            case 'boundingCoords':
            case 'layoutCenter':
            case 'regions':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: [],`);
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
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: ` + '${1|\'auto\',20,\'%\'|},');
                break;

            case 'aspectScale':
            case 'zlevel':
            case 'z':
            case 'zoom':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: $0,`);
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

export default getGeoOptions;