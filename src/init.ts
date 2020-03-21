import { OptionsStruct, BarItemStatus } from './type';
import { TextEditor, ExtensionContext } from 'vscode';
import Diagnostic from './diagnostic';
import EchartsStatusBarItem from './statusBarItem';
import { getOptionsStruct } from './utils';

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
    !optionsStruct && (optionsStruct = getOptionsStruct());
    optionsStruct ? statusBarItem.changeStatus(BarItemStatus.Loaded)
        : statusBarItem.changeStatus(BarItemStatus.Failed);

    return {
        option: '',
        optionsStruct,
        statusBarItem,
        diagnostic,
        isActive: false
    };
}