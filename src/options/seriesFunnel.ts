/**
 * @file Series-Funnel component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import {urls} from '../urls';
import {utils, Options} from '../utils';

const seriesFunnelOptionsName: string[] = [
    'id',
    'name',
    'min',
    'max',
    'minSize',
    'maxSize',
    'sort',
    'gap',
    'legendHoverLink',
    'funnelAlign',
    'label',
    'labelLine',
    'itemStyle',
    'emphasis',
    'zlevel',
    'z',
    'left',
    'top',
    'right',
    'bottom',
    'width',
    'height',
    'seriesLayoutBy',
    'datasetIndex',
    'dimensions',
    'encode',
    'data',
    'markPoint',
    'markLine',
    'markArea',
    'silent',
    'animation',
    'animationThreshold',
    'animationDuration',
    'animationEasing',
    'animationDelay',
    'animationDurationUpdate',
    'animationEasingUpdate',
    'animationDelayUpdate',
    'tooltip'
];

async function getFunnelOptions(lang: string): Promise<CompletionItem[]> {
    const jsonData: Options|undefined = await utils.getData(urls[lang].SERIES_FUNNEL_URL);
    return seriesFunnelOptionsName.map((item: string) => {
        let completionItem: CompletionItem;
        let insertText: SnippetString;

        switch (item) {
            case 'label':
            case 'labelLine':
            case 'itemStyle':
            case 'emphasis':
            case 'tooltip':
            case 'encode':
            case 'markPoint':
            case 'markLine':
            case 'markArea':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: {$0}`);
                break;

            case 'legendHoverLink':
            case 'silent':
            case 'animation':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false|},');
                break;

            case 'sort':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '${1|\'descending\',\'ascending\',\'none\',function (idx) {}|},');
                break;

            case 'zlevel':
            case 'z':
            case 'animationThreshold':
            case 'min':
            case 'max':
            case 'gap':
            case 'datasetIndex':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: $0`);
                break;

            case 'seriesLayoutBy':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|column,row|}\',');
                break;

            case 'animationDelay':
            case 'animationDurationUpdate':
            case 'animationDelayUpdate':
            case 'animationDuration':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|1,function (idx) {}|},');
                break;

            case 'left':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: ` + '${1|80,\'left\',\'center\',\'right\',\'%\'|},');
                break;
            case 'top':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: ` + '${1|60,\'top\',\'middle\',\'bottom\',\'%\'|},');
                break;
            case 'right':
            case 'bottom':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: ` + '${1|20,\'auto\',\'%\'|},');
                break;

            case 'width':
            case 'height':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}:` + '${1|\'auto\',10|},');
                break;

            case 'minSize':
            case 'maxSize':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}:` + '${1|\'\',10|},');
                break;

            case 'data':
            case 'dimensions':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: [$0],`);
                break;

            case 'funnelAlign':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: ` + '\'${1|center,left,right|}\',');
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

export default getFunnelOptions;