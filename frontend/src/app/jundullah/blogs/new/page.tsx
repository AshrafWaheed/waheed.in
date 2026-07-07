import type { Metadata } from 'next';
import PostForm from '../PostForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'New post · WAHEED Admin',
  robots: { index: false, follow: false },
};

export default function NewPostPage() {
  return <PostForm mode="create" />;
}
