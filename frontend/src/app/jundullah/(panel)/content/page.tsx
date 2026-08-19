import type { Metadata } from 'next';
import Link from 'next/link';
import { adminApi } from '@/lib/admin-api';
import GenerateTopicButton from './GenerateTopicButton';
import TopicStatusButton from './TopicStatusButton';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Content engine · WAHEED Admin',
  robots: { index: false, follow: false },
};

type Topic = {
  id: number;
  title: string;
  pillar: string;
  primary_keyword: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'low-comp';
  bridge_target: string | null;
  priority: number;
  status: 'queued' | 'in_progress' | 'published' | 'parked';
  notes: string | null;
  post: { id: number; title: string; slug: string; status: string } | null;
};

type Status = {
  enabled: boolean;
  has_api_key: boolean;
  model: string;
  prompt_version: string;
  month_spend_usd: number;
  month_budget_usd: number;
  budget_enforced: boolean;
  budget_exhausted: boolean;
  queued_topics: number;
};

type Author = { id: number; name: string };

const STATUS_LABEL: Record<string, string> = {
  queued: 'Queued',
  in_progress: 'Drafted',
  published: 'Done',
  parked: 'Parked',
};

const PILLAR_LABEL: Record<string, string> = {
  'halal-income': 'Halal income',
  'halal-marketing': 'Halal marketing',
  'web-app-software': 'Web, apps & software',
  'islamic-branding': 'Islamic branding',
  'charities-masjids': 'Charities & masjids',
};

async function getJson<T>(path: string, fallback: T): Promise<T> {
  const res = await adminApi(path);
  if (!res.ok) return fallback;
  return (await res.json().catch(() => fallback)) as T;
}

export default async function ContentEnginePage() {
  const [status, topicsRes, usersRes] = await Promise.all([
    getJson<Status | null>('/admin/content/status', null),
    getJson<{ data: Topic[] }>('/admin/content/topics', { data: [] }),
    getJson<{ data: Author[] }>('/admin/users', { data: [] }),
  ]);

  const topics = topicsRes.data ?? [];
  const authors = (usersRes.data ?? []).map((u) => ({ id: u.id, name: u.name }));
  const queued = topics.filter((t) => t.status === 'queued');
  const active = topics.filter((t) => t.status === 'in_progress');
  const done = topics.filter((t) => t.status === 'published');

  // The engine cannot run without both of these. Say which is missing rather
  // than letting the first click fail with a 503.
  const blocked = !status?.enabled
    ? 'The engine is switched off. Set CONTENT_ENGINE_ENABLED=true in backend/.env.'
    : !status.has_api_key
      ? 'No ANTHROPIC_API_KEY in backend/.env. `claude --bare` reads auth only from that variable and never falls back to an interactive login.'
      : status.budget_exhausted
        ? `Monthly budget reached ($${status.month_spend_usd.toFixed(2)} of $${status.month_budget_usd.toFixed(2)}).`
        : null;

  return (
    <section className="adm-main">
      <div className="adm-list-head">
        <div>
          <h1 className="adm-h1">Content engine</h1>
          <p className="adm-list-count">
            {queued.length} queued · {active.length} drafted · {done.length} done
          </p>
        </div>
        {/* The learning loop is a separate screen because it is a separate
            decision: approving a voice rule changes every future post, and
            that does not belong next to a per-topic Generate button. */}
        <Link href="/jundullah/content/voice" className="adm-link">
          House voice &rarr;
        </Link>
      </div>

      {blocked && (
        <div className="adm-placeholder" style={{ borderLeft: '3px solid #9c7d1c', textAlign: 'left' }}>
          <strong>Not ready to generate.</strong>
          <br />
          {blocked}
        </div>
      )}

      {status && !blocked && (
        <p className="adm-list-count" style={{ marginBottom: '1rem' }}>
          {status.model} · prompt {status.prompt_version} ·{' '}
          {status.budget_enforced
            ? `$${status.month_spend_usd.toFixed(2)} of $${status.month_budget_usd.toFixed(2)} billed this month`
            : /* Subscription: the figure is an API-equivalent price, not a bill.
                 Labelled as usage so it is not mistaken for money owed. */
              `${status.month_spend_usd.toFixed(2)} usage units this month (subscription — not billed)`}
        </p>
      )}

      {topics.length === 0 ? (
        <div className="adm-placeholder">
          No topics. Seed them with <code>php artisan db:seed --class=TopicSeeder</code>.
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th style={{ width: '3rem' }}>#</th>
                <th>Topic</th>
                <th>Keyword</th>
                <th>Pillar</th>
                <th>Bridges to</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {topics.map((t) => (
                <tr key={t.id}>
                  <td style={{ opacity: 0.55, fontVariantNumeric: 'tabular-nums' }}>{t.priority}</td>
                  <td>
                    <strong>{t.title}</strong>
                    {t.notes && (
                      <span style={{ display: 'block', opacity: 0.6, fontSize: '.82em', marginTop: 2 }}>
                        {t.notes}
                      </span>
                    )}
                  </td>
                  <td>
                    <code style={{ fontSize: '.85em' }}>{t.primary_keyword}</code>
                    <span style={{ display: 'block', opacity: 0.6, fontSize: '.78em', marginTop: 2 }}>
                      {t.difficulty}
                    </span>
                  </td>
                  <td style={{ fontSize: '.85em' }}>{PILLAR_LABEL[t.pillar] ?? t.pillar}</td>
                  <td style={{ fontSize: '.82em', opacity: 0.75 }}>
                    {t.bridge_target ?? <em>authority piece</em>}
                  </td>
                  <td>
                    <span className="adm-topic-status" data-status={t.status}>
                      {STATUS_LABEL[t.status] ?? t.status}
                    </span>
                  </td>
                  {/* "Open draft" not "Fact check": that screen is also where
                      you ask the model to rewrite the post. */}
                  <td style={{ textAlign: 'right' }}>
                    <div className="adm-topic-actions">
                      {t.post ? (
                        <Link href={`/jundullah/content/drafts/${t.post.id}`} className="adm-link">
                          Open draft →
                        </Link>
                      ) : (
                        t.status !== 'published' && (
                          <GenerateTopicButton topicId={t.id} authors={authors} disabled={!!blocked} />
                        )
                      )}
                      <TopicStatusButton topicId={t.id} status={t.status} hasPost={!!t.post} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
