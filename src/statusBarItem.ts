import {
    window,
    StatusBarItem,
    StatusBarAlignment,
    ExtensionContext
} from 'vscode';
import { BarItemStatus } from './type';

export default class EchartsStatusBarItem {
    #statusBarItem: StatusBarItem
    #loading = {
        text: BarItemStatus.Loading,
        color: '#f2e746',
        command: undefined
    }
    #loaded = {
        text: BarItemStatus.Loaded,
        color: '#fff',
        command: 'echarts.deactivate'
    }
    #failed = {
        text: BarItemStatus.Failed,
        color: '#db0f31',
        command: 'echarts.reload'
    }

    constructor() {
        this.#statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 100);
        this.changeStatus(BarItemStatus.Loading);
    }

    changeStatus(barItemStatus: string): void {
        switch(barItemStatus) {
            case BarItemStatus.Loading:
                this.#statusBarItem.text = this.#loading.text;
                this.#statusBarItem.command = this.#loading.command;
                this.#statusBarItem.color = this.#loading.color;
                break;

            case BarItemStatus.Failed:
                this.#statusBarItem.text = this.#failed.text;
                this.#statusBarItem.command = this.#failed.command;
                this.#statusBarItem.color = this.#failed.color;
                break;

            default:
                this.#statusBarItem.text = this.#loaded.text;
                this.#statusBarItem.command = this.#loaded.command;
                this.#statusBarItem.color = this.#loaded.color;
        }
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