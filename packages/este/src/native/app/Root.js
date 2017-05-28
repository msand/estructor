// @flow
import App from './App';
import Fela from '../../common/components/FelaProvider';
import React from 'react';
import configureFela from '../configureFela';
import { MemoryRouter } from 'react-router';
import { ApolloProvider } from 'react-apollo';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
  client: Object,
  store: Object,
};

// Must be the ES6 class to ensure hot reload works for stateless components.
/* eslint-disable react/prefer-stateless-function */
class Root extends React.Component {
  props: Props;

  render() {
    const { client, store } = this.props;
    return (
      <ApolloProvider client={client} store={store}>
        <Fela
          Button={TouchableOpacity}
          Image={Image}
          Text={Text}
          TextInput={TextInput}
          View={View}
          renderer={configureFela()}
        >
          <MemoryRouter>
            <App />
          </MemoryRouter>
        </Fela>
      </ApolloProvider>
    );
  }
}

export default Root;
