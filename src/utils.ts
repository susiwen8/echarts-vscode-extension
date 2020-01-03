/**
 * @file util functions
 */

import axios from 'axios';

export interface Options {
    [propName: string]: string;
}

/**
 * Axios request
 * @param url request url
 */
async function getData(url: string): Promise<Options|undefined> {
    try {
        const res = await axios.get(url);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

/**
 * Generate an arry from a-z
 */
function generateAToZArray(): string[] {
    const arr: string[] = [];
    for (var i = 65; i <= 122; i++) {
        if (i > 90 && i < 97) {
            continue;
        }
        arr.push(String.fromCharCode(i));
    }

    return arr;
}

export const utils = {
    getData,
    generateAToZArray
};