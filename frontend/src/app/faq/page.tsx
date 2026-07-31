import type { Metadata } from 'next';
import { FAQS } from './faqData';
import { pageMeta } from '@/lib/seo';
import SmoothScroll from '@/components/motion/SmoothScroll';
import SectionNav from '@/components/motion/useSectionNav';
import FaqHero from '@/components/faq/FaqHero';
import FaqBody from '@/components/faq/FaqBody';
import FaqCta from '@/components/faq/FaqCta';

export const metadata: Metadata = pageMeta({
  title: 'FAQs · WAHEED',
  description:
    'Answers to common questions about working with Waheed Digital Studio, from our faith-aligned approach to website timelines and payment plans.',
  path: '/faq',
});

// FAQPage structured data → eligible for rich results in search. Built from the
// same FAQS array the page renders, so the two can never drift.
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

/**
 * /faq — rebuilt to homepage standard. The old single FaqContent client component
 * is now three components, with the page-level primitives (Lenis, khatam cursor,
 * colour-aware nav) mounted here as on / , /about and /services.
 */
export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SmoothScroll>
        <SectionNav />
        <main>
          <FaqHero />
          <FaqBody />
          <FaqCta />
        </main>
      </SmoothScroll>
    </>
  );
}
