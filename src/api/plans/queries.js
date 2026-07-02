import { customFetch } from '../../util/fetch';

export const listPlansQuery = async (groupId, category = '') => {
  const queryString = category ? `?category=${encodeURIComponent(category)}` : '';
  return customFetch(`/groups/${groupId}/plans${queryString}`);
};
