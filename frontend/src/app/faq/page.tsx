import type { Metadata } from 'next';
import FaqContent from './FaqContent';
import { FAQS } from './faqData';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'FAQs · WAHEED',
  description:
    'Answers to common questions about working with Waheed Digital Studio, from our faith-aligned approach to website timelines and payment plans.',
  path: '/faq',
});

// FAQPage structured data → eligible for rich results in search.
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FaqContent />
    </>
  );
}
