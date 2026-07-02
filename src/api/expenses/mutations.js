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

export const createPersonalExpenseMutation = async (expenseData) => {
  return customFetch(`/expenses`, {
    method: 'POST',
    body: expenseData
  });
};

export const deletePersonalExpenseMutation = async (expenseId) => {
  return customFetch(`/expenses/${expenseId}`, {
    method: 'DELETE'
  });
};
