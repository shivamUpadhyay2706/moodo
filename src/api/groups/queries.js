import { customFetch } from '../../util/fetch';

export const listGroupsQuery = async () => {
  return customFetch('/groups');
};

export const getGroupMembersQuery = async (groupId) => {
  return customFetch(`/groups/${groupId}/members`);
};
