import { APP_MEDIA_RETRIEVED, APP_INITTIAL_DATA_RETRIEVED, APP_UPDATE_CONTENT_LIST, NASA_SEARCH_RESULT_RETRIEVED } from "../reducer-consts";

const initialState = {
    selectedMedia: {},
    contentList: [],
    nasaData: []
}

export const appState = (state = initialState, action : any) => {
    switch (action.type) {
        case APP_UPDATE_CONTENT_LIST:
            return {
                ...state, // 1 level immutBLW
                contentList: action.data,
            };
        case NASA_SEARCH_RESULT_RETRIEVED:
        return {
            ...state, 
            nasaData: action.data,
        }
        case APP_MEDIA_RETRIEVED:
            return {
                ...state,
                selectedMedia: action.data,
            };
        case APP_INITTIAL_DATA_RETRIEVED:
            return {
                ...state,
                contentList: action.payload,
            };
        default:
            return state
    }
}