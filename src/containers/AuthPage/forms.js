import * as yup from 'yup';

const form = {
  'forgot-password': {
    endPoint: '/auth/forgot-password',
    inputs: [
      {
        label: 'Enter your email',
        name: 'email',
        type: 'email',
        placeholder: 'johndoe@gmail.com',
      },
    ],
    schema: yup.object({
      email: yup
        .string()
        .email()
        .required(),
    }),
  },
  login: {
    endPoint: '/auth/local',
    inputs: [
      {
        label: 'Username',
        name: 'identifier',
        type: 'text',
        placeholder: 'johndoe@gmail.com',
      },
      {
        label: 'Password',
        name: 'password',
        type: 'password',
      },
      {
        styleName: 'col-md-6',
        label: 'Remember me',
        name: 'rememberMe',
        type: 'checkbox',
      },
    ],
    schema: yup.object({
      identifier: yup.string().required(),
      password: yup.string().required(),
    }),
  },
  register: {
    endPoint: '/auth/local/register',
    inputs: [
      {
        label: 'Username',
        name: 'username',
        type: 'text',
        placeholder: 'Bob',
      },
      {
        label: 'Password',
        name: 'password',
        type: 'password',
      },
      {
        label: 'Confirm Password',
        name: 'passwordConfirmation',
        type: 'password',
      },
      {
        label: 'Email',
        name: 'email',
        placeholder: 'johndoe@gmail.com',
        type: 'email',
      },
    ],
    schema: yup.object({
      email: yup
        .string()
        .email()
        .required(),
      username: yup.string().required(),
      password: yup.string().required(),
      passwordConfirmation: yup
        .string()
        .oneOf([yup.ref('password'), null])
        .required('Password confirm is required'),
    }),
  },
  'reset-password': {
    endPoint: '/auth/reset-password',
    inputs: [
      {
        name: 'password',
        type: 'password',
        label: 'Password',
      },
      {
        name: 'passwordConfirmation',
        type: 'password',
        label: 'Confirm Password',
      },
    ],
    schema: yup.object({
      code: yup.string().required(),
      password: yup.string().required(),
      passwordConfirmation: yup
        .string()
        .oneOf([yup.ref('password'), null])
        .required('Password confirm is required'),
    }),
  },
};

export default form;
