import { customFetch } from '../../util/fetch';

export const listExpensesQuery = async (groupId) => {
  return customFetch(`/groups/${groupId}/expenses`);
};

export const getExpenseBalancesQuery = async (groupId) => {
  return customFetch(`/groups/${groupId}/expenses/balances`);
};
