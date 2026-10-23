import { NextRequest, NextResponse } from 'next/server';
import { SurveySubmissionSchema } from '@/types/survey';
import { hashSurveyToken } from '@/lib/tokens';
import { checkSubmissionRateLimit } from '@/lib/rate-limiter';
import { submitSurveyResponse } from '@/lib/survey-service';
import { supabaseServer } from '@/lib/supabase-server';
import { getDbClient } from '@/lib/db-provider';
import { safeLog } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const rawIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.ip;

    const body = await req.json();

    // 1. Validate payload structure using Zod
    const parseResult = SurveySubmissionSchema.safeParse(body);
    if (!parseResult.success) {
      safeLog.warn('Survey submission validation rejected');
      return NextResponse.json(
        { success: false, error: 'INVALID_PAYLOAD', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const submission = parseResult.data;
    const tokenHash = hashSurveyToken(submission.token);

    // 2. Edge / in-memory rate limiting (keyed by tokenHash and transient salted IP hash)
    const rateCheck = checkSubmissionRateLimit(tokenHash, rawIp);
    if (!rateCheck.allowed) {
      safeLog.warn('Survey submission rate limit exceeded');
      return NextResponse.json(
        {
          success: false,
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please wait a moment.',
        },
        { status: 429 }
      );
    }

    // 3. Connect via unified database client
    const db = await getDbClient();

    // 4. Submit response through SECURITY DEFINER function
    const result = await submitSurveyResponse(submission, db);

    if (!result.success) {
      // Return uniform message to prevent leaking token state
      return NextResponse.json(
        { success: false, error: 'SUBMISSION_REJECTED' },
        { status: 400 }
      );
    }

    safeLog.info('Anonymous survey response recorded successfully');

    // Uniform generic success response
    return NextResponse.json({
      success: true,
      message: 'Response recorded anonymously.',
    });
  } catch (err: any) {
    safeLog.error('Unexpected error in survey submit handler');
    return NextResponse.json(
      { success: false, error: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
