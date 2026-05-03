'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Guest {
  id: number;
  slug: string;
  name: string;
  with_family: number;
  is_active: number;
  rsvp_status: string;
  created_at: string;
  updated_at: string;
}

interface Stats {
  total: number;
  confirmed: number;
  declined: number;
  pending: number;
  inactive: number;
}

export default function DekAdmin() {
  // null = still reading sessionStorage (avoid login flash)
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [guests, setGuests] = useState<Guest[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [dataLoading, setDataLoading] = useState(false);

  const [search, setSearch] = useState('');

  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState('');
  const [addWithFamily, setAddWithFamily] = useState(false);
  const [addError, setAddError] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editWithFamily, setEditWithFamily] = useState(false);

  const [importStatus, setImportStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  useEffect(() => {
    setAuthed(sessionStorage.getItem('dek_authed') === 'true');
  }, []);

  useEffect(() => {
    if (authed === true) fetchGuests();
  }, [authed]);

  async function fetchGuests() {
    setDataLoading(true);
    try {
      const res = await fetch('/api/dek/guests');
      const data = await res.json();
      setGuests(data.guests ?? []);
      setStats(data.stats ?? null);
    } catch {
      // silent — table stays empty
    } finally {
      setDataLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/dek/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.ok) {
        sessionStorage.setItem('dek_authed', 'true');
        setAuthed(true);
      } else {
        setAuthError('Incorrect password');
      }
    } catch {
      setAuthError('Something went wrong. Try again.');
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleAddGuest() {
    if (!addName.trim()) {
      setAddError('Name is required');
      return;
    }
    setAddLoading(true);
    setAddError('');
    try {
      const res = await fetch('/api/dek/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: addName.trim(), with_family: addWithFamily }),
      });
      if (res.ok) {
        setShowAdd(false);
        setAddName('');
        setAddWithFamily(false);
        await fetchGuests();
      } else {
        const data = await res.json();
        setAddError(data.error ?? 'Failed to add guest');
      }
    } catch {
      setAddError('Something went wrong');
    } finally {
      setAddLoading(false);
    }
  }

  function startEdit(guest: Guest) {
    setEditingSlug(guest.slug);
    setEditName(guest.name);
    setEditWithFamily(guest.with_family === 1);
  }

  async function handleSave(slug: string) {
    if (!editName.trim()) return;
    await fetch(`/api/dek/guests/${slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName.trim(), with_family: editWithFamily }),
    });
    setEditingSlug(null);
    await fetchGuests();
  }

  async function handleToggleActive(slug: string) {
    await fetch(`/api/dek/guests/${slug}`, { method: 'DELETE' });
    await fetchGuests();
  }

  async function handleImport(file: File) {
    setImportStatus('Importing...');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/dek/import', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) {
        setImportStatus(`✓ ${data.inserted} guests added`);
        await fetchGuests();
      } else {
        setImportStatus(`✗ Error: ${data.error ?? 'Import failed'}`);
      }
    } catch {
      setImportStatus('✗ Error: Network error');
    }
  }

  function handleDownloadTemplate() {
    const content = 'name,with_family\nExample Guest,0';
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'guests-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleCopy(slug: string) {
    await navigator.clipboard.writeText(`https://waheed.in/dawat-e-khas/${slug}`);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  }

  function handleLogout() {
    sessionStorage.removeItem('dek_authed');
    window.location.reload();
  }

  const filteredGuests = guests.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  // Still reading sessionStorage — render nothing to avoid flash
  if (authed === null) return null;

  // ─── Login Screen ──────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-sm">
          <h1 className="text-xl font-semibold text-[#1a1a1a] mb-6 text-center">
            Dawat-e-Khas Admin
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-[#1a1a1a] outline-none focus:border-blue-500 transition-colors"
            />
            {authError && <p className="text-red-500 text-sm">{authError}</p>}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg px-4 py-2.5 transition-colors disabled:opacity-60"
            >
              {authLoading ? 'Checking...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 text-[#1a1a1a]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-base font-semibold">Dawat-e-Khas Admin</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats Row */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {(
              [
                { label: 'Total Guests', value: stats.total },
                { label: 'Confirmed', value: stats.confirmed },
                { label: 'Declined', value: stats.declined },
                { label: 'Pending', value: stats.pending },
              ] as const
            ).map(({ label, value }) => (
              <div
                key={label}
                className="bg-white border border-gray-200 rounded-xl p-4 text-center"
              >
                <p className="text-3xl font-bold text-[#1a1a1a]">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <button
            onClick={() => {
              setShowAdd(true);
              setAddError('');
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
          >
            + Add Guest
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-white border border-gray-300 hover:border-gray-400 text-[#1a1a1a] text-sm rounded-lg px-4 py-2 transition-colors"
          >
            Import CSV
          </button>
          <button
            onClick={handleDownloadTemplate}
            className="bg-white border border-gray-300 hover:border-gray-400 text-[#1a1a1a] text-sm rounded-lg px-4 py-2 transition-colors"
          >
            Download Template
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImport(file);
              e.target.value = '';
            }}
          />
          {importStatus && (
            <span
              className={`text-sm ${
                importStatus.startsWith('✓')
                  ? 'text-green-600'
                  : importStatus === 'Importing...'
                  ? 'text-gray-500'
                  : 'text-red-500'
              }`}
            >
              {importStatus}
            </span>
          )}
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search guests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500 transition-colors w-full sm:w-80"
          />
        </div>

        {/* Table */}
        {dataLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm bg-white">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left">
                  {['Name', 'With Family', 'Status', 'RSVP', 'Link', 'Actions'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 font-medium text-gray-500 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredGuests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-14 text-gray-400">
                      {guests.length === 0
                        ? 'No guests yet. Add one!'
                        : 'No results for your search.'}
                    </td>
                  </tr>
                ) : (
                  filteredGuests.map((guest) => {
                    const isEditing = editingSlug === guest.slug;
                    return (
                      <tr
                        key={guest.slug}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60"
                      >
                        {/* Name */}
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1 text-sm w-44 outline-none focus:border-blue-500"
                            />
                          ) : (
                            <span className="font-medium">{guest.name}</span>
                          )}
                        </td>

                        {/* With Family */}
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <input
                              type="checkbox"
                              checked={editWithFamily}
                              onChange={(e) => setEditWithFamily(e.target.checked)}
                              className="w-4 h-4 cursor-pointer"
                            />
                          ) : (
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                                guest.with_family === 1
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-500'
                              }`}
                            >
                              {guest.with_family === 1 ? 'Yes' : 'No'}
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                              guest.is_active === 1
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-600'
                            }`}
                          >
                            {guest.is_active === 1 ? 'Active' : 'Inactive'}
                          </span>
                        </td>

                        {/* RSVP */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          {guest.rsvp_status === 'confirmed' && (
                            <span className="text-green-600 font-medium">✓ Confirmed</span>
                          )}
                          {guest.rsvp_status === 'declined' && (
                            <span className="text-red-500 font-medium">✗ Declined</span>
                          )}
                          {guest.rsvp_status === 'pending' && (
                            <span className="text-gray-400">⏳ Pending</span>
                          )}
                        </td>

                        {/* Link */}
                        <td className="px-4 py-3">
                          <div className="relative inline-block">
                            <button
                              onClick={() => handleCopy(guest.slug)}
                              title="Copy invitation link"
                              className="text-gray-400 hover:text-gray-700 transition-colors"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </svg>
                            </button>
                            {copiedSlug === guest.slug && (
                              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none">
                                Copied!
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => handleSave(guest.slug)}
                                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-1.5 transition-colors"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingSlug(null)}
                                  className="text-xs border border-gray-300 hover:border-gray-400 text-gray-600 rounded px-3 py-1.5 transition-colors"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => startEdit(guest)}
                                className="text-xs bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-1.5 transition-colors"
                              >
                                Edit
                              </button>
                            )}
                            <button
                              onClick={() => handleToggleActive(guest.slug)}
                              className={`text-xs rounded px-3 py-1.5 border transition-colors ${
                                guest.is_active === 1
                                  ? 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200'
                                  : 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200'
                              }`}
                            >
                              {guest.is_active === 1 ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Guest Modal */}
      {showAdd && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAdd(false);
              setAddName('');
              setAddWithFamily(false);
              setAddError('');
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-base font-semibold text-[#1a1a1a] mb-4">Add Guest</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Name</label>
                <input
                  type="text"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddGuest()}
                  placeholder="Guest name"
                  autoFocus
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors"
                />
                {addError && (
                  <p className="text-red-500 text-xs mt-1">{addError}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="addWithFamily"
                  checked={addWithFamily}
                  onChange={(e) => setAddWithFamily(e.target.checked)}
                  className="w-4 h-4 cursor-pointer"
                />
                <label htmlFor="addWithFamily" className="text-sm text-gray-600 cursor-pointer">
                  With Family
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAdd(false);
                  setAddName('');
                  setAddWithFamily(false);
                  setAddError('');
                }}
                className="flex-1 border border-gray-300 hover:border-gray-400 text-[#1a1a1a] text-sm rounded-lg py-2.5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddGuest}
                disabled={addLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg py-2.5 transition-colors disabled:opacity-60"
              >
                {addLoading ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
