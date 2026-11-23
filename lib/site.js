// Public origin of the site, used for canonical URLs, hreflang, the sitemap
// and share links. Override per environment with NEXT_PUBLIC_SITE_URL.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://software.joe13th.com').replace(/\/+$/, '');

export const LOCALES = ['en', 'ar'];
export const DEFAULT_LOCALE = 'en';

// One code per locale, shared by <html lang>, hreflang and the sitemap.
export const LANG_CODE = { en: 'en', ar: 'ar' };

export const localeUrl = locale => `${SITE_URL}/${locale}`;
