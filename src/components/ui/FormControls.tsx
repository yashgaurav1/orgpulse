import React, { useState } from 'react';

export interface ScaleSelectorProps {
  value: number | null;
  onChange: (value: number) => void;
  minLabel?: string;
  maxLabel?: string;
  disabled?: boolean;
  className?: string;
}

export function ScaleSelector({
  value,
  onChange,
  minLabel = 'Strongly disagree',
  maxLabel = 'Strongly agree',
  disabled = false,
  className = '',
}: ScaleSelectorProps) {
  const options = [1, 2, 3, 4, 5];

  return (
    <div className={`space-y-3 ${className}`}>
      <div
        role="radiogroup"
        aria-label="Rating scale 1 to 5"
        className="grid grid-cols-5 gap-2 sm:gap-3"
      >
        {options.map((opt) => {
          const isSelected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => onChange(opt)}
              className={`flex flex-col items-center justify-center py-3.5 px-2 border transition-all duration-120 select-none ${
                isSelected
                  ? 'bg-ink text-paper border-ink scale-[1.02] shadow-xs'
                  : 'bg-surface text-ink border-ink/20 hover:border-ink/50 hover:bg-paper'
              } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span className="font-mono text-lg font-semibold tabular-nums">{opt}</span>
              <span className="font-mono text-[10px] opacity-60 mt-0.5 hidden sm:inline">[{opt}]</span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center text-xs text-slate font-sans">
        <span>1: {minLabel}</span>
        <span>5: {maxLabel}</span>
      </div>
    </div>
  );
}

export interface TextareaWithCounterProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxLength?: number;
  label?: string;
  helperText?: string;
  error?: string;
}

export function TextareaWithCounter({
  maxLength = 600,
  label,
  helperText,
  error,
  value,
  onChange,
  disabled = false,
  className = '',
  ...props
}: TextareaWithCounterProps) {
  const [internalValue, setInternalValue] = useState('');
  const currentValue = typeof value === 'string' ? value : internalValue;
  const currentLength = currentValue.length;
  const isNearLimit = currentLength > maxLength * 0.85;
  const isOverLimit = currentLength > maxLength;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (value === undefined) {
      setInternalValue(e.target.value);
    }
    onChange?.(e);
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block font-mono text-xs uppercase tracking-wider text-slate font-medium">
          {label}
        </label>
      )}

      <div className="relative">
        <textarea
          value={currentValue}
          onChange={handleChange}
          disabled={disabled}
          maxLength={maxLength}
          rows={4}
          className={`w-full bg-surface border font-sans text-sm p-3 text-ink placeholder:text-slate/60 focus:bg-paper focus:border-ink focus:outline-none transition-colors duration-120 resize-y min-h-[96px] ${
            error
              ? 'border-terracotta focus:border-terracotta'
              : 'border-ink/20 focus:border-ink'
          } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
          {...props}
        />
      </div>

      <div className="flex justify-between items-center text-xs">
        {error ? (
          <span className="font-sans text-terracotta text-xs">{error}</span>
        ) : helperText ? (
          <span className="font-sans text-slate text-xs">{helperText}</span>
        ) : (
          <span />
        )}

        <span
          className={`font-mono text-xs tabular-nums ${
            isOverLimit
              ? 'text-terracotta font-semibold'
              : isNearLimit
              ? 'text-amber'
              : 'text-slate'
          }`}
        >
          {currentLength} / {maxLength}
        </span>
      </div>
    </div>
  );
}
