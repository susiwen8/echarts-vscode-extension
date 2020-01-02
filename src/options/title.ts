import {
    CompletionItem,
    CompletionItemKind
} from 'vscode';
import axios from 'axios'


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

async function getData(): Promise<any> {
    try {
        const res = await axios.get('https://echarts.apache.org/zh/documents/option-parts/option.title.json?');
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

async function getTitleOptions(): Promise<Array<CompletionItem>> {
    const jsonData: any = await getData();
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