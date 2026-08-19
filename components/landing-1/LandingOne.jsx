'use client';

import { useLocale } from 'next-intl';
import { getLandingContent } from './content';
import LandingNav from './sections/Nav';
import Hero from './sections/Hero';
import Services from './sections/Services';
import Projects from './sections/Projects';
import Stats from './sections/Stats';
import Process from './sections/Process';
import TechStack from './sections/TechStack';
import Testimonials from './sections/Testimonials';
import Cta from './sections/Cta';
import Footer from './sections/Footer';

export default function LandingOne() {
  const locale = useLocale();
  const copy = getLandingContent(locale);

  return (
    <div className="landing-1 grain min-h-screen" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <LandingNav copy={copy} />
      <main>
        <Hero copy={copy} />
        <Services copy={copy} />
        <Projects copy={copy} />
        <Stats copy={copy} />
        <Process copy={copy} />
        <TechStack copy={copy} />
        <Testimonials copy={copy} />
        <Cta copy={copy} />
      </main>
      <Footer copy={copy} />
    </div>
  );
}
