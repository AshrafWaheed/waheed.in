'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

async function post(url: string, method: string, payload: unknown) {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errs = (data as { errors?: Record<string, string[]> }).errors;
    const first = errs ? Object.values(errs)[0]?.[0] : undefined;
    throw new Error(first ?? (data as { message?: string }).message ?? 'Something went wrong.');
  }
  return data;
}

export default function ProfileForm({ initialName, initialEmail }: { initialName: string; initialEmail: string }) {
  const router = useRouter();

  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [savingDetails, setSavingDetails] = useState(false);
  const [detailsMsg, setDetailsMsg] = useState('');
  const [detailsErr, setDetailsErr] = useState('');

  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState('');
  const [pwErr, setPwErr] = useState('');

  async function saveDetails() {
    setSavingDetails(true); setDetailsMsg(''); setDetailsErr('');
    try {
      await post('/api/admin/profile', 'PATCH', { name: name.trim(), email: email.trim() });
      setDetailsMsg('Profile updated.');
      router.refresh();
    } catch (e) {
      setDetailsErr(e instanceof Error ? e.message : 'Could not save.');
    } finally {
      setSavingDetails(false);
    }
  }

  async function savePassword() {
    setSavingPw(true); setPwMsg(''); setPwErr('');
    if (next !== confirm) {
      setPwErr('New password and confirmation do not match.');
      setSavingPw(false);
      return;
    }
    try {
      await post('/api/admin/profile/password', 'POST', {
        current_password: current,
        password: next,
        password_confirmation: confirm,
      });
      setPwMsg('Password changed. Other devices have been signed out.');
      setCurrent(''); setNext(''); setConfirm('');
    } catch (e) {
      setPwErr(e instanceof Error ? e.message : 'Could not change password.');
    } finally {
      setSavingPw(false);
    }
  }

  return (
    <div className="adm-profile-grid">
      <section className="adm-card">
        <div className="adm-card-head"><h2>Account details</h2></div>
        {detailsErr && <p className="adm-form-error">{detailsErr}</p>}
        {detailsMsg && <p className="adm-form-ok">{detailsMsg}</p>}
        <label className="adm-field2">
          <span>Name</span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="adm-field2">
          <span>Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <div className="adm-modal-actions">
          <button type="button" className="btn btn-gold" onClick={saveDetails} disabled={savingDetails}>
            {savingDetails ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </section>

      <section className="adm-card">
        <div className="adm-card-head"><h2>Change password</h2></div>
        {pwErr && <p className="adm-form-error">{pwErr}</p>}
        {pwMsg && <p className="adm-form-ok">{pwMsg}</p>}
        <label className="adm-field2">
          <span>Current password</span>
          <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" />
        </label>
        <label className="adm-field2">
          <span>New password</span>
          <input type="password" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" />
          <small className="adm-hint">At least 12 characters.</small>
        </label>
        <label className="adm-field2">
          <span>Confirm new password</span>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
        </label>
        <div className="adm-modal-actions">
          <button type="button" className="btn btn-gold" onClick={savePassword} disabled={savingPw}>
            {savingPw ? 'Saving…' : 'Update password'}
          </button>
        </div>
      </section>
    </div>
  );
}
