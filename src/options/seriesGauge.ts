/**
 * @file Series-Gauge component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import {urls} from '../urls';
import {utils, Options} from '../utils';

const seriesGaugeOptionsName: string[] = [
    'id',
    'name',
    'radius',
    'startAngle',
    'endAngle',
    'clockwise',
    'data',
    'min',
    'max',
    'splitNumber',
    'axisLine',
    'splitLine',
    'axisTick',
    'axisLabel',
    'pointer',
    'itemStyle',
    'emphasis',
    'title',
    'detail',
    'markPoint',
    'markLine',
    'markArea',
    'silent',
    'animationType',
    'animationTypeUpdate',
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

async function getGaugeOptions(lang: string): Promise<CompletionItem[]> {
    const jsonData: Options|undefined = await utils.getData(urls[lang].SERIES_GAUGE_URL);
    return seriesGaugeOptionsName.map((item: string) => {
        let completionItem: CompletionItem;
        let insertText: SnippetString;

        switch (item) {
            case 'itemStyle':
            case 'emphasis':
            case 'markPoint':
            case 'markLine':
            case 'markArea':
            case 'tooltip':
            case 'axisLine':
            case 'splitLine':
            case 'axisTick':
            case 'axisLabel':
            case 'pointer':
            case 'title':
            case 'detail':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: {$0}`);
                break;

            case 'silent':
            case 'animation':
            case 'clockwise':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false|},');
                break;

            case 'selectedMode':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false,\'single\',\'multiple\'|},');
                break;

            case 'roseType':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false,\'radius\',\'area\'|},');
                break;

            case 'startAngle':
            case 'endAngle':
            case 'animationThreshold':
            case 'min':
            case 'max':
            case 'splitNumber':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: $0`);
                break;

            case 'seriesLayoutBy':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|column,row|}\',');
                break;

            case 'animationType':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|expansion,scale|}\',');
                break;

            case 'animationTypeUpdate':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|transition,expansion|}\',');
                break;

            case 'radius':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '${1|10,\'%\'|},');
                break;

            case 'animationDelay':
            case 'animationDurationUpdate':
            case 'animationDelayUpdate':
            case 'animationDuration':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|1,function (idx) {}|},');
                break;

            case 'data':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: [$0],`);
                break;

            case 'center':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: [$0, ],`);
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

export default getGaugeOptions;