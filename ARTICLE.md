The previous article explained how to build an Authentication flow using React and classes.

With the release of React 16.8 and the Hooks Api, the authentication is even easier to develop, so I thought that I should rewrite
this article, using only hooks and also adding some improvements like form validations file upload with Strapi (you should definitely read the article to know more...).

So before digging into some practical code we are going to set up a Strapi API so we will use JSON Web Tokens for our authentication, we'll also create some content type and use the new group feature and we'll cover the file upload part
which have been made way easier for developers.

(screen shot of the react app)

# Environment setup

Before all, you need to setup your development environment

First create a strapi project using the `create-strapi-app` command

```bash
npx create-strapi-app authentication-flow --quickstart
```

Then create a react project with [Create React App](https://create-react-app.dev)

```bash
npx create-react-app good-old-react-authentication-flow
```

We are going to use [Buffetjs](https://buffetjs.io) a UI component library so we don't have to redevelop all the inputs and button components for our app, [Yup](https://github.com/jquense/yup#yup) to handle
our form validations and [styled-components](https://styled-components.com) so we'll design a bit our app.

```
yarn add buffetjs yup styled-components react-router react-router-dom
```

You need to [register your first admin user](http://localhost:1337/admin) and then you're ready to go!

## Front-end App Architecture

I'm a huge fan of the [React Boilerplate's](https://www.reactboilerplate.com) architecture so I created something similar to organize my code:

```
/src
└─── containers // React components associated with a Route
|    └─── App // The entry point of the application
|    └─── AuthPage // Component handling all the auth views
|    └─── ConnectPage // Handles the auth with a custom provider
|    └─── HomePage // Can be accessed only if the user is logged in
|    └─── NotFound // 404 Component
|    └─── PrivateRoute // HoC
|
└─── components // Dummy components
|
└─── utils
     └─── auth
     └─── request // Request helper using fetch
```

Before going further in the tutorial you will need to create a `.env` file at the root of your app with the following content:

```
REACT_APP_BACK_END_URL = "http://localhost:1337"
```

## Router Setup and PrivateRoute

To implement the authentication views, we first need to create a HoC: Higher Order Component that will check if a user can access a specific URL.
To do so, we just need to follow the [official documentation](https://reacttraining.com/react-router/web/example/auth-workflow) and modify the `fakeAuth` example and use our `auth.js` helper:

**\*gist auth.js**
**_gist App/index.js_**

## Creating the Authentication Views

Now that all our routes are implemented we need the create our views.
The way we declared our routes allows us to have one component that is responsible for creating the correct form according to the location.

First of all, let's create a `forms.js` file that will handle the creation of the form on each auth view, in it we will also define our Yup schema to handle our form validations as well as the API endPoint for the following auth view:

- forgot-password
- login
- register
- reset-password

(The following config file is very useful to create dynamic forms depending on the URL's params)
**_gist of AuthPage/forms.js_**

In this views we will need several components:

- SocialLink so the user can register/login to your app using a provider like Facebook
- Other styled components...

### SocialLink component

The SocialLink component is a pretty dummy component as it is just an `<a />` tag that redirects your user to the dedicated provider.

**\*gist AuthPage/SocialLink.js**

### Generating the form depending on the location

Our config file let's us dynamically build the form depending on the location so let's create the form first, we will add the form validation logic and the API call after.

```
import React, { memo, useEffect, useState } from 'react';
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
  // State to store our input's value
  const [state, setState] = useState({});
  // Error state that we will use for our form validation
  const [errors, setErrors] = useState({});
  // Reset the state on navigation
  useEffect(() => {
    setState({});
  }, [authType]);
  // OnChange handler
  const handleChange = ({ target: { name, value } }) =>
    setState(prevState => ({ ...prevState, [name]: value }));

  // OnSubmit handler
  const handleSubmit = async e => {
    e.preventDefault();
  }


  // Displayed providers
  const providers = ['facebook', 'github', 'google', 'twitter'];
  const authLink = authType === 'login' ? 'register' : 'login';
  // Displayed input depending on the location
  const { inputs } = form[authType];

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

  AuthPage.propTypes = {
    location: PropTypes.shape({ search: PropTypes.string.isRequired }),
    match: PropTypes.shape({
      params: PropTypes.shape({ authType: PropTypes.string.isRequired }),
    }),
  };

  export default memo(AuthPage);
}
```

Well, at this point all the views needed for authenticating your users should be created! We just need to make the API call to access the app.

### Posting data to the API

To make the API call, I have a request helper ([that you can get in the demo app](link to the app on github)) so we just need to use it in our `handleSubmit` function. But before sending the request we need to make sure that the form is valid and we will use Yup to do so!

```
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
```

There's only one thing we need to take care of now: redirecting the user to the homepage once he is logged in.

```
if (auth.getToken() !== null) {
  return <Redirect to="/" />;
}

return (
  // ...
)

```

Nothing fancy here, once we get the response from the API we just store the needed informations in either the localStorage or the sessionStorage and we redirect the user to the HomePage.

Well we just achieved the most difficult part because using a custom provider like Facebook is easy as pie!

Using a Authentication Provider
Whatever you choose Facebook, GitHub or even Google, using a provider for authenticating your users with Strapi is again really easy 🙈. In this example, I will show you how to use it with Facebook.

Since Strapi doesn't provide (yet) a Javascript SDK to bridge the gap between the Strapi API and the Facebook API.

Here is the flow:

1. The user clicks on login with Facebook
2. It redirects him to another page so he can authorize the app
3. Once authorized, Facebook redirects the user to your app with a code in the URL
4. Send this code to Strapi

At this point we are going to create a Custom Hook that uses the `useEffect` hook which will perform the API request once it is
rendered:

```
import { memo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import request from '../../utils/request';
import auth from '../../utils/auth';

const ConnectPage = ({
  history: { push },
  location: { search },
  match: {
    params: { provider },
  },
}) => {
  const pushRef = useRef();
  pushRef.current = push;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestURL = `${process.env.REACT_APP_BACK_END_URL}/auth/${provider}/callback${search}`;
        const response = await request(requestURL, { method: 'GET' });

        auth.setToken(response.jwt, true);
        auth.setUserInfo(response.user, true);
        pushRef.current('/');
      } catch (err) {
        // TODO handle API errors
        console.log({ err });
      }
    };

    fetchData();
  }, [provider, search]);
};

ConnectPage.propTypes = {
  location: PropTypes.shape({ search: PropTypes.string.isRequired }),
  match: PropTypes.shape({
    params: PropTypes.shape({ provider: PropTypes.string.isRequired }),
  }),
};

export default memo(ConnectPage);
```

Well that's pretty much what we need to do for the front-end application now just need to setup Strapi to enable custom providers 😎

UPDATE THE SCREENS FOR THE FB PARTS
