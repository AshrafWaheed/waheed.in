/**
 * 03 · Brand Strategy — page copy.
 *
 * The `promise` and the register title are verbatim from `expertise.doors[2]`
 * in content/home.ts. Everything else is written for this page.
 *
 * This page has its own LAYOUT (components/service/layouts/BrandStrategy.tsx),
 * not the default one, so the copy is written to that layout's shape:
 *
 *   - `problem.symptoms` are read by a sticky illustration that cross-fades
 *     between three drawings, so each symptom has to be a distinct FAILURE
 *     MODE, not three angles on one complaint.
 *   - `build.items` travel horizontally through a pinned rail, so each title
 *     has to survive being read alone on a card, out of sequence.
 *   - `outcomes.list` uses the ' → ' convention from types.ts: each item is a
 *     from/to pair, rendered as a shift.
 *
 * Voice check: plain, specific, no superlatives. Positioning claims are the
 * easiest thing on this site to over-write, so every one of them here names
 * something observable — what a buyer does, what a page says, what stops.
 */
import type { ServicePage } from './types';

const brandStrategy: ServicePage = {
  slug: 'brand-strategy',

  metaTitle: 'Brand Strategy · WAHEED',
  metaDescription:
    'Positioning, narrative and visual systems for halal brands — so the right buyer feels chosen, the wrong buyer moves on, and you stop competing on price.',

  hero: {
    eyebrow: 'Service 03',
    h1: { lead: 'Brand', em: 'Strategy' },
    sub:
      'A weak brand competes on price; a strong brand commands premium trust. We craft ' +
      'positioning, narrative and visual systems that make the right buyer feel chosen, ' +
      'and the wrong buyer move on.',
    promise: 'Positioning that pre-sells.',
  },

  problem: {
    eyebrow: 'Why this exists',
    heading: { lead: 'If the buyer cannot tell you apart,', em: 'price is the only lever left.' },
    body:
      'Nobody sets out to build a brand that blends in. It happens one reasonable decision at a ' +
      'time — matching what the category already does, adding a message for each new audience, ' +
      'saying yes to the wrong client because the month was quiet. None of those is a mistake ' +
      'on its own. Together they are a brand with no edges.',
    symptoms: [
      {
        title: 'You could swap logos and nothing would change',
        body:
          'Same promise, same three benefits, same photography as everyone in the category. ' +
          'When the differences are invisible, the buyer stops looking for them and starts ' +
          'comparing the only number on the page.',
      },
      {
        title: 'Every deal ends in a discount',
        body:
          'Discovery goes well, the proposal lands, and then the conversation moves to price ' +
          'and stays there. That is not a sales problem. It is what happens when the value ' +
          'was never established before the number arrived.',
      },
      {
        title: 'The wrong people keep enquiring',
        body:
          'Enquiries arrive from buyers who want something you do not do, at a budget you ' +
          'cannot serve. A brand that tries to appeal to everyone spends its week qualifying ' +
          'people out — work the positioning should have done before they ever wrote in.',
      },
    ],
  },

  build: {
    eyebrow: 'What you get',
    heading: 'Six artefacts, one argument.',
    sub:
      'Strategy that stays in a workshop is a nice afternoon. These are the things it becomes — ' +
      'each one written down, handed over, and usable by anyone who joins next year.',
    items: [
      {
        num: '01',
        title: 'Positioning statement',
        body:
          'Who you are for, what you do that matters to them, and why you rather than the ' +
          'obvious alternative — in one paragraph the whole team can repeat without checking. ' +
          'Every other artefact is downstream of this one.',
      },
      {
        num: '02',
        title: 'Buyer definition',
        body:
          'The person you are actually talking to: what they already believe, what they have ' +
          'tried, what would make them hesitate, and what they need to hear before they will ' +
          'trust a stranger with this. Written from real conversations, not demographics.',
      },
      {
        num: '03',
        title: 'Messaging hierarchy',
        body:
          'The one-line claim, the three proofs beneath it, and the objections each proof ' +
          'answers — ordered, so the site, the deck and the sales call make the argument in ' +
          'the same sequence instead of three different ones.',
      },
      {
        num: '04',
        title: 'Verbal identity',
        body:
          'Voice, vocabulary and the sentences you would never write, plus naming and taglines ' +
          'where they are needed. Enough rules that a new writer sounds like you, and not so ' +
          'many that they cannot write.',
      },
      {
        num: '05',
        title: 'Visual identity system',
        body:
          'Logo system, type scale, colour, layout grid, photography and iconography direction ' +
          '— built as a system with rules, so the fiftieth asset is as consistent as the first ' +
          'and nobody has to guess.',
      },
      {
        num: '06',
        title: 'Guidelines and rollout kit',
        body:
          'One document that makes the whole thing usable without us: how to apply it, what ' +
          'not to do, and a starter set of templates for the assets you make weekly. Handed ' +
          'over in editable source, not as a locked PDF.',
      },
    ],
  },

  process: {
    eyebrow: 'How it runs',
    heading: 'Evidence, then decisions, then design.',
    sub:
      'Positioning is a decision, and a decision made without evidence is a preference. Half of ' +
      'this engagement happens before anything is designed — and the design goes faster because ' +
      'of it, because there is finally something to be right about.',
    steps: [
      {
        span: 'Weeks 1–2',
        title: 'Immersion and evidence',
        body:
          'Interviews with you, your team, and — where you will allow it — your customers. A ' +
          'read of the category, what your competitors claim, and where those claims overlap. ' +
          'Output: what is actually true about you that nobody else can say.',
      },
      {
        span: 'Week 3',
        title: 'Positioning',
        body:
          'A working session where the choices get made, out loud, with the trade-offs named. ' +
          'You leave having decided who you are not for. Output: the positioning statement and ' +
          'the buyer definition, signed off before anything is built on them.',
      },
      {
        span: 'Weeks 4–6',
        title: 'Narrative and voice',
        body:
          'The messaging hierarchy, the verbal identity, and the copy for the pages that carry ' +
          'the most weight. Reviewed in draft, so the argument is settled in words before it ' +
          'is settled in pixels.',
      },
      {
        span: 'Weeks 7–9',
        title: 'Visual system and handover',
        body:
          'Identity, type, colour, grid and imagery, built and pressure-tested against real ' +
          'assets rather than a mood board. Then guidelines, templates, source files, and a ' +
          'walkthrough with whoever will be using them.',
      },
    ],
  },

  outcomes: {
    eyebrow: 'What changes',
    heading: { lead: 'The shift you are', em: 'paying for.' },
    list: [
      'One of several credible options → The obvious choice, before price comes up',
      'Explaining what you do → Being understood in a sentence',
      'Qualifying the wrong buyers out → The wrong buyer moving on by themselves',
      'Design decided by whoever is in the room → Design decided by the system',
      'A different message on every channel → One argument, said the same way everywhere',
    ],
    fitHeading: 'This is for you if',
    fit: [
      'You are winning on price or on relationships, and you want to win on the offer',
      'The business has changed and the brand still describes the old one',
      'You are about to invest in a site, a launch, or ads, and want to aim them first',
    ],
    notHeading: 'This is not for you if',
    not: [
      'You want a logo — that is a design job, and a smaller one than this',
      'The positioning is settled and working; spend the budget on reaching people instead',
      'The decisions cannot be made, or cannot be made by the people in the room',
    ],
  },

  packages: ['Foundations Engagement', 'The Authority System', 'Halal Brand Audit'],

  faq: [
    {
      q: 'Is this not just a logo and a colour palette?',
      a:
        'Those are outputs of it, and the last ones. Roughly half of this engagement produces ' +
        'no visuals at all — it produces a decision about who you are for and what you are ' +
        'claiming. A logo drawn before that decision is a guess that everything else then has ' +
        'to be consistent with.',
    },
    {
      q: 'How do you make positioning decisions without guessing?',
      a:
        'Evidence first: interviews with your team and your customers, and a read of what every ' +
        'credible competitor already claims. Positioning is mostly a process of elimination — ' +
        'most of what you could say is already taken or is not true about you, and what ' +
        'survives that is usually a short list you can choose from with your eyes open.',
    },
    {
      q: 'What if we do not agree internally?',
      a:
        'That surfaces in week three, which is the point of doing it out loud in a room rather ' +
        'than by document. Disagreement about positioning is nearly always disagreement about ' +
        'strategy that had not been said yet. We will not paper over it — an unresolved split ' +
        'here becomes a brand that says two things.',
    },
    {
      q: 'Do we need the website rebuilt too?',
      a:
        'Not necessarily, and not immediately. The messaging hierarchy is written to be usable ' +
        'on the site you already have. If the current site cannot carry the new argument — ' +
        'because the structure fights it, not because it looks dated — we will say so, and a ' +
        'Foundations Engagement is the route.',
    },
  ],

  cta: {
    eyebrow: 'Start here',
    heading: { lead: 'Find out what only you', em: 'can say.' },
    body:
      'A 15–30 minute fit call. Bring the version of your pitch you are least sure about — ' +
      'that is usually where the positioning is missing.',
  },
};

export default brandStrategy;
