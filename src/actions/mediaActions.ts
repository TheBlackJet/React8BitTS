import _ from "lodash";
import moment from "moment";
import {
    MEDIA_DATA_LIST_UPDATE,
    MEDIA_DOWNLOAD_FAILED,
    MEDIA_LIST_INITTIAL_APP_DATA_RETRIEVED,
    MEDIA_UPLOAD_FAILED,
    MEDIA_UPLOAD_SUCCESSFULLY
} from "../reducer-consts";
import {
    ACCEPTED_MIME_TYPES,
    FIREBASE_DATA_FILE,
    FIREBASE_DATA_TYPE,
    FIREBASE_FOLDER,
    NASA_IMAGES_URL
} from "../app-config-constants";
import {
    FireBase,
} from "../shared/fireBase";

import {
    getCurrentDate,
    getFileAsDataURL,
    generateId,
    exportToCSV,
    getBlobFromFile
} from "../shared/util";

import { IMediaItem, IMediaState, IMediaList } from "../typings/app";
import {
    INasaData,
    Datum,
    Link
} from "../entity/nasa-get-model";

import { MediaUploadState } from "../entity/mediaUpload";

import { FIREBASE_CONFIG } from "../app-config-constants";
import { Observable } from "rxjs/Observable";

// init FireBase
const fireBase = new FireBase();
fireBase.setConfiguration(FIREBASE_CONFIG); // set fireBase configs


export const addFileToMediaList = (data: MediaUploadState) => {

    return (dispatch, getState) => {
        // add to the image list object json
        const mediaState : IMediaState = getState().media;
        const contentList : Array<IMediaItem> = mediaState.mediaList;
        const fileName = FIREBASE_FOLDER + "/" + data.file.name;
        const fileExtension: string = data.file.name.replace(/^.*\./, '');
        const randomId: string = generateId();
        const getFileData = getFileAsDataURL(data.file)
            .then((base64Data:any) => {
                return fetch(base64Data).then(resp => resp.blob());
            })
            .then(res => {
                fireBase.setFileReference(fileName);
                return fireBase.putFileToServer(res, data.fileType);
            })
            .then(result => {
                contentList.push(<IMediaItem>{
                    id: randomId,
                    title: data.title,
                    description: data.description,
                    dateCreated: (new Date()).toISOString(),
                    url: FIREBASE_FOLDER + "/" + randomId + "." + fileExtension,
                    fullUrl: result.metadata.downloadURLs[0],
                    type: data.fileType
                });

                fireBase.setFileReference(FIREBASE_DATA_FILE);
                return fireBase.putFileStringToServer(contentList, FIREBASE_DATA_TYPE)
            })
            .then(result => {
                dispatch({
                    type: MEDIA_DATA_LIST_UPDATE,
                    data: contentList
                });
                dispatch({
                    type: MEDIA_UPLOAD_SUCCESSFULLY,
                    filename: data.file.name
                })
            })
            .catch((err) => {
                dispatch({
                    type: MEDIA_UPLOAD_FAILED,
                    filename: data.file.name
                })
            });
    }
}


export const deleteMedia = (id: string, fileLocation: string) => {
    return (dispatch, getState) => {
        // delete the media file
        fireBase.setFileReference(fileLocation);
        fireBase.deleteFile().then(result => {
            debugger
            // update the data file
            const contentList = getState().appState.contentList;
            const toDelete = new Set([id]);
            const newContentList = contentList.filter(obj => !toDelete.has(obj.id));

            // update the state list
            dispatch({
                type: MEDIA_DATA_LIST_UPDATE,
                data: newContentList
            });
            fireBase.setFileReference(FIREBASE_DATA_FILE);
            return fireBase.putFileStringToServer(newContentList, FIREBASE_DATA_TYPE)
        })
            .then(data => {

            })
            .catch(err => {
            })
    }
}