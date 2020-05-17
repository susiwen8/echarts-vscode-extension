import { OptionsStruct } from './type';
import {
    TextEditor,
    ExtensionContext
} from 'vscode';
import Diagnostic from './diagnostic';
import EchartsStatusBarItem from './statusBarItem';
import { generateAToZArray } from './jsUtils';
import { getOptionsStruct } from './option';

export default function init(
    activeTextEditor: TextEditor,
    context: ExtensionContext
): {
    option: string,
    optionsStruct: OptionsStruct,
    statusBarItem: EchartsStatusBarItem,
    diagnostic: Diagnostic,
    isActive: boolean,
    activeKeys: string[]
} {
    const optionsStruct = getOptionsStruct();
    const diagnostic = new Diagnostic(activeTextEditor.document.uri);
    const statusBarItem = new EchartsStatusBarItem();
    statusBarItem.addInContext(context);
    statusBarItem.changeStatus();

    return {
        option: '',
        optionsStruct,
        statusBarItem,
        diagnostic,
        isActive: false,
        activeKeys: generateAToZArray()
    };
}