/**
 * 04 · SEO — page copy.
 *
 * The `promise` and the register title are verbatim from `expertise.doors[3]`
 * in content/home.ts. Everything else is written for this page.
 *
 * This page has its own LAYOUT (components/service/layouts/SeoLayout.tsx). The
 * copy is written to that layout's shape, and two of its slots are load-bearing:
 *
 *   - `build.items` are rendered as a STACK, built bottom-up, so the order is
 *     structural rather than editorial: 01 is the foundation everything above
 *     it rests on, 06 is what sits on top. Reordering this array is a claim
 *     about how SEO works, not a reshuffle.
 *   - `process.steps` are a staircase across twelve months, so each `span` is a
 *     month range and they have to be contiguous — a gap in the stair reads as
 *     a month nobody is working.
 *
 * Voice check: SEO is the craft on this list with the most inflated claims
 * attached to it, so every number here is one we would repeat on a call, and
 * the page says plainly what cannot be promised.
 */
import type { ServicePage } from './types';

const seo: ServicePage = {
  slug: 'seo',

  metaTitle: 'SEO · WAHEED',
  metaDescription:
    'Technical SEO, intent-driven content and authority building for halal brands — compounding organic visibility that keeps working after the invoice stops, with no bought links and no black-hat shortcuts.',

  hero: {
    eyebrow: 'Service 05',
    h1: { lead: 'Search that', em: 'compounds.' },
    sub:
      'Ads stop the moment you stop paying. We compound your visibility on Google with ' +
      'technical fixes, intent-driven content, and authority signals that bring qualified ' +
      'buyers to your door, for years.',
    promise: 'Traffic that compounds.',
  },

  problem: {
    eyebrow: 'Why this exists',
    heading: { lead: 'Paid attention is rented.', em: 'Organic attention is owned.' },
    body:
      'A campaign is a tap. It runs while the money runs and stops the day it does not, and ' +
      'the month after you switch it off looks exactly like the month before you switched it ' +
      'on. Search is the opposite shape: slow to start, and it keeps returning long after the ' +
      'work that earned it was paid for.',
    symptoms: [
      {
        title: 'The traffic stops when the spend stops',
        body:
          'Your best month was your highest ad spend. That is not a growth engine, it is a ' +
          'meter — and every month you are buying the same audience again because none of ' +
          'last month’s budget is still working for you.',
      },
      {
        title: 'You rank for your own name and nothing else',
        body:
          'People who already know you can find you. Everybody else is finding a competitor, ' +
          'because the searches that describe the problem you solve are being answered by ' +
          'somebody who wrote about it and you did not.',
      },
      {
        title: 'You publish, and nothing happens',
        body:
          'There is a blog, it is updated, and it has never produced an enquiry. Content ' +
          'written without a search behind it and without a site that can be crawled is ' +
          'work that no one asked for and no one will find.',
      },
    ],
  },

  build: {
    eyebrow: 'What we build',
    heading: 'Six SEO layers, built bottom-up.',
    sub:
      'Search is a stack, and it is only ever as strong as the layer under it. Publishing on ' +
      'a site Google cannot crawl properly is the most common way to spend a year on content ' +
      'and rank for nothing — so we build in this order, always.',
    items: [
      {
        num: '01',
        title: 'Technical foundation',
        body:
          'Crawlability, indexation, site speed, mobile rendering, canonical and redirect ' +
          'hygiene, structured data. The unglamorous layer that decides whether anything ' +
          'above it can be seen at all.',
      },
      {
        num: '02',
        title: 'Keyword and intent map',
        body:
          'Not a list of search volumes — a map of what people type at each stage, from "what ' +
          'is" to "who does this near me", matched to the page that should answer it. This is ' +
          'what stops content being written on a hunch.',
      },
      {
        num: '03',
        title: 'Architecture and on-page',
        body:
          'The site restructured so that related pages support each other rather than compete: ' +
          'internal linking, hierarchy, titles, headings and page-level targeting, each URL ' +
          'given one job.',
      },
      {
        num: '04',
        title: 'Content engine',
        body:
          'Briefs, drafts and a publishing cadence you can sustain, aimed at the intents that ' +
          'convert rather than the ones with the biggest numbers. Written to be the best answer ' +
          'on the page, because that is now the only thing that holds a ranking.',
      },
      {
        num: '05',
        title: 'Authority and digital PR',
        body:
          'Earned coverage, citations and genuine relationships in your sector — the signals ' +
          'that tell Google other people take you seriously. Earned, never bought; see the ' +
          'refusal below, it is not a stylistic preference.',
      },
      {
        num: '06',
        title: 'Measurement',
        body:
          'Rankings, impressions, clicks and — the one that matters — enquiries attributed to ' +
          'organic. Reported monthly against the baseline we took in month one, so the question ' +
          '"is this working" has an answer rather than an opinion.',
      },
    ],
  },

  process: {
    eyebrow: 'How it runs',
    heading: 'How SEO compounds: a staircase, not a switch.',
    sub:
      'Twelve months, because that is honestly how long the compounding takes to show. Each ' +
      'step is a landing you can stop on — the work done so far keeps paying whether or not ' +
      'you continue to the next.',
    steps: [
      {
        span: 'Month 1',
        title: 'Audit and baseline',
        body:
          'Technical crawl, content and backlink review, competitor read, and a recorded ' +
          'baseline of where you rank today. Output: a prioritised fix list, ordered by ' +
          'impact over effort rather than by ease.',
      },
      {
        span: 'Months 1–3',
        title: 'Fix the foundation',
        body:
          'The technical layer, the architecture, and the pages you already have that are ' +
          'closest to ranking. This is where the fastest wins live — a page sitting at ' +
          'position 12 usually needs work, not a replacement.',
      },
      {
        span: 'Months 3–8',
        title: 'Build the content engine',
        body:
          'The intent map turned into published pages at a steady cadence, each one briefed ' +
          'against a real search and internally linked into what already exists. Cadence beats ' +
          'volume here, and both beat a burst.',
      },
      {
        span: 'Months 8–12',
        title: 'Compound',
        body:
          'Authority work, refreshing what is nearly there, and cutting what is not going to ' +
          'rank. By this stage most months improve because of work done in earlier ones, which ' +
          'is the entire point of the exercise.',
      },
    ],
  },

  outcomes: {
    eyebrow: 'What changes',
    heading: { lead: 'What you walk away', em: 'with.' },
    list: [
      'Visibility for the searches your buyers actually type, not just for your own name',
      'A site Google can crawl, render and index without working around it',
      'A content engine your team can keep running, with briefs instead of guesses',
      'Enquiries you did not pay per click for, arriving after the invoice has stopped',
      'A baseline and a monthly report, so "is this working" has an answer',
    ],
    fitHeading: 'This is for you if',
    fit: [
      'You are already buying traffic and want something that keeps working when you stop',
      'You sell something people search for before they know your name',
      'You can commit to twelve months — this is the one craft here that cannot be rushed',
    ],
    notHeading: 'This is not for you if',
    not: [
      'You need enquiries this month — that is a paid problem, and we will say so',
      'You want bought links, private networks or AI bulk content; we do not do deception',
      'Nobody searches for what you sell, which is worth finding out before you spend',
    ],
  },

  packages: ['The Authority System', 'Halal Brand Partnership', 'Halal Brand Audit'],

  faq: [
    {
      q: 'How long before we see results?',
      a:
        'Technical fixes can move things in weeks, because the pages already exist and were ' +
        'being held back. New content ranking on competitive terms is three to nine months, ' +
        'and the compounding is a twelve-month story. Anyone quoting you faster on a ' +
        'competitive term is describing a term that is not competitive.',
    },
    {
      q: 'Can you guarantee a number one ranking?',
      a:
        'No, and neither can anyone else — the ranking is Google’s decision, not ours or ' +
        'theirs. What we commit to is the work, the baseline, and a monthly report against it, ' +
        'so you can see movement rather than take our word for it. A guarantee in this craft is ' +
        'either about a term nobody searches or about a method we would not use.',
    },
    {
      q: 'Do we have to blog every week?',
      a:
        'You have to publish at a cadence you can hold, which for most teams is not weekly. ' +
        'Twelve pages a year that each answer a real search will beat fifty that answer none. ' +
        'We would rather set a rhythm that survives a busy quarter than one that stops in ' +
        'month three.',
    },
    {
      q: 'What about AI-written content?',
      a:
        'We use AI where it genuinely helps — research, outlining, first-pass drafting — and ' +
        'never as the thing that ships. Bulk-generated pages are the current version of an old ' +
        'shortcut, and they get devalued the same way every previous one did. Everything ' +
        'published carries a human editor and someone who knows your business.',
    },
  ],

  cta: {
    eyebrow: 'Start here',
    heading: { lead: 'Find out what you are', em: 'already close to ranking for.' },
    body:
      'A 15–30 minute fit call. Bring your domain — most sites have pages sitting at position ' +
      '8 to 15 that are a fix away, and that is the fastest thing we can tell you.',
  },
};

export default seo;
