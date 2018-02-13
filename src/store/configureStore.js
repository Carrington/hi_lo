import { createStore, applyMiddleware } from 'redux';
import { rootEpic, rootReducer } from '../ducks';
import { createEpicMiddleware } from 'redux-observable';
import { composeWithDevTools } from 'redux-devtools-extension';

const epicMiddleware = createEpicMiddleware(rootEpic);

export default function configureStore(initialState) {
  
  const store = createStore(
      rootReducer, 
      initialState, 
      composeWithDevTools(
        applyMiddleware(epicMiddleware)
      )     
  );

  if (module.hot) {
      module.hot.accept('../ducks', () => {
        const nextRootReducer = require('../ducks').rootReducer;
        store.replaceReducer(nextRootReducer);
        const rootEpic = require('../ducks').rootEpic;
        epicMiddleware.replaceEpic(rootEpic)
      });
  }

  return store;
}