'use client';

import { Download } from 'lucide-react';

function toCsv(rows: readonly unknown[], columns: { key: string; label: string }[]): string {
  const esc = (v: unknown) => {
    const s = v == null ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = columns.map((c) => esc(c.label)).join(',');
  const body = rows
    .map((r) => columns.map((c) => esc((r as Record<string, unknown>)[c.key])).join(','))
    .join('\n');
  return `${header}\n${body}`;
}

export default function ExportCsvButton({
  rows,
  columns,
  filename,
}: {
  rows: readonly unknown[];
  columns: { key: string; label: string }[];
  filename: string;
}) {
  function download() {
    const csv = toCsv(rows, columns);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <button type="button" className="btn adm-export-btn" onClick={download} disabled={rows.length === 0}>
      <Download size={15} />
      Export CSV
    </button>
  );
}
