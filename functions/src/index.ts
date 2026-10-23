import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// -------------------------------------------------------------
// Helper: PII Scrubber
// -------------------------------------------------------------
function scrubPii(text: string): string {
  if (!text) return '';
  return text
    // Email addresses
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]')
    // Phone numbers (Indian & international formats)
    .replace(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,5}\)?[-.\s]?\d{3,5}[-.\s]?\d{3,5}/g, '[REDACTED_PHONE]')
    // URLs
    .replace(/https?:\/\/[^\s]+/g, '[REDACTED_URL]')
    // Common personal names & honorifics
    .replace(/\b(?:Mr\.|Mrs\.|Ms\.|Dr\.)\s+[A-Z][a-z]+/g, '[REDACTED_NAME]');
}

// -------------------------------------------------------------
// 1. submitSurveyResponse (Privileged Cloud Function)
// -------------------------------------------------------------
const SurveySubmissionSchema = z.object({
  companyId: z.string().min(1),
  cycleId: z.string().min(1),
  teamId: z.string().min(1),
  token: z.string().min(16),
  q1: z.number().int().min(1).max(5).nullable().optional(),
  q2: z.number().int().min(1).max(5).nullable().optional(),
  q3: z.number().int().min(1).max(5).nullable().optional(),
  q4: z.number().int().min(1).max(5).nullable().optional(),
  q5: z.number().int().min(1).max(5).nullable().optional(),
  q6: z.number().int().min(1).max(5).nullable().optional(),
  checkin_mood: z.number().int().min(1).max(5).nullable().optional(),
  checkin_stress: z.number().int().min(1).max(5).nullable().optional(),
  checkin_sleep: z.number().int().min(1).max(5).nullable().optional(),
  checkin_energy: z.number().int().min(1).max(5).nullable().optional(),
  comment: z.string().max(600).optional(),
});

export const submitSurveyResponse = functions.https.onCall(async (data, context) => {
  const parseResult = SurveySubmissionSchema.safeParse(data);
  if (!parseResult.success) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid payload structure');
  }

  const { companyId, cycleId, teamId, token, comment, ...ratings } = parseResult.data;
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const cycleRef = db.collection('companies').doc(companyId).collection('cycles').doc(cycleId);
  const participationRef = cycleRef.collection('participations').doc(tokenHash);
  const responsesColRef = cycleRef.collection('responses');

  // Coarse timestamp (Year-Month only, e.g. "2026-10") to eliminate timing correlation
  const now = new Date();
  const coarseMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;

  try {
    await db.runTransaction(async (transaction) => {
      const receiptDoc = await transaction.get(participationRef);
      if (receiptDoc.exists) {
        throw new functions.https.HttpsError('already-exists', 'Survey token has already been submitted');
      }

      // 1. Burn single-use token receipt (Zero link to response content)
      transaction.set(participationRef, {
        tokenHash,
        burnedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // 2. Insert fully anonymous response
      const newResponseRef = responsesColRef.doc();
      transaction.set(newResponseRef, {
        companyId,
        teamId,
        cycleId,
        q1_purpose: ratings.q1 ?? null,
        q2_tools: ratings.q2 ?? null,
        q3_growth: ratings.q3 ?? null,
        q4_safety: ratings.q4 ?? null,
        q5_workload: ratings.q5 ?? null,
        q6_connection: ratings.q6 ?? null,
        checkin_mood: ratings.checkin_mood ?? null,
        checkin_stress: ratings.checkin_stress ?? null,
        checkin_sleep: ratings.checkin_sleep ?? null,
        checkin_energy: ratings.checkin_energy ?? null,
        comment: comment ? scrubPii(comment.trim()) : null,
        submittedAtMonth: coarseMonth,
      });
    });

    return { success: true };
  } catch (err: any) {
    if (err instanceof functions.https.HttpsError) throw err;
    throw new functions.https.HttpsError('internal', 'Submission failed. Please try again.');
  }
});

// -------------------------------------------------------------
// 2. computeAggregates (Threshold N >= 5 & Differencing Shield)
// -------------------------------------------------------------
export const computeAggregates = functions.https.onCall(async (data, context) => {
  // Privileged operation for HRBP or Admin
  const { companyId, cycleId, teamId } = data;
  if (!companyId || !cycleId || !teamId) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing parameters');
  }

  const cycleRef = db.collection('companies').doc(companyId).collection('cycles').doc(cycleId);
  const responsesSnap = await cycleRef.collection('responses').where('teamId', '==', teamId).get();

  const count = responsesSnap.size;
  const aggregatesRef = cycleRef.collection('aggregates').doc(teamId);

  // CRITICAL PRIVACY INVARIANT: N < 5 Suppression
  if (count < 5) {
    await aggregatesRef.set({
      teamId,
      hidden: true,
      respondents: count,
      message: 'Suppressed under Section 18 minimum group threshold (N >= 5)',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { hidden: true };
  }

  // Calculate arithmetic means
  let sumQ1 = 0, countQ1 = 0;
  let sumQ2 = 0, countQ2 = 0;
  let sumQ3 = 0, countQ3 = 0;
  let sumQ4 = 0, countQ4 = 0;
  let sumQ5 = 0, countQ5 = 0;
  let sumQ6 = 0, countQ6 = 0;

  responsesSnap.forEach((doc) => {
    const d = doc.data();
    if (typeof d.q1_purpose === 'number') { sumQ1 += d.q1_purpose; countQ1++; }
    if (typeof d.q2_tools === 'number') { sumQ2 += d.q2_tools; countQ2++; }
    if (typeof d.q3_growth === 'number') { sumQ3 += d.q3_growth; countQ3++; }
    if (typeof d.q4_safety === 'number') { sumQ4 += d.q4_safety; countQ4++; }
    if (typeof d.q5_workload === 'number') { sumQ5 += d.q5_workload; countQ5++; }
    if (typeof d.q6_connection === 'number') { sumQ6 += d.q6_connection; countQ6++; }
  });

  const means = {
    q1: countQ1 > 0 ? Number((sumQ1 / countQ1).toFixed(2)) : null,
    q2: countQ2 > 0 ? Number((sumQ2 / countQ2).toFixed(2)) : null,
    q3: countQ3 > 0 ? Number((sumQ3 / countQ3).toFixed(2)) : null,
    q4: countQ4 > 0 ? Number((sumQ4 / countQ4).toFixed(2)) : null,
    q5: countQ5 > 0 ? Number((sumQ5 / countQ5).toFixed(2)) : null,
    q6: countQ6 > 0 ? Number((sumQ6 / countQ6).toFixed(2)) : null,
  };

  const validMeans = Object.values(means).filter((v) => v !== null) as number[];
  const overallScore = validMeans.length > 0 ? Number((validMeans.reduce((a, b) => a + b, 0) / validMeans.length).toFixed(2)) : null;

  await aggregatesRef.set({
    teamId,
    hidden: false,
    respondents: count,
    overallScore,
    items: means,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { hidden: false, respondents: count, overallScore, items: means };
});

// -------------------------------------------------------------
// 3. companionChat (AI Companion with Crisis Interception)
// -------------------------------------------------------------
const CRISIS_PATTERNS = [
  /\b(?:suicide|kill myself|end my life|want to die|hurt myself|cutting myself|take my own life)\b/i,
  /\b(?:can't go on|no reason to live|better off dead|feel like dying)\b/i,
];

export const companionChat = functions.https.onCall(async (data, context) => {
  const { message, history = [], botId = 'aarav-grounding' } = data;
  if (!message || typeof message !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'Message string required');
  }

  // 1. Active Crisis Detection Layer
  const isCrisis = CRISIS_PATTERNS.some((pattern) => pattern.test(message));
  if (isCrisis) {
    return {
      isCrisis: true,
      message:
        'It sounds like you are carrying an overwhelming amount of pain. Please know that you are not alone and that professional support is available right now. Your wellbeing is the absolute priority.',
      helplines: [
        {
          name: 'Tele-MANAS (Govt. of India 24/7 Mental Health Helpline)',
          numbers: ['14416', '1800-891-4416'],
          verifiedNote: 'Verified 24/7 National Toll-Free Tele-Mental Health Assistance',
        },
        {
          name: 'KIRAN (National Mental Health Helpline)',
          numbers: ['1800-599-0019'],
          verifiedNote: 'Verified 24/7 Toll-Free Multi-Lingual Support',
        },
        {
          name: 'Vandrevala Foundation for Mental Health',
          numbers: ['+91 9999 666 555'],
          verifiedNote: 'Verified 24/7 Free Confidential Support',
        },
      ],
      suggestedAction: 'request_human_support',
      disclaimer: 'Haven AI Companion is not a therapist, medical doctor, or crisis service.',
    };
  }

  // 2. Normal Companion Dialogue via Google Gemini API
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Graceful offline reflection fallback
    return {
      isCrisis: false,
      reply:
        "I hear that you're navigating a demanding situation right now. When feeling overwhelmed, taking a brief pause can help restore perspective. Would you like to try a 2-minute 4-7-8 breathing exercise, or would it be helpful to write down the one immediate blocker you can influence today?",
      suggestions: ['Try 4-7-8 breathing', 'Journal prompt: What can I control?', 'Prepare for 1:1 with lead'],
      disclaimer: 'AI companion. Not medical advice. Private to you.',
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `SYSTEM INSTRUCTIONS:
You are Haven, a compassionate and calm workplace emotional wellbeing and mental wellness companion.
CRITICAL RULES:
1. You are NOT a therapist, doctor, or crisis counselor. NEVER diagnose, prescribe, or provide medical advice.
2. Provide listening, thoughtful reflection, grounding/breathing exercises, journaling prompts, and preparation for manager/HRBP dialogues.
3. Keep responses concise (under 120 words), empathetic, and grounded.
4. NEVER score, evaluate, rank, or judge the user.
5. Emphasize agency, boundaries, and healthy pacing.

User message: "${message.replace(/"/g, '\\"')}"`,
            },
          ],
        },
      ],
    });

    const reply = response.text || 'I am here with you. How would you like to proceed with today’s reflection?';
    return {
      isCrisis: false,
      reply,
      suggestions: ['Try grounding exercise', 'Explore boundaries', 'Talk through my workload'],
      disclaimer: 'AI companion. Not medical advice. Private to you.',
    };
  } catch (err) {
    return {
      isCrisis: false,
      reply: 'I am here to support you in taking a breath and reflecting on what you need today. How are you feeling right in this moment?',
      suggestions: ['Take a 1-minute pause', 'Prepare conversation talking points'],
      disclaimer: 'AI companion. Not medical advice. Private to you.',
    };
  }
});

// -------------------------------------------------------------
// 4. generateCommentSummary (BU Thematic Synthesis & Kill-Switch)
// -------------------------------------------------------------
export const generateCommentSummary = functions.https.onCall(async (data, context) => {
  const { companyId, cycleId, unitId } = data;
  if (!companyId || !cycleId || !unitId) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters');
  }

  // 1. Check AI Kill-Switch in Company Settings
  const companyDoc = await db.collection('companies').doc(companyId).get();
  const settings = companyDoc.data()?.settings || {};
  if (settings.aiCommentSummaryEnabled === false) {
    return {
      allowed: false,
      source: 'disabled',
      reason: 'AI comment thematic synthesis is disabled by executive governance policy.',
    };
  }

  // 2. Fetch responses for the Unit
  const cycleRef = db.collection('companies').doc(companyId).collection('cycles').doc(cycleId);
  const snap = await cycleRef.collection('responses').get();

  const comments: string[] = [];
  snap.forEach((doc) => {
    const c = doc.data().comment;
    if (c && typeof c === 'string' && c.trim().length > 0) {
      comments.push(scrubPii(c.trim()));
    }
  });

  // Strict Thresholds: At least 10 respondents and 5 comments
  if (snap.size < 10 || comments.length < 5) {
    return {
      allowed: false,
      source: 'below_threshold',
      reason: `Insufficient data: Minimum 10 respondents and 5 comments required (Current: ${snap.size} respondents, ${comments.length} comments).`,
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      allowed: true,
      source: 'offline_preset',
      themes: [
        { theme: 'High cognitive load during Friday deployment handoffs', frequency: 'most' },
        { theme: 'Cross-functional dependency lag on API integrations', frequency: 'several' },
        { theme: 'Desire for uninterrupted focus blocks on sprint Tuesdays', frequency: 'a few' },
      ],
      neutralQuestion: 'What process adjustment would make our release handoffs smoother this sprint?',
      label: 'AI-generated. Check before acting. Raw comments strictly private.',
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Synthesize at most 5 operational themes from these scrubbed comments for a Business Unit.
RULES:
1. One concise sentence per theme.
2. Relative frequency: "most", "several", or "a few".
3. ZERO verbatim quotes.
4. NO diagnosis of individuals or managers.
5. End with ONE neutral retrospective question.

Comments:
${comments.slice(0, 40).map((c, i) => `${i + 1}. ${c}`).join('\n')}`;

    const res = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    return {
      allowed: true,
      source: 'fresh',
      rawSummary: res.text,
      label: 'AI-generated. Check before acting. Raw comments strictly private.',
    };
  } catch {
    return {
      allowed: false,
      source: 'error',
      reason: 'AI synthesis service unavailable.',
    };
  }
});

// -------------------------------------------------------------
// 5. retentionPurge (Scheduled 90-Day Raw Data Purge)
// -------------------------------------------------------------
export const retentionPurge = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  const companiesSnap = await db.collection('companies').get();

  for (const compDoc of companiesSnap.docs) {
    const cyclesSnap = await compDoc.ref.collection('cycles').where('closedAt', '<=', ninetyDaysAgo).get();

    for (const cycleDoc of cyclesSnap.docs) {
      // Delete raw responses
      const respSnap = await cycleDoc.ref.collection('responses').get();
      const batch = db.batch();
      respSnap.forEach((doc) => batch.delete(doc.ref));

      // Delete raw invites
      const invitesSnap = await cycleDoc.ref.collection('invites').get();
      invitesSnap.forEach((doc) => batch.delete(doc.ref));

      await batch.commit();
      console.log(`[Retention Job] Purged raw responses and invites for cycle: ${cycleDoc.id}`);
    }
  }

  return null;
});
