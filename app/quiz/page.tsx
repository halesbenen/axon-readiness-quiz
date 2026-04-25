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
