'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StackButton from '@/components/ui/StackButton';

export default function LoginForm({ expired = false }: { expired?: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'submitting') return;
    setStatus('submitting');
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message ?? 'Login failed. Please try again.');
        setStatus('idle');
        return;
      }
      // Full navigation so the proxy re-evaluates with the new session cookie.
      window.location.assign('/jundullah/dashboard');
    } catch {
      setError('Network error. Please try again.');
      setStatus('idle');
    }
  }

  return (
    <main className="adm-auth">
      <div className="adm-auth-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Waheed" className="adm-auth-logo" />
        <p className="adm-auth-eyebrow">Admin Portal</p>
        <h1 className="adm-auth-h">
          Welcome <em>back.</em>
        </h1>

        {expired && (
          <p className="adm-auth-notice">Your session expired — please sign in again.</p>
        )}

        <form className="adm-auth-form" onSubmit={handleSubmit} noValidate>
          <label className="adm-field">
            <span>Email</span>
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@waheed.in"
              required
              disabled={status === 'submitting'}
            />
          </label>
          <label className="adm-field">
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              disabled={status === 'submitting'}
            />
          </label>

          {error && <p className="adm-auth-error">{error}</p>}

          <StackButton type="submit" fullWidth className="adm-auth-submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Signing in…' : 'Sign in →'}
          </StackButton>
        </form>
      </div>
    </main>
  );
}
