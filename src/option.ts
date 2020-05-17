import * as json from './json/option/option.json';
import * as jsonGL from './json/option/option-gl.json';
import { OptionsStruct } from './type';

// get option structure
export function getOptionsStruct(): OptionsStruct {
    const optionsNames: OptionsStruct = {};
    Object.assign(optionsNames, json);
    Object.assign(optionsNames, jsonGL);
    return optionsNames;
}
