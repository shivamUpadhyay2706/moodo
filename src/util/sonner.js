import { toast } from 'sonner';

export const showToast = {
  success: (message) => {
    toast.success(message, {
      style: {
        background: '#0f172a',
        color: '#10b981',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        borderRadius: '12px',
        fontFamily: 'Outfit, sans-serif'
      }
    });
  },
  error: (message) => {
    toast.error(message, {
      style: {
        background: '#0f172a',
        color: '#f43f5e',
        border: '1px solid rgba(244, 63, 94, 0.2)',
        borderRadius: '12px',
        fontFamily: 'Outfit, sans-serif'
      }
    });
  },
  info: (message) => {
    toast(message, {
      style: {
        background: '#0f172a',
        color: '#06b6d4',
        border: '1px solid rgba(6, 182, 212, 0.2)',
        borderRadius: '12px',
        fontFamily: 'Outfit, sans-serif'
      }
    });
  },
  loading: (message) => {
    return toast.loading(message, {
      style: {
        background: '#0f172a',
        color: '#6366f1',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        borderRadius: '12px',
        fontFamily: 'Outfit, sans-serif'
      }
    });
  },
  dismiss: (toastId) => {
    toast.dismiss(toastId);
  }
};
