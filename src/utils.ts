/**
 * @file util functions
 */

import axios from 'axios';
import { urls } from './urls';
import {
    GetDataParams,
    Options
} from './type';

/**
 * Axios request
 * @param url request url
 */
export async function getData({ lang, option }: GetDataParams): Promise<Options | undefined> {
    const api = urls[lang][option];
    try {
        const res = await axios.get(api, {
            timeout: 2000
        });
        for (const key in res.data) {
            res.data[key] = res.data[key].replace(/<[^>]+>/g, '').trim();
        }
        return res.data;
    } catch (error) {
        console.log(`${error.code}, ${api}: `);
    }
}

/**
 * Generate an arry from a-z
 */
export function generateAToZArray(): string[] {
    const arr: string[] = [];
    for (let i = 65; i <= 122; i++) {
        if (i > 90 && i < 97) {
            continue;
        }
        arr.push(String.fromCharCode(i));
    }

    return arr;
}