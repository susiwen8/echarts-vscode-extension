/**
 * @file Series-PictorialBar component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import {getData} from '../utils';
import {Options} from '../type';

const seriesPictorialBarOptionsName: string[] = [
    'id',
    'name',
    'legendHoverLink',
    'coordinateSystem',
    'xAxisIndex',
    'yAxisIndex',
    'cursor',
    'label',
    'itemStyle',
    'emphasis',
    'barWidth',
    'barMaxWidth',
    'barMinWidth',
    'barMinHeight',
    'barGap',
    'barCategoryGap',
    'symbol',
    'symbolSize',
    'symbolPosition',
    'symbolOffset',
    'symbolRotate',
    'symbolRepeat',
    'symbolRepeatDirection',
    'symbolMargin',
    'symbolClip',
    'symbolBoundingData',
    'symbolPatternSize',
    'hoverAnimation',
    'dimensions',
    'encode',
    'data',
    'markPoint',
    'markLine',
    'markArea',
    'zlevel',
    'z',
    'silent',
    'animation',
    'animationThreshold',
    'animationDuration',
    'animationEasing',
    'animationDurationUpdate',
    'animationEasingUpdate',
    'tooltip'
];

async function getPictorialBarOptions(lang: string): Promise<CompletionItem[]> {
    const jsonData: Options|undefined = await getData({lang, option: 'SERIES_PICTORIALBAR_URL'});
    return seriesPictorialBarOptionsName.map((item: string) => {
        let completionItem: CompletionItem;
        let insertText: SnippetString;

        switch (item) {
            case 'label':
            case 'itemStyle':
            case 'emphasis':
            case 'encode':
            case 'markPoint':
            case 'markLine':
            case 'markArea':
            case 'tooltip':
            case 'hoverAnimation':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: {$0}`);
                break;

            case 'legendHoverLink':
            case 'silent':
            case 'animation':
            case 'symbolClip':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false|},');
                break;

            case 'barWidth':
            case 'barMaxWidth':
            case 'barMinWidth':
            case 'symbolMargin':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: ` + '${1|5,\'\'|},');
                break;

            case 'symbolRepeat':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: ` + '${1|5,\'fixed\',true,false,null,undefined|},');
                break;

            case 'barMinHeight':
            case 'zlevel':
            case 'z':
            case 'animationThreshold':
            case 'symbolRotate':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: $0`);
                break;

            case 'symbolPosition':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|start,end,center|}\',');
                break;

            case 'symbolRepeatDirection':
                completionItem = new CompletionItem(item, CompletionItemKind.Text);
                insertText = new SnippetString(`${item}: ` + '\'${1|start,end|}\',');
                break;

            case 'symbol':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '\'${1|circle,rect,roundRect,triangle,diamond,pin,arrow,none,image://|}\',');
                break;

            case 'symbolSize':
            case 'symbolBoundingData':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|10,[ , ]|},');
                break;

            case 'animationDurationUpdate':
            case 'animationDuration':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|1,function (idx) {}|},');
                break;

            case 'xAxisIndex':
            case 'yAxisIndex':
            case 'symbolPatternSize':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: $0,`);
                break;

            case 'dimensions':
            case 'data':
            case 'symbolOffset':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: [$0],`);
                break;

            case 'coordinateSystem':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: 'cartesian2d',`);
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

export default getPictorialBarOptions;