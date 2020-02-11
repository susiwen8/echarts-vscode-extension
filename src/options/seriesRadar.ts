/**
 * @file Series-Radar component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import { getData } from '../utils';
import { Options, Item } from '../type';

const seriesRadarOptionsName: string[] = [
    'id',
    'name',
    'radarIndex',
    'symbol',
    'symbolSize',
    'symbolRotate',
    'symbolKeepAspect',
    'symbolOffset',
    'label',
    'itemStyle',
    'lineStyle',
    'areaStyle',
    'emphasis',
    'data',
    'zlevel',
    'z',
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

async function getRadarOptions(lang: string): Promise<Item> {
    const jsonData: Options | undefined = await getData({ lang, option: 'SERIES_RADAR_URL' });
    const item = seriesRadarOptionsName.map((item: string) => {
        let completionItem: CompletionItem;
        let insertText: SnippetString;

        switch (item) {
            case 'label':
            case 'itemStyle':
            case 'lineStyle':
            case 'areaStyle':
            case 'emphasis':
            case 'tooltip':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: {$0}`);
                break;

            case 'silent':
            case 'animation':
            case 'symbolKeepAspect':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false|},');
                break;

            case 'zlevel':
            case 'z':
            case 'animationThreshold':
            case 'radarIndex':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: $0`);
                break;

            case 'animationDelay':
            case 'animationDurationUpdate':
            case 'animationDelayUpdate':
            case 'animationDuration':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|1,function (idx) {}|},');
                break;

            case 'symbol':
            case 'symbolRotate':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '\'${1|circle,rect,roundRect,triangle,diamond,pin,arrow,none,image://|}\',');
                break;

            case 'symbolSize':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|4,[],function (value, params) {}|},');
                break;

            case 'data':
            case 'symbolOffset':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: [$0],`);
                break;

            default:
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: '$0',`);
        }

        completionItem.insertText = insertText;
        completionItem.documentation = jsonData && jsonData[item];
        // completionItem.label = 'seriesRadar';
        return completionItem;
    });

    return {
        id: 'typeradar',
        item
    };
}

export default getRadarOptions;