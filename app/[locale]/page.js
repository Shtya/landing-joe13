import LandingTwo from '@/components/landing-2/LandingTwo';
import { getLandingTwoContent } from '@/components/landing-2/content';
import './landing-2/landing.css';

export async function generateMetadata({ params: { locale } }) {
  const copy = getLandingTwoContent(locale);
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
  };
}

export default function HomePage() {
  return <LandingTwo />;
}
