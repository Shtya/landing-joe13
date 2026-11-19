import JoeRedesign from '@/components/redesign/JoeRedesign';
import { getRedesignContent } from '@/components/redesign/content';
import { fontVariables } from './fonts';
import './redesign.css';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || '';

export async function generateMetadata({ params: { locale } }) {
  const copy = getRedesignContent(locale);
  const { title, description, ogAlt } = copy.meta;
  const url = `${SITE}/${locale}`;
  return {
    metadataBase: new URL(SITE || 'http://localhost:3000'),
    title,
    description,
    applicationName: copy.brand,
    authors: [{ name: copy.brand }],
    openGraph: {
      type: 'website',
      siteName: copy.brand,
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      alternateLocale: locale === 'ar' ? ['en_US'] : ['ar_SA'],
      url,
      title,
      description,
      images: [{ url: '/logos/logo-white.png', width: 300, height: 101, alt: ogAlt }],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/logos/logo-white.png'] },
    alternates: {
      canonical: url,
      languages: { en: `${SITE}/en`, ar: `${SITE}/ar`, 'x-default': `${SITE}/en` },
    },
    robots: { index: true, follow: true },
  };
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#03060f' },
    { media: '(prefers-color-scheme: light)', color: '#f4f6fb' },
  ],
  colorScheme: 'dark light',
};

export default function HomePage({ params: { locale } }) {
  return <JoeRedesign locale={locale} fontClassName={fontVariables} />;
}
