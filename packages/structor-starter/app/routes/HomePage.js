/**
 *
 * HomePage
 *
 */

import React, { Component } from 'react';

import { Link } from 'react-router';

class HomePage extends Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <div>
        <h3 style={{ textAlign: 'center' }}><span>New Starter Application Home Page</span></h3>
        <h3 style={{ textAlign: 'center' }}><Link to="/second"> <span>Go to Second Page</span> </Link></h3>
        <h3 style={{ textAlign: 'center' }}></h3>
      </div>
      ); // eslint-disable-line
  }
}

export default HomePage;
