/**
 * @file brush component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import {urls} from '../urls';
import {utils, Options} from '../utils';

const brushOptionsName: string[] = [
    'id',
    'toolbox',
    'brushLink',
    'seriesIndex',
    'geoIndex',
    'xAxisIndex',
    'yAxisIndex',
    'brushType',
    'brushMode',
    'transformable',
    'brushStyle',
    'throttleType',
    'throttleDelay',
    'removeOnClick',
    'inBrush',
    'outOfBrush',
    'z',
];

async function getBrushOptions(lang: string): Promise<CompletionItem[]> {
    const jsonData: Options|undefined = await utils.getData(urls[lang].BRUSH_URL);
    return brushOptionsName.map((item: string) => {
        let completionItem: CompletionItem;
        let insertText: SnippetString;

        switch (item) {
            case 'inBrush':
            case 'outBrush':
            case 'brushStyle':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: {$0\n},`);
                break;

            case 'toolbox':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: ['rect', 'polygon', 'keep', 'clear'],`);
                break;

            case 'brushLink':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: ` + '${1|[],\'all\',\'none\',null,undefined|}');
                break;
    
            case 'transformable':
            case 'showTitle':
            case 'removeOnClick':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false|},');
                break;

            case 'seriesIndex':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: ` + '\'${1|all,Array,number|}\',');
                break;

            case 'geoIndex':
            case 'xAxisIndex':
            case 'yAxisIndex':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: ` + '${1|\'all\',[],0,\'none\',null,undefined|},');
                break;

            case 'z':
            case 'throttleDelay':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: $0,`);
                break;

            case 'brushType':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|rect,polygon,lineX,lineY|}\',');
                break;

            case 'brushMode':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|single,multiple|}\',');
                break;

            case 'throttleType':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|fixRate,debounce|}\',');
                break;

            default:
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: \'$0\',`);
        }
    
        completionItem.insertText = insertText;
        completionItem.documentation = jsonData && jsonData[item];
        return completionItem;
    });
}

export default getBrushOptions;