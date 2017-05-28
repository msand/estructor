// @flow
import BaseRoot from '../../browser/app/BaseRoot';
import Helmet from 'react-helmet';
import Html from './Html';
import React from 'react';
import Root, { createRouterRender } from '../../browser/app/Root';
import config from '../config';
import configureFela from '../../browser/configureFela';
import configureFound from '../../browser/configureFound';
import configureStore from '../../common/configureStore';
import initClient from '../../common/lib/apollo/initClient';
import createInitialState from './createInitialState';
import serialize from 'serialize-javascript';
import { RedirectException } from 'found';
import { RouterProvider } from 'found/lib/server';
import { ServerProtocol } from 'farce';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { getDataFromTree } from 'react-apollo';

// createInitialState loads files, so it must be called once.
const initialState = createInitialState();

const getHost = req =>
  `${req.headers['x-forwarded-proto'] || req.protocol}://${req.headers.host}`;

const getLocale = req =>
  process.env.IS_SERVERLESS
    ? config.defaultLocale
    : req.acceptsLanguages(config.locales) || config.defaultLocale;

const createStore = (found, req, client): Object =>
  configureStore({
    client,
    initialState: {
      ...initialState,
      ...client.initialState,
      device: {
        ...initialState.device,
        host: getHost(req),
      },
      intl: {
        ...initialState.intl,
        currentLocale: getLocale(req),
        initialNow: Date.now(),
      },
    },
    platformReducers: { found: found.reducer },
    platformStoreEnhancers: found.storeEnhancers,
  });

const renderBody = async (renderArgs, store, client) => {
  const felaRenderer = configureFela();
  const app = (
    <BaseRoot felaRenderer={felaRenderer} client={client} store={store}>
      <RouterProvider router={renderArgs.router}>
        {createRouterRender(renderArgs)}
      </RouterProvider>
    </BaseRoot>
  );
  await getDataFromTree(app);
  const html = renderToString(app);
  const helmet = Helmet.rewind();
  const css = felaRenderer.renderToString();
  return { html, helmet, css };
};

const renderScripts = (
  state,
  appJsFilename,
  // github.com/yahoo/serialize-javascript#user-content-automatic-escaping-of-html-characters
) =>
  `
    <script>
      window.__INITIAL_STATE__ = ${serialize(state)};
    </script>
    <script src="${appJsFilename}"></script>
  `;

const renderHtml = (state, body) => {
  const {
    styles: { app: appCssFilename },
    javascript: { app: appJsFilename },
  } = global.webpackIsomorphicTools.assets();
  if (!config.isProduction) {
    global.webpackIsomorphicTools.refresh();
  }
  const scripts = renderScripts(state, appJsFilename);
  const html = renderToStaticMarkup(
    <Html
      appCssFilename={appCssFilename}
      bodyCss={body.css}
      bodyHtml={`<div id="app">${body.html}</div>${scripts}`}
      googleAnalyticsId={config.googleAnalyticsId}
      helmet={body.helmet}
      isProduction={config.isProduction}
    />,
  );
  return `<!DOCTYPE html>${html}`;
};

const render = async (req: Object, res: Object, next: Function) => {
  const found = configureFound(Root.routeConfig, new ServerProtocol(req.url));
  const headers = req.headers;
  const client = initClient(headers);
  const store = createStore(found, req, client);
  try {
    await found.getRenderArgs(store, async renderArgs => {
      const body = await renderBody(renderArgs, store, client);
      const state = store.getState();

      const initialState = {
        ...state,
        apollo: {
          data: client.getInitialState().data,
        },
      };

      const html = renderHtml(initialState, body);
      res.status(renderArgs.error ? renderArgs.error.status : 200).send(html);
    });
  } catch (error) {
    if (error instanceof RedirectException) {
      res.redirect(302, store.farce.createHref(error.location));
      return;
    }
    next(error);
  }
};

export default render;
