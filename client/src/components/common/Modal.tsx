import React, { useEffect } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Dialog'}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0e1a]/92 backdrop-blur-md select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-surface-elevated border border-primary/30 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] shadow-glow-primary/20 overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent gradient bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#4f7cff] via-[#60a5fa] to-[#4f7cff]" />

        {/* Modal Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 z-10 p-2 text-text-secondary hover:text-text-primary bg-surface/60 hover:bg-surface border border-border/60 hover:border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-150"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {title && (
          <div className="px-7 pt-6 pb-2 border-b border-border">
            <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
          </div>
        )}

        {children}
      </div>
    </div>
  );
};
