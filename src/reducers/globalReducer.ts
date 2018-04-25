
import { IStateGlobal } from "../typings/app";

const initialState : IStateGlobal = {
    
}

export const globalState = (state : IStateGlobal = initialState, action : any) => {
    switch (action.type) {
        default:
            return state
    }
}