// @flow
import configureMiddleware from './configureMiddleware';
import configureReducer from './configureReducer';
import isReactNative from './app/isReactNative';
import { applyMiddleware, createStore, compose } from 'redux';
import { autoRehydrate } from 'redux-persist';

type Options = {
  client: Object,
  initialState: Object,
  platformDeps?: Object,
  platformReducers?: Object,
  platformMiddleware?: Array<Function>,
  platformStoreEnhancers?: Array<Function>,
};

const configureStore = (options: Options) => {
  const {
    client,
    initialState,
    platformDeps = {},
    platformMiddleware = [],
    platformReducers = {},
    platformStoreEnhancers = [],
  } = options;

  const apolloReducer = client.reducer();

  const reducer = configureReducer(platformReducers, initialState, apolloReducer);

  const middleware = configureMiddleware(
    client,
    initialState,
    platformDeps,
    platformMiddleware,
  );

  // $FlowFixMe
  const store = createStore(
    reducer,
    initialState,
    compose(
      applyMiddleware(...middleware),
      autoRehydrate(),
      ...platformStoreEnhancers,
    ),
  );

  // Enable hot reloading for reducers.
  if (module.hot && typeof module.hot.accept === 'function') {
    if (isReactNative) {
      // React Native for some reason needs accept without the explicit path.
      // facebook.github.io/react-native/blog/2016/03/24/introducing-hot-reloading.html
      module.hot.accept(() => {
        const configureReducer = require('./configureReducer').default;

        store.replaceReducer(configureReducer(platformReducers, initialState, apolloReducer));
      });
    } else {
      // Webpack for some reason needs accept with the explicit path.
      module.hot.accept('./configureReducer', () => {
        const configureReducer = require('./configureReducer').default;

        store.replaceReducer(configureReducer(platformReducers, initialState, apolloReducer));
      });
    }
  }

  return store;
};

export default configureStore;
