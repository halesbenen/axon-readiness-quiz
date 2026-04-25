# Readiness Quiz KV Storage & Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist every quiz completion to Vercel KV and add a password-protected internal dashboard at `/dashboard` listing all past assessments.

**Architecture:** A company name interstitial replaces the current `/quiz` page, creating a KV record before the quiz starts. The quiz runs at `/quiz/[id]`, PATCHes the result on completion, then redirects to `/results/[id]` which reads from KV. A separate password-gated `/dashboard` lists all assessments.

**Tech Stack:** Next.js 16 (app router), `@vercel/kv`, `jose`, Tailwind CSS v4, TypeScript, Vitest

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `lib/kv.ts` | Create | KV types + CRUD for assessments |
| `lib/auth.ts` | Create | JWT cookie auth helpers |
| `middleware.ts` | Create | Protect `/dashboard*` routes |
| `app/api/auth/login/route.ts` | Create | Login endpoint |
| `app/api/auth/logout/route.ts` | Create | Logout endpoint |
| `app/api/assessments/route.ts` | Create | POST — create assessment record |
| `app/api/assessments/[id]/route.ts` | Create | GET + PATCH assessment record |
| `app/quiz/page.tsx` | Replace | Company name interstitial |
| `app/quiz/[id]/page.tsx` | Create | 30-question quiz (moved here) |
| `app/results/[id]/page.tsx` | Create | Results page reading from KV |
| `app/results/page.tsx` | Replace | Redirect old `?id=` links to `/` |
| `app/dashboard/page.tsx` | Create | Assessment list (auth-gated) |
| `app/dashboard/login/page.tsx` | Create | Login screen |
| `vitest.config.ts` | Create | Vitest config |
| `lib/auth.test.ts` | Create | Unit test for `verifyPassword` |
| `package.json` | Modify | Add `@vercel/kv`, `jose`, `vitest` |

---

## Task 1: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install packages**

```bash
cd "Apps/Readiness-quiz"
npm install @vercel/kv jose
npm install --save-dev vitest @vitejs/plugin-react
```

Expected: packages added to `package.json`, `package-lock.json` updated.

- [ ] **Step 2: Add test script to package.json**

Open `package.json`. The `scripts` block currently has `dev`, `build`, `start`. Add `test`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run"
  }
}
```

- [ ] **Step 3: Create vitest config**

Create `vitest.config.ts` at the project root:

```typescript
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    passWithNoTests: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "chore: add @vercel/kv, jose, vitest dependencies"
```

---

## Task 2: KV storage layer

**Files:**
- Create: `lib/kv.ts`

- [ ] **Step 1: Create `lib/kv.ts`**

```typescript
import { kv } from '@vercel/kv';
import type { QuizResult } from '@/lib/scoring';

export interface AssessmentMeta {
  id: string;
  companyName: string;
  overallScore: number;
  overallTierLabel: string;
  createdAt: string;
}

export interface AssessmentRecord {
  companyName: string;
  answers: Record<string, number>;
  result: QuizResult | null;
  createdAt: string;
}

const INDEX_KEY = 'readiness-index';

function recordKey(id: string): string {
  return `readiness:${id}`;
}

export async function listAssessments(): Promise<AssessmentMeta[]> {
  const index = await kv.get<AssessmentMeta[]>(INDEX_KEY);
  return index ?? [];
}

export async function createAssessment(companyName: string): Promise<string> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const record: AssessmentRecord = {
    companyName,
    answers: {},
    result: null,
    createdAt: now,
  };

  const meta: AssessmentMeta = {
    id,
    companyName,
    overallScore: 0,
    overallTierLabel: 'In Progress',
    createdAt: now,
  };

  await kv.set(recordKey(id), record);
  const index = await listAssessments();
  await kv.set(INDEX_KEY, [...index, meta]);

  return id;
}

export async function getAssessment(id: string): Promise<AssessmentRecord | null> {
  return kv.get<AssessmentRecord>(recordKey(id));
}

export async function saveAssessment(
  id: string,
  answers: Record<string, number>,
  result: QuizResult
): Promise<void> {
  const existing = await getAssessment(id);
  if (!existing) return;

  const updated: AssessmentRecord = { ...existing, answers, result };
  await kv.set(recordKey(id), updated);

  const index = await listAssessments();
  const newIndex = index.map(m =>
    m.id === id
      ? { ...m, overallScore: result.overallScore, overallTierLabel: result.overallTierLabel }
      : m
  );
  await kv.set(INDEX_KEY, newIndex);
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/kv.ts
git commit -m "feat: KV storage layer for readiness assessments"
```

---

## Task 3: Auth layer + unit test

**Files:**
- Create: `lib/auth.ts`
- Create: `lib/auth.test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/auth.test.ts`:

```typescript
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
```

- [ ] **Step 2: Run test — expect FAIL (module not found)**

```bash
npm test
```

Expected: fail with "Cannot find module '@/lib/auth'"

- [ ] **Step 3: Create `lib/auth.ts`**

```typescript
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
```

- [ ] **Step 4: Run test — expect PASS**

```bash
npm test
```

Expected: 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/auth.ts lib/auth.test.ts
git commit -m "feat: auth helpers + unit tests for readiness quiz"
```

---

## Task 4: Middleware

**Files:**
- Create: `middleware.ts`

- [ ] **Step 1: Create `middleware.ts`**

This protects only `/dashboard` and `/dashboard/*`. All other routes (quiz, results) remain public.

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { COOKIE_NAME } from '@/lib/auth';

function getSecret(): Uint8Array {
  return new TextEncoder().encode(process.env.QUIZ_SECRET ?? '');
}

export async function middleware(request: NextRequest) {
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
```

- [ ] **Step 2: Commit**

```bash
git add middleware.ts
git commit -m "feat: middleware protecting /dashboard routes"
```

---

## Task 5: Auth API routes

**Files:**
- Create: `app/api/auth/login/route.ts`
- Create: `app/api/auth/logout/route.ts`

- [ ] **Step 1: Create `app/api/auth/login/route.ts`**

```typescript
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
```

- [ ] **Step 2: Create `app/api/auth/logout/route.ts`**

```typescript
import { NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  const response = NextResponse.redirect(`${origin}/dashboard/login`);
  response.cookies.delete(COOKIE_NAME);
  return response;
}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/auth/
git commit -m "feat: auth login/logout API routes"
```

---

## Task 6: Assessments API routes

**Files:**
- Create: `app/api/assessments/route.ts`
- Create: `app/api/assessments/[id]/route.ts`

- [ ] **Step 1: Create `app/api/assessments/route.ts`**

```typescript
import { NextResponse } from 'next/server';
import { createAssessment } from '@/lib/kv';

export async function POST(request: Request) {
  try {
    const { companyName } = (await request.json()) as { companyName?: string };
    const name = (companyName ?? '').trim() || 'Anonymous';
    const id = await createAssessment(name);
    return NextResponse.json({ id });
  } catch {
    return NextResponse.json({ error: 'Failed to create assessment' }, { status: 500 });
  }
}
```

- [ ] **Step 2: Create `app/api/assessments/[id]/route.ts`**

```typescript
import { NextResponse } from 'next/server';
import { getAssessment, saveAssessment } from '@/lib/kv';
import type { QuizResult } from '@/lib/scoring';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const record = await getAssessment(id);
    if (!record) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(record);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { answers, result } = (await request.json()) as {
      answers: Record<string, number>;
      result: QuizResult;
    };
    await saveAssessment(id, answers, result);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/assessments/
git commit -m "feat: assessments API routes (create, get, save)"
```

---

## Task 7: Quiz dynamic route page

**Files:**
- Create: `app/quiz/[id]/page.tsx`

This is the existing quiz page moved to a dynamic route. The only changes from `app/quiz/page.tsx` are:
1. Import `useParams` and read `id` from it
2. `advanceQuiz` becomes async — on completion, PATCH to KV then redirect to `/results/[id]`
3. Remove `generateId` and `localStorage.setItem`

- [ ] **Step 1: Create `app/quiz/[id]/page.tsx`**

```typescript
'use client';

import { useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { questions, dimensions } from '@/data/questions';
import { calculateResults } from '@/lib/scoring';

const QUESTIONS_PER_DIMENSION = 6;
const TOTAL_QUESTIONS = 30;

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [currentDimensionIndex, setCurrentDimensionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showDimensionIntro, setShowDimensionIntro] = useState(true);
  const [showTransition, setShowTransition] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [animKey, setAnimKey] = useState(0);

  const currentDimension = dimensions[currentDimensionIndex];
  const dimensionQuestions = questions.filter(q => q.dimension === currentDimension.id);
  const currentQuestion = dimensionQuestions[currentQuestionIndex];

  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / TOTAL_QUESTIONS) * 100;

  const canGoBack = !showDimensionIntro && !showTransition &&
    (currentQuestionIndex > 0 || currentDimensionIndex > 0);

  function bumpAnim() {
    setAnimKey(k => k + 1);
  }

  function handleOptionSelect(questionId: string, value: number) {
    if (selectedOption !== null) return;
    setSelectedOption(value);
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    setTimeout(() => advanceQuiz(newAnswers), 150);
  }

  async function advanceQuiz(newAnswers: Record<string, number>) {
    const isLastQuestion = currentQuestionIndex >= QUESTIONS_PER_DIMENSION - 1;
    const isLastDimension = currentDimensionIndex >= dimensions.length - 1;

    if (isLastQuestion && isLastDimension) {
      const result = calculateResults(newAnswers);
      try {
        await fetch(`/api/assessments/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: newAnswers, result }),
        });
      } catch {
        // best-effort save — still redirect
      }
      router.push(`/results/${id}`);
      return;
    }

    if (isLastQuestion) {
      setShowTransition(true);
      setTimeout(() => {
        setShowTransition(false);
        setCurrentDimensionIndex(prev => prev + 1);
        setCurrentQuestionIndex(0);
        setShowDimensionIntro(true);
        setSelectedOption(null);
      }, 700);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      bumpAnim();
    }
  }

  const handleBack = useCallback(() => {
    if (!canGoBack) return;
    setSelectedOption(null);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      bumpAnim();
    } else {
      setCurrentDimensionIndex(currentDimensionIndex - 1);
      setCurrentQuestionIndex(QUESTIONS_PER_DIMENSION - 1);
      setShowDimensionIntro(false);
      bumpAnim();
    }
  }, [canGoBack, currentQuestionIndex, currentDimensionIndex]);

  // Transition screen
  if (showTransition) {
    const nextDimension = dimensions[currentDimensionIndex + 1];
    return (
      <div className="flex-1 flex items-center justify-center transition-screen anim-fade">
        <div className="text-center">
          <p className="text-sm mb-3 anim-fade-up" style={{ color: '#a900f1', fontWeight: 500 }}>Up next</p>
          <div className="relative inline-flex items-center justify-center mb-4 anim-scale delay-100">
            <div className="glow-ring" />
            <span style={{ fontSize: 64, display: 'block' }}>{nextDimension.icon}</span>
          </div>
          <p className="text-3xl font-semibold anim-fade-up delay-200" style={{ color: '#ffffff' }}>
            {nextDimension.label}
          </p>
        </div>
      </div>
    );
  }

  // Dimension intro card
  if (showDimensionIntro) {
    return (
      <div className="flex-1 flex items-center justify-center px-4" style={{ backgroundColor: '#230533' }}>
        <div className="w-full max-w-lg text-center anim-fade">
          <div className="relative inline-flex items-center justify-center mb-6 anim-scale">
            <div className="glow-ring" />
            <span className="anim-float" style={{ fontSize: 72, display: 'block' }}>{currentDimension.icon}</span>
          </div>
          <div className="gradient-bar mx-auto mb-6 anim-fade-up delay-100" style={{ width: 64 }} />
          <h2 className="mb-4 anim-fade-up delay-200" style={{ fontSize: 36, fontWeight: 600, color: '#ffffff', lineHeight: 1.2 }}>
            {currentDimension.label}
          </h2>
          <p className="mb-3 anim-fade-up delay-300" style={{ fontSize: 16, fontWeight: 300, color: '#b0b8c8', lineHeight: 1.65 }}>
            {currentDimension.description}
          </p>
          <p className="mb-10 anim-fade-up delay-400" style={{ fontSize: 13, color: '#a900f1', fontWeight: 400 }}>
            {QUESTIONS_PER_DIMENSION} questions
          </p>
          <div className="anim-fade-up delay-500">
            <button
              onClick={() => setShowDimensionIntro(false)}
              className="gradient-bg inline-flex items-center justify-center text-white"
              style={{ height: 50, minWidth: 180, borderRadius: 10, fontSize: 15, fontWeight: 500, border: 'none', cursor: 'pointer', letterSpacing: '0.01em' }}
            >
              {"Let's go →"}
            </button>
          </div>
          {currentDimensionIndex > 0 && (
            <div className="mt-6 anim-fade delay-500">
              <button className="back-btn" onClick={() => {
                setCurrentDimensionIndex(currentDimensionIndex - 1);
                setCurrentQuestionIndex(QUESTIONS_PER_DIMENSION - 1);
                setShowDimensionIntro(false);
                setSelectedOption(null);
                bumpAnim();
              }}>
                ← Previous section
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Question card
  return (
    <div className="flex-1 flex flex-col dot-grid-bg" style={{ backgroundColor: '#fdf5ff' }}>
      {/* Progress bar */}
      <div style={{ height: 4, backgroundColor: '#ede0ff' }}>
        <div
          className="gradient-bar"
          style={{ width: `${progressPercent}%`, transition: 'width 0.4s cubic-bezier(0.22, 1, 0.36, 1)', height: '100%', borderRadius: 0 }}
        />
      </div>

      {/* Header */}
      <div className="px-6 py-3 flex items-center justify-between" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #ede0ff' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/axon-logo-colour.svg" alt="Axon IT" style={{ height: 28, width: 'auto' }} />
        <span className="text-xs" style={{ color: '#a900f1', fontWeight: 400 }}>
          {currentDimension.icon} {currentDimension.label} · {currentQuestionIndex + 1} of {QUESTIONS_PER_DIMENSION}
        </span>
      </div>

      {/* Question area */}
      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-xl" key={animKey} style={{ willChange: 'transform, opacity' }}>
          <p className="text-xs uppercase tracking-widest mb-4 anim-fade-right" style={{ color: '#a900f1', fontWeight: 500 }}>
            {currentDimension.icon} {currentDimension.label}
          </p>
          <h2 className="mb-8 anim-fade-up" style={{ fontSize: 22, fontWeight: 600, color: '#230533', lineHeight: 1.4 }}>
            {currentQuestion.text}
          </h2>
          <OptionList
            key={currentQuestion.id}
            options={currentQuestion.options}
            onSelect={(value) => handleOptionSelect(currentQuestion.id, value)}
            disabled={selectedOption !== null}
            selectedValue={selectedOption ?? answers[currentQuestion.id]}
          />
        </div>
      </div>

      {/* Back button */}
      <div className="px-6 pb-6 flex items-center justify-between">
        {canGoBack ? (
          <button
            onClick={handleBack}
            className="gradient-bg inline-flex items-center gap-2 text-white"
            style={{
              height: 44, minWidth: 110, borderRadius: 10, fontSize: 14,
              fontWeight: 500, border: 'none', cursor: 'pointer',
              letterSpacing: '0.01em', paddingInline: 20,
            }}
          >
            ← Back
          </button>
        ) : (
          <span />
        )}
        <p className="text-xs" style={{ color: '#a900f1', fontWeight: 300 }}>
          {answeredCount} of {TOTAL_QUESTIONS} answered
        </p>
      </div>
    </div>
  );
}

function OptionList({
  options,
  onSelect,
  disabled,
  selectedValue,
}: {
  options: { label: string; value: number }[];
  onSelect: (value: number) => void;
  disabled: boolean;
  selectedValue?: number;
}) {
  return (
    <div className="flex flex-col gap-3">
      {options.map((option, idx) => {
        const isSelected = selectedValue === option.value;
        return (
          <button
            key={idx}
            onClick={() => !disabled && onSelect(option.value)}
            className={`option-btn anim-fade-up${isSelected ? ' selected' : ''}`}
            style={{
              animationDelay: `${0.04 + idx * 0.06}s`,
              padding: '15px 20px',
              borderRadius: 10,
              border: isSelected ? '2px solid #a900f1' : '1.5px solid #ede0ff',
              backgroundColor: isSelected ? '#f5eaff' : '#ffffff',
              cursor: disabled ? 'default' : 'pointer',
              textAlign: 'left',
              fontSize: 14,
              fontWeight: isSelected ? 500 : 300,
              color: '#230533',
              lineHeight: 1.45,
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add "app/quiz/[id]/"
git commit -m "feat: quiz dynamic route page at /quiz/[id]"
```

---

## Task 8: Company name interstitial

**Files:**
- Modify: `app/quiz/page.tsx` (full replacement)

- [ ] **Step 1: Replace `app/quiz/page.tsx` with the interstitial**

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function QuizInterstitial() {
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleStart(name: string) {
    setLoading(true);
    try {
      const res = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName: name }),
      });
      const { id } = await res.json();
      router.push(`/quiz/${id}`);
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: '#230533' }}>
      <div className="w-full max-w-md px-6 text-center anim-fade">
        <div className="gradient-bar mx-auto mb-8" style={{ width: 64 }} />
        <h2 className="mb-3" style={{ fontSize: 28, fontWeight: 600, color: '#ffffff', lineHeight: 1.3 }}>
          Before we start —
        </h2>
        <p className="mb-8" style={{ fontSize: 16, fontWeight: 300, color: '#64dfec', lineHeight: 1.6 }}>
          What company are you from?
        </p>
        <input
          type="text"
          value={companyName}
          onChange={e => setCompanyName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !loading) handleStart(companyName); }}
          placeholder="Company name"
          autoFocus
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.06)',
            border: '1.5px solid rgba(169,0,241,0.3)',
            borderRadius: 8,
            padding: '12px 16px',
            color: '#ffffff',
            fontSize: 15,
            marginBottom: 12,
            outline: 'none',
            textAlign: 'center',
          }}
        />
        <button
          onClick={() => handleStart(companyName)}
          disabled={loading}
          className="gradient-bg w-full"
          style={{
            height: 50,
            borderRadius: 8,
            border: 'none',
            color: '#fff',
            fontSize: 15,
            fontWeight: 500,
            cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? 0.7 : 1,
            marginBottom: 12,
          }}
        >
          {loading ? 'Starting...' : 'Start assessment →'}
        </button>
        <button
          onClick={() => handleStart('')}
          disabled={loading}
          style={{
            background: 'none',
            border: 'none',
            color: '#a900f1',
            fontSize: 13,
            cursor: loading ? 'default' : 'pointer',
            opacity: 0.7,
          }}
        >
          Skip
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/quiz/page.tsx
git commit -m "feat: company name interstitial at /quiz"
```

---

## Task 9: Results dynamic route page

**Files:**
- Create: `app/results/[id]/page.tsx`

This is the existing results page adapted to fetch from KV instead of localStorage. Key changes: use `useParams` for `id`, fetch from `/api/assessments/${id}`, read `record.result`.

- [ ] **Step 1: Create `app/results/[id]/page.tsx`**

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { QuizResult, ReadinessTier } from '@/lib/scoring';
import type { AssessmentRecord } from '@/lib/kv';

function tierColor(tier: ReadinessTier): string {
  if (tier === 'ready') return '#10b981';
  if (tier === 'developing') return '#f59e0b';
  return '#ff1d79';
}

export default function ResultsPage() {
  const params = useParams();
  const id = params.id as string;
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) { setError('Invalid assessment link.'); return; }
    fetch(`/api/assessments/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('not found');
        return r.json() as Promise<AssessmentRecord>;
      })
      .then(record => {
        if (!record.result) {
          setError('This assessment was not completed. Please start again.');
          return;
        }
        setResult(record.result);
      })
      .catch(() => setError('Assessment not found. Please take the quiz again.'));
  }, [id]);

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: '#fdf5ff' }}>
        <div className="text-center max-w-md px-6">
          <p style={{ color: '#230533', fontSize: 18, marginBottom: 16 }}>{error}</p>
          <a
            href="/"
            className="gradient-bg inline-flex items-center justify-center text-white"
            style={{ height: 48, minWidth: 180, borderRadius: 8, fontSize: 15, fontWeight: 500, textDecoration: 'none' }}
          >
            Start again
          </a>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: '#fdf5ff' }}>
        <p style={{ color: '#a900f1', fontSize: 14 }}>Loading your results...</p>
      </div>
    );
  }

  const overallColor = result.overallTier === 'ai-forward' || result.overallTier === 'ready-to-build'
    ? '#10b981'
    : result.overallTier === 'building-foundations'
    ? '#f59e0b'
    : '#ff1d79';

  return (
    <div className="flex-1 flex flex-col">

      {/* 1. Overall tier banner */}
      <section style={{ backgroundColor: '#230533' }} className="px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <p className="uppercase tracking-widest mb-4" style={{ fontSize: 12, color: '#a900f1', fontWeight: 500 }}>
            Your AI Readiness Assessment
          </p>
          <div className="gradient-bar mx-auto mb-8" style={{ width: 80 }} />
          <div className="inline-block mb-6">
            <span className="px-4 py-1.5 rounded-full text-white text-sm font-medium" style={{ backgroundColor: overallColor, fontSize: 13 }}>
              {result.overallTierLabel}
            </span>
          </div>
          <div className="mb-3">
            <span style={{ fontSize: 56, fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>{result.overallScore}</span>
            <span style={{ fontSize: 24, fontWeight: 300, color: '#ffffff', opacity: 0.6 }}> / 5</span>
          </div>
          <h1 className="mb-6" style={{ fontSize: 36, fontWeight: 600, color: '#ffffff', lineHeight: 1.2 }}>
            {result.overallTierLabel}
          </h1>
          <p style={{ fontSize: 16, fontWeight: 300, color: '#64dfec', lineHeight: 1.7, maxWidth: 620, margin: '0 auto' }}>
            {result.overallDescription}
          </p>
        </div>
      </section>

      {/* 2. Dimension breakdown */}
      <section style={{ backgroundColor: '#ffffff' }} className="px-6 py-12">
        <div style={{ maxWidth: 896, margin: '0 auto' }}>
          <h2 className="mb-3" style={{ fontSize: 24, fontWeight: 600, color: '#230533' }}>Your Breakdown</h2>
          <div className="gradient-bar mb-8" style={{ width: 80 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 20 }}>
            {result.dimensions.map(dim => {
              const color = tierColor(dim.tier);
              const barWidth = ((dim.score - 1) / 4) * 100;
              return (
                <div key={dim.id} style={{ border: '1px solid #ede0ff', borderRadius: 12, padding: 24, backgroundColor: '#fdf5ff' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: 28 }}>{dim.icon}</span>
                      <span style={{ fontSize: 18, fontWeight: 600, color: '#230533' }}>{dim.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 14, color: '#a900f1', fontWeight: 500 }}>{dim.score} / 5</span>
                      <span className="px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: color, fontSize: 11, fontWeight: 500 }}>
                        {dim.tierLabel}
                      </span>
                    </div>
                  </div>
                  <div style={{ height: 6, backgroundColor: '#ede0ff', borderRadius: 3, marginBottom: 16 }}>
                    <div style={{ height: '100%', width: `${barWidth}%`, backgroundColor: color, borderRadius: 3, transition: 'width 0.6s ease' }} />
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 300, color: '#230533', lineHeight: 1.6, marginBottom: 12 }}>
                    {dim.commentary}
                  </p>
                  <div>
                    <span className="uppercase tracking-wider" style={{ fontSize: 11, fontWeight: 500, color: '#a900f1', display: 'block', marginBottom: 4 }}>
                      Audit focus:
                    </span>
                    <p style={{ fontSize: 12, fontWeight: 300, color: '#230533', lineHeight: 1.55 }}>{dim.auditFocus}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. CTA */}
      <section style={{ backgroundColor: '#fdf5ff' }} className="px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="gradient-bar mx-auto mb-8" style={{ width: 80 }} />
          <h2 className="mb-4" style={{ fontSize: 28, fontWeight: 600, color: '#230533' }}>
            Ready to take the next step?
          </h2>
          <p className="mb-4" style={{ fontSize: 16, fontWeight: 300, color: '#230533', lineHeight: 1.7 }}>
            An AI Readiness Audit gives you a complete picture of your top automation opportunities, ranked and costed, with a clear 12-month roadmap to act on them.
          </p>
          <p className="mb-8" style={{ fontSize: 14, color: '#a900f1', fontWeight: 500 }}>£1,500 · Fixed price · 2–3 weeks</p>
          <a
            href="mailto:ben@axon-it.com?subject=AI%20Readiness%20Audit%20Enquiry"
            className="gradient-bg inline-flex items-center justify-center text-white mb-4"
            style={{ height: 48, minWidth: 280, borderRadius: 8, fontSize: 15, fontWeight: 500, textDecoration: 'none', display: 'inline-flex' }}
          >
            Book your AI Readiness Audit →
          </a>
          <p style={{ fontSize: 12, color: '#a900f1', marginTop: 12 }}>
            Or email <a href="mailto:ben@axon-it.com" style={{ color: '#a900f1' }}>ben@axon-it.com</a> to find out more
          </p>
        </div>
      </section>

      {/* 4. Restart */}
      <div className="text-center py-6" style={{ backgroundColor: '#ffffff' }}>
        <a href="/" style={{ fontSize: 13, color: '#a900f1', fontWeight: 400 }}>Take the assessment again</a>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add "app/results/[id]/"
git commit -m "feat: results dynamic route page at /results/[id]"
```

---

## Task 10: Redirect old results page

**Files:**
- Modify: `app/results/page.tsx` (full replacement)

Old localStorage links (`/results?id=xxx`) are no longer valid — those IDs don't exist in KV. Redirect to `/` so users can retake the quiz.

- [ ] **Step 1: Replace `app/results/page.tsx`**

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';

function Redirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/'); }, [router]);
  return null;
}

export default function OldResultsPage() {
  return <Suspense><Redirect /></Suspense>;
}
```

- [ ] **Step 2: Commit**

```bash
git add app/results/page.tsx
git commit -m "feat: redirect old /results?id= links to home"
```

---

## Task 11: Dashboard login page

**Files:**
- Create: `app/dashboard/login/page.tsx`

- [ ] **Step 1: Create `app/dashboard/login/page.tsx`**

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setError('Incorrect password');
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: '#230533' }}>
      <div
        className="flex flex-col items-center text-center anim-fade"
        style={{ width: 340, animation: shake ? 'shake 0.4s ease' : undefined }}
      >
        <div className="gradient-bar" style={{ width: 48, marginBottom: 20 }} />
        <p style={{ fontSize: 10, fontWeight: 500, color: '#a900f1', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>
          AI & Automation
        </p>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#fff', marginBottom: 6 }}>
          Assessment Dashboard
        </h1>
        <p style={{ fontSize: 13, fontWeight: 300, color: '#64dfec', marginBottom: 32 }}>
          Internal use only
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter team password"
            autoFocus
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.06)',
              border: '1.5px solid rgba(169,0,241,0.3)',
              borderRadius: 8,
              padding: '12px 16px',
              color: '#fff',
              fontSize: 14,
              textAlign: 'center',
              letterSpacing: '0.1em',
              outline: 'none',
            }}
          />
          {error && <p style={{ fontSize: 12, color: '#ff1d79', margin: 0 }}>{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="gradient-bg"
            style={{
              width: '100%',
              height: 48,
              borderRadius: 8,
              border: 'none',
              color: '#fff',
              fontSize: 14,
              fontWeight: 500,
              cursor: loading || !password ? 'not-allowed' : 'pointer',
              opacity: loading || !password ? 0.6 : 1,
            }}
          >
            {loading ? 'Checking...' : 'Enter →'}
          </button>
        </form>

        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 24 }}>
          Session lasts 30 days · Axon IT
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/dashboard/
git commit -m "feat: dashboard login page"
```

---

## Task 12: Dashboard list page

**Files:**
- Create: `app/dashboard/page.tsx`

- [ ] **Step 1: Create `app/dashboard/page.tsx`**

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AssessmentMeta } from '@/lib/kv';

function tierColor(label: string): string {
  if (label === 'AI-Forward' || label === 'Ready to Build') return '#10b981';
  if (label === 'Building Foundations') return '#f59e0b';
  if (label === 'Early Stage') return '#ff1d79';
  return '#a900f1';
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function DashboardPage() {
  const [assessments, setAssessments] = useState<AssessmentMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/assessments')
      .then(r => r.json())
      .then((data: AssessmentMeta[]) => {
        setAssessments(data.slice().reverse()); // newest first
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ backgroundColor: '#fdf5ff', minHeight: '100%' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '36px 32px' }}>

        {/* Header */}
        <div className="flex items-center justify-between anim-fade-up" style={{ marginBottom: 28 }}>
          <div>
            <p style={{ fontSize: 10, color: '#a900f1', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>
              All Assessments
            </p>
            <h1 style={{ fontSize: 24, fontWeight: 600, color: '#230533', lineHeight: 1.2 }}>
              AI Readiness Assessments
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/quiz"
              className="gradient-bg"
              style={{ height: 42, padding: '0 20px', borderRadius: 8, border: 'none', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
            >
              + New Assessment
            </a>
            <button
              onClick={() => fetch('/api/auth/logout', { method: 'POST' }).then(() => router.push('/dashboard/login'))}
              style={{ fontSize: 12, color: 'rgba(35,5,51,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Sign out
            </button>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <p style={{ fontSize: 13, color: '#a900f1', fontWeight: 300 }}>Loading assessments...</p>
        ) : assessments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontSize: 15, color: '#230533', fontWeight: 300, marginBottom: 12 }}>No assessments yet</p>
            <p style={{ fontSize: 13, color: '#a900f1', fontWeight: 300 }}>
              Send prospects to <strong>readiness-quiz.vercel.app</strong> or click "+ New Assessment"
            </p>
          </div>
        ) : (
          <div className="flex flex-col anim-fade-up" style={{ gap: 8 }}>
            {assessments.map(a => (
              <div
                key={a.id}
                onClick={() => router.push(`/results/${a.id}`)}
                style={{
                  background: '#fff',
                  border: '1px solid #ede0ff',
                  borderRadius: 10,
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  cursor: 'pointer',
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#a900f1')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#ede0ff')}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: '#230533', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {a.companyName}
                  </p>
                  <p style={{ fontSize: 11, color: 'rgba(35,5,51,0.45)', fontWeight: 300 }}>
                    {timeAgo(a.createdAt)}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                  {a.overallTierLabel !== 'In Progress' ? (
                    <>
                      <span style={{ fontSize: 12, color: '#a900f1', fontWeight: 500 }}>
                        {a.overallScore} / 5
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          background: tierColor(a.overallTierLabel),
                          color: '#fff',
                          padding: '2px 8px',
                          borderRadius: 4,
                          fontWeight: 500,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {a.overallTierLabel}
                      </span>
                    </>
                  ) : (
                    <span style={{ fontSize: 10, background: 'rgba(169,0,241,0.15)', color: '#a900f1', padding: '2px 8px', borderRadius: 4, fontWeight: 500 }}>
                      In Progress
                    </span>
                  )}
                  <span style={{ color: '#a900f1', opacity: 0.5, fontSize: 16 }}>›</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add GET handler to `app/api/assessments/route.ts`**

The dashboard needs to list assessments. Add a `GET` export to the existing file:

Open `app/api/assessments/route.ts` and add this after the `POST` function:

```typescript
import { NextResponse } from 'next/server';
import { createAssessment, listAssessments } from '@/lib/kv';

export async function GET() {
  try {
    const assessments = await listAssessments();
    return NextResponse.json(assessments);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { companyName } = (await request.json()) as { companyName?: string };
    const name = (companyName ?? '').trim() || 'Anonymous';
    const id = await createAssessment(name);
    return NextResponse.json({ id });
  } catch {
    return NextResponse.json({ error: 'Failed to create assessment' }, { status: 500 });
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add app/dashboard/page.tsx app/api/assessments/route.ts
git commit -m "feat: dashboard list page + GET /api/assessments"
```

---

## Task 13: Vercel env vars + deploy

- [ ] **Step 1: Add env vars to Vercel**

Run from `Apps/Readiness-quiz/`:

```bash
printf '%s' 'YOUR_KV_REST_API_URL' | vercel env add KV_REST_API_URL production
printf '%s' 'YOUR_KV_REST_API_TOKEN' | vercel env add KV_REST_API_TOKEN production
printf '%s' 'YOUR_QUIZ_PASSWORD' | vercel env add QUIZ_PASSWORD production
printf '%s' 'YOUR_QUIZ_SECRET_32_CHARS' | vercel env add QUIZ_SECRET production
```

- The KV URL and token come from the shared Upstash KV instance — copy from the audit tool's Vercel project env vars.
- `QUIZ_PASSWORD`: choose a password (e.g. same as `HUB_PASSWORD` or a new one — Ben's call).
- `QUIZ_SECRET`: any random 32+ character string (used to sign JWT cookies).

- [ ] **Step 2: Also add env vars for Preview environment**

```bash
printf '%s' 'YOUR_KV_REST_API_URL' | vercel env add KV_REST_API_URL preview
printf '%s' 'YOUR_KV_REST_API_TOKEN' | vercel env add KV_REST_API_TOKEN preview
printf '%s' 'YOUR_QUIZ_PASSWORD' | vercel env add QUIZ_PASSWORD preview
printf '%s' 'YOUR_QUIZ_SECRET_32_CHARS' | vercel env add QUIZ_SECRET preview
```

- [ ] **Step 3: Push to GitHub to trigger deploy**

```bash
git push origin main
```

- [ ] **Step 4: Verify deployment**

1. Visit https://readiness-quiz.vercel.app — landing page loads
2. Click "Start the assessment" → company name interstitial appears
3. Enter a company name → quiz starts at `/quiz/[id]`
4. Complete a few questions (you can test with a single dimension by watching network)
5. Complete all 30 → redirects to `/results/[id]` — results load from KV
6. Visit https://readiness-quiz.vercel.app/dashboard → redirects to `/dashboard/login`
7. Enter password → dashboard loads → assessment row appears with company name + tier

- [ ] **Step 5: Update tracking.md**

Add a session entry in `AI & Automation/tracking.md` noting the feature is live.
