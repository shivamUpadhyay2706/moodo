import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300">
      <div 
        className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/95 shadow-2xl p-6 glow-indigo overflow-hidden max-h-[90vh] flex flex-col animate-float"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 select-none">
          <h3 className="text-lg font-bold text-slate-100 font-sans tracking-wide">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>
        {/* Content */}
        <div className="pt-4 flex-1 overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
