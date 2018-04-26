import { combineReducers } from 'redux';
import { globalState } from '../reducers/globalReducer';
import { mediaState } from "../reducers/mediaReducer";

export const rootReducer = combineReducers({
  global: globalState,
  media: mediaState,
});

// const appReducer = combineReducers({
//   global: globalState,
//   media: mediaState,
// })

// const rootReducer = (state, action) => {

//   return appReducer(state, action)
// }
