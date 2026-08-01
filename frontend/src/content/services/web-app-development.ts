/**
 * 01 · Web & App Development — page copy.
 *
 * The `promise` and the register title are verbatim from `expertise.doors[0]`
 * in content/home.ts. Everything else is written for this page.
 *
 * Voice check for anyone editing: plain, specific, no superlatives, no "we are
 * passionate about". Where a claim can carry a number it carries a number, and
 * where it cannot, it stays a sentence rather than becoming a boast.
 */
import type { ServicePage } from './types';

const webAppDevelopment: ServicePage = {
  slug: 'web-app-development',

  metaTitle: 'Web & App Development · WAHEED',
  metaDescription:
    'Websites and web apps for halal brands — fast, conversion-fluent, and built on a system you can grow into. Design, build, launch, and 30 days of post-launch optimisation.',

  hero: {
    eyebrow: 'Service 01',
    h1: { lead: 'Web & App', em: 'Development' },
    sub:
      'Your website is the first impression and the closing pitch. We build sites and ' +
      'applications that load fast, convert decisively, and keep working on the visitors ' +
      'you never get to speak to.',
    promise: 'Built to convert. Made to last.',
  },

  problem: {
    eyebrow: 'Why this exists',
    heading: { lead: 'A beautiful site that does not sell is', em: 'an expensive brochure.' },
    body:
      'Most of the sites we are handed were not built badly. They were built without a job ' +
      'to do. Nobody decided what the page was supposed to make a stranger do, so every ' +
      'section became decoration, and the traffic that arrives has nowhere to land.',
    symptoms: [
      {
        title: 'Traffic arrives and leaves',
        body:
          'Analytics show visitors. The inbox does not. Somewhere between the ad and the ' +
          'enquiry form, the argument for buying from you was never actually made.',
      },
      {
        title: 'Every change needs a developer',
        body:
          'Updating a price or adding a page turns into a ticket, a wait, and an invoice. ' +
          'A site you cannot edit is a site that quietly goes out of date.',
      },
      {
        title: 'It is slow where it matters',
        body:
          'It feels fine on your laptop on office WiFi. On a mid-range phone on mobile data ' +
          'the hero takes four seconds, and most people never see it at all.',
      },
    ],
  },

  build: {
    eyebrow: 'What you get',
    heading: 'What actually gets built.',
    sub:
      'Not a list of technologies. A list of things that are handed over, working, at the ' +
      'end of the engagement.',
    items: [
      {
        num: '01',
        title: 'A conversion-mapped structure',
        body:
          'Every page is assigned one job and one next step before any design happens. That ' +
          'map is agreed in writing, so the build is never a matter of taste.',
      },
      {
        num: '02',
        title: 'A design system, not screens',
        body:
          'Type scale, colour, spacing and components defined once and reused. New pages come ' +
          'out consistent because there is only one set of parts to build them from.',
      },
      {
        num: '03',
        title: 'A production front end',
        body:
          'Next.js and TypeScript, server-rendered for speed and search. Accessible markup, ' +
          'real focus states, and behaviour that degrades gracefully on old devices.',
      },
      {
        num: '04',
        title: 'A CMS you can actually use',
        body:
          'Content, pages and posts editable by your team without touching code, with the ' +
          'fields constrained so nothing can be edited into a broken layout.',
      },
      {
        num: '05',
        title: 'Measurement wired in',
        body:
          'Analytics, event tracking on the actions that matter, and a form that lands in ' +
          'your CRM. You should be able to answer "did it work" without guessing.',
      },
      {
        num: '06',
        title: 'Launch and 30 days after',
        body:
          'Deployment, SSL, redirects from the old URLs, and a month of watching real ' +
          'behaviour and fixing what the data exposes. Launch is a milestone, not the end.',
      },
    ],
  },

  process: {
    eyebrow: 'How it runs',
    heading: 'Four phases, nothing hidden.',
    sub:
      'The Ihsan Process, applied to a build. Each phase ends with something you can review, ' +
      'so you are never waiting weeks to find out what we understood.',
    steps: [
      {
        span: 'Week 1',
        title: 'Discovery and diagnosis',
        body:
          'We audit what exists, read the analytics, and get clear on who this has to convince ' +
          'and what it has to make them do. Output: a written diagnosis and a page map.',
      },
      {
        span: 'Weeks 2–3',
        title: 'Structure and design',
        body:
          'Wireframes first, then the design system, then the key pages. You review at each ' +
          'stage. No surprise reveal at the end, because a surprise reveal is a rebuild risk.',
      },
      {
        span: 'Weeks 4–6',
        title: 'Build and integration',
        body:
          'Front end, CMS, forms, analytics, and the third-party pieces you already rely on. ' +
          'Staging is live throughout, so progress is something you can click, not a status call.',
      },
      {
        span: 'Week 7 onward',
        title: 'Launch and optimisation',
        body:
          'Migration, redirects, and go-live — then 30 days of reading real behaviour and ' +
          'tightening the pages that are underperforming.',
      },
    ],
  },

  outcomes: {
    eyebrow: 'What changes',
    heading: { lead: 'What you walk away', em: 'with.' },
    list: [
      'A site that states, on every page, what it wants the visitor to do next',
      'Sub-two-second loads on a mid-range phone, not just on your laptop',
      'A design system your next five pages can be built from without us',
      'Enquiries arriving with enough context that the first call is not a discovery call',
      'Full ownership — the code, the domain, the accounts, all in your name',
    ],
    fitHeading: 'This is for you if',
    fit: [
      'You have traffic, or a way to get it, and it is not converting',
      'Your business depends on the site being the first thing people trust',
      'You want to own the system, not rent a page builder subscription',
    ],
    notHeading: 'This is not for you if',
    not: [
      'You need a single landing page live by the weekend',
      'The offer itself is still unclear — start with a Halal Brand Audit',
      'The build would serve something we do not build for',
    ],
  },

  packages: ['Foundations Engagement', 'The Authority System', 'Halal Brand OS'],

  faq: [
    {
      q: 'How long does a build take?',
      a:
        'Six to eight weeks for a marketing site of ten to twenty pages, from kickoff to ' +
        'launch. Applications with real functionality behind them run longer and are quoted ' +
        'separately. We give you a dated schedule in week one and tell you early if it moves.',
    },
    {
      q: 'Do we own the code?',
      a:
        'Yes, entirely, and the accounts with it — hosting, domain, analytics, and the ' +
        'repository, all in your name from day one. There is no lock-in and no licence to ' +
        'keep paying. If you take the project elsewhere, everything goes with you.',
    },
    {
      q: 'Can our team edit the site afterwards?',
      a:
        'That is a requirement, not an extra. Pages, posts and the content that changes ' +
        'often are editable without code, with fields constrained so nothing can be edited ' +
        'into a broken layout. We hand over a walkthrough recording at launch.',
    },
    {
      q: 'What if we already have a site we do not want to throw away?',
      a:
        'Then we should not throw it away. A Halal Brand Audit gives you a written read on ' +
        'what is costing you conversions and what to fix first — often that is three pages ' +
        'and a load-time problem, not a rebuild. We will tell you if that is the case.',
    },
  ],

  cta: {
    eyebrow: 'Start here',
    heading: { lead: 'Tell us what the site', em: 'has to do.' },
    body:
      'A 15–30 minute fit call. Bring the problem, not a brief — we will tell you whether a ' +
      'build is the right answer, including when it is not.',
  },
};

export default webAppDevelopment;
