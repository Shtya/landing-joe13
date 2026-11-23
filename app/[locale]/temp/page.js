import LandingTwo from '@/components/landing-2/LandingTwo';
import { getLandingTwoContent } from '@/components/landing-2/content';
import './tailwind.css';
import './landing.css';
import { localeUrl } from '@/lib/site';

export async function generateMetadata({ params: { locale } }) {
  const copy = getLandingTwoContent(locale);
  // Old landing kept for reference: out of search, canonical to the live home.
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: { canonical: localeUrl(locale) },
    robots: { index: false, follow: false },
  };
}

// These fonts used to load in the shared layout; they belong to this page only,
// so the home page no longer pays for a render-blocking stylesheet.
const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Cairo:wght@400;500;600;700&display=swap';

export default function TempPage() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={FONTS_HREF} precedence="default" />
      <LandingTwo />
    </>
  );
}
