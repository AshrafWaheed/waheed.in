/**
 * 02 · App Development — page copy.
 *
 * Web and app are separate services now; this page argues ONLY the mobile app
 * surface (iOS + Android). The web case lives in ./web-development.ts. The
 * `promise` and register title are verbatim from expertise.doors
 * (content/home.ts); everything else is written for this page.
 *
 * Voice check for anyone editing: plain, specific, no superlatives. Where a
 * claim can carry a number it carries a number; where it cannot, it stays a
 * sentence rather than becoming a boast.
 */
import type { ServicePage } from './types';

const appDevelopment: ServicePage = {
  slug: 'app-development',

  metaTitle: 'Muslim App Developers · Islamic App Development · WAHEED',
  metaDescription:
    'Islamic app development for Muslim businesses — iOS and Android from one codebase. ' +
    'Product definition, native-grade design, store release, and 30 days after.',

  hero: {
    eyebrow: 'Service 02',
    h1: { lead: 'App', em: 'Development' },
    sub:
      'An app is where the people who already trust you come back. We turn an idea into a ' +
      'product people reopen — one codebase for iOS and Android, built to do something the ' +
      'website cannot, and shipped to both stores under your own accounts.',
    promise: 'From idea to shipped app.',
  },

  problem: {
    eyebrow: 'Why this exists',
    heading: { lead: 'An app nobody opens is worse than', em: 'no app at all.' },
    body:
      'Most apps we are handed were built because a competitor had one, not because there was ' +
      'a job only an app could do. So they ship as a wrapper around the website, give nobody ' +
      'a reason to keep them, and get swiped away in the next home-screen clear-out.',
    symptoms: [
      {
        title: 'Installed once, opened twice',
        body:
          'There is no saved state, no offline, and no notification worth allowing. An icon ' +
          'that earns no place on a home screen is gone by the end of the week, and the ' +
          'install number was the only number that ever moved.',
      },
      {
        title: 'It is the website in a frame',
        body:
          'Loaded in a webview, it is slower than the browser it is hiding, breaks the moment ' +
          'the signal drops, and feels nothing like the platform it is running on. People can ' +
          'tell in seconds, and they judge the whole brand by it.',
      },
      {
        title: 'Two stores, two problems, no plan',
        body:
          'iOS and Android were quoted as two separate builds, so the budget bought one and a ' +
          'half. Now they are out of step, a fix has to be made twice, and a store rejection ' +
          'nobody planned for has stalled the launch.',
      },
    ],
  },

  build: {
    eyebrow: 'What you get',
    heading: 'What actually gets built.',
    sub:
      'Not a list of technologies. A list of things that are handed over, working and in the ' +
      'stores, at the end of the engagement.',
    items: [
      {
        num: '01',
        title: 'A product defined before a screen is drawn',
        body:
          'We pin down the one job the app does that the website cannot, and the flows that ' +
          'earn a place on the home screen. Agreed in writing, so the build is not a matter ' +
          'of taste.',
      },
      {
        num: '02',
        title: 'A native-grade design system',
        body:
          'Type, colour, spacing and components defined once and expressed as native patterns ' +
          'for each platform — so the app feels like iOS on iOS and Android on Android, not ' +
          'like a template stretched across both.',
      },
      {
        num: '03',
        title: 'iOS and Android from one codebase',
        body:
          'React Native, so one team ships both stores and they stay in step. Native modules ' +
          'written where the cross-platform layer is not good enough, so nothing feels second-hand.',
      },
      {
        num: '04',
        title: 'The device features the product earns',
        body:
          'Offline tolerance, push notifications, camera, location and biometric sign-in — ' +
          'added where the product genuinely needs them, not as a checklist. What ships is what ' +
          'gives someone a reason to reopen the app.',
      },
      {
        num: '05',
        title: 'One backend behind it',
        body:
          'A single API and CMS the app reads from — shared with your site where that makes ' +
          'sense — so content is written once and lands everywhere, editable by your team ' +
          'without code.',
      },
      {
        num: '06',
        title: 'Store release, and 30 days after',
        body:
          'App Store and Play submission under your own developer accounts, analytics, event ' +
          'tracking and crash reporting wired in — then a month of watching real behaviour and ' +
          'fixing what the data exposes.',
      },
    ],
  },

  process: {
    eyebrow: 'How it runs',
    heading: 'Four phases, store review included.',
    sub:
      'The Ihsan Process, applied to an app — with the store review a web schedule does not ' +
      'have built in from the start. Each phase ends with something you can open, not a ' +
      'status update.',
    steps: [
      {
        span: 'Week 1',
        title: 'Discovery and diagnosis',
        body:
          'We get clear on who this is for, and the one job that justifies an app over a fast ' +
          'mobile site. Output: a written diagnosis and a screen map — including the honest ' +
          'answer if you do not need an app yet.',
      },
      {
        span: 'Weeks 2–3',
        title: 'Design and prototype',
        body:
          'The design system, then the key screens, then a clickable prototype on a real ' +
          'device. You review at each stage, so the flows are proven before a line of the ' +
          'build is written.',
      },
      {
        span: 'Weeks 4–9',
        title: 'Build and integration',
        body:
          'App, API, CMS, push, analytics and the third-party pieces you rely on. Every build ' +
          'goes to TestFlight and the Play internal track, so progress is something you can ' +
          'open on your own phone throughout.',
      },
      {
        span: 'Week 10 onward',
        title: 'Store release, review and optimisation',
        body:
          'Submission and store review — usually two to seven days, and we submit early enough ' +
          'that a rejection is a fix, not a missed launch — then 30 days of reading real ' +
          'behaviour and tightening what underperforms.',
      },
    ],
  },

  outcomes: {
    eyebrow: 'What changes',
    heading: { lead: 'What you walk away', em: 'with.' },
    list: [
      'An app people reopen, because it does something the website cannot',
      'iOS and Android from one codebase, so a change ships once, not twice',
      'Native-grade feel on each platform, not a website in a frame',
      'Push, offline and the device features the product actually earns',
      'Full ownership — the code, the store listings, the developer accounts, all in your name',
    ],
    fitHeading: 'This is for you if',
    fit: [
      'Your customers deal with you often enough that an app would earn its place on a home screen',
      'There is a job an app can do that a mobile site genuinely cannot',
      'You want to own the product and the store listings, not rent them',
    ],
    notHeading: 'This is not for you if',
    not: [
      'You want an app because a competitor has one, with nothing for it to do',
      'A fast mobile web experience would serve the same need for less',
      'The product would serve something we do not build for',
    ],
  },

  packages: ['The Authority System', 'Halal Brand OS'],

  faq: [
    {
      q: 'Do you do Islamic app development — prayer times, Quran, donations?',
      a:
        'Yes. Prayer and qibla calculation, a Quran or hifz reader with audio and bookmarks, ' +
        'Hijri calendars, donation and zakat flows, masjid and community apps. The religious ' +
        'logic needs care — calculation methods differ by school and region, and getting a ' +
        'prayer time wrong is not a normal bug — so we agree the method and the source of ' +
        'truth in writing before a screen is drawn.',
    },
    {
      q: 'Native or cross-platform?',
      a:
        'Cross-platform by default: React Native from one codebase, which is what makes two ' +
        'stores affordable and keeps them in step. We write native modules where the ' +
        'cross-platform layer is not good enough, and we will tell you outright when a product ' +
        'should be fully native instead — heavy real-time graphics, deep hardware work, or ' +
        'anything where a frame budget is the product.',
    },
    {
      q: 'Do we even need an app?',
      a:
        'Often not, and we will say so. If a fast mobile web experience would serve the same ' +
        'need, that is cheaper for you and honest of us. An app earns its keep when people ' +
        'come back often and need something a browser tab cannot give them — saved state, ' +
        'offline, notifications worth allowing. If that is not you yet, we will tell you.',
    },
    {
      q: 'How long does it take?',
      a:
        'Ten to fourteen weeks for a first version of iOS and Android, from kickoff to store ' +
        'release, including the review. We give you a dated schedule in week one, submit early ' +
        'enough that a rejection is a fix rather than a missed launch, and tell you early if ' +
        'the schedule moves.',
    },
    {
      q: 'Do we own the code and the store listings?',
      a:
        'Yes, entirely. The repository, and the Apple Developer and Google Play accounts, are ' +
        'all in your name from day one, with the apps published under yours rather than ours. ' +
        'There is no lock-in — if you take the project elsewhere, everything goes with you, ' +
        'including the listings.',
    },
  ],

  cta: {
    eyebrow: 'Start here',
    heading: { lead: 'Tell us what it', em: 'has to do.' },
    body:
      'A 15–30 minute fit call. Bring the idea, not a spec — we will tell you whether an app, ' +
      'a mobile site, or neither is the right answer, including when it is none of them.',
  },
};

export default appDevelopment;
