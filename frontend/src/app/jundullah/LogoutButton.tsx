'use client';

import { useState } from 'react';

export default function LogoutButton() {
  const [busy, setBusy] = useState(false);

  async function handleLogout() {
    if (busy) return;
    setBusy(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // ignore — clear client state regardless
    }
    // Full navigation so the proxy re-evaluates without the session cookie.
    window.location.assign('/jundullah');
  }

  return (
    <button type="button" className="adm-logout" onClick={handleLogout} disabled={busy}>
      {busy ? 'Signing out…' : 'Log out'}
    </button>
  );
}
