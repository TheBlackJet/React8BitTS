
import firebase from "firebase";
import _ from "lodash";
import Observable from "rxjs";

import { Parser } from "json2csv";
import download from "downloadjs";

import moment from "moment";

/* 
FireBase upload / download
*/
interface IFireBase {
    FIREBASE_CONFIG: any;
    storageRef: any;
    firebase: any
}

export class FireBase<IFireBase> {

    constructor() { }

    setConfiguration(config) {

        this.FIREBASE_CONFIG = config;
        this.firebase = null;
        this.storage = null;
        this.storageRef = null;
        this.fileRef = null;
        this.folderRef = null;
        this.firebase = firebase;

        if (this.firebase.apps.length === 0) { // dont re innitialize
            // init sirebase app
            this.firebase.initializeApp(this.FIREBASE_CONFIG);
            // init firebase storage
            this.storage = this.firebase.storage();
            // Create a storage reference from our storage service
            this.storageRef = this.storage.ref();
        }

    }


    getFullURL() {
        if (_.isEmpty(this.fileRef)) return;
        return this.fileRef.getMetadata();
    }

    setFileReference(fileRef: string) {
        if (_.isEmpty(this.storage)) return;
        const mediaArray: Array<string> = fileRef.split('/');
        if (mediaArray.length != 2) return;
        this.storageRef.child(_.first(mediaArray));
        this.fileRef = this.storageRef.child(fileRef);
    }

    putFileToServer(data, fileType) {
        if (_.isEmpty(this.fileRef)) return;
        const metadata = {
            contentType: fileType,
        };

        return this.fileRef.put(data, metadata);
    }

    putBase64UrlStringToServer(data : string, fileType : string) {
        if (_.isEmpty(this.fileRef)) return;
        const metadata = {
            contentType: fileType,
        };
        return this.fileRef.putString(data, 'base64', metadata); // return a promise
    }

    putFileStringToServer(data, fileType) {
        if (_.isEmpty(this.fileRef)) return;
        const metadata = {
            contentType: fileType,
        };

        return this.fileRef.putString(JSON.stringify(data)); // return a promise
    }

    downloadDataURLFromServer(file) {
        if (_.isEmpty(this.storageRef)) return;
        return this.storageRef.child(file).getDownloadURL(); // return a promise
    }

    deleteFile() {
        if (_.isEmpty(this.fileRef)) return;
        return this.fileRef.delete();
    }

}


export const detectMimeType = (file: any) => {

}


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

