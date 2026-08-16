/**
 * 05 · Social Media Marketing — page copy.
 *
 * The `promise` and the register title are verbatim from `expertise.doors[4]`
 * in content/home.ts. Everything else is written for this page.
 *
 * This page has its own LAYOUT (components/service/layouts/SmmLayout.tsx), and
 * two slots are written to its shape:
 *
 *   - `build.items` are panels in a horizontal accordion, so each title has to
 *     survive being set VERTICALLY in a collapsed 5rem column. Nothing here
 *     runs past three words for that reason.
 *   - `process.steps` are plotted onto a 13-week cadence grid, so the `span`
 *     values must be week ranges inside 1–13 and must be contiguous.
 *
 * Voice check: this is the craft clients have been sold hardest on, so the copy
 * refuses the usual promises — no follower counts, no virality, and the halal
 * production constraints are stated as constraints rather than skirted.
 */
import type { ServicePage } from './types';

const socialMediaMarketing: ServicePage = {
  slug: 'social-media-marketing',

  metaTitle: 'Social Media Marketing for Muslim Businesses · WAHEED',
  metaDescription:
    'Social media marketing for Muslim businesses — channel strategy, content pillars, a production system you can sustain, and community management that turns followers into customers.',

  hero: {
    eyebrow: 'Service 06',
    h1: { lead: 'Content that earns', em: 'the sale.' },
    sub:
      'Posting daily and praying for reach is not a strategy. We build content engines that ' +
      'earn trust first, sell second, and turn passive followers into a community that buys, ' +
      'refers and returns.',
    promise: 'Content engagements, then sales.',
  },

  problem: {
    eyebrow: 'Why this exists',
    heading: { lead: 'A feed is not an audience,', em: 'and reach is not revenue.' },
    body:
      'Most brands are not failing at social because they post too little. They are failing ' +
      'because nothing they post is connected to anything else they post — so every piece has ' +
      'to earn attention from a standing start, and none of it compounds into a reason to buy.',
    symptoms: [
      {
        title: 'Posting is a chore nobody owns',
        body:
          'It happens when someone has an hour, which means it happens in bursts and then not ' +
          'at all. The account goes quiet for three weeks, and the next post has to reintroduce ' +
          'you to an audience that has already moved on.',
      },
      {
        title: 'The numbers move and the inbox does not',
        body:
          'Views, saves, follows — all up. Enquiries flat. Reach you cannot convert is a ' +
          'vanity metric with a dashboard attached, and it usually means the content and the ' +
          'offer have never once been in the same place.',
      },
      {
        title: 'Every post starts from zero',
        body:
          'No pillars, no running arguments, no reason for someone who liked last week’s post ' +
          'to expect anything from this week’s. Without a through-line, an account is a series ' +
          'of adverts to strangers.',
      },
    ],
  },

  build: {
    eyebrow: 'What we build',
    heading: 'The growth engine, in six parts.',
    sub:
      'Not a posting schedule. A system with an argument in it — where each piece has a job, ' +
      'the jobs add up, and the person who has to run it next month can actually run it.',
    items: [
      {
        num: '01',
        title: 'Channel strategy',
        body:
          'Which platforms deserve your effort and which do not, based on where your buyers ' +
          'already are and what you can realistically produce. Most brands are on one channel ' +
          'too many and under-serving the one that matters.',
      },
      {
        num: '02',
        title: 'Content pillars',
        body:
          'Three to five running arguments the account keeps making, so a post is never a ' +
          'standing start. Pillars are what turn a feed into a body of work and give the ' +
          'audience a reason to expect something next week.',
      },
      {
        num: '03',
        title: 'Production system',
        body:
          'Batching, a shot list, a calendar, and templates for the formats you repeat. ' +
          'Designed around the time you actually have — a system that needs a spare afternoon ' +
          'every day is a system that stops in month two.',
      },
      {
        num: '04',
        title: 'Community management',
        body:
          'Replies, DMs and comments treated as the sales channel they are, with saved ' +
          'responses for the questions that repeat and a rule for the ones that need a human. ' +
          'This is where most of the actual conversion happens.',
      },
      {
        num: '05',
        title: 'Collaborations',
        body:
          'Creators, guests and partner brands chosen for the audience overlap rather than for ' +
          'the follower count, with the brief and the boundaries agreed in writing before ' +
          'anything is filmed.',
      },
      {
        num: '06',
        title: 'Measure and iterate',
        body:
          'Monthly review against enquiries and saves, not against follows. What performed gets ' +
          'made again in a new form; what did not gets cut rather than quietly repeated for ' +
          'another quarter.',
      },
    ],
  },

  process: {
    eyebrow: 'How it runs',
    heading: 'Ninety days to a rhythm.',
    sub:
      'The goal of the first quarter is not a viral post. It is a cadence that still runs in ' +
      'month four, whether we are on it or not — which is why the last phase is a handover ' +
      'rather than a report.',
    steps: [
      {
        span: 'Weeks 1–2',
        title: 'Audit and strategy',
        body:
          'What you have published, what performed, where your buyers actually are, and what ' +
          'you can produce without it becoming somebody’s second job. Output: channel choice ' +
          'and the pillars.',
      },
      {
        span: 'Weeks 3–4',
        title: 'Look, formats, first batch',
        body:
          'The visual system, the repeatable formats, and the first month of content produced ' +
          'in one batch — so publishing never depends on somebody having a good idea on a ' +
          'Tuesday morning.',
      },
      {
        span: 'Weeks 5–10',
        title: 'Publish and engage',
        body:
          'The cadence runs, comments and DMs are worked daily, and the content adjusts against ' +
          'what the first few weeks actually show. This is the stretch where a pillar either ' +
          'earns its place or is replaced.',
      },
      {
        span: 'Weeks 11–13',
        title: 'Review and hand over',
        body:
          'What worked, what is being cut, and the system documented — calendar, templates, ' +
          'shot lists and saved replies — so your team can hold the rhythm without us, or with ' +
          'us on a lighter retainer.',
      },
    ],
  },

  outcomes: {
    eyebrow: 'What changes',
    heading: { lead: 'What you walk away', em: 'with.' },
    list: [
      'A cadence that survives a busy month, because it was built around your real capacity',
      'Pillars that make each post add to the last instead of starting over',
      'DMs and comments worked as a sales channel, with the repeat questions already answered',
      'Content your team can keep producing — templates, shot lists, a calendar',
      'A monthly read on saves and enquiries, not on follower counts',
    ],
    fitHeading: 'This is for you if',
    fit: [
      'You have something worth saying and no system for saying it consistently',
      'Your buyers research on social before they ever reach the site',
      'You can commit someone — you or a team member — to being on camera or in the comments',
    ],
    notHeading: 'This is not for you if',
    not: [
      'You want follower growth as the goal; we optimise for enquiries and will say so',
      'Nobody internally can give this two hours a week — no agency survives that',
      'The content would need music, imagery or claims we do not produce',
    ],
  },

  packages: ['The Authority System', 'Halal Brand Partnership'],

  faq: [
    {
      q: 'How does social media marketing for Muslim businesses actually differ?',
      a:
        'In the constraints, mostly — and constraints are useful. Music, imagery and the ' +
        'boundaries on what is shown are yours to set, and we plan the content system inside ' +
        'them rather than treating them as a problem to work around. In practice it rules out ' +
        'the lazy formats and pushes you towards the ones that build trust anyway: teaching, ' +
        'proof of work, customer stories, and a real voice.',
    },
    {
      q: 'Which platforms should we be on?',
      a:
        'Fewer than you are on now, almost certainly. The answer comes out of the audit: where ' +
        'your buyers already are, crossed with what you can produce every week without it ' +
        'collapsing. One channel done properly beats four done occasionally, and the second ' +
        'channel should only open once the first one runs itself.',
    },
    {
      q: 'Do we have to be on camera?',
      a:
        'Someone does, usually — faces outperform everything else, and for a values-led brand ' +
        'the founder is normally the strongest asset you have. But it is not the only route. ' +
        'Voice-over, text-led, illustration and product-led formats all work, and we will build ' +
        'the system around what you are genuinely willing to sustain.',
    },
    {
      q: 'How do you handle halal production constraints?',
      a:
        'As constraints, not as obstacles to work around. No background music where you do not ' +
        'want it — we use ambient, voice and sound design instead. Imagery and casting to your ' +
        'standard, agreed in writing before production. Creators briefed on the same terms. ' +
        'These are decided at the strategy stage, not negotiated per post.',
    },
    {
      q: 'Can you guarantee growth or a viral post?',
      a:
        'No. Reach is a platform decision and virality is not a strategy — it is an outcome ' +
        'nobody can schedule. What we commit to is the cadence, the system, and a monthly read ' +
        'on saves and enquiries. If you want a number promised up front, that promise is being ' +
        'made by someone who intends to buy the number.',
    },
  ],

  cta: {
    eyebrow: 'Start here',
    heading: { lead: 'Bring the account', em: 'you keep meaning to fix.' },
    body:
      'A 15–30 minute fit call. We will tell you which channel to keep, which to drop, and ' +
      'whether a system or a person is what you are actually missing.',
  },
};

export default socialMediaMarketing;
