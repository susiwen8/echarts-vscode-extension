import { ExtensionContext } from 'vscode';
import { OptionsStruct } from './type';
import { getOptionsStruct } from './utils';

interface CacheValue {
    saveTime: number;
    expireTime: number;
    value: OptionsStruct
}

class Cache {
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

export default async function cacheControl(
    optionsStruct: OptionsStruct | undefined,
    context: ExtensionContext
): Promise<OptionsStruct | undefined> {
    const cache = new Cache(context);
    let hasSendRequest = false;
    const cacheValue = cache.get();

    if (
        cacheValue
        && (+new Date() - cacheValue.saveTime > cacheValue.expireTime)
    ) {
        cache.erase();
    } else if (
        cacheValue
        && (+new Date() - cacheValue.saveTime < cacheValue.expireTime)
    ) {
        optionsStruct = cacheValue.value;
    }

    if (!optionsStruct) {
        optionsStruct = await getOptionsStruct();
        hasSendRequest = true;
    }

    if (hasSendRequest && optionsStruct) {
        cache.set({
            value: {
                saveTime: +new Date(),
                expireTime: 7 * 24 * 60 * 60 * 1000,
                value: optionsStruct
            }
        });
    }

    return optionsStruct;
}