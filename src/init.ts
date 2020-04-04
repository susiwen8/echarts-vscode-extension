import { OptionsStruct, BarItemStatus } from './type';
import { TextEditor, ExtensionContext } from 'vscode';
import Diagnostic from './diagnostic';
import EchartsStatusBarItem from './statusBarItem';
import { getOptionsStruct } from './utils';

export default function init(
    activeTextEditor: TextEditor,
    context: ExtensionContext
): {
    option: string,
    optionsStruct: OptionsStruct,
    statusBarItem: EchartsStatusBarItem,
    diagnostic: Diagnostic,
    isActive: boolean
} {
    const optionsStruct = getOptionsStruct();
    const diagnostic = new Diagnostic(activeTextEditor.document.uri);
    const statusBarItem = new EchartsStatusBarItem();
    statusBarItem.addInContext(context);
    statusBarItem.changeStatus(BarItemStatus.Loaded);

    return {
        option: '',
        optionsStruct,
        statusBarItem,
        diagnostic,
        isActive: false
    };
}