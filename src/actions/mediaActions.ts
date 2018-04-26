import _ from "lodash";
import moment from "moment";
import {
    MEDIA_DATA_LIST_UPDATE,
    MEDIA_DOWNLOAD_FAILED,
    MEDIA_LIST_INITTIAL_APP_DATA_RETRIEVED,
    MEDIA_UPLOAD_FAILED,
    MEDIA_UPLOAD_SUCCESSFULLY,
    NASA_SEARCH_RESULT_RETRIEVED,
    APP_LOADER_SHOW,
    APP_LOADER_HIDE
} from "../reducer-consts";
import {
    ACCEPTED_MIME_TYPES,
    FIREBASE_DATA_FILE,
    FIREBASE_DATA_TYPE,
    FIREBASE_FOLDER,
    NASA_IMAGES_URL,
    NASA_DEFAULT_IMAGE_TYPE,
    MEDIA_FILE_BEING_ADDED,
    RECORD_BEING_EDITTED,
    RECORD_BEING_DELETED,
    RECORD_SEARCHING,
    RECORD_BEING_ADDED
} from "../app-config-constants";
import {
    FireBase,
} from "../shared/fireBase";

import {
    getCurrentDate,
    getFileAsDataURL,
    generateId,
    exportToCSV,
    getBlobFromFile,
    removeByKey
} from "../shared/util";

import { IMediaItem, IMediaState, IMediaList } from "../typings/app";
import {
    INasaData,
    Datum,
    Link
} from "../entity/nasa-get-model";

import { MediaUploadState } from "../entity/mediaUpload";

import { FIREBASE_CONFIG } from "../app-config-constants";

// init FireBase
const fireBase = new FireBase();
fireBase.setConfiguration(FIREBASE_CONFIG); // set fireBase configs


export const addFileToMediaList = (data: MediaUploadState) => {

    return (dispatch, getState) => {
        // add to the image list object json
        dispatch({
            type: APP_LOADER_SHOW,
            text: MEDIA_FILE_BEING_ADDED
        })
        const mediaState: IMediaState = getState().media;
        const contentList: Array<IMediaItem> = mediaState.mediaList;
        const fileExtension: string = data.file.name.replace(/^.*\./, '');
        const randomId: string = generateId();
        const fileName = FIREBASE_FOLDER + "/" + randomId + "." + fileExtension;
        const getFileData = getFileAsDataURL(data.file)
            .then((base64Data: any) => {
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
                    url: fileName,
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
                })

                dispatch({
                    type: APP_LOADER_HIDE,
                    path: "/list"
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

export const editFile = (data: MediaUploadState) => {
    return (dispatch, getState) => {
        dispatch({
            type: APP_LOADER_SHOW,
            text: RECORD_BEING_EDITTED
        })
        // add to the image list object json
        const mediaState: IMediaState = getState().media;
        const contentList: Array<IMediaItem> = mediaState.mediaList;
        const randomId: string = generateId();

        // if the user selected the file

        if (data.file == undefined) {
            _.map(contentList, item => {
                if (item.id == data.id) {
                    item.title = data.title;
                    item.description = data.description;
                }
            })

            fireBase.setFileReference(FIREBASE_DATA_FILE);
            return fireBase.putFileStringToServer(contentList, FIREBASE_DATA_TYPE)
                .then(result => {
                    dispatch({
                        type: APP_LOADER_HIDE,
                        path: "/list"
                    })
                    dispatch({
                        type: MEDIA_DATA_LIST_UPDATE,
                        data: contentList
                    })
                    
                })
                .catch((err) => {
                    dispatch({
                        type: MEDIA_UPLOAD_FAILED,
                        filename: data.file.name
                    })
                });
        } else {
            const fileExtension: string = data.file.name.replace(/^.*\./, '');
            const fileName = FIREBASE_FOLDER + "/" + randomId + "." + fileExtension;
            const foundObj = _.find(contentList, { id: data.id });
            fireBase.setFileReference(foundObj.url);
            return fireBase.deleteFile()
                .then(result => {
                    return getFileAsDataURL(data.file)
                })
                .then((base64Data: any) => {
                    return fetch(base64Data).then(resp => resp.blob());
                })
                .then(res => {
                    fireBase.setFileReference(fileName);
                    return fireBase.putFileToServer(res, data.fileType);
                })
                .then(result => {
                    // build another array
                    const newArray: Array<IMediaItem> = [];
                    contentList.forEach(item => {
                        if (item.id != data.id) {
                            newArray.push(item);
                        }
                    })
                    newArray.push(<IMediaItem>{
                        id: randomId,
                        title: data.title,
                        description: data.description,
                        dateCreated: (new Date()).toISOString(),
                        url: fileName,
                        fullUrl: result.metadata.downloadURLs[0],
                        type: data.fileType
                    });


                    fireBase.setFileReference(FIREBASE_DATA_FILE);
                    return fireBase.putFileStringToServer(newArray, FIREBASE_DATA_TYPE)
                })
                .then(result => {
                    dispatch({
                        type: APP_LOADER_HIDE,
                        path: "/list"
                    })
                    dispatch({
                        type: MEDIA_DATA_LIST_UPDATE,
                        data: contentList
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
}


export const deleteMedia = (id: string, fileLocation: string) => {
    return (dispatch, getState) => {
        dispatch({
            type: APP_LOADER_SHOW,
            text: RECORD_BEING_DELETED
        })
        // delete the media file
        fireBase.setFileReference(fileLocation);
        fireBase.deleteFile().then(result => {
            // update the data file
            const contentList = getState().media.mediaList;
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
                dispatch({
                    type: APP_LOADER_HIDE,
                    path: "/list"
                })
            })
            .catch(err => {
                dispatch({
                    type: MEDIA_UPLOAD_FAILED,
                    filename: FIREBASE_DATA_FILE
                })
            })
    }
}


export const getInitialData = () => {

    return (dispatch, getState) => {
        fireBase.downloadDataURLFromServer(FIREBASE_DATA_FILE)
            .then(url => {
                return fetch(url).then(resp => resp.text());
            })
            .then(result => {
                //exportToCSV(result);
                dispatch({
                    type: MEDIA_LIST_INITTIAL_APP_DATA_RETRIEVED,
                    payload: JSON.parse(result)
                })
            })
            .catch(err => {
                dispatch({
                    type: MEDIA_DOWNLOAD_FAILED,
                    filename: err
                })
            })
    }

}

export const searchForMedia = (query: string) => {
    return (dispatch, getState) => {
        dispatch({
            type: APP_LOADER_SHOW,
            text: RECORD_SEARCHING
        })
        return fetch(NASA_IMAGES_URL + "/search?q=" + _.trim(query)).then(resp => resp.text())
            .then((data) => {
                const parsedData: INasaData = JSON.parse(data);
                const videoFileJson: Array<{ link: string, index: number }> = [];
                const returnedData: Array<IMediaItem> = [];
                _.forEach(parsedData.collection.items, (item, index) => {
                    const dataItem: Datum = item.data[0]; // mandatory element
                    const link: Link = item.links[0]; // mandatory element
                    // check for video file
                    if (link.href.includes(".srt")) {
                        videoFileJson.push({ link: item.href, index: index });
                    } else {
                        returnedData.push(<IMediaItem>{
                            id: generateId(10),
                            title: dataItem.title,
                            description: dataItem.description,
                            dateCreated: dataItem.date_created,
                            thumbnailUrl: _.isEmpty(link.href) ? "" : link.href,
                            fullUrl: _.isEmpty(link.href) ? "" : link.href,
                            base64: "",
                            type: NASA_DEFAULT_IMAGE_TYPE
                        });
                    }

                })

                dispatch({
                    type: NASA_SEARCH_RESULT_RETRIEVED,
                    data: returnedData // get the first 5 item
                });

                dispatch({
                    type: APP_LOADER_HIDE,
                    path: "/list"
                })
            })
            .catch(err => {
                dispatch({
                    type: MEDIA_DOWNLOAD_FAILED,
                    filename: err
                })
            })
    }
}

export const addNasaMediaFileToList = (dataObj: any) => {
    return (dispatch, getState) => {
        dispatch({
            type: APP_LOADER_SHOW,
            text: RECORD_BEING_ADDED
        });
        const contentList = getState().media.mediaList;
        const fileExtension: string = dataObj.thumbnailUrl.replace(/^.*\./, '');
        const randomId: string = generateId();
        const fileLocation : string = FIREBASE_FOLDER + "/" + randomId + "." + fileExtension
        return fetch(dataObj.thumbnailUrl).then(resp => {
            return resp.blob() // return blob from response
        })
            .then(file => {
                fireBase.setFileReference(fileLocation);
                return fireBase.putFileToServer(file, "image/" + fileExtension)
            })
            .then(result => {
                dispatch({
                    type: MEDIA_UPLOAD_SUCCESSFULLY,
                    filename: fileLocation
                })

                return fireBase.getFullURL();
            })
            .then(metaData => {
                contentList.push(<IMediaItem>{
                    id: randomId,
                    title: dataObj.title,
                    description: dataObj.description,
                    dateCreated: dataObj.dateCreated,
                    url: fileLocation,
                    fullUrl: metaData.downloadURLs[0],
                    type: NASA_DEFAULT_IMAGE_TYPE
                });

                // update contentList state
                dispatch({
                    type: MEDIA_DATA_LIST_UPDATE,
                    data: contentList
                });
                dispatch({
                    type: APP_LOADER_HIDE,
                    path: "/list"
                });

                fireBase.setFileReference(FIREBASE_DATA_FILE);
                return fireBase.putFileStringToServer(contentList, FIREBASE_DATA_TYPE)
            })
            .then(result => {
                dispatch({
                    type: MEDIA_UPLOAD_SUCCESSFULLY,
                    payload: fileLocation,
                })
            })
            .catch(err => {
                dispatch({
                    type: MEDIA_UPLOAD_FAILED,
                    filename: err
                })
            });
    }
}
