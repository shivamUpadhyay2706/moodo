import { customFetch } from '../../util/fetch';

export const loginMutation = async (username, password) => {
  return customFetch('/auth/login', {
    method: 'POST',
    body: { username, password }
  });
};

export const registerMutation = async (username, password) => {
  return customFetch('/auth/register', {
    method: 'POST',
    body: { username, password }
  });
};
