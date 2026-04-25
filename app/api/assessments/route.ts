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
