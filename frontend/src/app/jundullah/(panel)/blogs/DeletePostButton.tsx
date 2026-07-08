'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeletePostButton({ id, title }: { id: number; title: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (busy) return;
    if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
        return;
      }
      window.alert('Delete failed. Please try again.');
    } catch {
      window.alert('Network error. Please try again.');
    }
    setBusy(false);
  }

  return (
    <button type="button" className="adm-del" onClick={handleDelete} disabled={busy}>
      {busy ? '…' : 'Delete'}
    </button>
  );
}
