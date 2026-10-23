import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_DATABASE_USERS } from '@/lib/db-auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const user = INITIAL_DATABASE_USERS.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (!user || user.passwordHash !== password) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const { passwordHash: _, ...safeUser } = user;
    return NextResponse.json({
      success: true,
      user: safeUser,
      token: `token_${user.uid}_${Date.now()}`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Authentication error' },
      { status: 500 }
    );
  }
}
