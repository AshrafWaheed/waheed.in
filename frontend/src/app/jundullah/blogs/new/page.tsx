import type { Metadata } from 'next';
import PostForm from '../PostForm';
import { getTaxonomyOptions } from '../taxonomy';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'New post · WAHEED Admin',
  robots: { index: false, follow: false },
};

export default async function NewPostPage() {
  const options = await getTaxonomyOptions();
  return <PostForm mode="create" options={options} />;
}
