import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function parseSessionToken(token: string): { userId: string; expiresAt: number } | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function isValidSession(token: string): boolean {
  const session = parseSessionToken(token);
  if (!session) {
    return false;
  }
  const now = Date.now();
  return now < session.expiresAt;
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    try {
      const sessionCookie = request.cookies.get('auth-session');

      if (!sessionCookie || !sessionCookie.value) {
        console.log('[MIDDLEWARE] No session cookie found');
        return NextResponse.redirect(new URL('/login', request.url));
      }

      if (!isValidSession(sessionCookie.value)) {
        console.log('[MIDDLEWARE] Session invalid or expired');
        return NextResponse.redirect(new URL('/login', request.url));
      }

      console.log('[MIDDLEWARE] Session valid, allowing request');
    } catch (error) {
      console.error('[MIDDLEWARE] Auth validation failed:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
