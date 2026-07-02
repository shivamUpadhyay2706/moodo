import { customFetch } from '../../util/fetch';

export const createExpenseMutation = async (groupId, expenseData) => {
  return customFetch(`/groups/${groupId}/expenses`, {
    method: 'POST',
    body: expenseData
  });
};

export const deleteExpenseMutation = async (groupId, expenseId) => {
  return customFetch(`/groups/${groupId}/expenses/${expenseId}`, {
    method: 'DELETE'
  });
};
