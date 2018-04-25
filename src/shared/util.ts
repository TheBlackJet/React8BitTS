import _ from "lodash";
import Observable from "rxjs";

import { Parser } from "json2csv";
import download from "downloadjs";

import moment from "moment";

export const exportToCSV = (jsonData: any) => {
    if (!jsonData) return;
    const Json2csvParser = Parser;
    const fields = ['title', 'description', 'date created'];;
    const opts = { fields };

    try {
        const parser = new Json2csvParser(opts);
        const csv = parser.parse(JSON.parse(jsonData));
        //download(csv, "data.csv", "application/vnd.ms-excel");
    } catch (err) {
        console.error(err);
    }
}


export const getFileAsDataURL = (file: any) => {
    const promise = new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = (error) => {
            reject(error);
        };
    });

    return promise;

}

export const getBlobFromFile = (file: any) => {
    const promise = new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = (error) => {
            reject(error);
        };
    });

    return promise;
}

export const getCurrentDate = () => {
    const today = new Date();
    let dd: number = today.getDate();
    let mm: number = today.getMonth() + 1;
    let yyyy: number = today.getFullYear();

    if (dd < 10) {
        dd = _.toNumber('0' + _.toString(dd));
    }

    if (mm < 10) {
        mm = _.toNumber('0' + _.toString(mm));
    }

    return dd + '-' + mm + '-' + _.toString(yyyy);
}


const dec2hex = (dec: any) => {
    return ('0' + dec.toString(16)).substr(-2)
}

// generateId :: Integer -> String
export const generateId = (len: number = 10) => {
    var arr = new Uint8Array((len || 40) / 2)
    window.crypto.getRandomValues(arr)
    return Array.from(arr, dec2hex).join('')
}

export const convertISOStringToDate = (str: string, format: string = 'DD-MM-YYYY') => {
    const date = moment(str);
    const dateComponent = date.utc().format(format);
    return dateComponent;
}
