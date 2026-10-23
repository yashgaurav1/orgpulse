import { NextRequest, NextResponse } from 'next/server';
import { COMPANION_BOTS } from '@/lib/companion-bots-data';

interface ChatRequestPayload {
  message: string;
  botId?: string;
  history?: Array<{ sender: 'user' | 'assistant' | 'system'; content: string }>;
  clientMoodRating?: number;
}

const CRISIS_KEYWORDS = [
  'suicide',
  'kill myself',
  'end my life',
  'want to die',
  'no reason to live',
  'self harm',
  'cutting myself',
  'hopeless',
  'better off dead',
  'cannot live anymore',
  'cant live anymore',
  'take my own life',
];

// Offline Intelligent Wellbeing Engine responses categorized by theme
function generateOfflineCompanionResponse(
  message: string,
  botId: string = 'bot-manas'
): { reply: string; suggestions: string[]; groundingExercise?: { name: string; steps: string[] } } {
  const lower = message.toLowerCase();
  const bot = COMPANION_BOTS.find((b) => b.id === botId) || COMPANION_BOTS[0];

  // 1. MANAS / Tele-MANAS inquiries
  if (
    lower.includes('manas') ||
    lower.includes('tele-manas') ||
    lower.includes('telemanas') ||
    lower.includes('manad') ||
    lower.includes('helpline') ||
    lower.includes('government') ||
    lower.includes('free support')
  ) {
    return {
      reply:
        "Tele-MANAS (National Tele Mental Health Programme of India) is the Government of India's flagship mental health service, coordinated by NIMHANS Bangalore with technological support from IIIT-Bangalore. It provides free, confidential, 24/7 mental healthcare to anyone in need.\n\n" +
        "Key Facts About Tele-MANAS:\n" +
        "1. Toll-Free Dialing: Call 14416 or 1800-891-4416 anytime from any phone or telecom network across India.\n" +
        "2. Multilingual Support: Available in 20+ Indian languages (including Hindi, English, Tamil, Telugu, Kannada, Bengali, Marathi, Gujarati, and Malayalam) routed to your regional cell.\n" +
        "3. Two-Tier Professional Care Model:\n" +
        "   - Tier 1: Immediate de-escalation, emotional first aid, and supportive counseling by trained mental health counselors.\n" +
        "   - Tier 2: Specialized consultations with clinical psychologists and psychiatrists, including psychiatric referral and e-prescriptions when required.\n" +
        "4. Total Privacy: You do not need to register through your employer or HR. Calls are strictly confidential and independent of corporate systems.\n\n" +
        "Whether you are struggling with workplace burnout, insomnia, anxiety, grief, or personal stress, Tele-MANAS counselors are ready to speak with you right now at 14416.",
      suggestions: [
        'How does a Tele-MANAS call work?',
        'Guide me through 4-7-8 breathing',
        'Help me manage severe workplace burnout',
        'How do I set boundaries with after-hours Slack?',
      ],
      groundingExercise: {
        name: 'Tele-MANAS Centering Pause',
        steps: [
          'Place both feet flat on the floor and soften your shoulders.',
          'Take a slow breath in for 4 seconds, feeling your chest expand.',
          'Hold gently for 4 seconds, resting in this stillness.',
          'Exhale smoothly for 6 seconds, releasing tension.',
          'Remember: Help is always one phone call away at 14416.',
        ],
      },
    };
  }

  // 2. Burnout and Overwork
  if (
    lower.includes('burnout') ||
    lower.includes('exhausted') ||
    lower.includes('drained') ||
    lower.includes('fatigue') ||
    lower.includes('tired of work') ||
    lower.includes('overworked')
  ) {
    return {
      reply:
        "Burnout is a physiological state of nervous system depletion caused by prolonged, unmanaged workplace stress. It is not personal weakness or a lack of resilience.\n\n" +
        "Here is a 3-step immediate relief protocol you can apply today:\n\n" +
        "1. Cognitive Offloading: Write down every pending task on paper, then circle only the ONE item that strictly cannot wait until tomorrow. Everything else goes into a 'Tomorrow 10 AM' parking lot.\n" +
        "2. Biological Recovery Window: Block 25 minutes this evening where you deliberately do not look at screens or process information. Sit quietly, listen to soothing music, or take a gentle walk.\n" +
        "3. Assertive Capacity Signaling: It is safe to tell your manager: 'My bandwidth is currently fully allocated to [Item A]. To take on [Item B], which one should we deprioritize?'\n\n" +
        "Remember, your value as a human being is not measured by your sprint velocity. Would you like to practice a quick nervous system grounding exercise together?",
      suggestions: [
        'Start 4-7-8 breathing exercise',
        'Tell me more about Tele-MANAS (14416)',
        'Scripts for telling my manager I am at capacity',
        'How do I stop thinking about work at night?',
      ],
      groundingExercise: {
        name: 'Somatic Nervous System Reset',
        steps: [
          'Unclench your jaw and let your tongue rest away from the roof of your mouth.',
          'Drop your shoulders down and back by two inches.',
          'Take a deep double-inhale through your nose (one deep breath, then a sharp top-up sip).',
          'Let out a long, sighing exhale through your mouth.',
          'Repeat two more times to trigger the parasympathetic brake.',
        ],
      },
    };
  }

  // 3. Anxiety, Panic, or Somatic Distress
  if (
    lower.includes('anxious') ||
    lower.includes('anxiety') ||
    lower.includes('panic') ||
    lower.includes('breath') ||
    lower.includes('palpitations') ||
    lower.includes('heart racing') ||
    lower.includes('nervous')
  ) {
    return {
      reply:
        "I hear you. When acute anxiety surges, your brain's alarm center (the amygdala) is signaling danger, even if the stressor is a deadline or presentation. Let us bring your body back to safety.\n\n" +
        "Look around your physical space and let us try the 5-4-3-2-1 Sensory Grounding Technique:\n\n" +
        "• 5 things you can see (e.g. your monitor frame, a pen, your coffee cup, the wall paint, a shadow)\n" +
        "• 4 things you can physically feel (e.g. the fabric of your chair, your feet on the floor, the keyboard keys, your watch strap)\n" +
        "• 3 things you can hear (e.g. an AC fan, distant traffic, your own steady breathing)\n" +
        "• 2 things you can smell or savor (e.g. tea, fresh air, notebook paper)\n" +
        "• 1 positive truth: 'Right now, in this exact physical moment, I am safe.'\n\n" +
        "Notice your breath. You are here, grounded, and supported.",
      suggestions: [
        'Try guided 4-7-8 breathing',
        'How does Tele-MANAS help with anxiety?',
        'How to calm down before an executive presentation',
        'Check my current wellbeing score',
      ],
      groundingExercise: {
        name: '4-7-8 Parasympathetic Regulator',
        steps: [
          'Exhale completely through your mouth with a soft whoosh sound.',
          'Inhale quietly through your nose for 4 counts (1... 2... 3... 4).',
          'Hold your breath gently for 7 counts (1... 2... 3... 4... 5... 6... 7).',
          'Exhale completely through your mouth for 8 counts (1... 2... 3... 4... 5... 6... 7... 8).',
          'Repeat 4 cycles to stimulate the vagus nerve and slow heart rate.',
        ],
      },
    };
  }

  // 4. Boundaries, Slack, Work-Life Balance
  if (
    lower.includes('boundary') ||
    lower.includes('slack') ||
    lower.includes('disconnect') ||
    lower.includes('weekend') ||
    lower.includes('after hours') ||
    lower.includes('manager') ||
    lower.includes('difficult conversation')
  ) {
    return {
      reply:
        "Protecting your psychological boundaries is essential for sustained high performance and mental health. When boundaries blur, work takes over restorative sleep and personal relationships.\n\n" +
        "Here are three practical workplace scripts you can adapt:\n\n" +
        "• Slack Status Script: 'Focusing on deep work until 2 PM. For production emergencies, please page on-call; otherwise, I will reply this afternoon.'\n" +
        "• Evening Sign-off: 'Logging off for the evening to recharge. I have queued my updates in the project board and will pick up fresh tomorrow at 9 AM.'\n" +
        "• Capacity Pushback: 'I want to ensure this deliverable meets high quality standards. Given our sprint timeline, if we prioritize this today, we will need to slide [Secondary Feature] into next sprint.'\n\n" +
        "Setting boundaries feels uncomfortable at first, but respectful clarity earns professional respect over time.",
      suggestions: [
        'How to deal with a micromanager',
        'How to manage on-call sleep disruption',
        'Connect with Tele-MANAS counselors (14416)',
        'Guide me through a calming breathing exercise',
      ],
    };
  }

  // 5. Default Empathetic Guidance
  return {
    reply:
      `Thank you for reaching out. As your ${bot.name} wellbeing companion, I am here to provide a reflective, confidential sounding board.\n\n` +
      "Workplaces can be intellectually demanding and emotionally taxing. When we pause, name what we are experiencing, and ground ourselves, we create space to respond with wisdom rather than stress-reaction.\n\n" +
      "Would you like to explore what is creating tension today, try a structured breathing exercise, or learn about free professional support available through India's Tele-MANAS initiative (14416)?",
    suggestions: [
      'Tell me about Tele-MANAS (14416)',
      'I am feeling overwhelmed with deadlines',
      'Start 4-7-8 breathing exercise',
      'How do I disconnect after my shift?',
    ],
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChatRequestPayload;
    const { message, botId = 'bot-manas', history = [], clientMoodRating } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Valid message string is required.' },
        { status: 400 }
      );
    }

    const lower = message.toLowerCase();
    const isCrisis = CRISIS_KEYWORDS.some((kw) => lower.includes(kw));

    // Immediate Crisis Intervention Protocol
    if (isCrisis) {
      const crisisReply =
        "I hear how much pain you are experiencing right now, and I want to ensure you have immediate, confidential human support. You do not have to carry this alone. Please connect with one of these dedicated crisis lifelines right away:\n\n" +
        "• Govt of India Tele-MANAS: Call 14416 or 1800-891-4416 (24/7, Toll-Free, Confidential, Multilingual across India)\n" +
        "• KIRAN Mental Health Helpline: 1800-599-0019 (24/7, Govt of India)\n" +
        "• Vandrevala Foundation: 9999 666 555 (24/7 Free Counseling)\n" +
        "• International Resources: If outside India, visit befrienders.org or iasp.info/resources/Crisis_Centres\n\n" +
        "Trained counselors are waiting to listen and support you with warmth and zero judgment. Please reach out to them now.";

      return NextResponse.json({
        success: true,
        reply: crisisReply,
        isCrisis: true,
        suggestions: [
          'Call Tele-MANAS at 14416 (Toll-Free)',
          'Call Vandrevala at 9999 666 555',
          'I want to talk to someone I trust',
        ],
        emergencyContacts: [
          { name: 'Tele-MANAS', phone: '14416', available: '24/7 Toll-Free' },
          { name: 'Tele-MANAS (Alt)', phone: '1800-891-4416', available: '24/7 Toll-Free' },
          { name: 'KIRAN Helpline', phone: '1800-599-0019', available: '24/7 Toll-Free' },
          { name: 'Vandrevala Foundation', phone: '9999 666 555', available: '24/7' },
        ],
      });
    }

    // Try Gemini API if key is present
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (geminiApiKey && geminiApiKey !== '[GEMINI_API_KEY]') {
      try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: geminiApiKey });

        const activeBot =
          COMPANION_BOTS.find((b) => b.id === botId) || COMPANION_BOTS[0];

        const systemInstruction = `
You are ${activeBot.name}, an expert workplace mental health and wellbeing coach in the Pulse enterprise application.
Tone: ${activeBot.primaryTone}.
Role: ${activeBot.role}.
Guiding Principles:
1. Provide empathetic, non-evaluative, psychologically safe responses.
2. Provide concrete psychoeducation on stress reduction, burnout prevention, nervous system regulation (4-7-8 breathing, 5-4-3-2-1 senses), and work-life boundaries.
3. Promote awareness of India's national Tele-MANAS initiative (Toll-Free 14416 / 1800-891-4416, 24/7, free, confidential, 20+ regional languages, coordinated by NIMHANS Bangalore) whenever the user inquires about counseling, medical help, or severe emotional burden.
4. Strictly disclaim that you provide supportive coaching, not medical diagnosis or psychotherapy.
5. NEVER ask for identifiable employee personal data, manager names, or private company secrets.
6. Absolutely forbid em dashes (U+2014) in your output. Use commas, colons, hyphens, or periods instead.
`;

        const formattedHistory = history
          .slice(-6)
          .map((h) => `${h.sender.toUpperCase()}: ${h.content}`)
          .join('\n');

        const promptText = `${systemInstruction}\n\nRecent Conversation:\n${formattedHistory}\n\nUSER: ${message}\n${activeBot.name.toUpperCase()}:`;

        const response = await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: promptText,
        });

        const rawText = response.text || '';
        // Sanitize any em dashes from AI output dynamically using char code
        const forbiddenChar = String.fromCharCode(8212);
        const cleanText = rawText.split(forbiddenChar).join(': ');

        if (cleanText.trim().length > 0) {
          return NextResponse.json({
            success: true,
            reply: cleanText.trim(),
            isCrisis: false,
            suggestions: [
              'Tell me more about Tele-MANAS (14416)',
              'Guide me through a breathing exercise',
              'How to disconnect from work tonight',
              'Ways to recover from burnout',
            ],
          });
        }
      } catch (geminiError) {
        // Fallback gracefully to offline engine
        console.warn('Gemini companion call failed, using offline engine:', geminiError);
      }
    }

    // High quality offline fallback engine
    const offlineResult = generateOfflineCompanionResponse(message, botId);

    return NextResponse.json({
      success: true,
      reply: offlineResult.reply,
      isCrisis: false,
      suggestions: offlineResult.suggestions,
      groundingExercise: offlineResult.groundingExercise,
    });
  } catch (error: any) {
    console.error('Companion chat route error:', error);
    return NextResponse.json(
      { error: 'Internal server error processing companion response.' },
      { status: 500 }
    );
  }
}
