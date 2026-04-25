# Readiness Quiz — KV Storage & Dashboard

**Date:** 2026-04-25  
**Status:** Approved

## Overview

Add persistent KV storage to the Readiness Quiz so every completed assessment is saved server-side. Add a password-protected internal dashboard for Ben to browse all past assessments. The public quiz experience gains a lightweight company name prompt before the first question; the results page becomes a shareable URL backed by KV instead of localStorage.

---

## User Flows

### Public (prospect)

1. `/` — landing page (unchanged)
2. Click "Start" → `/quiz` — company name interstitial: "What company are you from?" text input + "Skip" link
3. Submit or skip → POST `/api/assessments` → KV record created → redirect `/quiz/[id]`
4. Complete 30 questions → PATCH `/api/assessments/[id]` → answers + computed result saved to KV → redirect `/results/[id]`
5. `/results/[id]` — full results page, reads from KV, shareable link

### Internal (Ben)

1. `/dashboard` → redirect to `/dashboard/login` if no valid session
2. Login with `QUIZ_PASSWORD` → httpOnly JWT cookie → redirect `/dashboard`
3. Dashboard lists all assessments: company name, overall tier, score, date
4. Click row → `/results/[id]`

---

## Data Model

### KV index key: `readiness-index`

Stores `AssessmentMeta[]`:

```ts
interface AssessmentMeta {
  id: string
  companyName: string      // "Anonymous" if skipped
  overallScore: number     // e.g. 3.4
  overallTierLabel: string // e.g. "Ready to Build"
  createdAt: string        // ISO timestamp
}
```

### KV per-record key: `readiness:{id}`

```ts
interface AssessmentRecord {
  companyName: string
  answers: Record<string, number>
  result: QuizResult        // full computed result — all 5 dimensions
  createdAt: string
}
```

`QuizResult` is the existing type from `lib/scoring.ts`. Storing it pre-computed means the results page reads directly from KV without re-running `calculateResults`.

---

## Architecture

### New files

| File | Purpose |
|------|---------|
| `lib/kv.ts` | list, create, get, save assessments |
| `lib/auth.ts` | JWT cookie auth (mirrors audit tool) |
| `middleware.ts` | protects `/dashboard*` routes only |
| `app/api/auth/login/route.ts` | login endpoint |
| `app/api/auth/logout/route.ts` | logout endpoint |
| `app/api/assessments/route.ts` | POST — create record from name interstitial |
| `app/api/assessments/[id]/route.ts` | GET — fetch record for results page; PATCH — save completed answers + result |
| `app/quiz/[id]/page.tsx` | 30-question quiz (moved from `app/quiz/page.tsx`); redirects to `/quiz` if ID not found in KV |
| `app/results/[id]/page.tsx` | results page reading from KV |
| `app/dashboard/page.tsx` | assessment list (auth-gated) |
| `app/dashboard/login/page.tsx` | login screen |

### Modified files

| File | Change |
|------|--------|
| `app/quiz/page.tsx` | Replaced with company name interstitial |
| `app/results/page.tsx` | Redirect `/results?id=xxx` → `/results/[id]` (backwards compat for any old localStorage links) |
| `package.json` | Add `@vercel/kv`, `jose` |

### Auth

- Single `QUIZ_PASSWORD` env var (same pattern as audit tool's `AUDIT_PASSWORD`)
- httpOnly JWT cookie, 30-day session
- Middleware protects `/dashboard` and `/dashboard/*` only
- Quiz (`/quiz`, `/quiz/[id]`) and results (`/results/[id]`) remain fully public

---

## Company Name Interstitial

Replaces `app/quiz/page.tsx`. Simple single-field form:

- Heading: "Before we start — what company are you from?"
- Text input: placeholder "Company name"
- Primary CTA: "Start assessment →"
- Secondary link below: "Skip"
- On submit/skip: POST to `/api/assessments` with `{ companyName }` (empty string if skipped, stored as "Anonymous")
- On success: redirect to `/quiz/[id]`

Visually matches existing quiz aesthetic (Deep Purple background, gradient bar, DM Sans).

---

## Results Page Change

Current: `/results/page.tsx` reads `axon-quiz-result` from localStorage using `?id=` query param.

New: `/results/[id]/page.tsx` fetches `/api/assessments/[id]` and reads `record.result`. No localStorage dependency. URL is clean and shareable.

The old `/results/page.tsx` is replaced with a simple redirect: if `?id=` param is present, redirect to `/results/[id]`. This handles any bookmarked or shared old-format links gracefully.

---

## Dashboard

Route: `/dashboard` (password-gated)

Layout mirrors audit tool dashboard:
- Sidebar: Axon logo, "AI & Automation / Readiness Quiz" label, sign out
- Main: "All Assessments" header + "New Assessment" button (links to `/quiz`)
- Assessment list rows: company name, tier badge (colour-coded), score `/5`, date, arrow
- Click row → `/results/[id]`
- No delete in v1 (low priority, can add later)

---

## KV Environment

The readiness quiz will use the same Upstash KV instance shared with the audit tool and content library (already configured via `KV_REST_API_URL` + `KV_REST_API_TOKEN` env vars in Vercel). Key prefix `readiness:` ensures no collisions.

---

## Out of Scope

- Lead capture (email) — separate roadmap item, Medium priority
- Delete assessment from dashboard — can add later
- Score history / retake comparison — separate roadmap item
- Any change to the 30 questions or scoring logic
