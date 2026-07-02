import { customFetch } from '../../util/fetch';

export const createTaskMutation = async (taskData) => {
  return customFetch('/tasks', {
    method: 'POST',
    body: taskData
  });
};

export const updateTaskMutation = async (taskId, taskData) => {
  return customFetch(`/tasks/${taskId}`, {
    method: 'PUT',
    body: taskData
  });
};

export const deleteTaskMutation = async (taskId) => {
  return customFetch(`/tasks/${taskId}`, {
    method: 'DELETE'
  });
};
