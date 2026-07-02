import * as Yup from 'yup';

export const INITIAL_GROUP_VALUES = {
  name: '',
  description: '',
};

export const GROUP_SCHEMA = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Group name must be at least 3 characters ⚠️')
    .required('Group name is required ⚠️'),
  description: Yup.string().max(250, 'Description too long ⚠️'),
});

export const INITIAL_INVITE_VALUES = {
  username: '',
};

export const INVITE_SCHEMA = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters ⚠️')
    .required('Username is required ⚠️'),
});
