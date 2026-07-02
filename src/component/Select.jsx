import React, { useState, useRef, useEffect } from 'react';
import { useField } from 'formik';
import { ChevronDown } from 'lucide-react';

// 1. Sleek Dropdown Layout Component (Pure View)
const DropdownLayout = ({ label, options, icon: Icon, value, onChange, hasError, errorMessage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value) || options[0] || { label: 'Select Option', value: '' };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className="w-full flex flex-col gap-1.5 relative select-none" ref={dropdownRef}>
      {label && (
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1">
          {label}
        </label>
      )}
      
      {/* Selector Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full py-2.5 px-3.5 rounded-xl text-left text-xs font-bold text-slate-200 bg-slate-950/40 border border-slate-800 outline-none flex items-center justify-between transition-all duration-200 cursor-pointer ${
          isOpen ? 'border-indigo-500/80 ring-2 ring-indigo-500/10' : 'hover:border-slate-700/80'
        } ${
          hasError ? 'border-rose-500/50' : ''
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && <Icon size={14} className="text-indigo-400" />}
          <span className="truncate">{selectedOption?.label || 'Select Option'}</span>
        </div>
        <ChevronDown 
          size={14} 
          className={`text-slate-500 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-indigo-400' : ''
          }`} 
        />
      </button>

      {/* Dropdown Options List */}
      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-full z-[100] rounded-xl border border-slate-800 bg-[#0d0f14]/95 backdrop-blur-xl shadow-2xl py-1 max-h-48 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              className={`w-full px-3.5 py-2 text-left text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                opt.value === value
                  ? 'bg-indigo-500/10 text-indigo-400 font-bold'
                  : 'text-slate-350 hover:bg-slate-900/60 hover:text-slate-100'
              }`}
            >
              <span>{opt.label}</span>
              {opt.value === value && (
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              )}
            </button>
          ))}
        </div>
      )}

      {hasError && (
        <span className="text-[10px] font-semibold text-rose-455 pl-1">
          {errorMessage}
        </span>
      )}
    </div>
  );
};

// 2. Formik-aware version
const FormikSelect = ({ name, ...props }) => {
  const [field, meta, helpers] = useField({ name, ...props });
  return (
    <DropdownLayout
      {...props}
      value={field.value}
      onChange={(val) => helpers.setValue(val)}
      hasError={meta.touched && meta.error}
      errorMessage={meta.error}
    />
  );
};

// 3. Controlled-state version
const ControlledSelect = ({ value, onChange, ...props }) => {
  return (
    <DropdownLayout
      {...props}
      value={value}
      onChange={onChange}
      hasError={false}
    />
  );
};

// 4. Main Export
const Select = (props) => {
  if (props.name) {
    return <FormikSelect {...props} />;
  }
  return <ControlledSelect {...props} />;
};

export default Select;
