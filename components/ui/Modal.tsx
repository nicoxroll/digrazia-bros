
import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-[4rem] shadow-2xl border border-nude-100 overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="p-10 border-b border-nude-50 flex justify-between items-center">
          <h3 className="font-serif text-3xl text-nude-500 font-bold">{title}</h3>
          <button onClick={onClose} className="p-3 hover:bg-nude-50 rounded-full transition-colors text-nude-300">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <div className="p-12 max-h-[70vh] overflow-y-auto no-scrollbar">
          {children}
        </div>
        {footer && (
          <div className="p-10 bg-nude-50 border-t border-nude-100 flex justify-end gap-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
