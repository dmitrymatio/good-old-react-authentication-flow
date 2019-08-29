import React, { useEffect, useState, memo } from 'react';
import PropTypes from 'prop-types';
import { get, set } from 'lodash';
import { Link, Redirect } from 'react-router-dom';
import { Button, Inputs } from 'buffetjs';

import auth from '../../utils/auth';
import getQueryParameters from '../../utils/getQueryParameters';
import request from '../../utils/request';
import form from './forms';
import { Wrapper } from './components';
import SocialLink from './SocialLink';

const AuthPage = ({
  location: { search },
  match: {
    params: { authType },
  },
}) => {
  const [state, setState] = useState({});
  const [errors, setErrors] = useState({});
  // Reset the state on navigation
  useEffect(() => {
    setState({});
  }, [authType]);
  const handleChange = ({ target: { name, value } }) =>
    setState(prevState => ({ ...prevState, [name]: value }));

  const { endPoint, inputs, schema } = form[authType];
  const handleSubmit = async e => {
    e.preventDefault();
    let errors = {};
    const body = state;
    const code = getQueryParameters(search, 'code');

    if (authType === 'reset-password' && code !== null) {
      set(body, 'code', code);
    }

    if (authType === 'forgot-password') {
      set(body, 'url', `${window.location.origin}/auth/reset-password`);
    }

    try {
      await schema.validate(body, { abortEarly: false });
      const { REACT_APP_BACK_END_URL } = process.env;

      delete body.rememberMe;

      try {
        const response = await request(`${REACT_APP_BACK_END_URL}${endPoint}`, {
          method: 'POST',
          body,
        });

        auth.setToken(response.jwt, body.rememberMe);
        auth.setUserInfo(response.user, body.rememberMe);
      } catch (err) {
        // TODO handle API errors
      }
    } catch (err) {
      console.log({ err });
      errors = get(err, 'inner', []).reduce((acc, curr) => {
        acc[
          curr.path
            .split('[')
            .join('.')
            .split(']')
            .join('')
        ] = [{ id: curr.message }];

        return acc;
      }, {});
    }

    setErrors(errors);
  };

  const providers = ['facebook', 'github', 'google', 'twitter']; // To remove a provider from the list just delete it from this array...
  const authLink = authType === 'login' ? 'register' : 'login';

  if (auth.getToken() !== null) {
    return <Redirect to="/" />;
  }

  return (
    <Wrapper>
      <form onSubmit={handleSubmit}>
        <div>
          <h1>Welcome</h1>
          {authType === 'login' &&
            providers.map(provider => (
              <SocialLink provider={provider} key={provider} />
            ))}
          <div>
            <div className="input-wrapper">
              {inputs.map(input => {
                return (
                  <Inputs
                    key={input.name}
                    errors={errors}
                    {...input}
                    error="lll"
                    value={state[input.name]}
                    onChange={handleChange}
                  />
                );
              })}
            </div>
            <Button type="submit" primary>
              Submit
            </Button>
          </div>
          <div>
            <div>
              {authType !== 'forgot-password' && (
                <>
                  <Link to="/auth/forgot-password">Forgot Password</Link>
                  &nbsp;or&nbsp;
                </>
              )}
              <Link to={`/auth/${authLink}`}>{authLink}</Link>
            </div>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};

AuthPage.propTypes = {
  location: PropTypes.shape({ search: PropTypes.string.isRequired }),
  match: PropTypes.shape({
    params: PropTypes.shape({ authType: PropTypes.string.isRequired }),
  }),
};

export default memo(AuthPage);
