import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-mono font-medium transition-colors duration-120 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink select-none';

    const sizeStyles = {
      sm: 'text-xs px-2.5 py-1 min-h-[32px] gap-1.5',
      md: 'text-xs px-3.5 py-2 min-h-[40px] gap-2',
      lg: 'text-sm px-5 py-2.5 min-h-[48px] gap-2.5',
    };

    const variantStyles = {
      primary: 'bg-ink text-paper hover:bg-slate active:bg-ink/90 border border-ink',
      secondary:
        'bg-surface text-ink border border-ink/20 hover:bg-paper hover:border-ink/40 active:bg-paper-sunken',
      text: 'bg-transparent text-ink underline underline-offset-4 decoration-ink/30 hover:decoration-terracotta hover:text-terracotta active:text-ink/70 p-0 min-h-0 border-0',
    };

    const disabledStyles = disabled || loading ? 'opacity-40 cursor-not-allowed pointer-events-none' : '';

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${disabledStyles} ${className}`}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
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
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
