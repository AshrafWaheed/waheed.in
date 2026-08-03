import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { pageMeta } from '@/lib/seo';
import SmoothScroll from '@/components/motion/SmoothScroll';
import SectionNav from '@/components/motion/useSectionNav';
import DefaultServiceLayout from '@/components/service/layouts/DefaultServiceLayout';
import WebAppLayout from '@/components/service/layouts/WebAppLayout';
import BrandStrategyLayout from '@/components/service/layouts/BrandStrategyLayout';
import SeoLayout from '@/components/service/layouts/SeoLayout';
import SmmLayout from '@/components/service/layouts/SmmLayout';
import type { ServiceLayoutProps } from '@/components/service/layouts/types';
import { services, pages, servicePage } from '@/content/services';

/**
 * Slug → layout. Each craft can own its journey.
 *
 * Every service page makes the same argument in the same eight beats, so the
 * CONTENT shape is shared (content/services/types.ts) — but a page whose whole
 * subject is differentiation cannot be rendered by the same objects as the page
 * before it without losing that argument on sight. Anything not listed here
 * falls back to the default scan-down journey.
 */
const LAYOUTS: Record<string, React.ComponentType<ServiceLayoutProps>> = {
  'web-app-development': WebAppLayout,
  'brand-strategy': BrandStrategyLayout,
  seo: SeoLayout,
  'social-media-marketing': SmmLayout,
};

/**
 * /services/[slug] — one route, five pages.
 *
 * The seven crafts share an argument (problem → deliverables → process →
 * outcomes → packages → objections → close), so they share a template and
 * differ only in content/services/<slug>.ts. Writing five near-identical page
 * files would have guaranteed they drift.
 *
 * A slug with no module 404s. `pages` is keyed off modules that actually exist,
 * and the nav and the sitemap read the same map — so nothing on the site can
 * link here before the copy has been written.
 *
 * The section list itself lives in a LAYOUT, picked by slug — see LAYOUTS above.
 */

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = servicePage(slug);
  if (!page) return {};
  return pageMeta({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/services/${slug}`,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = servicePage(slug);
  if (!page) notFound();

  // Index in the register — drives which CraftArtifact the hero mounts, so the
  // page opens on the same object the homepage bento showed for this craft.
  const artifact = services.findIndex((s) => s.slug === slug);
  const Layout = LAYOUTS[slug] ?? DefaultServiceLayout;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: page.hero.h1.em ? `${page.hero.h1.lead} ${page.hero.h1.em}` : page.hero.h1.lead,
        description: page.metaDescription,
        serviceType: services[artifact]?.title,
        url: `https://waheed.in/services/${slug}`,
        provider: {
          '@type': 'Organization',
          name: 'WAHEED',
          url: 'https://waheed.in',
        },
        areaServed: 'Worldwide',
      },
      {
        '@type': 'FAQPage',
        mainEntity: page.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };

  return (
    <SmoothScroll>
      <SectionNav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main>
        <Layout page={page} artifact={artifact} />
      </main>
    </SmoothScroll>
  );
}
