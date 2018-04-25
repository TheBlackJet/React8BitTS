import _ from "lodash";
import 
import {
    APP_MEDIA_RETRIEVED,
    APP_INITTIAL_DATA_RETRIEVED,
    APP_UPDATE_CONTENT_LIST,
    APP_MEDIA_UPLOAD_FAILED,
    APP_MEDIA_UPLOAD_SUCCESSFULLY,
    APP_DATA_DOWNLOAD_FAILED,
    NASA_SEARCH_RESULT_RETRIEVED
} from "../reducer-consts";
import {
    ACCEPTED_MIME_TYPES,
    FIREBASE_DATA_FILE,
    FIREBASE_FOLDER,
    NASA_IMAGES_URL
} from "../app-config-constants";
import {
    getCurrentDate,
    getFileAsDataURL,
    generateId,
    FireBase,
    exportToCSV
} from "../shared/utility-functions";

import { IMediaItem } from "../typings/app";
import {
    INasaData,
    Datum,
    Link
} from "../typings/nasa-search-entity";

import { FIREBASE_CONFIG } from "../app-config-constants";
import { Observable } from "rxjs/Observable";

// init FireBase
const fireBase = new FireBase();
fireBase.setConfiguration(FIREBASE_CONFIG); // set fireBase configs


export const mediaSelect = () => {
    return (dispatch) => {
        dispatch({
            type: APP_MEDIA_RETRIEVED
        });
    }
}

export const addFileToTheList = (data: any) => {

    return (dispatch, getState) => {
        // add to the image list object json
        const contentList = getState().appState.contentList;
        const fileName = FIREBASE_FOLDER + "/" + data.file.name;
        const fileExtension: string = data.file.name.replace(/^.*\./, '');
        const randomId: string = generateId();
        
        // upload media file to clould storage
        fireBase.setFileReference(fileName);
        fireBase.putFileToServer(data.file, data.fileType)
            .then(result => {
                debugger
                contentList.push(<IMediaItem>{
                    id: randomId,
                    title: data.title,
                    description: data.description,
                    dateCreated: new Date.now().toISOString(),
                    url: FIREBASE_FOLDER + "/" + randomId + "." + fileExtension,
                    fullUrl: result.metadata.downloadURLs[0]
                });

                dispatch({
                    type: APP_MEDIA_UPLOAD_SUCCESSFULLY,
                    filename: data.file.name
                })

                fireBase.setFileReference(FIREBASE_DATA_FILE);
                return fireBase.putFileStringToServer(contentList, "application/json")
            })
            .then(result => {
                dispatch({
                    type: APP_UPDATE_CONTENT_LIST,
                    data: contentList
                });
                dispatch({
                    type: APP_MEDIA_UPLOAD_SUCCESSFULLY,
                    filename: data.file.name
                })
            })
            .catch((err) => {
                dispatch({
                    type: APP_MEDIA_UPLOAD_FAILED,
                    filename: data.file.name
                })
            });
    }
}

export const searchForMedia = (query: string) => {

    return (dispatch, getState) => {
        return fetch(NASA_IMAGES_URL + "/search?q=sea").then(resp => resp.text())
            .then((data) => {
                const parsedData: INasaData = JSON.parse(data);
                const returnedData: Array<IMediaItem> = _.map(parsedData.collection.items, (item) => {
                    const dataItem: Datum = item.data[0]; // mandatory element
                    const link: Link = item.links[0]; // mandatory element
                    return <IMediaItem>{
                        id: generateId(10),
                        title: dataItem.title,
                        description: dataItem.description,
                        dateCreated: dataItem.date_created,
                        thumbnailUrl: _.isEmpty(link.href) ? "" : link.href,
                        fullUrl: _.isEmpty(link.href) ? "" : link.href,
                        base64: ""
                    };
                })

                dispatch({
                    type: NASA_SEARCH_RESULT_RETRIEVED,
                    data: returnedData.slice(0, 5) // get the first 5 item
                });
            })
            .catch(err => {
                dispatch({
                    type: APP_DATA_DOWNLOAD_FAILED,
                    filename: err
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
                    type: APP_INITTIAL_DATA_RETRIEVED,
                    payload: JSON.parse(result)
                })
            })
            .catch(err => {
                dispatch({
                    type: APP_DATA_DOWNLOAD_FAILED,
                    filename: err
                })
            })
    }

}

export const addNasaMediaFileToList = (dataObj: any) => {
    return (dispatch, getState) => {
        const contentList = getState().appState.contentList;
        //const fileName = FIREBASE_FOLDER + "/" + data.file.name;
        const fileExtension: string = dataObj.thumbnailUrl.replace(/^.*\./, '');
        const randomId: string = generateId();

        return fetch(dataObj.thumbnailUrl).then(resp => {
            return resp.blob() // return blob from response
        })
            .then(file => {
                fireBase.setFileReference(FIREBASE_FOLDER + "/" + randomId + "." + fileExtension);
                return fireBase.putFileToServer(file, "image/" + fileExtension)
            })
            .then(result => {
                dispatch({
                    type: APP_MEDIA_UPLOAD_SUCCESSFULLY,
                    filename: FIREBASE_FOLDER + "/" + randomId + "." + fileExtension
                })

                return fireBase.getFullURL();
            })
            .then(metaData => {
                contentList.push(<IMediaItem>{
                    id: randomId,
                    title: dataObj.title,
                    description: dataObj.description,
                    dateCreated: getCurrentDate(),
                    url: FIREBASE_FOLDER + "/" + randomId + "." + fileExtension,
                    fullUrl: metaData.downloadURLs[0]
                });

                // update contentList state
                dispatch({
                    type: APP_UPDATE_CONTENT_LIST,
                    data: contentList
                });

                fireBase.setFileReference(FIREBASE_DATA_FILE);
                return fireBase.putFileStringToServer(contentList, "application/json")
            })
            .then(result => {
                dispatch({
                    type: APP_MEDIA_UPLOAD_SUCCESSFULLY,
                    payload: FIREBASE_FOLDER + "/" + randomId + "." + fileExtension,
                })
            })
            .catch(err => {
                dispatch({
                    type: APP_DATA_DOWNLOAD_FAILED,
                    filename: err
                })
            });
    }
}

export const deleteMedia = (id: string, fileLocation : string) => {
    return (dispatch, getState) => {
        debugger
    }
}
