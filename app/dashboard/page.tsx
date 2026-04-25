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
              Send prospects to <strong>readiness-quiz.vercel.app</strong> or click &quot;+ New Assessment&quot;
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
