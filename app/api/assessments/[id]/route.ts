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
