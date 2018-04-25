import { combineReducers } from 'redux';
import { routerReducer as router, RouterState } from 'react-router-redux';
import { appState } from '../reducers/app';

interface StoreEnhancerState { }

export interface AppState extends StoreEnhancerState {
  appState: any;
  router: RouterState;
}

export const rootReducer = combineReducers({
  appState,
  router,
});
