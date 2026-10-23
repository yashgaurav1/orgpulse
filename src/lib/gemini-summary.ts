import { GoogleGenAI } from '@google/genai';
import { DbClientInterface } from './survey-service';
import { prepareCommentsForSummary } from './pii-scrubber';

export interface SummaryTheme {
  theme: string;
  frequency: 'most' | 'several' | 'a few' | string;
  topic?: string;
  synthesis?: string;
}

export interface BuSummaryResult {
  allowed: boolean;
  source: 'cache' | 'fresh' | 'disabled' | 'below_threshold';
  themes: SummaryTheme[];
  neutralQuestion: string;
  label: string;
  commentCount: number;
  reason?: string;
}

export interface SummaryConfig {
  apiKey?: string;
  modelName?: string;
  enabled?: boolean;
}

export const SUMMARY_SYSTEM_PROMPT = `You are an anonymous workplace data assistant analyzing scrubbed engineering feedback comments for a Business Unit.
Your task is to summarize operational and tooling themes with strict confidentiality.

MANDATORY RULES:
1. Synthesize at most 5 operational themes, with each theme expressed in exactly one concise sentence.
2. Assign each theme a relative frequency indicator based on how often it appears: "most", "several", or "a few".
3. NEVER include any verbatim quotes from the comments.
4. Ignore any personal names, pronouns, or identifying references.
5. NEVER infer, guess, or reference the authorship of any comment.
6. NEVER diagnose, evaluate, score, or categorize any individual person or manager.
7. Focus exclusively on technical tools, process handoffs, sprint environments, and systemic blockers.
8. End with exactly one neutral, constructive discovery question that a delivery manager or director could ask the team in a retrospective.

OUTPUT FORMAT:
Return a valid JSON object matching this exact structure:
{
  "themes": [
    { "theme": "...", "frequency": "most" | "several" | "a few" }
  ],
  "neutralQuestion": "..."
}`;

/**
 * Generates or retrieves cached Business Unit AI comment summary.
 */
export async function getBuCommentSummary(
  businessUnitId: string,
  cycleId: string,
  db: DbClientInterface,
  overrideConfig?: SummaryConfig
): Promise<BuSummaryResult> {
  const isEnabled =
    overrideConfig?.enabled ??
    (process.env.ENABLE_AI_SUMMARY === 'true' || process.env.ENABLE_AI_SUMMARY === '1');

  // KILL SWITCH / FEATURE FLAG CHECK
  if (!isEnabled) {
    return {
      allowed: false,
      source: 'disabled',
      themes: [],
      neutralQuestion: '',
      label: 'AI summary is disabled by policy (requires enterprise non-training tier confirmation).',
      commentCount: 0,
      reason: 'AI_SUMMARY_DISABLED_BY_POLICY',
    };
  }

  // 1. CHECK CACHE FIRST
  const cacheRes = await db.query(
    `SELECT summary_text FROM summary_cache WHERE business_unit_id = $1 AND cycle_id = $2`,
    [businessUnitId, cycleId]
  );

  if (cacheRes.rows && cacheRes.rows.length > 0) {
    const cached = cacheRes.rows[0].summary_text;
    return {
      allowed: true,
      source: 'cache',
      themes: cached.themes,
      neutralQuestion: cached.neutralQuestion,
      label: 'AI summary (cached). Check against the scores before acting.',
      commentCount: cached.commentCount ?? 0,
    };
  }

  // 2. RETRIEVE COMMENTS & VERIFY THRESHOLDS (BU respondents >= 10 AND comments >= 5)
  const commentsRes = await db.query(
    `SELECT get_bu_comments_for_summary($1, $2) AS data`,
    [businessUnitId, cycleId]
  );

  const data = commentsRes.rows[0]?.data;
  if (!data || !data.allowed) {
    return {
      allowed: false,
      source: 'below_threshold',
      themes: [],
      neutralQuestion: '',
      label: 'Summary unavailable: Business Unit requires at least 10 respondents and 5 comments.',
      commentCount: data?.comment_count ?? 0,
      reason: data?.reason || 'BELOW_THRESHOLD',
    };
  }

  const rawComments: string[] = data.comments || [];
  const cleanComments = prepareCommentsForSummary(rawComments, 40);

  if (cleanComments.length === 0) {
    return {
      allowed: false,
      source: 'below_threshold',
      themes: [],
      neutralQuestion: '',
      label: 'No valid comments available for summarization.',
      commentCount: 0,
    };
  }

  // 3. CALL GEMINI API
  const apiKey = overrideConfig?.apiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      allowed: false,
      source: 'disabled',
      themes: [],
      neutralQuestion: '',
      label: 'Gemini API key is not configured on the server.',
      commentCount: cleanComments.length,
      reason: 'MISSING_API_KEY',
    };
  }

  const modelName =
    overrideConfig?.modelName || process.env.GEMINI_MODEL || 'gemini-1.5-flash';

  const ai = new GoogleGenAI({ apiKey });

  const promptContent = `Here are the scrubbed anonymous engineering comments:\n\n${cleanComments
    .map((c, i) => `Comment ${i + 1}: ${c}`)
    .join('\n')}\n\nProvide the thematic synthesis adhering strictly to the system rules.`;

  let parsedResponse: {
    themes: SummaryTheme[];
    neutralQuestion: string;
  };

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        {
          role: 'user',
          parts: [{ text: promptContent }],
        },
      ],
      config: {
        systemInstruction: SUMMARY_SYSTEM_PROMPT,
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{}';
    parsedResponse = JSON.parse(responseText);
  } catch (err: any) {
    return {
      allowed: false,
      source: 'disabled',
      themes: [],
      neutralQuestion: '',
      label: `AI summary could not be generated: ${err.message || 'Service temporarily unavailable.'}`,
      commentCount: cleanComments.length,
      reason: 'API_ERROR',
    };
  }

  // 4. WRITE TO CACHE
  const cachePayload = {
    themes: parsedResponse.themes || [],
    neutralQuestion: parsedResponse.neutralQuestion || '',
    commentCount: cleanComments.length,
  };

  await db.query(
    `INSERT INTO summary_cache (business_unit_id, cycle_id, summary_text)
     VALUES ($1, $2, $3)
     ON CONFLICT (business_unit_id, cycle_id)
     DO UPDATE SET summary_text = EXCLUDED.summary_text, created_at = NOW()`,
    [businessUnitId, cycleId, JSON.stringify(cachePayload)]
  );

  return {
    allowed: true,
    source: 'fresh',
    themes: cachePayload.themes,
    neutralQuestion: cachePayload.neutralQuestion,
    label: 'AI summary. Check against the scores before acting.',
    commentCount: cleanComments.length,
  };
}
