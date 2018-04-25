import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createEpicMiddleware } from 'redux-observable';
import { routerMiddleware as createRouterMiddleware } from 'react-router-redux';
import { createBrowserHistory } from 'history';

import { rootReducer } from 'Features/root-reducer';

import { IAppState } from './typings/app';

const composeEnhancers = (
  process.env.NODE_ENV === 'development' &&
  window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
) || compose;

export const browserHistory = createBrowserHistory();
export const routerMiddleware = createRouterMiddleware(browserHistory);

function configureStore(initialState?: IAppState) {
  // configure middlewares
  const middlewares = [
    routerMiddleware,
    thunk
  ];
  // compose enhancers
  const enhancer = composeEnhancers(
    applyMiddleware(...middlewares)
  );
  // create store
  return createStore(
    rootReducer,
    initialState!,
    enhancer
  );
}

// pass an optional param to rehydrate state on app start
const initialAppState: IAppState = {
    
}


export const store = configureStore(initialAppState);

// export store singleton instance
export default store;