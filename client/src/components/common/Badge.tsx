import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border border-secondary/40 text-secondary bg-secondary/10 select-none ${className}`}
    >
      {children}
    </span>
  );
};
