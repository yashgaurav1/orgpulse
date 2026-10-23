import React from 'react';

export interface TagProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  count?: number;
  children: React.ReactNode;
}

export function Tag({
  active = false,
  count,
  disabled = false,
  className = '',
  children,
  ...props
}: TagProps) {
  const baseStyles =
    'inline-flex items-center gap-1.5 font-mono text-xs px-2.5 py-1 border transition-colors duration-120 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink select-none';

  const stateStyles = active
    ? 'bg-ink text-paper border-ink font-semibold'
    : 'bg-surface text-ink border-ink/20 hover:border-ink/50 hover:bg-paper';

  const disabledStyles = disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'cursor-pointer';

  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={active}
      className={`${baseStyles} ${stateStyles} ${disabledStyles} ${className}`}
      {...props}
    >
      <span>{children}</span>
      {count !== undefined && (
        <span
          className={`text-[10px] tabular-nums px-1 rounded-none ${
            active ? 'bg-paper text-ink' : 'bg-ink/10 text-slate'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
