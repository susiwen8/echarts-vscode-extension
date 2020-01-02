/**
 * @file util functions
 * @author susiwen
 */

import axios from 'axios';

async function getData(url: string): Promise<any> {
    try {
        const res = await axios.get(url);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export const utils = {
    getData
};