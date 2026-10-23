'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  PhoneCall,
  Shield,
  Trash2,
  Sparkles,
  Bot,
  User,
  Heart,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Wind,
  CheckCircle2,
  Copy,
  Clock,
  EyeOff,
  Download,
  Play,
  Pause,
  RotateCcw,
  Smile,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { COMPANION_BOTS, CompanionBot } from '../../lib/companion-bots-data';
import { useAuth } from '../../lib/auth-context';

interface Message {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isCrisis?: boolean;
  groundingExercise?: {
    name: string;
    steps: string[];
  };
}

interface CompanionChatProps {
  initialBotId?: string;
  onOpenSupportModal?: () => void;
}

export function CompanionChat({
  initialBotId = 'bot-manas',
  onOpenSupportModal,
}: CompanionChatProps) {
  const { profile } = useAuth();
  const [selectedBotId, setSelectedBotId] = useState(initialBotId);
  const activeBot =
    COMPANION_BOTS.find((b) => b.id === selectedBotId) || COMPANION_BOTS[0];

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [saveHistory, setSaveHistory] = useState(false);
  const [crisisDetected, setCrisisDetected] = useState(false);
  const [copiedHelpline, setCopiedHelpline] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [moodRating, setMoodRating] = useState<number | null>(null);
  const [isBreathingGuideOpen, setIsBreathingGuideOpen] = useState(false);
  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([
    'Tell me about Tele-MANAS (14416)',
    'How do I manage burnout & fatigue?',
    'Guide me through 4-7-8 breathing',
    'How to set boundaries on Slack & after-hours',
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Somatic Breathing Guide State (4-7-8)
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathingTimer, setBreathingTimer] = useState(4);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingCyclesCompleted, setBreathingCyclesCompleted] = useState(0);

  // Initialize messages on companion change
  useEffect(() => {
    setMessages([
      {
        id: 'msg-welcome',
        sender: 'assistant',
        content: activeBot.greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setCrisisDetected(false);
  }, [activeBot]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Breathing Guide Timer Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (breathingActive && isBreathingGuideOpen) {
      interval = setInterval(() => {
        setBreathingTimer((prev) => {
          if (prev > 1) return prev - 1;

          // Transition between phases
          if (breathingPhase === 'Inhale') {
            setBreathingPhase('Hold');
            return 7;
          } else if (breathingPhase === 'Hold') {
            setBreathingPhase('Exhale');
            return 8;
          } else {
            setBreathingPhase('Inhale');
            setBreathingCyclesCompleted((c) => c + 1);
            return 4;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [breathingActive, breathingPhase, isBreathingGuideOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/companion/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          botId: activeBot.id,
          history: messages.slice(-5).map((m) => ({ sender: m.sender, content: m.content })),
          clientMoodRating: moodRating || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      setIsTyping(false);

      if (data.isCrisis) {
        setCrisisDetected(true);
      }

      if (data.suggestions && Array.isArray(data.suggestions)) {
        setDynamicSuggestions(data.suggestions);
      }

      const botMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCrisis: data.isCrisis,
        groundingExercise: data.groundingExercise,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.warn('Network call failed, using graceful client fallback:', err);
      setIsTyping(false);

      let fallbackReply =
        "Thank you for sharing that with me. Tele-MANAS (14416) is available 24/7 as a free, confidential national helpline across India. Taking a pause, breathing with intent, and prioritizing restorative rest are fundamental rights, not privileges.";

      if (text.toLowerCase().includes('manas') || text.toLowerCase().includes('tele-manas')) {
        fallbackReply =
          "Tele-MANAS is the Government of India's flagship mental health service, operated via NIMHANS Bangalore. Dial toll-free 14416 or 1800-891-4416 anytime, 24/7 across India in 20+ languages for confidential psychological counseling.";
      }

      const botMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        content: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'msg-welcome',
        sender: 'assistant',
        content: activeBot.greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setCrisisDetected(false);
  };

  const handleCopyHelpline = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedHelpline(true);
    setTimeout(() => setCopiedHelpline(false), 2000);
  };

  const handleExportSession = () => {
    const formatted = messages
      .map((m) => `[${m.timestamp}] ${m.sender.toUpperCase()}: ${m.content}`)
      .join('\n\n');

    const blob = new Blob([`Pulse Wellbeing Session Export (${activeBot.name})\n\n${formatted}`], {
      type: 'text/plain',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pulse-companion-notes-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-[750px] bg-theme-surface border hairline-border rounded-panel overflow-hidden shadow-sm">
      {/* Companion Header */}
      <div className="p-4 border-b border-theme-subtle bg-theme-raised flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-panel bg-theme-surface border hairline-border flex items-center justify-center text-2xl shadow-xs">
            {activeBot.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-theme-primary">
                {activeBot.name}
              </h2>
              <span className="w-2 h-2 rounded-full bg-success animate-live-dot" />
              <span className="text-[10px] text-theme-tertiary font-mono">
                Active Companion
              </span>
            </div>
            <p className="text-xs text-accent font-mono truncate max-w-xs">
              {activeBot.role} : {activeBot.primaryTone}
            </p>
          </div>
        </div>

        {/* Companion Selector, Breathing Toggle & History Controls */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              setIsBreathingGuideOpen(!isBreathingGuideOpen);
              if (!breathingActive) setBreathingActive(true);
            }}
            className={`px-2.5 py-1.5 rounded-control border hairline-border flex items-center gap-1.5 transition-colors focus-ring ${
              isBreathingGuideOpen
                ? 'bg-accent text-white border-accent'
                : 'bg-theme-surface text-theme-secondary hover:text-theme-primary'
            }`}
            title="Toggle 4-7-8 Breathing Guide"
          >
            <Wind size={13} />
            <span className="hidden sm:inline">4-7-8 Breath</span>
          </button>

          <select
            value={selectedBotId}
            onChange={(e) => setSelectedBotId(e.target.value)}
            className="h-8 px-2 bg-theme-surface border hairline-border rounded-control text-xs text-theme-primary focus-ring"
          >
            {COMPANION_BOTS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.role.split('&')[0].trim()})
              </option>
            ))}
          </select>

          <button
            onClick={handleExportSession}
            className="p-1.5 text-theme-tertiary hover:text-theme-primary hover:bg-theme-surface border hairline-border rounded-control transition-colors focus-ring"
            title="Export private session notes (client-only)"
            aria-label="Export private session notes"
          >
            <Download size={14} />
          </button>

          <button
            onClick={handleClearHistory}
            className="p-1.5 text-theme-tertiary hover:text-danger hover:bg-theme-surface border hairline-border rounded-control transition-colors focus-ring"
            title="Clear conversation history"
            aria-label="Clear conversation history"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Interactive Somatic Breathing Visualizer (collapsible) */}
      <AnimatePresence>
        {isBreathingGuideOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-theme-subtle bg-theme-surface p-4"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Expanding Breathing Circle */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale:
                        breathingPhase === 'Inhale'
                          ? 1.35
                          : breathingPhase === 'Hold'
                          ? 1.35
                          : 0.9,
                    }}
                    transition={{
                      duration:
                        breathingPhase === 'Inhale' ? 4 : breathingPhase === 'Hold' ? 0.3 : 8,
                      ease: 'easeInOut',
                    }}
                    className={`absolute inset-0 rounded-full border-2 ${
                      breathingPhase === 'Inhale'
                        ? 'border-accent bg-accent/15'
                        : breathingPhase === 'Hold'
                        ? 'border-warning bg-warning/15'
                        : 'border-success bg-success/15'
                    }`}
                  />
                  <div className="relative z-10 text-center font-mono">
                    <div className="text-sm font-bold text-theme-primary">{breathingTimer}s</div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
                      {breathingPhase}
                    </span>
                    <span className="text-[10px] text-theme-tertiary font-mono">
                      Cycle {breathingCyclesCompleted + 1}
                    </span>
                  </div>
                  <p className="text-xs text-theme-secondary font-sans mt-0.5">
                    {breathingPhase === 'Inhale' && 'Inhale gently through nose for 4 counts.'}
                    {breathingPhase === 'Hold' && 'Hold breath softly for 7 counts.'}
                    {breathingPhase === 'Exhale' && 'Exhale completely through mouth for 8 counts.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBreathingActive(!breathingActive)}
                  className="px-3 py-1.5 bg-theme-raised hover:bg-theme-border border hairline-border rounded-control text-xs font-mono text-theme-primary flex items-center gap-1.5 focus-ring"
                >
                  {breathingActive ? <Pause size={12} /> : <Play size={12} />}
                  <span>{breathingActive ? 'Pause' : 'Resume'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBreathingPhase('Inhale');
                    setBreathingTimer(4);
                    setBreathingCyclesCompleted(0);
                  }}
                  className="p-1.5 text-theme-tertiary hover:text-theme-primary bg-theme-raised rounded-control border hairline-border"
                  title="Reset cycle"
                >
                  <RotateCcw size={12} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Strict Anonymity & Tele-MANAS Banner */}
      <div className="px-4 py-2 bg-theme-raised/60 border-b border-theme-subtle flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-theme-tertiary">
        <div className="flex items-center gap-1.5 text-success">
          <EyeOff size={13} />
          <span>100% Confidential: Zero manager or HRBP visibility</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-theme-secondary">National Tele-MANAS:</span>
          <span className="font-bold text-accent">14416</span>
          <span className="text-[10px] text-theme-tertiary">(24/7 Toll-Free)</span>
        </div>
      </div>

      {/* Crisis Interception Alert Overlay (if active) */}
      <AnimatePresence>
        {crisisDetected && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-danger/10 border-b border-danger/30 space-y-2.5"
          >
            <div className="flex items-start gap-2.5">
              <PhoneCall size={18} className="text-danger flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="text-xs font-mono font-bold text-danger uppercase tracking-wider">
                  National Mental Health Support Available 24/7
                </div>
                <p className="text-xs text-theme-primary font-sans leading-relaxed">
                  If you are in acute distress or feeling unsafe, trained professionals are standing by right now. Calls are free, private, and confidential:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-theme-surface border border-danger/40 rounded-control flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-theme-tertiary uppercase">Govt. Tele-MANAS (24/7 Toll-Free)</div>
                  <div className="font-bold text-theme-primary text-sm">14416 / 1800-891-4416</div>
                </div>
                <button
                  onClick={() => handleCopyHelpline('14416')}
                  className="p-1.5 text-theme-secondary hover:text-theme-primary hover:bg-theme-raised rounded-control border hairline-border"
                  title="Copy number"
                >
                  <Copy size={13} />
                </button>
              </div>

              <div className="p-2.5 bg-theme-surface border border-danger/40 rounded-control flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-theme-tertiary uppercase">KIRAN Mental Health Line</div>
                  <div className="font-bold text-theme-primary text-sm">1800-599-0019</div>
                </div>
                <button
                  onClick={() => handleCopyHelpline('1800-599-0019')}
                  className="p-1.5 text-theme-secondary hover:text-theme-primary hover:bg-theme-raised rounded-control border hairline-border"
                  title="Copy number"
                >
                  <Copy size={13} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={onOpenSupportModal}
                className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
              >
                <span>Or submit a confidential request to your dedicated HRBP</span>
                <ArrowRight size={12} />
              </button>
              {copiedHelpline && (
                <span className="text-[10px] font-mono text-success flex items-center gap-1">
                  <CheckCircle2 size={11} /> Copied to clipboard!
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-control flex items-center justify-center text-xs flex-shrink-0 ${
                  isUser
                    ? 'bg-accent text-white'
                    : 'bg-theme-raised border hairline-border text-theme-primary'
                }`}
              >
                {isUser ? <User size={13} /> : activeBot.avatar}
              </div>

              <div className={`space-y-1 ${isUser ? 'items-end' : ''}`}>
                <div
                  className={`p-3.5 rounded-panel text-xs leading-relaxed font-sans whitespace-pre-line ${
                    isUser
                      ? 'bg-accent text-white rounded-tr-none'
                      : msg.isCrisis
                      ? 'bg-danger/10 border border-danger/30 text-theme-primary rounded-tl-none'
                      : 'bg-theme-raised border hairline-border text-theme-primary rounded-tl-none'
                  }`}
                >
                  {msg.content}

                  {/* Inline Grounding Exercise Checklist if provided */}
                  {msg.groundingExercise && (
                    <div className="mt-3 pt-3 border-t border-theme-subtle space-y-1.5">
                      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                        <Wind size={12} />
                        <span>{msg.groundingExercise.name}</span>
                      </div>
                      <div className="space-y-1">
                        {msg.groundingExercise.steps.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-[11px] text-theme-secondary font-sans">
                            <span className="font-mono text-[10px] text-accent mt-0.5">{idx + 1}.</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className={`text-[10px] font-mono text-theme-tertiary px-1 flex items-center gap-1 ${
                    isUser ? 'justify-end' : ''
                  }`}
                >
                  <Clock size={10} />
                  <span>{msg.timestamp}</span>
                </div>
              </div>
            </motion.div>
          );
        })}

        {isTyping && (
          <div className="flex gap-3 max-w-md">
            <div className="w-7 h-7 rounded-control bg-theme-raised border hairline-border flex items-center justify-center text-xs">
              {activeBot.avatar}
            </div>
            <div className="p-3 bg-theme-raised border hairline-border rounded-panel rounded-tl-none flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Dynamic Suggested Quick Prompts */}
      <div className="px-4 py-2 bg-theme-raised/40 border-t border-theme-subtle flex gap-2 overflow-x-auto text-[11px] font-mono">
        {dynamicSuggestions.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSendMessage(prompt)}
            className="px-2.5 py-1 bg-theme-surface hover:bg-theme-raised border hairline-border text-theme-secondary hover:text-theme-primary rounded-control whitespace-nowrap transition-colors focus-ring"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Mood Rating Quick Check-In Bar */}
      <div className="px-4 py-1.5 bg-theme-surface border-t border-theme-subtle flex items-center justify-between text-[11px] font-mono text-theme-tertiary">
        <span className="flex items-center gap-1.5">
          <Smile size={12} className="text-accent" />
          <span>Calm check-in:</span>
        </span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => setMoodRating(rating)}
              className={`w-5 h-5 rounded-xs text-[10px] transition-colors ${
                moodRating === rating
                  ? 'bg-accent text-white font-bold'
                  : 'bg-theme-raised hover:bg-theme-border text-theme-secondary'
              }`}
              title={`Rate calm level ${rating}/5`}
            >
              {rating}
            </button>
          ))}
          <span className="text-[10px] text-theme-tertiary ml-1">
            {moodRating ? `(${moodRating}/5 selected)` : '(1 calm : 5 strained)'}
          </span>
        </div>
      </div>

      {/* Message Input Box */}
      <div className="p-3 border-t border-theme-subtle bg-theme-surface">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Message ${activeBot.name}... (Press Enter to send)`}
            className="flex-1 h-10 px-3 bg-theme-raised border hairline-border rounded-control text-xs text-theme-primary placeholder:text-theme-tertiary focus-ring"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="h-10 px-4 bg-accent hover:bg-accent-hover disabled:opacity-40 text-white rounded-control text-xs font-mono font-medium transition-colors shadow-xs flex items-center gap-1.5 focus-ring"
          >
            <span>Send</span>
            <Send size={13} />
          </button>
        </form>
      </div>
    </div>
  );
}
