'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export type Contact = {
  id: number;
  name: string;
  email: string;
  brand: string;
  whatsapp: string | null;
  location: string | null;
  service: string;
  custom_services: string[] | null;
  stage: string | null;
  budget: string | null;
  message: string;
  timeline: string | null;
  created_at: string;
};

function fmt(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="adm-detail-row">
      <span className="adm-detail-label">{label}</span>
      <span className="adm-detail-value">{value}</span>
    </div>
  );
}

export default function ContactsTable({ rows }: { rows: Contact[] }) {
  const [open, setOpen] = useState<Contact | null>(null);

  return (
    <>
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Brand</th>
              <th>Service</th>
              <th>Email</th>
              <th>Received</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="adm-row-click" onClick={() => setOpen(c)}>
                <td className="adm-table-title">{c.name}</td>
                <td>{c.brand}</td>
                <td>{c.service}</td>
                <td className="adm-table-muted">{c.email}</td>
                <td className="adm-table-date">{fmt(c.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="adm-drawer-overlay" onClick={() => setOpen(null)}>
          <aside className="adm-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="adm-drawer-head">
              <div>
                <h2>{open.name}</h2>
                <p className="adm-drawer-sub">{open.brand} · {fmt(open.created_at)}</p>
              </div>
              <button type="button" className="adm-drawer-close" onClick={() => setOpen(null)} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <div className="adm-drawer-body">
              <Field label="Email" value={open.email} />
              <Field label="WhatsApp" value={open.whatsapp} />
              <Field label="Location" value={open.location} />
              <Field label="Service" value={open.service} />
              <Field
                label="Custom services"
                value={open.custom_services && open.custom_services.length ? open.custom_services.join(', ') : null}
              />
              <Field label="Stage" value={open.stage} />
              <Field label="Budget" value={open.budget} />
              <Field label="Timeline" value={open.timeline} />
              <div className="adm-detail-row adm-detail-message">
                <span className="adm-detail-label">Message</span>
                <p className="adm-detail-value">{open.message}</p>
              </div>
              <div className="adm-drawer-actions">
                <a className="btn adm-save-draft" href={`mailto:${open.email}`}>Reply by email</a>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
