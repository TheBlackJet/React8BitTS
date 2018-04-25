import { combineReducers } from 'redux';
import { globalState } from '../reducers/globalReducer';
import { mediaState } from "../reducers/mediaReducer";

export const rootReducer = combineReducers({
  global: globalState,
  media: mediaState
});
