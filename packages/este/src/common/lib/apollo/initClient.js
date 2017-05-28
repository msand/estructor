import { ApolloClient, createNetworkInterface } from 'react-apollo';
import isClient from '../../app/isClient';

let apolloClient = null;

function init(headers, initialState, storage) {
  const networkInterface = createNetworkInterface({
    uri: 'http://api.githunt.com/graphql',
     opts: {
     credentials: 'same-origin',
     // Pass headers here if your graphql server requires them
     },
  });

  networkInterface.use([{
    async applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {};  // Create the header object if needed.
      }
      // get the authentication token from local storage if it exists
      const token = await (storage && storage.getItem('token'));
      if (token) {
        req.options.headers.authorization = `Bearer ${token}`;
      }
      next();
    },
  }]);

  return new ApolloClient({
    initialState,
    ssrMode: !isClient,
    dataIdFromObject: result => result.id || null,
    networkInterface,
  });
}

export default (headers, initialState = {}, storage) => {
  if (!isClient) {
    return init(headers, initialState, storage);
  }
  if (!apolloClient) {
    apolloClient = init(headers, initialState, storage);
  }
  return apolloClient;
};
