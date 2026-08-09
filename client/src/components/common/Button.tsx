import React, { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  fullWidth = true,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg text-sm px-4 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed select-none transition-all duration-150';

  const variantStyles = {
    primary:
      'bg-primary text-white hover:bg-primary-hover border border-transparent shadow-sm hover:shadow-glow-primary',
    secondary:
      'bg-transparent text-text-primary border border-border hover:border-primary hover:text-text-primary hover:shadow-glow-primary hover:bg-surface/50',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <svg
            className="w-4 h-4 animate-spin text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
