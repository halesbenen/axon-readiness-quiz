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
          AI &amp; Automation
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
