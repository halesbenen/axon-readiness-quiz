import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Inlined from lib/auth to keep the Edge proxy bundle free of local imports.
const COOKIE_NAME = 'quiz_session';

function getSecret(): Uint8Array {
  return new TextEncoder().encode(process.env.QUIZ_SECRET ?? '');
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/dashboard/login') || pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (token) {
    try {
      await jwtVerify(token, getSecret());
      return NextResponse.next();
    } catch {
      // expired or invalid — fall through
    }
  }

  const loginUrl = new URL('/dashboard/login', request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/dashboard', '/dashboard/:path*'],
};
