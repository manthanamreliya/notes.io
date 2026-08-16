import React, { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  id,
  error,
  helperText,
  className = '',
  ...props
}) => {
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  const ariaDescribedBy = [
    error ? errorId : null,
    helperText ? helperId : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="w-full flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary select-none"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        aria-invalid={Boolean(error)}
        aria-describedby={ariaDescribedBy || undefined}
        className={`w-full px-4 py-2.5 rounded-lg bg-surface text-text-primary placeholder:text-text-secondary/40 border transition-all duration-150 text-sm ${
          error
            ? 'border-error focus:border-error focus:ring-1 focus:ring-error'
            : 'border-border focus:border-primary focus:shadow-glow-primary'
        } focus:outline-none ${className}`}
        {...props}
      />
      {helperText && !error && (
        <p id={helperId} className="text-xs text-text-secondary mt-0.5">
          {helperText}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-error font-medium mt-0.5">
          {error}
        </p>
      )}
    </div>
  );
};
