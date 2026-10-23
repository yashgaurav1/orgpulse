'use client';

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Send,
  EyeOff,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Lock,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../lib/auth-context';

export interface SupportRequest {
  id: string;
  category: string;
  urgency: 'normal' | 'elevated' | 'critical';
  isAnonymous: boolean;
  subject: string;
  description: string;
  status: 'open' | 'in_review' | 'assigned' | 'resolved' | 'withdrawn';
  createdAt: string;
  assignedHrbpName?: string;
  messages: Array<{
    id: string;
    sender: 'employee' | 'hrbp';
    text: string;
    timestamp: string;
  }>;
}

const SAMPLE_REQUESTS: SupportRequest[] = [
  {
    id: 'req-2026-081',
    category: 'Workload & On-Call Strain',
    urgency: 'elevated',
    isAnonymous: true,
    subject: 'Continuous weekend on-call pages without recovery time',
    description: 'Our squad has had 3 consecutive weeks of high on-call volume due to legacy migrations. Experiencing severe sleep deprivation.',
    status: 'assigned',
    createdAt: '2026-02-14T09:30:00Z',
    assignedHrbpName: 'Kavita Menon (Lead HRBP)',
    messages: [
      {
        id: 'm1',
        sender: 'employee',
        text: 'I submitted this confidentially. The pager duty rotation has not had a compensatory day off.',
        timestamp: '2026-02-14 09:30',
      },
      {
        id: 'm2',
        sender: 'hrbp',
        text: 'Thank you for reaching out. I am working with the director to establish a mandatory 24-hour post-call recovery window for your squad. Your name is strictly protected.',
        timestamp: '2026-02-14 14:15',
      },
    ],
  },
];

interface SupportRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupportRequestModal({ isOpen, onClose }: SupportRequestModalProps) {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'new' | 'tracking'>('new');
  const [category, setCategory] = useState('Burnout / Fatigue');
  const [urgency, setUrgency] = useState<'normal' | 'elevated' | 'critical'>('normal');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submittedRequests, setSubmittedRequests] = useState<SupportRequest[]>(SAMPLE_REQUESTS);
  const [activeRequestDetail, setActiveRequestDetail] = useState<SupportRequest | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newReq: SupportRequest = {
        id: `req-2026-${Math.floor(100 + Math.random() * 900)}`,
        category,
        urgency,
        isAnonymous,
        subject,
        description,
        status: 'open',
        createdAt: new Date().toISOString(),
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: 'employee',
            text: description,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      };

      setSubmittedRequests((prev) => [newReq, ...prev]);
      setIsSubmitting(false);
      setSuccessBanner(true);
      setSubject('');
      setDescription('');
      setTimeout(() => {
        setSuccessBanner(false);
        setActiveTab('tracking');
      }, 1500);
    }, 600);
  };

  const handleWithdrawRequest = (reqId: string) => {
    setSubmittedRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: 'withdrawn' } : r))
    );
    if (activeRequestDetail && activeRequestDetail.id === reqId) {
      setActiveRequestDetail((prev) => (prev ? { ...prev, status: 'withdrawn' } : null));
    }
  };

  const handleSendReply = (reqId: string) => {
    if (!replyText.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'employee' as const,
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setSubmittedRequests((prev) =>
      prev.map((r) =>
        r.id === reqId ? { ...r, messages: [...r.messages, newMsg] } : r
      )
    );

    if (activeRequestDetail && activeRequestDetail.id === reqId) {
      setActiveRequestDetail((prev) =>
        prev ? { ...prev, messages: [...prev.messages, newMsg] } : null
      );
    }

    setReplyText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 8 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-2xl bg-theme-surface border hairline-border rounded-panel shadow-2xl flex flex-col max-h-[90vh] overflow-hidden z-10"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-theme-subtle bg-theme-raised flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-control bg-accent/10 border border-accent/20 text-accent flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-theme-primary tracking-tight">
                Confidential Wellbeing Support Request
              </h2>
              <p className="text-xs text-accent font-mono">
                Firewalled Directly to Assigned HRBP • Zero Manager Access
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-theme-tertiary hover:text-theme-primary rounded-control hover:bg-theme-surface transition-colors focus-ring"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-theme-subtle px-4 bg-theme-surface">
          <button
            onClick={() => {
              setActiveTab('new');
              setActiveRequestDetail(null);
            }}
            className={`py-2.5 px-3 text-xs font-mono border-b-2 transition-all ${
              activeTab === 'new'
                ? 'border-accent text-accent font-semibold'
                : 'border-transparent text-theme-secondary hover:text-theme-primary'
            }`}
          >
            Submit New Request
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`py-2.5 px-3 text-xs font-mono border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'tracking'
                ? 'border-accent text-accent font-semibold'
                : 'border-transparent text-theme-secondary hover:text-theme-primary'
            }`}
          >
            <span>My Active Requests</span>
            <span className="px-1.5 py-0.2 rounded-full bg-theme-raised border hairline-border text-[10px]">
              {submittedRequests.length}
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'new' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Safe Privacy Callout */}
              <div className="p-3 bg-theme-raised border hairline-border rounded-control flex items-start gap-2.5 text-xs">
                <Lock size={15} className="text-success flex-shrink-0 mt-0.5" />
                <div className="text-theme-secondary font-sans leading-relaxed">
                  <strong className="text-theme-primary font-semibold">Strict Confidentiality Guarantee: </strong>
                  This request bypasses all managers and executives. It is encrypted and visible only to the dedicated HR Business Partner assigned to your unit.
                </div>
              </div>

              {/* Category & Urgency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <label className="block text-theme-tertiary uppercase text-[11px] mb-1">
                    Category of Support
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-9 px-2.5 bg-theme-raised border hairline-border rounded-control text-xs text-theme-primary focus-ring"
                  >
                    <option>Burnout / Fatigue</option>
                    <option>Team Dynamics / Interpersonal</option>
                    <option>Workload & On-Call Strain</option>
                    <option>Mental Health & Stress</option>
                    <option>Career & Growth Concerns</option>
                    <option>Other / Unspecified</option>
                  </select>
                </div>

                <div>
                  <label className="block text-theme-tertiary uppercase text-[11px] mb-1">
                    Urgency Level
                  </label>
                  <div className="flex gap-1.5">
                    {[
                      { id: 'normal', label: 'Normal' },
                      { id: 'elevated', label: 'Elevated' },
                      { id: 'critical', label: 'Critical' },
                    ].map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => setUrgency(u.id as any)}
                        className={`flex-1 h-9 rounded-control border text-xs text-center transition-all ${
                          urgency === u.id
                            ? u.id === 'critical'
                              ? 'bg-danger/10 border-danger text-danger font-semibold'
                              : u.id === 'elevated'
                              ? 'bg-warning/10 border-warning text-warning font-semibold'
                              : 'bg-accent/10 border-accent text-accent font-semibold'
                            : 'bg-theme-raised border-theme-border text-theme-secondary'
                        }`}
                      >
                        {u.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Anonymous Option */}
              <div className="p-3 bg-theme-raised border hairline-border rounded-control flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <EyeOff size={15} className="text-theme-tertiary" />
                  <div>
                    <div className="text-xs font-semibold text-theme-primary">
                      Submit Anonymously (Pseudonymized Token)
                    </div>
                    <div className="text-[11px] text-theme-tertiary font-sans">
                      Your name and email will be replaced with a random support token.
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="accent-accent w-4 h-4 cursor-pointer"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-mono text-theme-tertiary uppercase mb-1">
                  Brief Summary / Subject
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Need assistance with on-call recovery or team conflict"
                  className="w-full h-9 px-3 bg-theme-raised border hairline-border rounded-control text-xs text-theme-primary focus-ring"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-mono text-theme-tertiary uppercase mb-1">
                  Detailed Context (What would be most helpful?)
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Share as much or as little context as you feel comfortable. You can specify whether you prefer written guidance or an async follow-up."
                  className="w-full p-3 bg-theme-raised border hairline-border rounded-control text-xs text-theme-primary focus-ring"
                />
              </div>

              {successBanner && (
                <div className="p-3 bg-success/10 border border-success/30 rounded-control text-xs font-mono text-success flex items-center gap-2">
                  <CheckCircle2 size={14} />
                  <span>Support request submitted securely to assigned HRBP.</span>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-theme-raised hover:bg-theme-surface border hairline-border text-theme-secondary text-xs font-mono rounded-control transition-colors focus-ring"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white text-xs font-mono font-medium rounded-control transition-colors shadow-xs flex items-center gap-2 focus-ring"
                >
                  <Send size={13} />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Confidential Request'}</span>
                </button>
              </div>
            </form>
          ) : activeRequestDetail ? (
            /* Active Request Thread View */
            <div className="space-y-4">
              <button
                onClick={() => setActiveRequestDetail(null)}
                className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
              >
                ← Back to all requests
              </button>

              <div className="p-4 bg-theme-raised border hairline-border rounded-control space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-theme-primary">
                      {activeRequestDetail.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase ${
                        activeRequestDetail.status === 'assigned'
                          ? 'bg-accent/10 text-accent border border-accent/20'
                          : activeRequestDetail.status === 'withdrawn'
                          ? 'bg-theme-subtle text-theme-tertiary'
                          : 'bg-warning/10 text-warning border border-warning/20'
                      }`}
                    >
                      {activeRequestDetail.status}
                    </span>
                  </div>

                  {activeRequestDetail.status !== 'withdrawn' && (
                    <button
                      onClick={() => handleWithdrawRequest(activeRequestDetail.id)}
                      className="text-xs font-mono text-danger hover:underline"
                    >
                      Withdraw Request
                    </button>
                  )}
                </div>

                <h3 className="text-sm font-semibold text-theme-primary">
                  {activeRequestDetail.subject}
                </h3>
                <p className="text-xs text-theme-secondary font-sans">
                  {activeRequestDetail.description}
                </p>

                <div className="pt-2 border-t border-theme-subtle flex items-center justify-between text-[11px] font-mono text-theme-tertiary">
                  <span>Assigned HRBP: {activeRequestDetail.assignedHrbpName || 'Triage in progress'}</span>
                  <span>Created: {new Date(activeRequestDetail.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Message Thread */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-mono uppercase tracking-wider text-theme-tertiary">
                  Confidential Messages
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto p-2 bg-theme-raised/30 border hairline-border rounded-control">
                  {activeRequestDetail.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-3 rounded-control text-xs ${
                        m.sender === 'employee'
                          ? 'bg-theme-surface border hairline-border ml-6 text-theme-primary'
                          : 'bg-accent/10 border border-accent/20 mr-6 text-theme-primary'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-[10px] text-theme-tertiary mb-1">
                        <span>{m.sender === 'employee' ? 'You' : activeRequestDetail.assignedHrbpName || 'HRBP'}</span>
                        <span>{m.timestamp}</span>
                      </div>
                      <div className="font-sans leading-relaxed">{m.text}</div>
                    </div>
                  ))}
                </div>

                {activeRequestDetail.status !== 'withdrawn' && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Reply confidentially to your HRBP..."
                      className="flex-1 h-9 px-3 bg-theme-raised border hairline-border rounded-control text-xs text-theme-primary focus-ring"
                    />
                    <button
                      type="button"
                      onClick={() => handleSendReply(activeRequestDetail.id)}
                      className="h-9 px-4 bg-accent hover:bg-accent-hover text-white text-xs font-mono rounded-control transition-colors shadow-xs"
                    >
                      Send
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Requests List View */
            <div className="space-y-3">
              {submittedRequests.map((req) => (
                <div
                  key={req.id}
                  onClick={() => setActiveRequestDetail(req)}
                  className="p-3.5 bg-theme-raised hover:bg-theme-surface border hairline-border rounded-control cursor-pointer transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-theme-primary">
                        {req.id}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                        {req.category}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase ${
                        req.status === 'assigned'
                          ? 'bg-accent/10 text-accent'
                          : req.status === 'withdrawn'
                          ? 'bg-theme-subtle text-theme-tertiary'
                          : 'bg-warning/10 text-warning'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <div className="text-xs font-medium text-theme-primary line-clamp-1">
                    {req.subject}
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-theme-tertiary pt-1">
                    <span>Assigned: {req.assignedHrbpName || 'Pending review'}</span>
                    <span className="text-accent hover:underline flex items-center gap-1">
                      <span>View Thread ({req.messages.length})</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
