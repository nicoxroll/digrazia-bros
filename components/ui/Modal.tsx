
import React, { useEffect } from 'react';

declare global {
  interface Window {
    lenis: any;
  }
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Pausar Lenis cuando se abre el modal
      if (window.lenis) {
        window.lenis.stop();
      }
    } else {
      document.body.style.overflow = 'unset';
      // Reanudar Lenis cuando se cierra el modal
      if (window.lenis) {
        window.lenis.start();
      }
    }
    return () => { 
      document.body.style.overflow = 'unset';
      if (window.lenis) {
        window.lenis.start();
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-6xl min-h-[80vh] max-h-[95vh] bg-white rounded-[3rem] shadow-2xl border border-nude-100 overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col">
        <div className="p-6 lg:p-8 border-b border-nude-50 flex justify-between items-center flex-shrink-0">
          <h3 className="font-serif text-2xl lg:text-3xl text-nude-500 font-bold">{title}</h3>
          <button onClick={onClose} className="p-3 hover:bg-nude-50 rounded-full transition-colors text-nude-300">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <div 
          className="p-6 lg:p-8 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-nude-200 scrollbar-track-transparent"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {children}
        </div>
        {footer && (
          <div className="p-6 lg:p-8 bg-nude-50 border-t border-nude-100 flex justify-end gap-4 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
