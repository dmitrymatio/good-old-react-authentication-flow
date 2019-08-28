import React, { memo } from 'react';
import { Fonts, GlobalStyle } from 'buffetjs';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import AuthPage from '../AuthPage';
import ConnectPage from '../ConnectPage';
import HomePage from '../HomePage';
import NotFound from '../NotFound';
import PrivateRoute from '../PrivateRoute';

const App = () => {
  return (
    <>
      <Fonts />
      <GlobalStyle />
      <Router>
        <div>
          <Switch>
            {/* A user can't go to the HomePage if is not authenticated */}
            <Route path="/auth/:authType/:id?" component={AuthPage} />
            <Route exact path="/connect/:provider" component={ConnectPage} />
            <PrivateRoute path="/" component={HomePage} exact />
            <Route path="" component={NotFound} />
          </Switch>
        </div>
      </Router>
    </>
  );
};

export default memo(App);
