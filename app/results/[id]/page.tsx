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
