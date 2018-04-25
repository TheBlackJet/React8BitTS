
import { IMediaState } from "../typings/app";
import {
    MEDIA_DATA_LIST_UPDATE,
    MEDIA_DOWNLOAD_FAILED,
    MEDIA_LIST_INITTIAL_APP_DATA_RETRIEVED,
    MEDIA_UPLOAD_FAILED,
    MEDIA_UPLOAD_SUCCESSFULLY
} from "../reducer-consts";

const initialState : IMediaState = {
    mediaList: []
}

export const mediaState = (state : IMediaState = initialState, action : any) => {
    switch (action.type) {
        case MEDIA_DATA_LIST_UPDATE:
            return {
                ...state, // 1 level immutBLW
                mediaList: action.data,
            };
        default:
            return state
    }
}