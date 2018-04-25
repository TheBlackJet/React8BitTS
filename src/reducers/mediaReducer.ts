
import { IMediaState } from "../typings/app";
import {
    MEDIA_DATA_LIST_UPDATE,
    MEDIA_DOWNLOAD_FAILED,
    MEDIA_LIST_INITTIAL_APP_DATA_RETRIEVED,
    MEDIA_UPLOAD_FAILED,
    MEDIA_UPLOAD_SUCCESSFULLY,
    NASA_SEARCH_RESULT_RETRIEVED
} from "../reducer-consts";

const initialState: IMediaState = {
    mediaList: [],
    nasaResult: []
}

export const mediaState = (state: IMediaState = initialState, action: any) => {
    switch (action.type) {
        case MEDIA_DATA_LIST_UPDATE:
            return {
                ...state, // 1 level immutBLW
                mediaList: action.data,
            };
        case MEDIA_LIST_INITTIAL_APP_DATA_RETRIEVED:
            return {
                ...state,
                mediaList: action.payload,
            };
        case NASA_SEARCH_RESULT_RETRIEVED:
            return {
                ...state,
                nasaResult: action.data,
            }
        case MEDIA_UPLOAD_SUCCESSFULLY:
            return state;
        default:
            return state
    }
}