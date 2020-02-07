/**
 * @file Radar component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import { getData } from '../utils';
import { Options } from '../type';

const radarOptionsName: string[] = [
    'id',
    'zlevel',
    'z',
    'center',
    'radius',
    'startAngle',
    'name',
    'nameGap',
    'splitNumber',
    'shape',
    'scale',
    'silent',
    'triggerEvent',
    'axisLine',
    'axisTick',
    'axisLabel',
    'splitLine',
    'splitArea',
    'indicator'
];

async function getRadarOptions(lang: string): Promise<CompletionItem[]> {
    const jsonData: Options | undefined = await getData({ lang, option: 'RADAR_URL' });
    return radarOptionsName.map((item: string) => {
        let completionItem: CompletionItem;
        let insertText: SnippetString;

        switch (item) {
            case 'axisLine':
            case 'axisTick':
            case 'axisLabel':
            case 'splitLine':
            case 'splitArea':
            case 'name':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: {$0\n},`);
                break;

            case 'indicator':
                completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                insertText = new SnippetString(`${item}: [$0\n],`);
                break;

            case 'center':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: [ $0, ],`);
                break;

            case 'radius':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: ,` + '${1|\'75%\',5,[ , ]|},');
                break;

            case 'scale':
            case 'silent':
            case 'triggerEvent':
                completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                insertText = new SnippetString(`${item}: ` + '${1|true,false|},');
                break;

            case 'nameGap':
            case 'zlevel':
            case 'z':
            case 'startAngle':
            case 'splitNumber':
                completionItem = new CompletionItem(item, CompletionItemKind.Value);
                insertText = new SnippetString(`${item}: $0,`);
                break;

            case 'shape':
                completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                insertText = new SnippetString(`${item}: ` + '\'${1|polygon,circle|}\',');
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

export default getRadarOptions;