import { DEFAULT_LOCALE, LANG_CODE, LOCALES, localeUrl } from '@/lib/site';

// One URL per locale (the site is a single page; #section links are not
// separate URLs to search engines), each listing its language versions.
export default function sitemap() {
  const languages = {
    ...Object.fromEntries(LOCALES.map(l => [LANG_CODE[l], localeUrl(l)])),
    'x-default': localeUrl(DEFAULT_LOCALE),
  };
  return LOCALES.map(locale => ({
    url: localeUrl(locale),
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: locale === DEFAULT_LOCALE ? 1 : 0.9,
    alternates: { languages },
  }));
}
