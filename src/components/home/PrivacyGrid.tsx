'use client';

import React from 'react';
import {
  Lock,
  EyeOff,
  MessageSquareOff,
  Calendar,
  FileCheck2,
  UserX,
  TrendingDown,
  Award,
  ChevronRight,
} from 'lucide-react';
import { PrivacyThresholdDiagram } from '@/components/home/PrivacyThresholdDiagram';

export function PrivacyGrid() {
  const privacyTiles = [
    {
      title: 'Minimum Group of 5',
      icon: Lock,
      description: 'Squads under 5 respondents return strictly blank results. No scores or comments exist in database response payloads.',
    },
    {
      title: 'No Email or IP Linked',
      icon: EyeOff,
      description: 'Single-use cryptographic hashes verify survey eligibility without foreign keys, email joins, or IP address persistence.',
    },
    {
      title: 'Comments Never Shown Raw',
      icon: MessageSquareOff,
      description: 'Freeform text comments are scrubbed of PII, randomized, and processed through privacy-safe synthesis.',
    },
    {
      title: '90-Day Raw Data Purge',
      icon: Calendar,
      description: 'Scheduled automated Cloud Functions permanently erase raw responses and tokens 90 days following cycle closure.',
    },
    {
      title: 'Immutable Audit Log',
      icon: FileCheck2,
      description: 'All system exports, triage reviews, and administrative actions are logged in tamper-evident audit records.',
    },
    {
      title: 'No Individual Scores',
      icon: UserX,
      description: 'Engineers cannot be isolated or deanonymized. Mathematical differencing shields prevent deduction by subtraction.',
    },
    {
      title: 'No Manager Rankings',
      icon: TrendingDown,
      description: 'No competitive league tables or squad stack-ranking. Pulse measures operational process hygiene, not people.',
    },
    {
      title: 'Not Used for Appraisal',
      icon: Award,
      description: 'Strict governance policy guarantees data is never ingested into annual compensation, performance, or rating models.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* 4x2 Grid of Off-White Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {privacyTiles.map((tile, idx) => {
          const Icon = tile.icon;
          return (
            <a
              key={idx}
              href="#privacy"
              className="group p-5 rounded-panel bg-[#F8F7F4] dark:bg-[#071936] border border-[#E8E6E1] dark:border-[#1F3F6E] hover:border-[#2E8EBF] transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-control bg-[#2E8EBF]/15 text-[#1D6F9F] dark:text-[#4AA3D6] flex items-center justify-center">
                  <Icon size={16} />
                </div>
                <div className="text-xs font-semibold text-[#0B1B33] dark:text-[#EAF0F8]">
                  {tile.title}
                </div>
                <p className="text-[12px] text-[#5C6778] dark:text-[#9FB2CC] font-sans leading-relaxed">
                  {tile.description}
                </p>
              </div>

              <div className="pt-2 flex items-center text-[11px] font-mono text-[#1D6F9F] dark:text-[#4AA3D6] font-medium">
                <span>Verification guarantee</span>
                <ChevronRight
                  size={12}
                  className="chevron-nudge ml-1 transition-transform group-hover:translate-x-1"
                />
              </div>
            </a>
          );
        })}
      </div>

      {/* Interactive 4 vs 5 Group Simulator Diagram */}
      <div id="privacy-threshold" className="pt-2">
        <PrivacyThresholdDiagram />
      </div>
    </div>
  );
}
