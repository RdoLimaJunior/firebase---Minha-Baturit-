import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
    toasts: ToastMessage[];
    removeToast: (id: number) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-5 right-5 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

interface ToastProps extends ToastMessage {
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const baseClasses = 'flex items-center w-full max-w-xs p-4 text-slate-600 bg-white rounded-lg shadow-lg border';
  const typeClasses = {
    success: 'bg-emerald-100 text-emerald-600 border-emerald-200',
    error: 'bg-rose-100 text-rose-600 border-rose-200',
    info: 'bg-sky-100 text-sky-600 border-sky-200',
  };
  const iconClasses = {
    success: 'text-emerald-500',
    error: 'text-rose-500',
    info: 'text-sky-500',
  }

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`} role="alert">
      <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg`}>
        {type === 'success' && <span className={iconClasses[type]}>✓</span>}
        {type === 'error' && <span className={iconClasses[type]}>✕</span>}
        {type === 'info' && <span className={`${iconClasses[type]} font-bold italic`}>i</span>}
      </div>
      <div className="ml-3 text-sm font-normal text-slate-700">{message}</div>
      <button type="button" className="ml-auto -mx-1.5 -my-1.5 bg-white text-slate-400 hover:text-slate-900 rounded-lg focus:ring-2 focus:ring-slate-300 p-1.5 hover:bg-slate-100 inline-flex h-8 w-8" onClick={onClose}>
        <span className="sr-only">Close</span>
        &times;
      </button>
    </div>
  );
};