/**
 * 01 · Web & App Development — page copy.
 *
 * The `promise` and the register title are verbatim from `expertise.doors[0]`
 * in content/home.ts. Everything else is written for this page.
 *
 * The craft is called Web & APP Development, so this page carries both surfaces
 * at equal weight — a site and a mobile app are different products with
 * different failure modes, and a page that only argues about websites is selling
 * half the craft. Every section names both: the problem section gives apps their
 * own symptom, the build gives them their own deliverable, the process gives
 * them the store review that a web-only schedule does not have, and the FAQ
 * answers the two questions every app buyer actually asks (cross-platform or
 * native, and do we even need one).
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
    'Websites, web apps and iOS + Android apps for halal brands — fast, conversion-fluent, ' +
    'and built on one design system and one backend. Design, build, launch, store release, ' +
    'and 30 days of post-launch optimisation.',

  hero: {
    eyebrow: 'Service 01',
    h1: { lead: 'Web & App', em: 'Development' },
    sub:
      'The site is where strangers decide whether to trust you. The app is where the people ' +
      'who already do come back. We build both — on one design system and one backend, so ' +
      'they say the same thing and a change ships once.',
    promise: 'Built to convert. Made to last.',
  },

  problem: {
    eyebrow: 'Why this exists',
    heading: { lead: 'A site nobody acts on and an app nobody opens are', em: 'the same problem.' },
    body:
      'Most of the sites and apps we are handed were not built badly. They were built without ' +
      'a job to do. Nobody decided what the screen was supposed to make a stranger do, so ' +
      'every section became decoration — and the traffic, or the install, arrives with ' +
      'nowhere to land.',
    symptoms: [
      {
        title: 'Traffic arrives and leaves',
        body:
          'Analytics show visitors. The inbox does not. Somewhere between the ad and the ' +
          'enquiry form the argument for buying from you was never actually made — and on a ' +
          'mid-range phone on mobile data, half of them left before the hero had loaded.',
      },
      {
        title: 'The app is installed once, opened twice',
        body:
          'It shipped as a wrapper around the website, so it gives nobody a reason to keep it. ' +
          'No saved state, no offline, no notification worth allowing — and an icon that earns ' +
          'no place on a home screen gets swiped away in the next clear-out.',
      },
      {
        title: 'Every change ships twice, or not at all',
        body:
          'The site and the app were built by different people from different files, so a new ' +
          'price is two tickets, two waits and two invoices. Anything you cannot edit yourself ' +
          'quietly goes out of date, and the two surfaces start contradicting each other.',
      },
    ],
  },

  build: {
    eyebrow: 'What you get',
    heading: 'What actually gets built.',
    sub:
      'Not a list of technologies. A list of things that are handed over, working, at the ' +
      'end of the engagement — on whichever surfaces the work actually needs.',
    items: [
      {
        num: '01',
        title: 'A conversion-mapped structure',
        body:
          'Every page and every screen is assigned one job and one next step before any design ' +
          'happens. That map is agreed in writing, so the build is never a matter of taste.',
      },
      {
        num: '02',
        title: 'One design system, both surfaces',
        body:
          'Type scale, colour, spacing and components defined once, then expressed as web ' +
          'components and as native ones. The app looks like the site because it is built ' +
          'from the same decisions, not because someone matched the colours by eye.',
      },
      {
        num: '03',
        title: 'A production web front end',
        body:
          'Next.js and TypeScript, server-rendered for speed and search. Accessible markup, ' +
          'real focus states, and behaviour that degrades gracefully on old devices.',
      },
      {
        num: '04',
        title: 'An iOS and Android app from one codebase',
        body:
          'React Native, so one team ships both stores. Offline-tolerant, with push, camera, ' +
          'location and biometric sign-in where the product genuinely needs them — and native ' +
          'modules written where the cross-platform layer is not good enough.',
      },
      {
        num: '05',
        title: 'One backend behind both',
        body:
          'A single API and CMS that the site and the app read from, so content is written ' +
          'once and lands everywhere. Editable by your team without code, with the fields ' +
          'constrained so nothing can be edited into a broken layout.',
      },
      {
        num: '06',
        title: 'Launch, store release, and 30 days after',
        body:
          'Deployment, SSL, redirects from the old URLs, App Store and Play submission under ' +
          'your accounts, then analytics, event tracking and crash reporting wired in — and a ' +
          'month of watching real behaviour and fixing what the data exposes.',
      },
    ],
  },

  process: {
    eyebrow: 'How it runs',
    heading: 'Four phases, nothing hidden.',
    sub:
      'The Ihsan Process, applied to a build. A site alone lands at the short end of these ' +
      'spans; a site with an app beside it lands at the long one. Each phase ends with ' +
      'something you can review, so you are never waiting weeks to find out what we understood.',
    steps: [
      {
        span: 'Week 1',
        title: 'Discovery and diagnosis',
        body:
          'We audit what exists, read the analytics, and get clear on who this has to convince ' +
          'and what it has to make them do — including which of it belongs on the web and ' +
          'which earns an app. Output: a written diagnosis and a screen map.',
      },
      {
        span: 'Weeks 2–3',
        title: 'Structure and design',
        body:
          'Wireframes first, then the design system, then the key pages and screens. You review ' +
          'at each stage. No surprise reveal at the end, because a surprise reveal is a ' +
          'rebuild risk.',
      },
      {
        span: 'Weeks 4–8',
        title: 'Build and integration',
        body:
          'Front end, app, API, CMS, forms, analytics, and the third-party pieces you already ' +
          'rely on. Staging is live throughout and every app build goes to TestFlight and the ' +
          'Play internal track, so progress is something you can open on your own phone.',
      },
      {
        span: 'Week 9 onward',
        title: 'Launch, review and optimisation',
        body:
          'Migration, redirects and go-live for the web; submission and store review for the ' +
          'app — then 30 days of reading real behaviour and tightening whatever is ' +
          'underperforming on either surface.',
      },
    ],
  },

  outcomes: {
    eyebrow: 'What changes',
    heading: { lead: 'What you walk away', em: 'with.' },
    list: [
      'A site that states, on every page, what it wants the visitor to do next',
      'An app people reopen, because it does something the website cannot',
      'Sub-two-second loads on a mid-range phone, not just on your laptop',
      'One design system and one backend behind both, so a change ships once, not twice',
      'Full ownership — the code, the store listings, the domain, the accounts, all in your name',
    ],
    fitHeading: 'This is for you if',
    fit: [
      'You have traffic, or a way to get it, and it is not converting',
      'Your customers deal with you often enough that an app would earn its place on a home screen',
      'You want to own the system, not rent a page builder subscription',
    ],
    notHeading: 'This is not for you if',
    not: [
      'You need a single landing page live by the weekend',
      'You want an app because a competitor has one, with nothing for it to do',
      'The build would serve something we do not build for',
    ],
  },

  packages: ['Foundations Engagement', 'The Authority System', 'Halal Brand OS'],

  faq: [
    {
      q: 'How long does a build take?',
      a:
        'Six to eight weeks for a marketing site of ten to twenty pages, from kickoff to ' +
        'launch. Ten to fourteen when there is an iOS and Android app beside it, plus the ' +
        'store review — usually two to seven days, and we submit early enough that a ' +
        'rejection is a fix, not a missed launch. We give you a dated schedule in week one ' +
        'and tell you early if it moves.',
    },
    {
      q: 'Native or cross-platform?',
      a:
        'Cross-platform by default: React Native from one codebase, which is what makes two ' +
        'stores affordable and keeps them in step. We write native modules where the ' +
        'cross-platform layer is not good enough, and we will tell you outright when a ' +
        'product should be fully native instead — heavy real-time graphics, deep hardware ' +
        'work, or anything where a frame budget is the product.',
    },
    {
      q: 'Do we own the code, and the store listings?',
      a:
        'Yes, entirely. Hosting, domain, analytics, the repository, and the Apple Developer ' +
        'and Google Play accounts — all in your name from day one, with the apps published ' +
        'under yours rather than ours. There is no lock-in and no licence to keep paying. If ' +
        'you take the project elsewhere, everything goes with you, including the listings.',
    },
    {
      q: 'What if we already have a site, or are not sure we need an app?',
      a:
        'Then we should not throw either away, and we should not build one you do not need. ' +
        'A Halal Brand Audit gives you a written read on what is costing you conversions and ' +
        'what to fix first — often that is three pages and a load-time problem, not a rebuild, ' +
        'and often the honest answer on the app is a fast mobile web experience instead. We ' +
        'will tell you if that is the case.',
    },
  ],

  cta: {
    eyebrow: 'Start here',
    heading: { lead: 'Tell us what it', em: 'has to do.' },
    body:
      'A 15–30 minute fit call. Bring the problem, not a brief — we will tell you whether a ' +
      'site, an app, or neither is the right answer, including when it is none of them.',
  },
};

export default webAppDevelopment;
