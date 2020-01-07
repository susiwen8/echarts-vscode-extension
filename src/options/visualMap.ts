/**
 * @file VisualMap component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import {urls} from '../urls';
import {getData, Options, VisualMapType} from '../utils';

const visualMapOptionsName: string[] = [
    'type',
    'id',
    'min',
    'max',
    'range',
    'calculable',
    'realtime',
    'inverse',
    'precision',
    'itemWidth',
    'itemHeight',
    'align',
    'text',
    'textGap',
    'show',
    'dimension',
    'seriesIndex',
    'hoverLink',
    'inRange',
    'outOfRange',
    'controller',
    'zlevel',
    'z',
    'left',
    'top',
    'right',
    'bottom',
    'orient',
    'padding',
    'backgroundColor',
    'borderColor',
    'borderWidth',
    'color',
    'textStyle',
    'formatter',
    'splitNumber',
    'pieces',
    'categories',
    'minOpen',
    'maxOpen',
    'selectedMode',
    'showLabel',
    'itemGap',
    'itemSymbol'
];

async function getVisualMapOptions(lang: string, type: string): Promise<CompletionItem[]> {
    const url: string = type === VisualMapType.Piecewise
        ? urls[lang].VISUALMAP_PIECEWISE_URL
        : urls[lang].VISUALMAP_CONTINUOUS_URL;

    const jsonData: Options|undefined = await getData(url);
    return visualMapOptionsName.map((item: string) => {
        let completionItem: CompletionItem;
        let insertText: SnippetString;

        if (type === VisualMapType.Piecewise) {
            switch (item) {
                case 'textStyle':
                case 'inRange':
                case 'outOfRange':
                case 'controller':
                    completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                    insertText = new SnippetString(`${item}: {$0\n},`);
                    break;

                // TODO: open color picker
                case 'backgroundColor':
                case 'borderColor':
                case 'color':
                    completionItem = new CompletionItem(item, CompletionItemKind.Color);
                    insertText = new SnippetString(`${item}: ` + '\'${1|#,rgba(),rgb()|}\',');
                    break;

                case 'minOpen':
                case 'maxOpen':
                case 'inverse':
                case 'showLabel':
                case 'show':
                case 'hoverLink':
                    completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                    insertText = new SnippetString(`${item}: ` + '${1|true,false|},');
                    break;

                case 'seriesIndex':
                case 'padding':
                    completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                    insertText = new SnippetString(`${item}: ` + '${1|5,[]|},');
                    break;

                case 'left':
                    completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                    insertText = new SnippetString(`${item}: ` + '${1|\'auto\',\'left\',\'center\',\'right\',20,\'%\'|},');
                    break;
                case 'top':
                    completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                    insertText = new SnippetString(`${item}: ` + '${1|\'auto\',\'top\',\'middle\',\'bottom\',20,\'%\'|},');
                    break;
                case 'right':
                case 'bottom':
                    completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                    insertText = new SnippetString(`${item}: ` + '${1|\'auto\',20,\'%\'|},');
                    break;

                case 'orient':
                    completionItem = new CompletionItem(item, CompletionItemKind.Text);
                    insertText = new SnippetString(`${item}: ` + '\'${1|horizontal,vertical|}\',');
                    break;

                case 'splitNumber':
                case 'min':
                case 'max':
                case 'precision':
                case 'itemWidth':
                case 'itemHeight':
                case 'textGap':
                case 'itemGap':
                case 'dimension':
                case 'zlevel':
                case 'z':
                case 'borderWidth':
                    completionItem = new CompletionItem(item, CompletionItemKind.Value);
                    insertText = new SnippetString(`${item}: $0,`);
                    break;

                case 'pieces':
                case 'categories':
                case 'text':
                    completionItem = new CompletionItem(item, CompletionItemKind.Value);
                    insertText = new SnippetString(`${item}: [$0],`);
                    break;

                case 'selectedMode':
                    completionItem = new CompletionItem(item, CompletionItemKind.Text);
                    insertText = new SnippetString(`${item}: ` + '\'${1|multiple,single|}\',');
                    break;

                case 'itemSymbol':
                    completionItem = new CompletionItem(item, CompletionItemKind.Text);
                    insertText = new SnippetString(`${item}: ` + '\'${1|circle,rect,roundRect,triangle,diamond,pin,arrow,none|}\',');
                    break;

                case 'align':
                    completionItem = new CompletionItem(item, CompletionItemKind.Text);
                    insertText = new SnippetString(`${item}: ` + '\'${1|auto,left,right|}\',');
                    break;

                case 'textAlign':
                    completionItem = new CompletionItem(item, CompletionItemKind.Text);
                    insertText = new SnippetString(`${item}: ` + '\'${1|auto,left,right,center|}\',');
                    break;

                case 'formatter':
                    completionItem = new CompletionItem(item, CompletionItemKind.Method);
                    insertText = new SnippetString(`${item}: ` + '${1|\'\',function (name) {}|},');
                    break;

                default:
                    completionItem = new CompletionItem(item, CompletionItemKind.Text);
                    insertText = new SnippetString(`${item}: '$0',`);
            }

        } else {
            switch (item) {
                case 'textStyle':
                case 'inRange':
                case 'outOfRange':
                case 'controller':
                    completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                    completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                    insertText = new SnippetString(`${item}: {$0\n},`);
                    break;

                case 'min':
                case 'max':
                case 'precision':
                case 'itemWidth':
                case 'itemHeight':
                case 'textGap':
                case 'dimension':
                case 'zlevel':
                case 'z':
                case 'borderWidth':
                    completionItem = new CompletionItem(item, CompletionItemKind.Value);
                    insertText = new SnippetString(`${item}: $0,`);
                    break;

                case 'orient':
                    completionItem = new CompletionItem(item, CompletionItemKind.Text);
                    insertText = new SnippetString(`${item}: ` + '\'${1|horizontal,vertical|}\',');
                    break;

                case 'range':
                case 'text':
                    completionItem = new CompletionItem(item, CompletionItemKind.Value);
                    insertText = new SnippetString(`${item}: [$0],`);
                    break;

                case 'align':
                    completionItem = new CompletionItem(item, CompletionItemKind.Text);
                    insertText = new SnippetString(`${item}: ` + '\'${1|auto,left,right|}\',');
                    break;

                // TODO: open color picker
                case 'backgroundColor':
                case 'borderColor':
                case 'color':
                    completionItem = new CompletionItem(item, CompletionItemKind.Color);
                    insertText = new SnippetString(`${item}: ` + '\'${1|#,rgba(),rgb()|}\',');
                    break;

                case 'show':
                case 'calculable':
                case 'realtime':
                case 'inverse':
                case 'hoverLink':
                    completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                    insertText = new SnippetString(`${item}: ` + '${1|true,false|},');
                    break;

                case 'padding':
                case 'seriesIndex':
                    completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                    insertText = new SnippetString(`${item}: ` + '${1|5,[]|},');
                    break;

                case 'left':
                    completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                    insertText = new SnippetString(`${item}: ` + '${1|\'auto\',\'left\',\'center\',\'right\',20,\'%\'|},');
                    break;
                case 'top':
                    completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                    insertText = new SnippetString(`${item}: ` + '${1|\'auto\',\'top\',\'middle\',\'bottom\',20,\'%\'|},');
                    break;
                case 'right':
                case 'bottom':
                    completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                    insertText = new SnippetString(`${item}: ` + '${1|\'auto\',20,\'%\'|},');
                    break;

                case 'textAlign':
                    completionItem = new CompletionItem(item, CompletionItemKind.Text);
                    insertText = new SnippetString(`${item}: ` + '\'${1|auto,left,right,center|}\',');
                    break;

                case 'formatter':
                    completionItem = new CompletionItem(item, CompletionItemKind.Method);
                    insertText = new SnippetString(`${item}: ` + '${1|\'\',function (name) {}|},');
                    break;

                default:
                    completionItem = new CompletionItem(item, CompletionItemKind.Text);
                    insertText = new SnippetString(`${item}: '$0',`);
            }
        }

        completionItem.insertText = insertText;
        completionItem.documentation = jsonData && jsonData[item];
        return completionItem;
    });
}

export default getVisualMapOptions;