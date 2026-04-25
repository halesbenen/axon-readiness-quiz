import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('verifyPassword', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('returns true when password matches QUIZ_PASSWORD env var', async () => {
    process.env.QUIZ_PASSWORD = 'TestPass123';
    const { verifyPassword } = await import('@/lib/auth');
    expect(verifyPassword('TestPass123')).toBe(true);
  });

  it('returns false when password does not match', async () => {
    process.env.QUIZ_PASSWORD = 'TestPass123';
    const { verifyPassword } = await import('@/lib/auth');
    expect(verifyPassword('wrong')).toBe(false);
  });

  it('returns false when QUIZ_PASSWORD is not set', async () => {
    delete process.env.QUIZ_PASSWORD;
    const { verifyPassword } = await import('@/lib/auth');
    expect(verifyPassword('anything')).toBe(false);
  });
});
