
import { IStateGlobal } from "../typings/app";
import { APP_LOADER_HIDE, APP_LOADER_SHOW } from '../reducer-consts';

const initialState : IStateGlobal = {
    redirect: false,
    path: ""
}

export const globalState = (state : IStateGlobal = initialState, action : any) => {
    switch (action.type) {
        case APP_LOADER_HIDE: 
        return {
            ...state, 
            redirect: false,
            path: action.path
        };
        case APP_LOADER_SHOW: 
        return {
            ...state, 
            redirect: true,
        };
        default:
            return state
    }
}