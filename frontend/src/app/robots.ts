import type { MetadataRoute } from 'next';

// Allow crawling the public site; keep bots out of the admin panel, the API,
// and the preview-only gates. Points crawlers at the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/jundullah', '/api/', '/coming-soon', '/maintenance'],
    },
    sitemap: 'https://waheed.in/sitemap.xml',
    host: 'https://waheed.in',
  };
}
