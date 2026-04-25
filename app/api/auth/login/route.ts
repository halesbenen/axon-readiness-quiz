import { NextResponse } from 'next/server';
import { verifyPassword, createSessionToken, COOKIE_NAME } from '@/lib/auth';

const MAX_AGE = 60 * 60 * 24 * 30;

export async function POST(request: Request) {
  try {
    const { password } = (await request.json()) as { password: string };

    if (!verifyPassword(password)) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    const token = await createSessionToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: MAX_AGE,
      path: '/',
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
