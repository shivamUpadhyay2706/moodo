import React from 'react';
import { useField } from 'formik';

const Input = ({ label, icon: Icon, ...props }) => {
  const [field, meta] = useField(props);
  const hasError = meta.touched && meta.error;

  return (
    <div className="w-full flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-slate-400 select-none">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 text-slate-500 pointer-events-none transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          {...field}
          {...props}
          className={`w-full py-3 px-4 rounded-xl text-slate-100 placeholder-slate-500 text-sm glass-input outline-none transition-all duration-200 ${
            Icon ? 'pl-11' : ''
          } ${
            hasError
              ? 'border-rose-500/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
              : ''
          }`}
        />
      </div>
      {hasError && (
        <span className="text-xs font-semibold text-rose-400 select-none">
          {meta.error}
        </span>
      )}
    </div>
  );
};

export default Input;
