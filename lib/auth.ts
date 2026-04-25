import { SignJWT, jwtVerify } from 'jose';

export const COOKIE_NAME = 'quiz_session';

function getSecret(): Uint8Array {
  const s = process.env.QUIZ_SECRET;
  if (!s) throw new Error('QUIZ_SECRET env var not set');
  return new TextEncoder().encode(s);
}

export function verifyPassword(password: string): boolean {
  const expected = process.env.QUIZ_PASSWORD;
  if (!expected) return false;
  return password === expected;
}

export async function createSessionToken(): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}
