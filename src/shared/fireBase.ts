import firebase from "firebase";
import _ from "lodash";

export class FireBase<IFireBase> {

    private FIREBASE_CONFIG: any;
    private storage: any;
    private storageRef: any;
    private fileRef: any;
    private folderRef: any;
    private _firebase: any;
    constructor() { }

    setConfiguration(config) {

        this.FIREBASE_CONFIG = config;
        this.storage = null;
        this.storageRef = null;
        this.fileRef = null;
        this.folderRef = null;
        this._firebase = firebase;

        if (this._firebase.apps.length === 0) { // dont re innitialize
            // init sirebase app
            this._firebase.initializeApp(this.FIREBASE_CONFIG);
            // init firebase storage
            this.storage = this._firebase.storage();
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