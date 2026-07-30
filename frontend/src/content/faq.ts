/**
 * WAHEED /faq page-chrome copy — SINGLE SOURCE OF TRUTH.
 *
 * The 28 questions and the category list stay where they were, in
 * app/faq/faqData.ts, because app/faq/page.tsx also feeds them to the FAQPage
 * JSON-LD for rich results. Only the hero and the closing CTA live here.
 *
 * Lifted VERBATIM from the old app/faq/FaqContent.tsx. The apostrophes came
 * through JSX `&apos;` so "we'll" and "shā'" are straight — do not curl them.
 */
import type { Heading } from './home';

export const faqHero = {
  eyebrow: 'Frequently Asked Questions',
  headline: {
    lead: 'Your questions,',
    em: 'honestly answered.',
  } as Heading,
  sub: 'Everything you need to know about working with Waheed.',
} as const;

export const faqCta = {
  eyebrow: 'Still have questions?',
  heading: 'Ask us directly.',
  body: "Fill out our project application form and we'll answer any questions during your discovery call, in shā' Allāh.",
  cta: { label: 'Apply for a Discovery Call →', href: '/contact' },
} as const;
