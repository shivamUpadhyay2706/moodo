import * as Yup from 'yup';

export const INITIAL_TASK_VALUES = {
  title: '',
  description: '',
  priority: 'medium',
  status: 'pending',
  dueDate: '',
  tagsString: '', // comma-separated tags
  recurrence: 'none',
};

export const TASK_SCHEMA = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters ⚠️')
    .required('Task title is required ⚠️'),
  description: Yup.string().max(300, 'Description too long ⚠️'),
  priority: Yup.string().oneOf(['low', 'medium', 'high']),
  status: Yup.string().oneOf(['pending', 'in_progress', 'completed']),
  dueDate: Yup.string(),
  recurrence: Yup.string().oneOf(['none', 'daily', 'weekly', 'monthly']),
});

export const PRIORITY_OPTIONS = [
  { value: 'low', label: '🟢 Low' },
  { value: 'medium', label: '🟡 Medium' },
  { value: 'high', label: '🔴 High' },
];

export const STATUS_OPTIONS = [
  { value: 'pending', label: '⏱️ Pending' },
  { value: 'in_progress', label: '⚡ In Progress' },
  { value: 'completed', label: '✅ Completed' },
];

export const RECURRENCE_OPTIONS = [
  { value: 'none', label: 'No Recurrence' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];
