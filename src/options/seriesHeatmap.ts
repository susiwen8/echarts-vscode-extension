/**
 * @file Series-Heatmap component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import {urls} from '../urls';
import {getData, Options} from '../utils';

const seriesHeatmapOptionsName: string[] = [
    'id',
    'name',
    'coordinateSystem',
    'xAxisIndex',
    'yAxisIndex',
    'geoIndex',
    'calendarIndex',
    'pointSize',
    'blurSize',
    'minOpacity',
    'maxOpacity',
    'progressive',
    'progressiveThreshold',
    'label',
    'itemStyle',
    'emphasis',
    'data',
    'markPoint',
    'markLine',
    'markArea',
    'zlevel',
    'z',
    'silent',
    'tooltip'
];

async function getHeatmapOptions(lang: string): Promise<CompletionItem[]> {
    const jsonData: Options|undefined = await getData(urls[lang].SERIES_HEATMAP_URL);
    return seriesHeatmapOptionsName.map((item: string) => {
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
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: {$0}`);
                break;

            case 'silent':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false|},');
                break;

            case 'pointSize':
            case 'progressive':
            case 'progressiveThreshold':
            case 'zlevel':
            case 'z':
            case 'xAxisIndex':
            case 'yAxisIndex':
            case 'geoIndex':
            case 'calendarIndex':
            case 'blurSize':
            case 'minOpacity':
            case 'maxOpacity':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: $0`);
                break;

            case 'data':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: [$0],`);
                break;

            case 'coordinateSystem':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: ` + '\'${1|cartesian2d,geo|}\',');
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

export default getHeatmapOptions;