import * as Yup from 'yup';

export const INITIAL_LOGIN_VALUES = {
  username: '',
  password: '',
};

export const INITIAL_REGISTER_VALUES = {
  username: '',
  password: '',
  confirmPassword: '',
};

export const LOGIN_SCHEMA = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters ⚠️')
    .required('Username is required ⚠️'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters ⚠️')
    .required('Password is required ⚠️'),
});

export const REGISTER_SCHEMA = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters ⚠️')
    .required('Username is required ⚠️'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters ⚠️')
    .required('Password is required ⚠️'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match ⚠️')
    .required('Confirm password is required ⚠️'),
});
