import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import VoicePanel from './VoicePanel';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'House voice · WAHEED Admin',
  robots: { index: false, follow: false },
};

export type RuleStatus = 'proposed' | 'approved' | 'rejected' | 'retired';

export type Evidence = { post_id: number; before: string; after: string };

export type Rule = {
  id: number;
  rule: string;
  category: string;
  rationale: string | null;
  status: RuleStatus;
  evidence: Evidence[];
  evidence_count: number;
  effective_from: number | null;
  effective_to: number | null;
  batch: string | null;
  supersedes_id: number | null;
  decision_note: string | null;
  posts_since_reinforced: number | null;
  stale: boolean;
  approved_at: string | null;
  created_at: string | null;
};

export type EditRow = {
  id: number;
  post_id: number;
  post_title: string | null;
  paragraphs_changed: number;
  words_before: number;
  words_after: number;
  consumed: boolean;
  created_at: string | null;
};

export type Group = { posts: number; mean_edit_burden: number | null };

export type VoicePayload = {
  ruleset_version: number;
  rules: Rule[];
  counts: Record<RuleStatus, number>;
  pending_edits: number;
  batch_size: number;
  ready_to_run: boolean;
  holdout_every: number;
  retire_after_posts: number;
  preview: string;
  comparison: { with_rules: Group; holdout: Group; before_rules: Group };
  recent_edits: EditRow[];
};

export default async function VoicePage() {
  const res = await adminApi('/admin/content/voice');
  const data = res.ok ? ((await res.json()) as VoicePayload) : null;

  return (
    <section className="adm-main">
      <Link
        href="/jundullah/content"
        className="adm-link"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '.85rem' }}
      >
        <ArrowLeft size={14} /> Content engine
      </Link>

      <div className="adm-list-head" style={{ marginTop: '.75rem' }}>
        <div>
          <h1 className="adm-h1">House voice</h1>
          <p className="adm-list-count">
            What the generator has been taught, and what it is still only being asked to learn.
          </p>
        </div>
      </div>

      {!data ? (
        <div className="adm-placeholder">Could not load the learning loop.</div>
      ) : (
        <VoicePanel initial={data} />
      )}
    </section>
  );
}
