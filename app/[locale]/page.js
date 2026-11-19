import JoeRedesign from '@/components/redesign/JoeRedesign';
import { getRedesignContent } from '@/components/redesign/content';
import { fontVariables } from './fonts';
import './redesign.css';

export async function generateMetadata({ params: { locale } }) {
  const copy = getRedesignContent(locale);
  return {
    title: copy.meta.title,
    description: copy.meta.description,
  };
}

export default function HomePage({ params: { locale } }) {
  return <JoeRedesign locale={locale} fontClassName={fontVariables} />;
}
