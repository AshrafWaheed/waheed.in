/**
 * WAHEED /contact page-chrome copy — SINGLE SOURCE OF TRUTH.
 *
 * Hero and aside only. The form's own labels, options, placeholders and error
 * strings deliberately stay inline in app/contact/page.tsx: they are welded to
 * the field names, the validator and the /api/contact payload, and pulling them
 * out here would buy tidiness at the cost of being able to read a field and its
 * rules in one place. This is a working form wired to HubSpot — the redesign is
 * presentational only and did not touch its logic.
 *
 * Lifted VERBATIM from the old page. Note the hero sub says "in sha Allah"
 * (unaccented, no apostrophe) while the aside says "in shā' Allāh" — that
 * inconsistency is in the original copy and is preserved.
 */
import type { Heading } from './home';

export const contactHero = {
  eyebrow: 'Apply for a Discovery Call',
  headline: {
    lead: 'Tell us about your',
    em: 'brand.',
  } as Heading,
  sub: 'A 30-minute fit call. We review every application personally and respond within 24 hours, in sha Allah.',
} as const;

export const contactAside = {
  heading: 'Start a Conversation',
  intro:
    "Whether you're exploring your options or ready to start immediately, we'd love to hear about your brand. Fill out the form and we'll be in touch, in shā' Allāh.",
  email: 'info@waheed.in',
  /** Rendered as <strong> + trailing sentence, exactly as before. */
  note: {
    lead: 'We only work with values-aligned brands.',
    rest: ' Every application is reviewed personally. We may respectfully decline projects that do not align with our ethical guidelines.',
  },
  socials: [
    { label: 'Facebook',  href: 'https://www.facebook.com/waheedhq.fb/' },
    { label: 'Instagram', href: 'https://www.instagram.com/waheedhq/' },
    { label: 'LinkedIn',  href: 'https://www.linkedin.com/company/waheedhq/' },
  ],
} as const;
