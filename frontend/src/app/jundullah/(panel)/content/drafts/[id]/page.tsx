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
  // How it was verified: someone read the source, or someone accepted a machine
  // pass that read the source. `verifier` names the accountable person either way.
  verified_via: 'human' | 'agent' | null;
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

export type Variant = {
  id: number;
  platform: string;
  label: string;
  format: 'html' | 'text';
  publish: 'api' | 'manual';
  title: string;
  body_html: string;
  angle: string;
  tags: string[] | null;
  status: 'draft' | 'approved' | 'queued' | 'published' | 'failed';
  canonical_url: string;
  external_url: string | null;
  char_count: number;
  max_chars: number | null;
  is_stale: boolean;
  warnings: string[];
  approver: { id: number; name: string } | null;
  published_at: string | null;
  attempts: number;
  last_error: string | null;
  /** Why this can or cannot be sent anywhere yet. */
  syndication: { ready: boolean; reason: string | null; automatable: boolean };
};

export type Indexation = {
  url: string;
  post_status: string;
  indexed_at: string | null;
  /** Whether Search Console can be queried, or manual confirmation is the only route. */
  can_query: boolean;
  ready: boolean;
  reason: string | null;
};

export type VariantPayload = {
  post: { id: number; title: string; slug: string; status: string };
  can_generate: boolean;
  blocked_reason: string | null;
  indexation: Indexation;
  variants: Variant[];
  available: { key: string; label: string; publish: 'api' | 'manual' }[];
};

export default async function DraftFactCheckPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [res, varRes] = await Promise.all([
    adminApi(`/admin/content/drafts/${id}`),
    adminApi(`/admin/content/drafts/${id}/variants`),
  ]);
  if (!res.ok) notFound();

  const data = (await res.json()) as DraftPayload;
  // Variants are secondary: a failure there should not take down the fact gate,
  // which is the screen's actual job.
  const variants = varRes.ok ? ((await varRes.json()) as VariantPayload) : null;

  return <FactGate initial={data} variants={variants} />;
}
