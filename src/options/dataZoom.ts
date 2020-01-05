/**
 * @file DataZoom component
 */

import {
    CompletionItem,
    CompletionItemKind,
    SnippetString
} from 'vscode';
import {urls} from '../urls';
import {utils, Options, DataZoomType} from '../utils';

const dataZoomOptionsName: string[] = [
    'type',
    'id',
    'disabled',
    'xAxisIndex',
    'yAxisIndex',
    'radiusAxisIndex',
    'angleAxisIndex',
    'filterMode',
    'start',
    'end',
    'startValue',
    'endValue',
    'minSpan',
    'maxSpan',
    'minValueSpan',
    'maxValueSpan',
    'orient',
    'zoomLock',
    'throttle',
    'rangeMode',
    'zoomOnMouseWheel',
    'moveOnMouseMove',
    'moveOnMouseWheel',
    'preventDefaultMouseMove',
    'show',
    'backgroundColor',
    'dataBackground',
    'fillerColor',
    'borderColor',
    'handleIcon',
    'handleSize',
    'handleStyle',
    'labelPrecision',
    'labelFormatter',
    'showDetail',
    'showDataShadow',
    'realtime',
    'textStyle',
    'zlevel',
    'z',
    'left',
    'right',
    'top',
    'bottom'
];

async function getDataZoomOptions(lang: string, type: string): Promise<CompletionItem[]> {
    let url: string = type === DataZoomType.Inside
        ? urls[lang].DATAZOOM_INSIDE_URL
        : urls[lang].DATAZOOM_SLIDER_URL;

    const jsonData: Options|undefined = await utils.getData(url);
    return dataZoomOptionsName.map((item: string) => {
        let completionItem: CompletionItem;
        let insertText: SnippetString;

        if (type === DataZoomType.Inside) {
            switch (item) {
                case 'disabled':
                case 'zoomLock':
                case 'preventDefaultMouseMove':
                    completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                    insertText = new SnippetString(`${item}: ` + '${1|true,false|},');
                    break;
    
                case 'xAxisIndex':
                case 'yAxisIndex':
                case 'radiusAxisIndex':
                case 'angleAxisIndex':
                    completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                    insertText = new SnippetString(`${item}: ` + '${1|5,[]|},');
                    break;

                case 'filterMode':
                    completionItem = new CompletionItem(item, CompletionItemKind.Text);
                    insertText = new SnippetString(`${item}: ` + '\'${1|filter,weakFilter,empty,none|}\',');
                    break;

                // TODO: Date
                case 'startValue':
                case 'endValue':
                case 'minValueSpan':
                case 'maxValueSpan':
                    completionItem = new CompletionItem(item, CompletionItemKind.Text);
                    insertText = new SnippetString(`${item}: ` + '\'${1|0, \'\', Date|}\',');
                    break;

                case 'orient':
                    completionItem = new CompletionItem(item, CompletionItemKind.Text);
                    insertText = new SnippetString(`${item}: ` + '\'${1|horizontal,vertical|}\',');
                    break;
        
                case 'start':
                case 'end':
                case 'minSpan':
                case 'maxSpan':
                case 'throttle':
                    completionItem = new CompletionItem(item, CompletionItemKind.Value);
                    insertText = new SnippetString(`${item}: $0,`);
                    break;

                case 'rangeMode':
                    completionItem = new CompletionItem(item, CompletionItemKind.Value);
                    insertText = new SnippetString(`${item}: [$0],`);
                    break;
        
                default:
                    completionItem = new CompletionItem(item, CompletionItemKind.Text);
                    insertText = new SnippetString(`${item}: \'$0\',`);
            }

        } else {
            switch (item) {
                case 'textStyle':
                case 'dataBackground':
                case 'handleStyle':
                    completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                    completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                    insertText = new SnippetString(`${item}: {$0\n},`);
                    break;

                case 'start':
                case 'end':
                case 'minSpan':
                case 'maxSpan':
                case 'throttle':
                    completionItem = new CompletionItem(item, CompletionItemKind.Value);
                    insertText = new SnippetString(`${item}: $0,`);
                    break;

                case 'rangeMode':
                    completionItem = new CompletionItem(item, CompletionItemKind.Value);
                    insertText = new SnippetString(`${item}: [$0],`);
                    break;

                case 'startValue':
                case 'endValue':
                case 'minValueSpan':
                case 'maxValueSpan':
                    completionItem = new CompletionItem(item, CompletionItemKind.Text);
                    insertText = new SnippetString(`${item}: ` + '\'${1|0, \'\', Date|}\',');
                    break;

                case 'zlevel':
                case 'z':
                    completionItem = new CompletionItem(item, CompletionItemKind.Value);
                    insertText = new SnippetString(`${item}: $0,`);
                    break;

                case 'filterMode':
                    completionItem = new CompletionItem(item, CompletionItemKind.Text);
                    insertText = new SnippetString(`${item}: ` + '\'${1|filter,weakFilter,empty,none|}\',');
                    break;

                case 'orient':
                    completionItem = new CompletionItem(item, CompletionItemKind.Text);
                    insertText = new SnippetString(`${item}: ` + '\'${1|horizontal,vertical|}\',');
                    break;

                case 'text':
                    completionItem = new CompletionItem(item, CompletionItemKind.Value);
                    insertText = new SnippetString(`${item}: [$0],`);
                    break;
        
                // TODO: open color picker
                case 'backgroundColor':
                case 'fillerColor':
                case 'borderColor':
                    completionItem = new CompletionItem(item, CompletionItemKind.Color);
                    insertText = new SnippetString(`${item}: ` + '\'${1|#,rgba(),rgb()|}\',');
                    break;
    
                case 'show':
                case 'showDetail':
                case 'realtime':
                case 'zoomLock':
                    completionItem = new CompletionItem(item, CompletionItemKind.EnumMember);
                    insertText = new SnippetString(`${item}: ` + '${1|true,false|},');
                    break;

                case 'xAxisIndex':
                case 'yAxisIndex':
                case 'radiusAxisIndex':
                case 'angleAxisIndex':
                    completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                    insertText = new SnippetString(`${item}: ` + '${1|5,[]|},');
                    break;

                case 'labelPrecision':
                    completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                    insertText = new SnippetString(`${item}: ` + '${1|5,\'auto\'|},');
                    break;

                case 'showDataShadow':
                    completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                    insertText = new SnippetString(`${item}: ` + '${1|true,fasle,\'auto\'|},');
                    break;

                case 'labelFormatter':
                    completionItem = new CompletionItem(item, CompletionItemKind.Enum);
                    insertText = new SnippetString(`${item}: ` + '${1|\'\',function (name) {}|},');
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

                case 'handleSize':
                    completionItem = new CompletionItem(item, CompletionItemKind.Struct);
                    insertText = new SnippetString(`${item}: ` + '${1|100,\'100%\'|},');
                    break;
        
                case 'handleIcon':
                    completionItem = new CompletionItem(item, CompletionItemKind.Text);
                    insertText = new SnippetString(`${item}: \'image://$0\',`);
                    break;
        
                default:
                    completionItem = new CompletionItem(item, CompletionItemKind.Text);
                    insertText = new SnippetString(`${item}: \'$0\',`);
            }
        }
    
        completionItem.insertText = insertText;
        completionItem.documentation = jsonData && jsonData[item];
        return completionItem;
    });
}

export default getDataZoomOptions;