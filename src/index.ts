import {
    OptionsStruct
} from './type';
import { getOptionsNames } from './utils';

export default async function getAllOptions(): Promise<OptionsStruct | null> {
    const optionsNames = await getOptionsNames();
    if (!optionsNames) {
        return null;
    }

    return optionsNames;
}