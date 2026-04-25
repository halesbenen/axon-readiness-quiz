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
