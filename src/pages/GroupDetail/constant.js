import * as Yup from 'yup';

export const INITIAL_EXPENSE_VALUES = {
  description: '',
  amount: '',
  paidBy: '', // selected member ID
  splitAmong: [], // array of member IDs
  date: '',
};

export const EXPENSE_SCHEMA = Yup.object().shape({
  description: Yup.string()
    .min(3, 'Description must be at least 3 characters ⚠️')
    .required('Description is required ⚠️'),
  amount: Yup.number()
    .min(0.01, 'Amount must be positive ⚠️')
    .required('Amount is required ⚠️'),
  paidBy: Yup.string(),
  splitAmong: Yup.array().of(Yup.string()),
  date: Yup.string(),
});

export const INITIAL_PLAN_VALUES = {
  title: '',
  description: '',
  location: '',
  startTime: '',
  endTime: '',
  category: 'other',
};

export const PLAN_SCHEMA = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters ⚠️')
    .required('Title is required ⚠️'),
  description: Yup.string().max(300, 'Description too long ⚠️'),
  location: Yup.string(),
  startTime: Yup.string(),
  endTime: Yup.string(),
  category: Yup.string().oneOf(['travel', 'lodging', 'activity', 'food', 'function_event', 'other']),
});

export const PLAN_CATEGORIES = [
  { value: 'travel', label: '✈️ Travel (Flight/Train)' },
  { value: 'lodging', label: '🏨 Lodging (Hotel/Airbnb)' },
  { value: 'activity', label: '🎪 Activity' },
  { value: 'food', label: '🍔 Food & Dining' },
  { value: 'function_event', label: '🎉 Event/Function' },
  { value: 'other', label: '📍 Other' },
];

export const INITIAL_GROUP_TASK_VALUES = {
  title: '',
  description: '',
  priority: 'medium',
  status: 'pending',
  dueDate: '',
  assignees: [], // array of member IDs
  tagsString: '',
  recurrence: 'none',
};

export const GROUP_TASK_SCHEMA = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters ⚠️')
    .required('Title is required ⚠️'),
  description: Yup.string().max(300, 'Description too long ⚠️'),
  priority: Yup.string().oneOf(['low', 'medium', 'high']),
  status: Yup.string().oneOf(['pending', 'in_progress', 'completed']),
  dueDate: Yup.string(),
  assignees: Yup.array().of(Yup.string()),
  recurrence: Yup.string().oneOf(['none', 'daily', 'weekly', 'monthly']),
});
