import { NextResponse } from 'next/server';

// Scaffold for future lead capture - currently a no-op
export async function POST() {
  return NextResponse.json({ success: true });
}
