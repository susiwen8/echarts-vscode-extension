import {
    window,
    StatusBarItem,
    StatusBarAlignment,
    ExtensionContext
} from 'vscode';

export default class EchartsStatusBarItem {
    #statusBarItem: StatusBarItem;

    constructor() {
        this.#statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 100);
    }

    changeStatus(): void {
        this.#statusBarItem.text = 'Echarts';
        this.#statusBarItem.command = 'echarts.deactivate';
        this.#statusBarItem.color = '#fff';
    }

    addInContext(context: ExtensionContext): void {
        context.subscriptions.push(this.#statusBarItem);
    }

    show(): void {
        this.#statusBarItem.show();
    }

    hide(): void {
        this.#statusBarItem.hide();
    }
}