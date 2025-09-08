



import React, { useEffect } from 'react';
import Icon from './Icon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-white z-[1000] animate-slide-in-up-full"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="w-full h-full flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-slate-200 flex-shrink-0">
          <h2 id="modal-title" className="text-xl font-bold text-slate-800">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 transition-colors" aria-label="Fechar modal">
            <Icon name="arrow_back" className="text-2xl" />
          </button>
        </header>
        <main className="overflow-y-auto flex-grow">
          {children}
        </main>
      </div>
       <style>{`
        @keyframes slide-in-up-full {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-in-up-full {
            animation: slide-in-up-full 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Modal;