import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import '../globals.css';

const locales = ['en', 'ar'];

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export async function generateMetadata({ params: { locale } }) {
  const isAr = locale === 'ar';
  return {
    title: isAr ? 'نيكسوس | هندسة برمجيات متطورة' : 'Nexus | Premium Software Engineering',
    description: isAr
      ? 'نيكسوس تبني تطبيقات ويب وجوال وبنى تحتية سحابية عالمية المستوى.'
      : 'Nexus builds world-class web apps, mobile applications, and cloud infrastructure that scale to millions.',
    keywords: isAr
      ? ['برمجيات', 'تطوير ويب', 'تطبيقات جوال', 'ذكاء اصطناعي', 'بنية سحابية']
      : ['software engineering', 'web development', 'mobile apps', 'AI integration', 'cloud infrastructure'],
    authors: [{ name: 'Nexus Dev Team' }],
    openGraph: {
      type: 'website',
      locale: isAr ? 'ar_SA' : 'en_US',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}`,
      title: isAr ? 'نيكسوس | هندسة برمجيات متطورة' : 'Nexus | Premium Software Engineering',
      description: isAr
        ? 'نيكسوس تبني برمجيات عالمية المستوى.'
        : 'We build world-class software that scales to millions.',
      siteName: 'Nexus',
    },
    twitter: {
      card: 'summary_large_image',
      title: isAr ? 'نيكسوس | هندسة برمجيات متطورة' : 'Nexus | Premium Software Engineering',
      description: isAr
        ? 'نيكسوس تبني برمجيات عالمية المستوى.'
        : 'We build world-class software that scales to millions.',
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}`,
      languages: {
        'en': `${process.env.NEXT_PUBLIC_SITE_URL}/en`,
        'ar': `${process.env.NEXT_PUBLIC_SITE_URL}/ar`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({ children, params: { locale } }) {
  if (!locales.includes(locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();
  const isRTL = locale === 'ar';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Nexus Dev',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    description: 'Premium software engineering company',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hello@nexus.dev',
      contactType: 'customer service',
    },
  };

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
