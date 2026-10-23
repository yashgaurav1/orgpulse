import React from 'react';
import { SummaryTheme } from '@/lib/gemini-summary';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { StatusBadge } from '@/components/enterprise/StatusBadge';

interface AiSummaryCardProps {
  allowed: boolean;
  themes: SummaryTheme[];
  neutralQuestion: string;
  label?: string;
  source?: 'cache' | 'fresh' | 'disabled' | 'below_threshold';
  commentCount?: number;
  reason?: string;
}

export function AiSummaryCard({
  allowed,
  themes,
  neutralQuestion,
  label = 'AI summary. Check against the scores before acting.',
  source,
  commentCount = 0,
  reason,
}: AiSummaryCardProps) {
  const frequencyBadges: Record<string, string> = {
    most: 'bg-accent text-white font-semibold',
    several: 'bg-theme-raised text-theme-primary border border-theme-border',
    'a few': 'bg-theme-surface text-theme-secondary border border-theme-subtle',
  };

  if (!allowed) {
    return (
      <div className="p-5 border hairline-border rounded-panel bg-theme-surface space-y-2 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="uppercase text-theme-tertiary font-semibold tracking-wider text-[11px]">
            AI Thematic Synthesis (Business Unit Level)
          </span>
          <StatusBadge label="Inactive" variant="neutral" size="sm" />
        </div>
        <p className="text-theme-secondary leading-relaxed font-sans text-xs">
          {source === 'disabled'
            ? 'The Gemini summary feature is currently disabled by governance policy. Unpaid API tiers may train on submitted text; this feature must remain disabled until an enterprise tier with confirmed contractual non-training terms is configured.'
            : 'Thematic summary is unavailable: requires a minimum of 10 respondents and 5 comments across the Business Unit.'}
        </p>
        {reason && (
          <span className="text-[10px] text-theme-tertiary block pt-1">
            Status Code: {reason} (Comments present: {commentCount})
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 border hairline-border rounded-panel bg-theme-surface space-y-4 shadow-sm font-mono text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-theme-subtle pb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-accent" />
          <span className="uppercase text-theme-primary font-bold tracking-wider text-xs">
            AI Thematic Synthesis
          </span>
          <span className="text-[10px] bg-accent/10 text-accent border border-accent/20 px-1.5 py-0.5 rounded-control">
            BU Scope (N &ge; 10)
          </span>
        </div>
        <div className="text-[11px] text-theme-tertiary">
          Legal review required &bull; Source: {source || 'fresh'}
        </div>
      </div>

      <div className="p-2.5 bg-accent/5 border border-accent/20 rounded-control text-xs font-sans text-theme-secondary">
        <strong className="text-theme-primary font-mono text-[11px] block">Mandatory Disclaimers:</strong>
        {label} Raw quotes are strictly prohibited; outputs represent non-attributable topic clusters.
      </div>

      {/* Neutral question suggestion */}
      <div className="p-3 bg-theme-raised border hairline-border rounded-control space-y-1">
        <span className="text-[10px] uppercase tracking-wider text-theme-tertiary block font-semibold">
          Recommended Neutral Dialogue Anchor
        </span>
        <p className="text-sm font-sans italic text-theme-primary">
          &ldquo;{neutralQuestion}&rdquo;
        </p>
      </div>

      {/* Themes List */}
      <div className="space-y-3 pt-1">
        <span className="text-[10px] uppercase tracking-wider text-theme-tertiary block font-semibold">
          Identified Cross-Squad Friction Themes
        </span>
        <div className="divide-y divide-theme-subtle border border-theme-subtle rounded-control overflow-hidden">
          {themes.map((theme, i) => (
            <div key={i} className="p-3 bg-theme-surface hover:bg-theme-raised/40 transition-colors space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-theme-primary">
                  {i + 1}. {theme.topic || theme.theme}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-control uppercase font-mono ${
                    frequencyBadges[theme.frequency.toLowerCase()] ||
                    'bg-theme-raised text-theme-secondary'
                  }`}
                >
                  {theme.frequency}
                </span>
              </div>
              {(theme.synthesis || (theme.topic && theme.theme !== theme.topic)) && (
                <p className="text-xs font-sans text-theme-secondary leading-relaxed">
                  {theme.synthesis || theme.theme}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
