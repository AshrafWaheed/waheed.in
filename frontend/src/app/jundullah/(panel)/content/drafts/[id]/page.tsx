import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { adminApi } from '@/lib/admin-api';
import FactGate from './FactGate';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Fact check · WAHEED Admin',
  robots: { index: false, follow: false },
};

export type Verdict = 'confirmed' | 'corrected' | 'removed';

export type Claim = {
  id: number;
  claim: string;
  source_url: string | null;
  model_confidence: 'high' | 'medium' | 'low';
  verified_at: string | null;
  verdict: Verdict | null;
  note: string | null;
  verifier: { id: number; name: string } | null;

  // The agent lane. A machine pass that has already read the sources; it can
  // recommend but never clears the gate, which stays keyed to verified_at.
  agent_verdict: Verdict | null;
  agent_note: string | null;
  agent_source_url: string | null;
  agent_checked_at: string | null;
  agent_model: string | null;
};

export type DraftPayload = {
  post: {
    id: number;
    title: string;
    slug: string;
    status: string;
    seo_title: string | null;
    body_html: string;
    reading_mins: number | null;
    generator_prompt_version: string | null;
    model_id: string | null;
    topic: { id: number; primary_keyword: string; bridge_target: string | null } | null;
    author: { id: number; name: string } | null;
  };
  claims: Claim[];
  warnings: string[];
  fact_check_state: 'pending' | 'partial' | 'cleared';
  can_publish: boolean;
  turns_used: number;
  turns_max: number;
};

export default async function DraftFactCheckPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await adminApi(`/admin/content/drafts/${id}`);
  if (!res.ok) notFound();

  const data = (await res.json()) as DraftPayload;

  return <FactGate initial={data} />;
}
