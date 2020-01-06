/**
 * @file Series-Map component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import {urls} from '../urls';
import {utils, Options} from '../utils';

const seriesMapOptionsName: string[] = [
    'id',
    'name',
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
    'geoIndex',
    'mapValueCalculation',
    'showLegendSymbol',
    'seriesLayoutBy',
    'datasetIndex',
    'data',
    'markPoint',
    'markLine',
    'markArea',
    'silent',
    'tooltip'
];

async function getMapOptions(lang: string): Promise<CompletionItem[]> {
    const jsonData: Options|undefined = await utils.getData(urls[lang].SERIES_MAP_URL);
    return seriesMapOptionsName.map((item: string) => {
        let completionItem: CompletionItem;
        let insertText: SnippetString;

        switch (item) {
            case 'label':
            case 'itemStyle':
            case 'emphasis':
            case 'markPoint':
            case 'markLine':
            case 'markArea':
            case 'tooltip':
            case 'scaleLimit':
            case 'nameMap':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: {$0}`);
                break;

            case 'silent':
            case 'showLegendSymbol':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false|},');
                break;

            case 'roam':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false,\'scale\',\'move\'|},');
                break;

            case 'datasetIndex':
            case 'zlevel':
            case 'z':
            case 'geoIndex':
            case 'aspectScale':
            case 'zoom':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: $0`);
                break;

            case 'left':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: ` + '${1|80,\'auto\',\'left\',\'center\',\'right\',\'%\'|},');
                break;
            case 'top':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: ` + '${1|60,\'auto\',\'top\',\'middle\',\'bottom\',\'%\'|},');
                break;
            case 'right':
            case 'bottom':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: ` + '${1|20,\'auto\',\'%\'|},');
                break;

            case 'layoutSize':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: ` + '${1|20,\'\'|},');
                break;

            case 'seriesLayoutBy':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|column,row|}\',');
                break;

            case 'mapValueCalculation':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|sum,average,max,min|}\',');
                break;

            case 'data':
            case 'center':
            case 'boundingCoords':
            case 'layoutCenter':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: [$0],`);
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

export default getMapOptions;