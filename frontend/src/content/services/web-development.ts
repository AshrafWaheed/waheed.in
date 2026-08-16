/**
 * 01 · Web Development — page copy.
 *
 * Web and app are separate services now, so this page argues ONLY the web
 * surface — marketing sites and web apps. The app case lives in
 * ./app-development.ts. The `promise` and register title are verbatim from
 * expertise.doors (content/home.ts); everything else is written for this page.
 *
 * Voice check for anyone editing: plain, specific, no superlatives, no "we are
 * passionate about". Where a claim can carry a number it carries a number, and
 * where it cannot, it stays a sentence rather than becoming a boast.
 */
import type { ServicePage } from './types';

const webDevelopment: ServicePage = {
  slug: 'web-development',

  metaTitle: 'Halal Web Design for Muslim Businesses · WAHEED',
  metaDescription:
    'Halal web design and development for Muslim businesses — fast, conversion-fluent sites ' +
    'on a design system you own, launched with 30 days of post-launch optimisation.',

  hero: {
    eyebrow: 'Service 01',
    h1: { lead: 'Web', em: 'Development' },
    sub:
      'Your website is where strangers decide whether to trust you. We build it to do one ' +
      'job on every page — communicate the offer, load fast, and turn the right visitor into ' +
      'an enquiry — on a system your team can edit and you own outright.',
    promise: 'Built to convert. Made to last.',
  },

  problem: {
    eyebrow: 'Why this exists',
    heading: { lead: 'A site nobody acts on is', em: 'a cost, not an asset.' },
    body:
      'Most of the sites we are handed were not built badly. They were built without a job to ' +
      'do. Nobody decided what each page was supposed to make a stranger do, so every section ' +
      'became decoration — and the traffic arrives with nowhere to land.',
    symptoms: [
      {
        title: 'Traffic arrives and leaves',
        body:
          'Analytics show visitors. The inbox does not. Somewhere between the ad and the ' +
          'enquiry form the argument for buying from you was never actually made, so people ' +
          'read, nod, and close the tab.',
      },
      {
        title: 'It crawls on a real phone',
        body:
          'It looks fine on your laptop on office wifi. On a mid-range phone on mobile data, ' +
          'half your visitors leave before the hero has loaded — and the fastest competitor, ' +
          'not the best one, wins the click.',
      },
      {
        title: 'Every change needs a developer',
        body:
          'A new price, a new page, a new case study — each one is a ticket, a wait and an ' +
          'invoice. Anything you cannot edit yourself quietly goes out of date, and the site ' +
          'drifts further from what the business actually offers.',
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
        title: 'A design system, not a theme',
        body:
          'Type scale, colour, spacing and components defined once and reused everywhere, so ' +
          'the site stays coherent as it grows and a new page takes hours, not a redesign.',
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
        title: 'A backend your team can run',
        body:
          'A CMS your team edits without code, with the fields constrained so nothing can be ' +
          'edited into a broken layout. Content is written once and lands where it belongs.',
      },
      {
        num: '05',
        title: 'Forms, analytics and the integrations you rely on',
        body:
          'Enquiry and booking flows wired to your inbox and CRM, event tracking that shows ' +
          'what actually converts, and the third-party tools you already use, connected.',
      },
      {
        num: '06',
        title: 'Launch, and 30 days after',
        body:
          'Deployment, SSL, redirects from the old URLs, then a month of watching real ' +
          'behaviour and fixing whatever the data exposes.',
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
          'Staging is live throughout, so progress is something you can open, not a status update.',
      },
      {
        span: 'Week 7 onward',
        title: 'Launch, review and optimisation',
        body:
          'Migration, redirects and go-live — then 30 days of reading real behaviour and ' +
          'tightening whatever is underperforming.',
      },
    ],
  },

  outcomes: {
    eyebrow: 'What changes',
    heading: { lead: 'What you walk away', em: 'with.' },
    list: [
      'A site that states, on every page, what it wants the visitor to do next',
      'Sub-two-second loads on a mid-range phone, not just on your laptop',
      'A design system that makes the next page hours of work, not a redesign',
      'A backend your team edits without waiting on a developer',
      'Full ownership — the code, the domain, the accounts, all in your name',
    ],
    fitHeading: 'This is for you if',
    fit: [
      'You have traffic, or a way to get it, and it is not converting',
      'You want to own the system, not rent a page builder subscription',
      'The site has to earn enquiries, not just look presentable',
    ],
    notHeading: 'This is not for you if',
    not: [
      'You need a single landing page live by the weekend',
      'You want a redesign for its own sake, with no conversion problem to solve',
      'The build would serve something we do not build for',
    ],
  },

  packages: ['Foundations Engagement', 'The Authority System', 'Halal Brand OS'],

  faq: [
    {
      q: 'What makes this halal web design, exactly?',
      a:
        'Less than some people expect, and more than others. There is no separate Islamic way ' +
        'to write TypeScript — the craft is the craft. What changes is what we will and will ' +
        'not build: no fake scarcity timers or dark patterns to force a conversion, no ' +
        'riba-based finance integrations at checkout, and imagery and language held to your ' +
        'standard rather than ours. If a tactic only works because it misleads someone, it ' +
        'does not ship.',
    },
    {
      q: 'Do you only do website design for Muslim businesses?',
      a:
        'Mostly, and by choice — it is who we understand best. But the standard is the ' +
        'standard: if you are not a Muslim-led brand and you want a site built this way, we ' +
        'are glad to talk.',
    },
    {
      q: 'How long does a build take?',
      a:
        'Six to eight weeks for a marketing site of ten to twenty pages, from kickoff to ' +
        'launch. We give you a dated schedule in week one and tell you early if it moves.',
    },
    {
      q: 'Do we own the code?',
      a:
        'Yes, entirely. Hosting, domain, analytics and the repository are all in your name ' +
        'from day one. There is no lock-in and no licence to keep paying — if you take the ' +
        'project elsewhere, everything goes with you.',
    },
    {
      q: 'What tech do you build on?',
      a:
        'Next.js and TypeScript for the front end, server-rendered for speed and search, on a ' +
        'headless CMS your team can edit. We pick boring, well-supported tools on purpose, so ' +
        'the site is still maintainable in three years by someone who is not us.',
    },
    {
      q: 'We already have a site — do we need a full rebuild?',
      a:
        'Often not. A Halal Brand Audit gives you a written read on what is costing you ' +
        'conversions and what to fix first — often that is three pages and a load-time ' +
        'problem, not a rebuild. We will tell you if that is the case.',
    },
  ],

  cta: {
    eyebrow: 'Start here',
    heading: { lead: 'Tell us what it', em: 'has to do.' },
    body:
      'A 15–30 minute fit call. Bring the problem, not a brief — we will tell you whether a ' +
      'new site is the right answer, and when a few fixes would do instead.',
  },
};

export default webDevelopment;
