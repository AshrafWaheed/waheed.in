import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { adminApi } from '@/lib/admin-api';
import PostForm, { type PostData } from '../../PostForm';
import { getTaxonomyOptions } from '../../taxonomy';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Edit post · WAHEED Admin',
  robots: { index: false, follow: false },
};

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [res, options] = await Promise.all([adminApi(`/admin/posts/${id}`), getTaxonomyOptions()]);
  if (!res.ok) notFound();

  const payload = (await res.json().catch(() => null)) as { data?: PostData } | null;
  if (!payload?.data) notFound();

  return <PostForm mode="edit" post={payload.data} options={options} />;
}
