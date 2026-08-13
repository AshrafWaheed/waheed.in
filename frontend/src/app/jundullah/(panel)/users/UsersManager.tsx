'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, Pencil, KeyRound, Trash2, X, Check, Copy } from 'lucide-react';
import StackButton from '@/components/ui/StackButton';

export type ManagedUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  last_login_at: string | null;
  created_at: string | null;
};

function fmt(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

type Mode = { kind: 'create' } | { kind: 'edit'; user: ManagedUser } | { kind: 'reset'; user: ManagedUser } | null;

export default function UsersManager({
  users,
  currentUserId,
}: {
  users: ManagedUser[];
  currentUserId: number;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState<{ email: string; password: string } | null>(null);

  function openCreate() {
    setName(''); setEmail(''); setPassword(''); setError(''); setMode({ kind: 'create' });
  }
  function openEdit(user: ManagedUser) {
    setName(user.name); setEmail(user.email); setError(''); setMode({ kind: 'edit', user });
  }
  function openReset(user: ManagedUser) {
    setPassword(''); setError(''); setMode({ kind: 'reset', user });
  }
  function close() { setMode(null); setError(''); }

  async function api(url: string, method: string, payload?: unknown) {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: payload ? JSON.stringify(payload) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const errs = (data as { errors?: Record<string, string[]> }).errors;
      const first = errs ? Object.values(errs)[0]?.[0] : undefined;
      throw new Error(first ?? (data as { message?: string }).message ?? 'Something went wrong.');
    }
    return data as { generated_password?: string | null; data?: { email: string } };
  }

  async function submit() {
    if (!mode) return;
    setBusy(true); setError('');
    try {
      if (mode.kind === 'create') {
        const data = await api('/api/admin/users', 'POST', {
          name: name.trim(), email: email.trim(), password: password.trim() || undefined,
        });
        if (data.generated_password) setNotice({ email: email.trim(), password: data.generated_password });
      } else if (mode.kind === 'edit') {
        await api(`/api/admin/users/${mode.user.id}`, 'PATCH', { name: name.trim(), email: email.trim() });
      } else if (mode.kind === 'reset') {
        const data = await api(`/api/admin/users/${mode.user.id}/password`, 'POST', {
          password: password.trim() || undefined,
        });
        if (data.generated_password) setNotice({ email: mode.user.email, password: data.generated_password });
      }
      close();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  async function remove(user: ManagedUser) {
    if (!window.confirm(`Delete ${user.name} (${user.email})? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await api(`/api/admin/users/${user.id}`, 'DELETE');
      router.refresh();
    } catch (e) {
      window.alert(e instanceof Error ? e.message : 'Could not delete user.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="adm-users-toolbar">
        <StackButton type="button" size="sm" onClick={openCreate}>
          <UserPlus size={16} /> Add user
        </StackButton>
      </div>

      {notice && (
        <div className="adm-pw-notice">
          <div>
            <strong>New password for {notice.email}</strong>
            <code>{notice.password}</code>
            <span>Copy it now — it won&rsquo;t be shown again.</span>
          </div>
          <div className="adm-pw-actions">
            <button type="button" onClick={() => navigator.clipboard?.writeText(notice.password)} title="Copy">
              <Copy size={15} /> Copy
            </button>
            <button type="button" onClick={() => setNotice(null)} title="Dismiss"><X size={15} /></button>
          </div>
        </div>
      )}

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Role</th><th>Last login</th><th>Joined</th><th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="adm-table-title">
                  {u.name} {u.id === currentUserId && <span className="adm-chip2">you</span>}
                </td>
                <td className="adm-table-muted">{u.email}</td>
                <td><span className="adm-badge adm-badge-published">{u.role}</span></td>
                <td className="adm-table-date">{fmt(u.last_login_at)}</td>
                <td className="adm-table-date">{fmt(u.created_at)}</td>
                <td className="adm-table-actions adm-row-actions">
                  <button type="button" onClick={() => openEdit(u)} title="Edit"><Pencil size={15} /></button>
                  <button type="button" onClick={() => openReset(u)} title="Reset password"><KeyRound size={15} /></button>
                  {u.id !== currentUserId && (
                    <button type="button" className="adm-danger" onClick={() => remove(u)} title="Delete" disabled={busy}>
                      <Trash2 size={15} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mode && (
        <div className="adm-drawer-overlay" onClick={close}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-drawer-head">
              <h2>
                {mode.kind === 'create' ? 'Add user'
                  : mode.kind === 'edit' ? 'Edit user'
                  : 'Reset password'}
              </h2>
              <button type="button" className="adm-drawer-close" onClick={close} aria-label="Close"><X size={20} /></button>
            </div>
            <div className="adm-modal-body">
              {error && <p className="adm-form-error">{error}</p>}

              {mode.kind !== 'reset' && (
                <>
                  <label className="adm-field2">
                    <span>Name</span>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
                  </label>
                  <label className="adm-field2">
                    <span>Email</span>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@waheed.in" />
                  </label>
                </>
              )}

              {mode.kind !== 'edit' && (
                <label className="adm-field2">
                  <span>{mode.kind === 'reset' ? 'New password' : 'Password'}</span>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to auto-generate"
                  />
                  <small className="adm-hint">Min 12 characters, or leave blank to generate a strong one.</small>
                </label>
              )}

              {mode.kind === 'reset' && (
                <p className="adm-hint">Resetting <strong>{mode.user.email}</strong> will sign them out of all devices.</p>
              )}

              <div className="adm-modal-actions">
                <StackButton type="button" size="sm" tone="ghost" onClick={close} disabled={busy}>Cancel</StackButton>
                <StackButton type="button" size="sm" onClick={submit} disabled={busy}>
                  <Check size={16} /> {busy ? 'Saving…' : 'Save'}
                </StackButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
