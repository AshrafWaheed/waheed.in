export type Category = 'All' | 'General' | 'Website & App' | 'Social Media' | 'Payment';

export const FILTERS: Category[] = ['All', 'General', 'Website & App', 'Social Media', 'Payment'];

export interface FaqItem { cat: Exclude<Category, 'All'>; q: string; a: string; }

export const FAQS: FaqItem[] = [
  // ── General ──────────────────────────────────────────────────
  {
    cat: 'General',
    q: 'What makes Waheed different from other digital agencies?',
    a: 'Waheed combines strategic technology, web and app development, and digital growth with a Shariah-aligned approach. We build high-performing digital products and marketing systems that prioritise clarity, conversion, and long-term credibility, without manipulative tactics or compromising your values. We believe barakah and real business results are not opposites. When technology, strategy, and marketing are built with integrity and excellence, growth becomes sustainable.',
  },
  {
    cat: 'General',
    q: 'Do you only work with Muslim clients?',
    a: 'We primarily serve Muslim-led brands and organisations. However, we also welcome values-aligned clients who respect our ethical and faith-based principles and serve Muslim audiences.',
  },
  {
    cat: 'General',
    q: 'What does "faith-aligned" actually mean?',
    a: 'Faith-aligned means ethical marketing, modest branding, and no deceptive or haram practices. We avoid manipulative tactics and prioritise trust, transparency, and long-term impact.',
  },
  {
    cat: 'General',
    q: 'Do you help with brand strategy and messaging?',
    a: 'Yes. Before designing your website or launching a marketing campaign, we help refine your positioning, messaging, audience clarity, and unique value proposition. Clear messaging is the foundation of effective marketing.',
  },
  {
    cat: 'General',
    q: 'Do you help with Islamic messaging and brand positioning?',
    a: 'Yes. We help you communicate your mission in a way that is authentic, respectful, and aligned with Islamic values.',
  },
  {
    cat: 'General',
    q: 'How do you ensure your marketing strategies are halal?',
    a: 'We avoid deceptive tactics, inappropriate visuals, and unethical persuasion. Every strategy is built around transparency, integrity, and trust.',
  },
  {
    cat: 'General',
    q: "We've worked with agencies before and didn't see results. How are you different?",
    a: 'We begin with research and strategy, not just design. Every recommendation is based on your audience, positioning, and business objectives, ensuring your website and marketing work together to generate meaningful results.',
  },
  {
    cat: 'General',
    q: 'How do we get started?',
    a: "Simply fill out our Project Application Form. We'll review your inquiry and schedule a clarity call if we're a good fit, in shā' Allāh.",
  },

  // ── Website & App ─────────────────────────────────────────────
  {
    cat: 'Website & App',
    q: 'What kinds of websites do you build?',
    a: 'We build custom websites tailored to your brand, audience, and business goals, from corporate websites and service businesses to e-commerce stores, non-profit organisations, and startup platforms.',
  },
  {
    cat: 'Website & App',
    q: 'Do you build mobile apps as well?',
    a: 'Yes. We develop both websites and custom web or mobile applications, including MVPs, client portals, dashboards, internal tools, booking systems, and other custom software solutions.',
  },
  {
    cat: 'Website & App',
    q: 'Do you use templates?',
    a: 'No. Every project is custom-designed to reflect your brand, communicate your message clearly, and create a seamless user experience.',
  },
  {
    cat: 'Website & App',
    q: 'Can you redesign our existing website?',
    a: 'Absolutely. We audit your current website and transform it into a more strategic, modern, and conversion-focused platform.',
  },
  {
    cat: 'Website & App',
    q: 'How long does it take to build a website or application?',
    a: "Most website projects take around 4–8 weeks, while custom applications vary depending on scope and complexity. We'll provide a timeline after understanding your project requirements.",
  },
  {
    cat: 'Website & App',
    q: 'Will our website be mobile-friendly and SEO-ready?',
    a: 'Yes. Every website is fully responsive and built with foundational SEO best practices to improve visibility, usability, and performance.',
  },
  {
    cat: 'Website & App',
    q: 'Will our website or app be fast and secure?',
    a: 'Yes. We prioritise speed, performance, and security throughout development, following industry best practices to ensure a reliable and trustworthy user experience.',
  },
  {
    cat: 'Website & App',
    q: 'Can you build e-commerce websites?',
    a: 'Yes. We create secure, user-friendly online stores designed to provide a seamless shopping experience while supporting your business growth.',
  },
  {
    cat: 'Website & App',
    q: 'Can you integrate third-party tools?',
    a: 'Absolutely. We can integrate payment gateways, CRM systems, email marketing platforms, analytics tools, APIs, booking systems, and other software your business relies on.',
  },
  {
    cat: 'Website & App',
    q: "Who owns the website or application after it's completed?",
    a: 'Once the project is completed and final payment has been made, you own your website or application. We ensure you have access to your project and provide guidance for ongoing management.',
  },
  {
    cat: 'Website & App',
    q: 'Do you provide maintenance and ongoing support?',
    a: 'Yes. We offer maintenance plans that include software updates, security monitoring, bug fixes, backups, and technical support after launch.',
  },

  // ── Social Media ──────────────────────────────────────────────
  {
    cat: 'Social Media',
    q: 'Do you fully manage social media accounts?',
    a: 'Yes. We offer both strategy-only consulting and full social media management, including content planning, creative direction, caption writing, publishing, and performance reporting.',
  },
  {
    cat: 'Social Media',
    q: 'Which social media platforms do you support?',
    a: 'We primarily work with Instagram, LinkedIn, Facebook, and X, depending on where your audience is most active. We focus on intentional marketing rather than trying to be everywhere.',
  },
  {
    cat: 'Social Media',
    q: 'Do you create the content for us?',
    a: "Yes. Depending on your package, we develop content strategy, post ideas, captions, and creative direction. However, your behind-the-scenes content, expertise, reflections, and experiences make your brand significantly more authentic. The strongest marketing combines your voice with our strategy.",
  },
  {
    cat: 'Social Media',
    q: 'Will social media actually grow our business?',
    a: 'When approached strategically, yes. Social media builds awareness, trust, authority, and relationships, but success comes from clear positioning and consistency rather than simply posting frequently.',
  },
  {
    cat: 'Social Media',
    q: 'Do you guarantee followers or viral posts?',
    a: "No. We don't use artificial growth tactics or chase vanity metrics. Instead, we focus on sustainable growth, meaningful engagement, and attracting the right audience.",
  },
  {
    cat: 'Social Media',
    q: 'How long before we see results?',
    a: 'Organic growth takes consistency. Many clients begin seeing stronger engagement, improved brand clarity, and increased inquiries within 1–3 months, although timelines vary depending on the industry and consistency.',
  },
  {
    cat: 'Social Media',
    q: 'Can you align our social media with our website?',
    a: 'Absolutely. Your website and social media should work together. We ensure your messaging, visuals, and calls-to-action remain consistent across every customer touchpoint.',
  },

  // ── Payment ───────────────────────────────────────────────────
  {
    cat: 'Payment',
    q: 'Do you offer payment plans?',
    a: "Yes, and we do not take an upfront payment. We work on a milestone-based system: the project is split into stages, and each stage is invoiced only once it is built and in front of you. You pay for what you can already see. No interest, no financing, nothing hidden — just a schedule you can check against the work.",
  },
];

export const CAT_LABELS: Record<Exclude<Category, 'All'>, string> = {
  'General':       'General',
  'Website & App': 'Website & App Development',
  'Social Media':  'Social Media Marketing',
  'Payment':       'Payment',
};
