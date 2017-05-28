import React from 'react';
import HomePage from './HomePage';
import Page10 from './Page10';

class App extends React.Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
      );
  }
}

export default {
  path: '/',
  component: App,
  indexRoute: {
    component: HomePage
  },
  childRoutes: [
    {
      path: '/home',
      name: '/home',
      component: HomePage,
    },
    {
      path: '/second',
      name: '/second',
      component: Page10,
    },
    {
      path: '*',
      name: 'notfound',
      component: HomePage,
    },
  ],
};
