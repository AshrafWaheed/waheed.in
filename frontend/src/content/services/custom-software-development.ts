/**
 * 02 · Custom Software Development — page copy.
 *
 * The `promise` and the register title are verbatim from `expertise.doors[1]`
 * in content/home.ts. Everything else is written for this page.
 *
 * This is the broadest craft on the list — ERPs, process automation,
 * integrations, AI, and connected devices are five different disciplines with
 * one thing in common: nothing off the shelf fits. So `build` carries the
 * DOMAINS rather than a deliverables list, and the things that get handed over
 * (source, docs, accounts) moved into `outcomes`, where they read as ownership
 * instead of as line items. Page 01 uses the same slot for deliverables; the
 * template allows both because the section is titled per page.
 *
 * Voice check: plain, specific, no superlatives. Every span in `process` is the
 * honest duration for work of this size, not a best case.
 */
import type { ServicePage } from './types';

const customSoftwareDevelopment: ServicePage = {
  slug: 'custom-software-development',

  metaTitle: 'Custom Software for Muslim Businesses & Masjids · WAHEED',
  metaDescription:
    'Custom software for Muslim businesses — ERPs, masjid and madrasa management, zakat and donation systems, process automation and AI, for teams that have outgrown off-the-shelf tools.',

  hero: {
    eyebrow: 'Service 03',
    h1: { lead: 'Custom Software', em: 'Development' },
    sub:
      'Off-the-shelf tools were not built for your business. We engineer ERPs, internal ' +
      'platforms, automations and integrations that pay themselves back in saved hours ' +
      'and clearer decisions.',
    promise: 'Software that earns its keep.',
  },

  problem: {
    eyebrow: 'Why this exists',
    heading: { lead: 'Your process already exists. It is just', em: 'held together by people.' },
    body:
      'Every business that has grown past a certain size is running software it never chose — ' +
      'a spreadsheet somebody maintains by hand, a subscription that does 30% of what you need, ' +
      'and a person in the middle re-typing data from one into the other. That person is the ' +
      'integration, and they are the part that does not scale.',
    symptoms: [
      {
        title: 'The same data is entered three times',
        body:
          'An order arrives, and somebody copies it into the accounting tool, then into a ' +
          'spreadsheet, then into a message. Every copy is a chance to be wrong, and the ' +
          'wrong version is the one that gets used.',
      },
      {
        title: 'You are paying per seat for a poor fit',
        body:
          'Three subscriptions, none of which quite works, each with a monthly cost that ' +
          'rises with headcount. Rented software that fits badly gets more expensive exactly ' +
          'as you grow into needing it to fit well.',
      },
      {
        title: 'Nobody can answer a simple question',
        body:
          '"What did we make on that line last quarter" takes two days and a phone call. The ' +
          'data exists — it is just scattered across systems that were never introduced to ' +
          'each other.',
      },
    ],
  },

  build: {
    eyebrow: 'What we build',
    heading: 'Six kinds of system, one standard.',
    sub:
      'These overlap more often than not — an ERP that nobody has to re-key into is an ' +
      'integration problem, and an automation worth trusting is a data problem first. ' +
      'We scope whichever combination your business actually needs.',
    items: [
      {
        num: '01',
        title: 'ERPs and internal platforms',
        body:
          'Inventory, orders, production, procurement, fulfilment, HR and finance in one ' +
          'system built around how your business actually runs — including the parts no ' +
          'generic ERP has a screen for. Masjid and madrasa management, Islamic school ERP ' +
          'and zakat administration fall here too. Role-based access, full audit trail.',
      },
      {
        num: '02',
        title: 'Business process automation',
        body:
          'The manual steps between systems, removed. Approvals that route themselves, ' +
          'invoices raised from a delivery, stock that reorders at a threshold, reports that ' +
          'arrive instead of being requested.',
      },
      {
        num: '03',
        title: 'Integrations and data plumbing',
        body:
          'Your accounting software, payment gateway, courier, CRM, marketplace and WhatsApp, ' +
          'talking to each other over real APIs with retries and error handling — not a ' +
          'nightly CSV somebody remembers to export.',
      },
      {
        num: '04',
        title: 'AI automation',
        body:
          'Language models put where they are actually reliable: extracting data from ' +
          'invoices and documents, triaging and drafting support replies, summarising long ' +
          'threads, semantic search over your own knowledge base. With a human in the loop ' +
          'wherever the output has consequences.',
      },
      {
        num: '05',
        title: 'Embedded and connected devices',
        body:
          'Firmware, device telemetry and the cloud layer above it — sensors, meters, ' +
          'scanners, kiosks and production-floor hardware reporting into the same system ' +
          'your dashboards read from, so the physical operation and the software agree.',
      },
      {
        num: '06',
        title: 'Dashboards and decision reporting',
        body:
          'The output of all of the above, made legible: live operational figures, cost and ' +
          'margin by line, and alerts on the numbers that should never drift quietly. Built ' +
          'for the person who has to decide, not for a demo.',
      },
    ],
  },

  process: {
    eyebrow: 'How it runs',
    heading: 'Mapped before it is built.',
    sub:
      'The expensive failure in custom software is building the wrong thing accurately. Two ' +
      'of these four phases happen before any feature is written, and you can stop after the ' +
      'specification with something useful in hand.',
    steps: [
      {
        span: 'Weeks 1–2',
        title: 'Process mapping',
        body:
          'We sit with the people who do the work and document what actually happens, ' +
          'including the workarounds. Output: a written map of the current process and the ' +
          'points where it costs you money.',
      },
      {
        span: 'Week 3',
        title: 'Specification and architecture',
        body:
          'Scope, data model, integrations, access rules and a phased plan — priced, dated, ' +
          'and yours to keep. If you take it to another firm, it still works.',
      },
      {
        span: 'Weeks 4–14',
        title: 'Build in increments',
        body:
          'Shipped in working slices, most valuable first, on a staging environment you can ' +
          'use throughout. Duration depends on scope — this is where an ERP and an automation ' +
          'part company.',
      },
      {
        span: 'Rollout',
        title: 'Migration, training and handover',
        body:
          'Data migrated, staff trained on the parts they touch, and a hypercare window while ' +
          'the old process is retired. Documentation and source handed over, not held.',
      },
    ],
  },

  outcomes: {
    eyebrow: 'What changes',
    heading: { lead: 'What you walk away', em: 'with.' },
    list: [
      'Hours back every week — the re-typing, chasing and reconciling stops being someone’s job',
      'One place where the numbers are true, instead of four that disagree',
      'A cost that stops scaling with headcount, because you own it rather than rent it',
      'Source code, documentation, infrastructure and accounts, all in your name',
      'A system that can be extended, because it was specified before it was written',
    ],
    fitHeading: 'This is for you if',
    fit: [
      'A real process is running on spreadsheets, WhatsApp and memory',
      'Off-the-shelf software gets you most of the way and stalls at the part that matters',
      'You can name the hours or the errors this is costing you each month',
    ],
    notHeading: 'This is not for you if',
    not: [
      'A configured off-the-shelf tool would genuinely do it — we will say so',
      'The process itself is undecided; software will only make the confusion faster',
      'The system would serve interest-based finance, gambling, or anything else we do not build for',
    ],
  },

  packages: ['Halal Brand OS', 'Halal Brand Partnership'],

  faq: [
    {
      q: 'Do you build masjid, madrasa or zakat management software?',
      a:
        'Yes — these are ordinary custom builds wearing different words. A masjid management ' +
        'system is membership, donations, events and a prayer timetable. A madrasa or Islamic ' +
        'school ERP is admissions, attendance, hifz progress, fees and parent communication. ' +
        'A zakat or sadaqah platform is a ledger with nisab rules, categories of eligible ' +
        'recipients and an audit trail a trustee can defend. We scope them the same way we ' +
        'scope any ERP: map the process first, build in increments.',
    },
    {
      q: 'What does custom software actually cost?',
      a:
        'It scales with scope, so the honest answer comes after the specification phase, not ' +
        'before it. A single automation or integration is a small piece of work; a full ERP ' +
        'replacing four systems is a months-long build. We price the mapping and specification ' +
        'first as their own engagement, so you get a costed plan before committing to a build.',
    },
    {
      q: 'Where does AI belong, and where does it not?',
      a:
        'It belongs where the work is reading, sorting and drafting — pulling fields out of ' +
        'invoices, triaging support, searching your own documents. It does not belong anywhere ' +
        'an unreviewed answer would move money, commit stock or go to a customer unseen. We put ' +
        'a human approval step at those points, and we tell you which of your data leaves your ' +
        'infrastructure and which does not.',
    },
    {
      q: 'Can you work with the systems we already have?',
      a:
        'Usually that is the cheaper answer, and often it is the whole project. If your ' +
        'accounting software works, we integrate with it rather than rebuild it. Replacement ' +
        'is what we recommend when licence costs, per-seat pricing or a hard limitation are ' +
        'already costing more than the build would.',
    },
    {
      q: 'Who maintains it after launch?',
      a:
        'You own the code and the infrastructure from day one, so the choice is yours: keep it ' +
        'in-house with the documentation and handover we provide, or keep us on a Halal Brand ' +
        'Partnership for maintenance, changes and the next phase. There is no licence, and ' +
        'nothing stops working if you walk away.',
    },
  ],

  cta: {
    eyebrow: 'Start here',
    heading: { lead: 'Show us the process', em: 'that is costing you.' },
    body:
      'A 15–30 minute fit call. Bring the bottleneck, not a feature list — we will tell you ' +
      'whether it needs software, configuration, or a decision.',
  },
};

export default customSoftwareDevelopment;
