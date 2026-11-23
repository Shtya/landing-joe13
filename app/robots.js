import { SITE_URL } from '@/lib/site';

export default function robots() {
  return {
    // /[locale]/temp is not blocked here on purpose: it carries noindex, which
    // crawlers can only see if they are allowed to fetch it.
    rules: { userAgent: '*', allow: '/', disallow: ['/api/'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
