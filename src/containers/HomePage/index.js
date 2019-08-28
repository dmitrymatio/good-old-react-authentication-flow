/**
 *
 * HomePage
 */

import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'buffetjs';
import auth from '../../utils/auth';

const HomePage = ({ history: { push } }) => {
  return (
    <div style={{ marginTop: '15%' }}>
      <h1>You're now logged in!!!</h1>
      <div style={{ marginTop: '50px' }}>
        <Button
          primary
          onClick={() => {
            auth.clearAppStorage();
            push('/auth/login');
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

HomePage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default HomePage;
