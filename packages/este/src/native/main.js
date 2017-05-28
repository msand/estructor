// @flow
import type { Action } from '../common/types';
import FBSDK from 'react-native-fbsdk';
import React from 'react';
import ReactNativeI18n from 'react-native-i18n';
import Root from './app/Root';
import configureStorage from '../common/configureStorage';
import configureStore from '../common/configureStore';
import initClient from '../common/lib/apollo/initClient';
import initialState from './initialState';
import uuid from 'react-native-uuid';
import { AppRegistry, AsyncStorage } from 'react-native';
import { persistStore } from 'redux-persist';
import codePush from 'react-native-code-push';

const getDefaultDeviceLocale = () => {
  const { defaultLocale, locales } = initialState.intl;
  const deviceLocale = ReactNativeI18n.locale.split('-')[0];
  const isSupported = locales.indexOf(deviceLocale) !== -1;
  return isSupported ? deviceLocale : defaultLocale;
};

const createNativeInitialState = () => ({
  ...initialState,
  device: {
    ...initialState.device,
  },
  intl: {
    ...initialState.intl,
    currentLocale: getDefaultDeviceLocale(),
  },
});

const nativeInitialState = createNativeInitialState();

const headers = {};
const client = initClient(headers, nativeInitialState, AsyncStorage);

const store = configureStore({
  initialState: client.initialState,
  platformDeps: { FBSDK, uuid, storage: AsyncStorage },
  client,
});

const Este = () => codePush(<Root client={client} store={store} />);

persistStore(
  store,
  {
    ...configureStorage(initialState.config.appName),
    storage: AsyncStorage,
  },
  () => {
    // Don't import appStarted action creator since it would break hot reload.
    store.dispatch(({ type: 'APP_STARTED' }: Action));
  },
);

AppRegistry.registerComponent('Este', () => Este);
