import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import BookExperience from './BookExperience';

export const metadata: Metadata = pageMeta({
  title: 'Book a call · WAHEED',
  description:
    'Book a 30-minute clarity call with WAHEED. Pick a time that suits you and we will send a Google Meet link — no payment, no obligation.',
  path: '/book',
});

/**
 * /book — the public booking page.
 *
 * Leads with the homepage's short clarity form, then the calendar directly
 * below it: tell us about the project, then pick a time. The two are wired
 * together client-side in BookExperience so there is no page hop between them.
 */
export default function BookPage() {
  return (
    <main className="bk-main">
      <BookExperience />
    </main>
  );
}
