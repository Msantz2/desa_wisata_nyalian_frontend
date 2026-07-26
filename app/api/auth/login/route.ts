import { NextRequest, NextResponse } from 'next/server';
import type { LoginRequest } from '@/types/auth';
import { authConfig, verifyPassword, setAuthCookie, createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();

    if (!body.username || !body.password) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    if (body.username !== authConfig.username) {
      console.error('[AUTH] Invalid login attempt - username mismatch');
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const isPasswordValid = await verifyPassword(
      body.password,
      authConfig.passwordHash
    );

    if (!isPasswordValid) {
      console.error('[AUTH] Invalid login attempt - password mismatch for user:', body.username);
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const session = createSession();
    await setAuthCookie(session);

    const response = NextResponse.redirect(new URL('/admin/dashboard', request.url));
    return response;
  } catch (error) {
    console.error('[AUTH] Login error:', error);
    return NextResponse.json(
      { error: 'Invalid username or password' },
      { status: 401 }
    );
  }
}

