import * as Yup from 'yup';

export const INITIAL_VALUES = {
  description: '',
  amount: '',
  category: 'other',
  date: ''
};

export const EXPENSE_SCHEMA = Yup.object().shape({
  description: Yup.string()
    .required('Description is required! 📝')
    .trim(),
  amount: Yup.number()
    .typeError('Amount must be a number! 🔢')
    .required('Amount is required! 💰')
    .positive('Amount must be greater than zero! 💳')
});

export const CATEGORY_OPTIONS = [
  { value: 'food', label: '🍔 Food' },
  { value: 'transport', label: '🚗 Transport' },
  { value: 'shopping', label: '🛍️ Shopping' },
  { value: 'entertainment', label: '🎬 Entertainment' },
  { value: 'bills', label: '💡 Bills' },
  { value: 'other', label: '🏷️ Other' }
];

export const CATEGORY_EMOJIS = {
  food: '🍔',
  transport: '🚗',
  shopping: '🛍️',
  entertainment: '🎬',
  bills: '💡',
  other: '🏷️'
};
