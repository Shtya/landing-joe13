import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import '../globals.css';
import { getRedesignContent } from '@/components/redesign/content';
import { LANG_CODE, LOCALES as locales, SITE_URL } from '@/lib/site';

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

// Site-wide defaults. Each page sets its own title, description, canonical,
// hreflang and share card (see app/[locale]/page.js). Favicons come from
// app/favicon.ico, app/icon.png and app/apple-icon.png.
export const metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: 'JOE13',
  manifest: '/manifest.webmanifest',
  formatDetection: { telephone: false, email: false, address: false },
};

// Organization + WebSite structured data, built from the same content the
// page shows so the two never disagree.
function structuredData(locale) {
  const copy = getRedesignContent(locale);
  // Skip template placeholders (hello@nexus.dev, +966-XXX-XXX) so search
  // engines never get fake contact details.
  const channel = icon => {
    const value = copy.contact.channels.find(ch => ch.icon === icon)?.value;
    return value && !/nexus\.dev|X{3}/i.test(value) ? value : undefined;
  };
  const sameAs = copy.footer.socials.map(so => so.href).filter(href => /^https?:\/\//.test(href || ''));
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: copy.brand,
        url: SITE_URL,
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon-512.png`, width: 512, height: 512 },
        image: `${SITE_URL}/og-image.png`,
        description: copy.meta.description,
        slogan: copy.tagline,
        email: channel('mail') || undefined,
        telephone: channel('phone') || undefined,
        address: channel('pin') ? { '@type': 'PostalAddress', streetAddress: channel('pin'), addressCountry: 'SA' } : undefined,
        // "Across the Gulf, Egypt, and the wider region" (Impact section).
        areaServed: ['Saudi Arabia', 'United Arab Emirates', 'Kuwait', 'Qatar', 'Bahrain', 'Oman', 'Egypt'].map(name => ({ '@type': 'Country', name })),
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: copy.brand,
        inLanguage: locales.map(l => LANG_CODE[l]),
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  };
}

export default async function LocaleLayout({ children, params: { locale } }) {
  if (!locales.includes(locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();
  const isRTL = locale === 'ar';

  const jsonLd = structuredData(locale);

  return (
    <html lang={LANG_CODE[locale] || locale} dir={isRTL ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var root = document.documentElement;
                var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                var stored = localStorage.getItem('theme');
                if (stored === 'dark' || (!stored && prefersDark)) root.classList.add('dark');
                // Home page theme: saved choice, else the system preference. Set before
                // first paint so the page never flashes the wrong theme.
                var j13 = localStorage.getItem('j13-theme');
                root.setAttribute('data-theme', j13 === 'light' || j13 === 'dark' ? j13 : (prefersDark ? 'dark' : 'light'));
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
