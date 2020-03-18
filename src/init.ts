import { OptionsStruct, BarItemStatus } from './type';
import { TextEditor, ExtensionContext } from 'vscode';
import Diagnostic from './diagnostic';
import EchartsStatusBarItem from './statusBarItem';
import { checkCode } from './utils';
import cacheControl from './cache';

export default async function init(activeTextEditor: TextEditor, context: ExtensionContext): Promise<{
    option: string,
    optionsStruct: OptionsStruct | undefined,
    statusBarItem: EchartsStatusBarItem,
    diagnostic: Diagnostic,
    isActive: boolean
}> {
    let optionsStruct: OptionsStruct | undefined;
    const diagnostic = new Diagnostic(activeTextEditor.document.uri);
    const statusBarItem = new EchartsStatusBarItem();
    statusBarItem.addInContext(context);
    statusBarItem.show();
    !optionsStruct && (optionsStruct = await cacheControl(optionsStruct, context));
    optionsStruct ? statusBarItem.changeStatus(BarItemStatus.Loaded)
        : statusBarItem.changeStatus(BarItemStatus.Failed);

    if (optionsStruct) {
        checkCode(diagnostic, activeTextEditor.document.getText(), optionsStruct);
    }

    return {
        option: '',
        optionsStruct,
        statusBarItem,
        diagnostic,
        isActive: false
    };
}