import { customFetch } from '../../util/fetch';

export const createPlanMutation = async (groupId, planData) => {
  return customFetch(`/groups/${groupId}/plans`, {
    method: 'POST',
    body: planData
  });
};

export const updatePlanMutation = async (groupId, planId, planData) => {
  return customFetch(`/groups/${groupId}/plans/${planId}`, {
    method: 'PUT',
    body: planData
  });
};

export const deletePlanMutation = async (groupId, planId) => {
  return customFetch(`/groups/${groupId}/plans/${planId}`, {
    method: 'DELETE'
  });
};
