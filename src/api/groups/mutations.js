import { customFetch } from '../../util/fetch';

export const createGroupMutation = async (groupData) => {
  return customFetch('/groups', {
    method: 'POST',
    body: groupData // { name, description }
  });
};

export const inviteMemberMutation = async (groupId, username) => {
  return customFetch(`/groups/${groupId}/invite`, {
    method: 'POST',
    body: { username }
  });
};
