/**
 * @file util functions
 */

import axios from 'axios';

/**
 * Axios request
 * @param url request url
 */
async function getData(url: string): Promise<any> {
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
    const arr: Array<string> = [];
    for (var i = 65; i <= 122; i++) {
        if (i > 90 && i < 97) {
            continue;
        }
        // 接受一个指定的 Unicode 值，然后返回一个字符串
        arr.push(String.fromCharCode(i));
    }

    return arr;
}

export const utils = {
    getData,
    generateAToZArray
};