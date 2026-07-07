'use client';

import { useState } from 'react';

// Shown (via the root layout) only when an admin is previewing the real site
// while the public still sees the coming-soon screen.
export default function PreviewBanner() {
  const [busy, setBusy] = useState(false);

  async function handleLogout() {
    if (busy) return;
    setBusy(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    window.location.assign('/jundullah');
  }

  return (
    <div className="adm-preview" role="status">
      <span className="adm-preview-dot" aria-hidden="true" />
      <span className="adm-preview-txt">Admin preview — only you can see the live site</span>
      <a href="/jundullah/blogs">Portal</a>
      <button type="button" onClick={handleLogout} disabled={busy}>
        {busy ? '…' : 'Log out'}
      </button>
    </div>
  );
}
