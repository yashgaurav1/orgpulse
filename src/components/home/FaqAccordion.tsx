'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  id: string;
  q: string;
  a: string;
}

const FAQS_COL1: FaqItem[] = [
  {
    id: 'faq-1',
    q: 'Can delivery managers or leadership see who provided low scores?',
    a: 'No. Survey responses are stored with company, team, and cycle identifiers only. No user ID, email address, IP address, or fine timestamp is ever persisted with a response. Furthermore, if fewer than 5 members of a delivery squad respond, the entire squad is mathematically suppressed from both the interface and the database API.',
  },
  {
    id: 'faq-2',
    q: 'Who has access to confidential wellbeing support requests?',
    a: 'Support requests route strictly to the designated HR Business Partner or wellbeing coordinator. Direct managers, team leads, and executive leadership are explicitly firewalled by Cloud Firestore Security Rules and can never view support requests or chat histories.',
  },
  {
    id: 'faq-3',
    q: 'How does the 24/7 AI Wellbeing Companion protect employee privacy?',
    a: 'Companion chats are entirely private to the employee. They are never shown to managers or HR, and they are never mined for performance evaluations or sentiment rankings. Conversations can be deleted by the employee at any moment. In addition, an active safety layer monitors for acute crisis phrases and immediately displays verified 24/7 helplines (such as Tele-MANAS).',
  },
];

const FAQS_COL2: FaqItem[] = [
  {
    id: 'faq-4',
    q: 'What is differencing protection and how does it prevent deanonymization?',
    a: 'If a Business Unit has multiple teams and one small team has under 5 respondents, an attacker might try to subtract the visible team scores from the total unit score to derive the hidden team’s results. Pulse applies complementary suppression: when a hidden group exists, another group is pooled with it so no algebraic subtraction can leak scores.',
  },
  {
    id: 'faq-5',
    q: 'What happens to survey responses after a cycle closes?',
    a: 'An automated Cloud Function retention job purges all raw responses, comments, and invite records 90 days after a cycle closes, retaining only high-level aggregate summaries.',
  },
  {
    id: 'faq-6',
    q: 'Can employees take the survey voluntarily without consequences?',
    a: 'Yes. Participation is voluntary, every individual question is skippable, and single-use tokens ensure each employee can submit at most once without linking their identity to their responses.',
  },
];

export function FaqAccordion() {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const renderFaqItem = (faq: FaqItem) => {
    const isOpen = openId === faq.id;
    return (
      <div
        key={faq.id}
        className="rounded-panel bg-[#F8F7F4] dark:bg-[#071936] border border-[#E8E6E1] dark:border-[#1F3F6E] overflow-hidden transition-colors"
      >
        <button
          type="button"
          onClick={() => toggle(faq.id)}
          className="w-full p-5 text-left flex items-center justify-between gap-4 font-sans text-xs sm:text-sm font-semibold text-[#0B1B33] dark:text-[#EAF0F8] hover:text-[#1D6F9F] dark:hover:text-[#4AA3D6] transition-colors focus-ring"
          aria-expanded={isOpen}
        >
          <span>{faq.q}</span>
          <ChevronDown
            size={16}
            strokeWidth={1.5}
            className={`text-[#5C6778] dark:text-[#9FB2CC] transition-transform duration-200 flex-shrink-0 ${
              isOpen ? 'rotate-180 text-[#2E8EBF]' : ''
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 pt-1 text-xs text-[#5C6778] dark:text-[#9FB2CC] font-sans leading-relaxed border-t border-[#E8E6E1] dark:border-[#1F3F6E]">
                {faq.a}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
      <div className="space-y-4">{FAQS_COL1.map(renderFaqItem)}</div>
      <div className="space-y-4">{FAQS_COL2.map(renderFaqItem)}</div>
    </div>
  );
}
