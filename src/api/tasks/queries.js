import { customFetch } from '../../util/fetch';

export const listTasksQuery = async (filters = {}) => {
  const queryParts = [];
  Object.keys(filters).forEach(key => {
    if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
      queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(filters[key])}`);
    }
  });
  const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  return customFetch(`/tasks${queryString}`);
};

export const getTaskStatsQuery = async (groupId = '') => {
  const queryString = groupId ? `?groupId=${encodeURIComponent(groupId)}` : '';
  return customFetch(`/tasks/stats${queryString}`);
};
