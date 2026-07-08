import { adminApi } from '@/lib/admin-api';
import type { TaxonomyOptions } from './PostForm';

type Term = { name: string; slug: string };

// Server-only: fetch existing category + tag names for the editor datalists.
export async function getTaxonomyOptions(): Promise<TaxonomyOptions> {
  const res = await adminApi('/admin/taxonomy');
  if (!res.ok) return { categories: [], tags: [] };
  const data = (await res.json().catch(() => null)) as
    | { categories?: Term[]; tags?: Term[] }
    | null;
  return {
    categories: (data?.categories ?? []).map((c) => c.name),
    tags: (data?.tags ?? []).map((t) => t.name),
  };
}
