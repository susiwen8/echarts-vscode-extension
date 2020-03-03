import { ExtensionContext } from 'vscode';
import { OptionsStruct } from './type';

interface CacheValue {
    saveTime: number;
    expireTime: number;
    value: OptionsStruct
}

export default class Cache {
    context: ExtensionContext;
    constructor(context: ExtensionContext) {
        this.context = context;
    }

    set({ key = 'res', value }: { key?: string, value: CacheValue | undefined }): void {
        this.context.globalState.update(key, value);
    }

    get(key = 'res'): CacheValue | undefined {
        return this.context.globalState.get(key);
    }

    erase(key = 'res'): void {
        this.set({
            key,
            value: undefined
        });
    }
}