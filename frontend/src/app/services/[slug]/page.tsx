import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { pageMeta } from '@/lib/seo';
import SmoothScroll from '@/components/motion/SmoothScroll';
import SectionNav from '@/components/motion/useSectionNav';
import ServiceHero from '@/components/service/ServiceHero';
import ServiceProblem from '@/components/service/ServiceProblem';
import ServiceBuild from '@/components/service/ServiceBuild';
import ServiceProcess from '@/components/service/ServiceProcess';
import ServiceOutcomes from '@/components/service/ServiceOutcomes';
import ServicePackages from '@/components/service/ServicePackages';
import ServiceFaq from '@/components/service/ServiceFaq';
import ServiceCta from '@/components/service/ServiceCta';
import { services, pages, servicePage } from '@/content/services';

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
 * Colour rhythm: dark → light → dark → light → dark → light → light → dark. The
 * two adjacent light bands (packages, FAQ) are the quiet run before the close,
 * and are separated by their own top hairline rather than by a colour flip.
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
        <ServiceHero page={page} artifact={artifact} />
        <ServiceProblem page={page} />
        <ServiceBuild page={page} />
        <ServiceProcess page={page} />
        <ServiceOutcomes page={page} />
        <ServicePackages page={page} />
        <ServiceFaq page={page} />
        <ServiceCta page={page} />
      </main>
    </SmoothScroll>
  );
}
