'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SURVEY_QUESTIONS, RATING_SCALE, SurveySubmission } from '@/types/survey';
import { Locale, TRANSLATIONS } from '@/lib/i18n';
import { DrawCheck } from '@/components/motion';
import { StatusBadge } from '@/components/enterprise/StatusBadge';
import { ENTERPRISE_SQUADS } from '@/lib/enterprise-data';

interface SurveyContainerProps {
  token: string;
  squadName?: string;
  businessUnitName?: string;
  cycleName?: string;
}

type Step = 'notice' | 'questions' | 'submitted';

export function SurveyContainer({
  token,
  squadName = 'Squad 01 (Payments & Ledger)',
  businessUnitName = 'Financial Services',
  cycleName = 'Q1 2026 Full Pulse',
}: SurveyContainerProps) {
  const [locale, setLocale] = useState<Locale>('en');
  const [step, setStep] = useState<Step>('notice');
  const [hasConsented, setHasConsented] = useState(true);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0); // 0-5 for questions, 6 for comments
  const [slideDirection, setSlideDirection] = useState<'forward' | 'backward'>('forward');

  // Interactive squad toggle for demo simulation
  const [currentSquadName, setCurrentSquadName] = useState(squadName);

  const [ratings, setRatings] = useState<Record<string, number | null>>({
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null,
    q6: null,
  });
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const t = TRANSLATIONS[locale];

  const handleRatingChange = useCallback((qId: string, value: number) => {
    setRatings((prev) => ({
      ...prev,
      [qId]: value,
    }));

    // Auto-advance after 120ms token animation
    setTimeout(() => {
      setActiveQuestionIndex((prev) => {
        if (prev < SURVEY_QUESTIONS.length) {
          setSlideDirection('forward');
          return prev + 1;
        }
        return prev;
      });
    }, 120);
  }, []);

  const handleNextQuestion = useCallback(() => {
    setActiveQuestionIndex((prev) => {
      if (prev <= 5) {
        setSlideDirection('forward');
        return prev + 1;
      }
      return prev;
    });
  }, []);

  const handlePrevQuestion = useCallback(() => {
    setActiveQuestionIndex((prev) => {
      if (prev > 0) {
        setSlideDirection('backward');
        return prev - 1;
      }
      return prev;
    });
  }, []);

  const handleSkipQuestion = useCallback(() => {
    handleNextQuestion();
  }, [handleNextQuestion]);

  // Global keyboard shortcuts (1-5, Enter, Backspace, Esc)
  useEffect(() => {
    if (step !== 'questions') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'INPUT')) {
        return;
      }

      if (activeQuestionIndex < 6) {
        const currentQ = SURVEY_QUESTIONS[activeQuestionIndex];
        if (['1', '2', '3', '4', '5'].includes(e.key)) {
          e.preventDefault();
          handleRatingChange(currentQ.id, parseInt(e.key, 10));
          return;
        }

        if (e.key === 'Enter') {
          e.preventDefault();
          handleNextQuestion();
          return;
        }

        if (e.key === 'Backspace') {
          e.preventDefault();
          handlePrevQuestion();
          return;
        }

        if (e.key === 'Escape') {
          e.preventDefault();
          handleSkipQuestion();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, activeQuestionIndex, handleRatingChange, handleNextQuestion, handlePrevQuestion, handleSkipQuestion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const payload: SurveySubmission = {
      token,
      q1: ratings.q1,
      q2: ratings.q2,
      q3: ratings.q3,
      q4: ratings.q4,
      q5: ratings.q5,
      q6: ratings.q6,
      comment: comment.trim() || undefined,
    };

    try {
      const res = await fetch('/api/survey/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Failed to submit response');
      }

      setStep('submitted');
    } catch (err: any) {
      // In demo mode with sample token, provide clean completion
      if (token.startsWith('demo-token')) {
        setStep('submitted');
      } else {
        setSubmitError(err.message || 'Network error submitting survey');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const answeredCount = Object.values(ratings).filter((v) => v !== null).length;
  const remainingChars = 600 - comment.length;
  const currentQ = SURVEY_QUESTIONS[activeQuestionIndex];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 sm:py-12 text-theme-primary">
      {/* Top Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-theme-subtle pb-4 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
              PULSE / {cycleName}
            </span>
            <StatusBadge label="Anonymous Single-Use Token" variant="accent" size="sm" />
          </div>

          <div className="flex items-center gap-2 mt-1">
            {/* Squad switcher in sample mode */}
            <select
              value={currentSquadName}
              onChange={(e) => setCurrentSquadName(e.target.value)}
              className="bg-transparent font-mono text-xs text-theme-secondary hover:text-theme-primary cursor-pointer border-none p-0 focus:outline-none max-w-[240px] sm:max-w-md truncate"
            >
              {ENTERPRISE_SQUADS.map((s) => (
                <option key={s.id} value={s.name} className="bg-theme-surface text-theme-primary">
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Locale Selector */}
        <div className="flex items-center gap-1 self-start sm:self-auto bg-theme-surface p-1 border hairline-border rounded-control text-xs font-mono">
          <button
            type="button"
            onClick={() => setLocale('en')}
            className={`px-2 py-0.5 rounded-xs transition-colors ${
              locale === 'en'
                ? 'bg-accent text-white font-semibold'
                : 'text-theme-secondary hover:text-theme-primary'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLocale('hi')}
            className={`px-2 py-0.5 rounded-xs transition-colors ${
              locale === 'hi'
                ? 'bg-accent text-white font-semibold'
                : 'text-theme-secondary hover:text-theme-primary'
            }`}
          >
            हिन्दी
          </button>
          <button
            type="button"
            onClick={() => setLocale('kn')}
            className={`px-2 py-0.5 rounded-xs transition-colors ${
              locale === 'kn'
                ? 'bg-accent text-white font-semibold'
                : 'text-theme-secondary hover:text-theme-primary'
            }`}
          >
            ಕನ್ನಡ
          </button>
        </div>
      </header>

      {/* STEP 1: NOTICE & CONSENT GATE */}
      {step === 'notice' && (
        <section className="space-y-6">
          <div className="space-y-2">
            <span className="inline-block bg-accent/10 border border-accent/30 text-accent text-[11px] font-mono uppercase px-2 py-0.5 rounded-control font-semibold">
              {t.notice.badge}
            </span>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-theme-primary leading-tight">
              {t.notice.title}
            </h1>
            <p className="font-sans text-xs text-theme-secondary">
              Privacy notice shown before the survey. Legal review required before real use.
            </p>
          </div>

          <div className="divide-y divide-theme-subtle text-xs sm:text-sm leading-relaxed text-theme-secondary border-t border-b border-theme-subtle">
            <div className="py-3">
              <h2 className="font-mono text-xs uppercase tracking-wider text-theme-primary mb-1 font-semibold">
                {t.notice.whatIsCollectedTitle}
              </h2>
              <p className="font-sans text-xs text-theme-secondary">{t.notice.whatIsCollectedBody}</p>
            </div>

            <div className="py-3">
              <h2 className="font-mono text-xs uppercase tracking-wider text-accent mb-1 font-semibold">
                {t.notice.whatIsNotCollectedTitle}
              </h2>
              <p className="font-sans text-xs text-theme-secondary">{t.notice.whatIsNotCollectedBody}</p>
            </div>

            <div className="py-3">
              <h2 className="font-mono text-xs uppercase tracking-wider text-theme-primary mb-1 font-semibold">
                {t.notice.whoSeesWhatTitle}
              </h2>
              <p className="font-sans text-xs text-theme-secondary">{t.notice.whoSeesWhatBody}</p>
            </div>

            <div className="py-3">
              <h2 className="font-mono text-xs uppercase tracking-wider text-theme-primary mb-1 font-semibold">
                {t.notice.minimumGroupTitle}
              </h2>
              <p className="font-sans text-xs text-theme-secondary">{t.notice.minimumGroupBody}</p>
            </div>

            <div className="py-3">
              <h2 className="font-mono text-xs uppercase tracking-wider text-theme-primary mb-1 font-semibold">
                {t.notice.retentionTitle}
              </h2>
              <p className="font-sans text-xs text-theme-secondary">{t.notice.retentionBody}</p>
            </div>

            <div className="py-3 bg-accent/5 px-3 border border-accent/20 rounded-control my-2">
              <h2 className="font-mono text-xs uppercase tracking-wider text-accent mb-1 font-semibold">
                {t.notice.misconductWarningTitle}
              </h2>
              <p className="font-sans text-xs text-theme-primary">{t.notice.misconductWarningBody}</p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <label className="flex items-center gap-2 cursor-pointer font-sans text-xs text-theme-secondary">
              <input
                type="checkbox"
                checked={hasConsented}
                onChange={(e) => setHasConsented(e.target.checked)}
                className="accent-accent h-4 w-4"
              />
              <span>I understand the privacy guarantees and voluntary nature of this survey.</span>
            </label>

            <button
              type="button"
              disabled={!hasConsented}
              onClick={() => setStep('questions')}
              className="w-full sm:w-auto bg-accent hover:bg-accent-hover disabled:opacity-40 text-white px-6 py-2.5 font-mono text-xs uppercase tracking-wider rounded-control transition-colors focus-ring font-medium shadow-sm"
            >
              {t.notice.startButton} &rarr;
            </button>
          </div>
        </section>
      )}

      {/* STEP 2: ONE QUESTION PER SCREEN & PROGRESS */}
      {step === 'questions' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Thin Top Accent Progress Bar */}
          <div className="w-full bg-theme-raised h-[2px] overflow-hidden rounded-full" aria-hidden="true">
            <div
              className="h-full bg-accent transition-all duration-200"
              style={{
                width: `${(answeredCount / 6) * 100}%`,
              }}
            />
          </div>

          <div className="border-b border-theme-subtle pb-3">
            <div className="flex items-center justify-between">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-[-0.02em] text-theme-primary">
                {t.survey.title}
              </h1>
              <span className="font-mono text-xs text-theme-tertiary">
                {answeredCount} of 6 answered
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs font-mono text-accent">
                &bull; {t.survey.skippableNote}
              </p>
              <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] text-theme-tertiary">
                <span>[1-5] Select</span>
                <span>[Enter] Next</span>
                <span>[Bksp] Back</span>
                <span>[Esc] Skip</span>
              </div>
            </div>
          </div>

          {/* Stepper Navigation Pills */}
          <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-theme-subtle">
            {SURVEY_QUESTIONS.map((q, idx) => {
              const isAnswered = ratings[q.id] !== null;
              const isCurrent = idx === activeQuestionIndex;

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    setSlideDirection(idx > activeQuestionIndex ? 'forward' : 'backward');
                    setActiveQuestionIndex(idx);
                  }}
                  className={`flex-1 py-1.5 px-1 font-mono text-[11px] text-center rounded-control border transition-all duration-120 ${
                    isCurrent
                      ? 'bg-accent text-white border-accent font-bold shadow-xs'
                      : isAnswered
                      ? 'bg-theme-surface text-theme-primary border-theme-border font-medium'
                      : 'bg-theme-raised text-theme-tertiary border-theme-subtle hover:border-theme-border'
                  }`}
                  aria-label={`Jump to question ${idx + 1}`}
                >
                  0{idx + 1}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setActiveQuestionIndex(6)}
              className={`py-1.5 px-3 font-mono text-[11px] rounded-control border transition-all duration-120 ${
                activeQuestionIndex === 6
                  ? 'bg-accent text-white border-accent font-bold'
                  : 'bg-theme-raised text-theme-tertiary border-theme-subtle hover:border-theme-border'
              }`}
              aria-label="Jump to optional feedback"
            >
              Notes
            </button>
          </div>

          {/* Question View (Active Question 0-5) */}
          {activeQuestionIndex < SURVEY_QUESTIONS.length && currentQ && (
            <fieldset
              key={currentQ.id}
              role="group"
              aria-label={`Question ${currentQ.number}: ${t.questions[currentQ.id]?.text || currentQ.text}`}
              className="p-6 sm:p-8 rounded-panel bg-theme-surface border hairline-border space-y-6"
            >
              <legend className="sr-only">
                Question {currentQ.number}: {t.questions[currentQ.id]?.text || currentQ.text}
              </legend>

              <div className="flex items-baseline justify-between gap-2 border-b border-theme-subtle pb-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-sm font-bold text-accent">
                    Question 0{currentQ.number} of 06
                  </span>
                  <span className="font-mono text-xs uppercase tracking-wider text-theme-tertiary">
                    &bull; {t.questions[currentQ.id]?.domain || currentQ.domain}
                  </span>
                </div>
                {ratings[currentQ.id] !== null && (
                  <span className="font-mono text-xs text-theme-primary font-semibold">
                    Saved: {ratings[currentQ.id]} / 5
                  </span>
                )}
              </div>

              <p className="text-lg sm:text-xl font-medium text-theme-primary leading-relaxed">
                {t.questions[currentQ.id]?.text || currentQ.text}
              </p>

              {/* Large 1-5 Scale Radios */}
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-5 gap-2 sm:gap-3">
                  {RATING_SCALE.map((scale) => {
                    const isSelected = ratings[currentQ.id] === scale.value;
                    const scaleLabel =
                      t.survey.scaleLabels[scale.value] || scale.label;

                    return (
                      <button
                        key={scale.value}
                        type="button"
                        onClick={() => handleRatingChange(currentQ.id, scale.value)}
                        className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-panel border transition-all duration-120 select-none ${
                          isSelected
                            ? 'bg-accent text-white border-accent scale-[1.03] shadow-md font-semibold'
                            : 'bg-theme-raised text-theme-primary border-theme-border hover:bg-theme-surface hover:border-accent/40'
                        }`}
                      >
                        <span className="font-mono text-lg sm:text-xl font-bold tabular-nums">
                          {scale.value}
                        </span>
                        <span
                          className={`text-[10px] sm:text-xs leading-tight mt-1 text-center ${
                            isSelected ? 'text-white/95' : 'text-theme-secondary'
                          }`}
                        >
                          {scaleLabel}
                        </span>
                        <span className="font-mono text-[9px] opacity-40 mt-1 hidden sm:inline">
                          [{scale.value}]
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between text-xs font-mono text-theme-tertiary pt-1 px-1">
                  <span>1: Strongly Disagree</span>
                  <span>5: Strongly Agree</span>
                </div>
              </div>

              {/* Question Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-theme-subtle">
                <button
                  type="button"
                  disabled={activeQuestionIndex === 0}
                  onClick={handlePrevQuestion}
                  className="font-mono text-xs text-theme-secondary hover:text-theme-primary disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  &larr; Previous Question
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSkipQuestion}
                    className="font-mono text-xs text-theme-secondary hover:text-theme-primary underline underline-offset-4"
                  >
                    Skip &rarr;
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSlideDirection('forward');
                      setActiveQuestionIndex((prev) => prev + 1);
                    }}
                    className="font-mono text-xs bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-control transition-colors font-medium shadow-xs"
                  >
                    {activeQuestionIndex === 5 ? 'Review & Notes &rarr;' : 'Next Question &rarr;'}
                  </button>
                </div>
              </div>
            </fieldset>
          )}

          {/* Step 6: Review & Optional Operational Feedback */}
          {activeQuestionIndex === 6 && (
            <div className="p-6 sm:p-8 rounded-panel bg-theme-surface border hairline-border space-y-6">
              <div className="border-b border-theme-subtle pb-3">
                <span className="font-mono text-xs uppercase tracking-wider text-theme-tertiary font-semibold block">
                  Final Step &bull; Qualitative Context
                </span>
                <label
                  htmlFor="operational-comment"
                  className="text-xl sm:text-2xl font-semibold text-theme-primary block mt-0.5"
                >
                  {t.survey.openQuestionTitle}
                </label>
                <p className="font-sans text-xs text-theme-secondary mt-1">
                  {t.survey.openQuestionSubtext}
                </p>
              </div>

              <textarea
                id="operational-comment"
                rows={5}
                maxLength={600}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t.survey.openQuestionPlaceholder}
                className="w-full bg-theme-raised border hairline-border rounded-control p-3.5 text-sm font-sans text-theme-primary focus-ring placeholder-theme-tertiary resize-y"
              />

              <div className="flex justify-between items-center text-xs font-mono text-theme-tertiary">
                <span>Max 600 characters &bull; PII scrubbed</span>
                <span className={remainingChars < 50 ? 'text-warning font-semibold' : ''}>
                  {remainingChars} {t.survey.charCount}
                </span>
              </div>

              {submitError && (
                <div className="p-3 bg-danger/10 border border-danger/30 text-danger text-xs font-mono rounded-control">
                  {submitError}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-theme-subtle">
                <button
                  type="button"
                  onClick={handlePrevQuestion}
                  className="font-mono text-xs text-theme-secondary hover:text-theme-primary underline underline-offset-4"
                >
                  &larr; Back to Question 06
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-accent hover:bg-accent-hover disabled:opacity-50 text-white px-8 py-2.5 rounded-control font-mono text-xs uppercase tracking-wider transition-colors font-semibold shadow-sm"
                >
                  {isSubmitting ? t.survey.submittingButton : t.survey.submitButton}
                </button>
              </div>
            </div>
          )}

          {/* Quick Jump Bar when on Question 0-5 */}
          {activeQuestionIndex < 6 && (
            <div className="flex justify-between items-center text-xs font-mono text-theme-tertiary pt-2 border-t border-theme-subtle">
              <span>{answeredCount} of 6 questions completed</span>
              <button
                type="button"
                onClick={() => setActiveQuestionIndex(6)}
                className="hover:text-theme-primary underline underline-offset-4"
              >
                Jump to optional feedback &rarr;
              </button>
            </div>
          )}
        </form>
      )}

      {/* STEP 3: SUBMISSION CONFIRMATION */}
      {step === 'submitted' && (
        <section className="text-center py-12 space-y-6 bg-theme-surface p-8 rounded-panel border hairline-border">
          <div className="flex justify-center">
            <DrawCheck size={48} color="#3D7BFF" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-theme-primary">
              {t.thankYou.title}
            </h1>
            <p className="font-sans text-sm text-theme-secondary max-w-md mx-auto leading-relaxed">
              {t.thankYou.message}
            </p>
          </div>

          <div className="pt-6 border-t border-theme-subtle max-w-sm mx-auto space-y-1">
            <p className="font-mono text-xs text-theme-secondary">
              {t.thankYou.privacyReminder}
            </p>
            <p className="font-mono text-[11px] text-theme-tertiary">
              Database token state: BURNED &bull; Zero retention of response timestamps.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
