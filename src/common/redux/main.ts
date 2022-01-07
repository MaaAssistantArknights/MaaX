import {
  forwardToRenderer,
  triggerAlias,
  replayActionMain,
} from 'electron-redux';

import {
  createStore,
  combineReducers,
  applyMiddleware,
  Middleware,
} from 'redux';

const todoApp = combineReducers(reducers);

const otherMiddleware: Middleware<any, any, any>[] = [];

const store = createStore(
  todoApp,
  initialState, // optional
  applyMiddleware(
    triggerAlias, // optional, see below
    ...otherMiddleware,
    forwardToRenderer // IMPORTANT! This goes last
  )
);

export default store;

replayActionMain(store);
