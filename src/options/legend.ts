import {
    CompletionItem,
    CompletionItemKind
} from 'vscode';
import * as options from '../json/legend.json';

const jsonData = options as any;

const titleOptionsName: Array<string> = [
    'type',
    'id',
    'show',
    'zlevel',
    'z',
    'left',
    'top',
    'right',
    'bottom',
    'width',
    'height',
    'orient',
    'align',
    'padding',
    'itemGap',
    'itemWidth',
    'itemHeight',
    'symbolKeepAspect',
    'formatter',
    'selectedMode',
    'inactiveColor',
    'selected',
    'textStyle',
    'tooltip',
    'icon',
    'data',
    'backgroundColor',
    'borderColor',
    'borderWidth',
    'borderRadius',
    'shadowBlur',
    'shadowColor',
    'shadowOffsetX',
    'shadowOffsetY',
    'scrollDataIndex',
    'pageButtonItemGap',
    'pageButtonGap',
    'pageButtonPosition',
    'pageFormatter',
    'pageIcons',
    'pageIconColor',
    'pageIconInactiveColor',
    'pageIconSize',
    'pageTextStyle',
    'animation',
    'animationDurationUpdate',
    'selector',
    'selectorLabel',
    'selectorPosition',
    'selectorItemGap',
    'selectorButtonGap'
];

const legendOptions: Array<CompletionItem> = titleOptionsName.map(item => {
    let completionItem: CompletionItem;
    let insertText: string;

    switch (item) {
        case 'textStyle':
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

export default legendOptions;