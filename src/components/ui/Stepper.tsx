import React from 'react';

export interface StepItem {
  id: string;
  title: string;
  description?: string;
}

export interface StepperProps {
  steps: StepItem[];
  currentStepIndex: number;
  className?: string;
}

export function Stepper({ steps, currentStepIndex, className = '' }: StepperProps) {
  return (
    <nav aria-label="Progress" className={`w-full max-w-full overflow-x-auto ${className}`}>
      <ol className="flex items-center justify-between gap-2 sm:gap-4 min-w-[280px]">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const isUpcoming = idx > currentStepIndex;
          const stepNumber = String(idx + 1).padStart(2, '0');

          return (
            <li key={step.id} className="flex-1 flex items-center gap-2 sm:gap-3">
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-xs font-semibold px-1.5 py-0.5 border ${
                      isCompleted
                        ? 'bg-sage/40 text-ink border-sage/60'
                        : isCurrent
                        ? 'bg-terracotta text-paper border-terracotta'
                        : 'bg-paper text-slate border-ink/20'
                    }`}
                  >
                    {stepNumber}
                  </span>
                  <span
                    className={`font-sans text-xs sm:text-sm font-medium truncate ${
                      isCurrent ? 'text-ink font-semibold' : isCompleted ? 'text-ink' : 'text-slate'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {step.description && (
                  <span className="hidden sm:block font-sans text-xs text-slate truncate">
                    {step.description}
                  </span>
                )}
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-[1px] ml-2 ${
                    isCompleted ? 'bg-sage' : 'bg-ink/15'
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
