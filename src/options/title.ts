import {
    CompletionItem,
    CompletionItemKind
} from 'vscode';
import {urls} from '../urls';
import {utils} from '../utils';

const titleOptionsName: Array<string> = [
    'id',
    'show',
    'text',
    'link',
    'target',
    'textStyle',
    'subtext',
    'sublink',
    'subtarget',
    'subtextStyle',
    'textAlign',
    'textVerticalAlign',
    'triggerEvent',
    'padding',
    'itemGap',
    'zlevel',
    'z',
    'left',
    'top',
    'right',
    'bottom',
    'backgroundColor',
    'borderColor',
    'borderWidth',
    'borderRadius',
    'shadowBlur',
    'shadowColor',
    'shadowOffsetX',
    'shadowOffsetY'
];

async function getTitleOptions(): Promise<Array<CompletionItem>> {
    const jsonData: any = await utils.getData(urls.TITLE_URL);
    return titleOptionsName.map(item => {
        let completionItem: CompletionItem;
        let insertText: string;

        switch (item) {
            case 'textStyle':
            case 'subtextStyle':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = '{\n}';
                break;
    
            case 'backgroundColor':
            case 'borderColor':
            case 'shadowColor':
                completionItem = new CompletionItem(item, CompletionItemKind.Color);
                insertText = '\'\'';
                break;
    
            case 'itemGap':
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
        completionItem.documentation = jsonData[item];
        return completionItem;
    });
}

const titleOptions = getTitleOptions();

export default titleOptions;