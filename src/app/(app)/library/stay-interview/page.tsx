'use client';

import React from 'react';
import { ScrollProgress } from '@/components/motion';
import { StatusBadge } from '@/components/enterprise/StatusBadge';
import { MessageSquare, HelpCircle } from 'lucide-react';

const STAY_INTERVIEW_QUESTIONS = [
  {
    num: 1,
    question: 'What aspects of your current project make you look forward to work each week?',
    intent: 'Identifies core motivational drivers, technical affinity, and positive team dynamics.',
  },
  {
    num: 2,
    question: 'Looking back at recent quarters, which technical problem or deliverable gave you the greatest sense of accomplishment?',
    intent: 'Reveals competence peaks and the types of engineering challenges that sustain engagement.',
  },
  {
    num: 3,
    question: 'Which recurring administrative tasks, meetings, or approval processes drain your daily energy?',
    intent: 'Surfaces bureaucratic friction, context-switching overhead, and process inefficiencies.',
  },
  {
    num: 4,
    question: 'If you had the authority to alter one internal process in our squad starting tomorrow, what would you change?',
    intent: 'Uncovers actionable operational improvements and empowers technical ownership.',
  },
  {
    num: 5,
    question: 'Which technical tools, languages, or domain skills do you want to build over the coming year?',
    intent: 'Aligns upcoming sprint opportunities with individual career progression goals.',
  },
  {
    num: 6,
    question: 'How can we adjust your daily project tasks to give you exposure to those technical areas?',
    intent: 'Practical job-crafting dialogue to weave stretch opportunities into client deliverables.',
  },
  {
    num: 7,
    question: 'What types of project roadblocks or organizational issues might prompt you to consider external job offers?',
    intent: 'Identifies systemic frustrations early before they translate into silent disengagement.',
  },
  {
    num: 8,
    question: 'How manageable is your daily work schedule alongside your commute, family obligations, and personal life? (Share only what you wish to.)',
    intent: 'Evaluates workload sustainability with explicit psychological safety and personal privacy boundaries.',
  },
  {
    num: 9,
    question: 'What specific actions can I take as your lead to better support your day-to-day delivery tasks?',
    intent: 'Establishes bidirectional accountability and managerial responsiveness.',
  },
];

export default function StayInterviewGuidePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 text-theme-primary">
      <ScrollProgress />

      {/* Header */}
      <header className="border-b border-theme-subtle pb-6 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
            Retention Toolkits
          </span>
          <StatusBadge label="Structured Dialogue Protocol" variant="accent" size="sm" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-theme-primary leading-tight">
          Stay Interview Question Guide
        </h1>
        <p className="font-mono text-xs text-theme-secondary">
          Nine semi-structured exploratory questions to understand employee engagement before resignation risk emerges
        </p>
      </header>

      {/* Rationale Banner */}
      <div className="p-4 rounded-panel bg-theme-raised border hairline-border space-y-2 text-xs leading-relaxed">
        <p className="font-semibold text-theme-primary flex items-center gap-2">
          <MessageSquare size={14} className="text-accent" />
          <span>Core Intent: Proactive Retention Discovery</span>
        </p>
        <p className="text-theme-secondary font-sans leading-relaxed text-[13px]">
          Exit interviews only reveal why someone already left. Stay interviews uncover what keeps high-performing engineers engaged, and what friction could tempt them elsewhere. Conduct these semi-annually with every squad member.
        </p>
      </div>

      {/* 9 Structured Questions */}
      <section className="space-y-4">
        <div className="divide-y divide-theme-subtle border border-theme-subtle rounded-panel overflow-hidden bg-theme-surface">
          {STAY_INTERVIEW_QUESTIONS.map((item) => (
            <div
              key={item.num}
              className="p-5 hover:bg-theme-raised/40 transition-colors space-y-2 text-xs"
            >
              <div className="flex items-start gap-3">
                <span className="px-2 py-0.5 rounded-control bg-accent/10 text-accent font-mono text-xs font-semibold">
                  0{item.num}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-theme-primary leading-relaxed">
                    {item.question}
                  </h3>
                  <div className="mt-1 text-theme-tertiary font-mono text-[11px] flex items-center gap-1.5">
                    <span className="text-accent font-bold">Intent:</span>
                    <span>{item.intent}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
