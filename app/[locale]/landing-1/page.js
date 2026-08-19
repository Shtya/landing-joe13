import LandingOne from '@/components/landing-1/LandingOne';
import { getLandingContent } from '@/components/landing-1/content';
import './landing.css';

export async function generateMetadata({ params: { locale } }) {
  const copy = getLandingContent(locale);
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
  };
}

export default function LandingOnePage() {
  return <LandingOne />;
}
