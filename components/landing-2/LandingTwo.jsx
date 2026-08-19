'use client';

import { useLocale } from 'next-intl';
import { getLandingTwoContent } from './content';
import LandingNav from './sections/Nav';
import Hero from './sections/Hero';
import Partnerships from './sections/Partnerships';
import Services from './sections/Services';
import Process from './sections/Process';
import About from './sections/About';
import Work from './sections/Work';
import Testimonials from './sections/Testimonials';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

const DIVIDER_BASE =
  "relative z-[8] -mb-px -mt-px h-[clamp(72px,9vw,140px)] overflow-hidden before:pointer-events-none before:absolute before:left-[-8%] before:w-[116%] before:content-[''] after:pointer-events-none after:absolute after:left-[-8%] after:w-[116%] after:content-['']";

const DIVIDER_LIGHT_DARK = `${DIVIDER_BASE} bg-[linear-gradient(to_bottom,#fbfcff_0%,#fafbff_8%,#f7f9fe_16%,#eff3fa_28%,#dde4ef_42%,#c1cad9_56%,#97a2b5_68%,#657188_79%,#313c52_89%,#121b2d_96%,#00040a_100%),radial-gradient(460px_140px_at_50%_8%,rgba(255,255,255,0.16),transparent_72%),radial-gradient(520px_190px_at_50%_0%,rgba(36,93,255,0.035),transparent_75%)] before:-top-4 before:h-[52%] before:bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.92),rgba(255,255,255,0.22)_58%,transparent_100%)] before:opacity-95 before:blur-2xl after:-bottom-[22px] after:h-[44%] after:bg-[radial-gradient(ellipse_at_50%_100%,rgba(3,11,24,0.95),rgba(3,11,24,0.38)_55%,transparent_100%)] after:opacity-[0.88] after:blur-[24px]`;

const DIVIDER_DARK_LIGHT = `${DIVIDER_BASE} bg-[linear-gradient(to_bottom,#00040a_0%,#07101b_8%,#121d2f_18%,#263146_32%,#4b576d_47%,#7f8a9e_61%,#b4bece_74%,#dbe3ef_86%,#f0f4fb_95%,#fbfcff_100%),radial-gradient(460px_140px_at_50%_92%,rgba(255,255,255,0.14),transparent_72%),radial-gradient(520px_190px_at_50%_100%,rgba(36,93,255,0.03),transparent_75%)] before:-top-[22px] before:h-[44%] before:bg-[radial-gradient(ellipse_at_50%_0%,rgba(3,11,24,0.94),rgba(3,11,24,0.36)_55%,transparent_100%)] before:opacity-90 before:blur-[24px] after:-bottom-4 after:h-[52%] after:bg-[radial-gradient(ellipse_at_50%_100%,rgba(255,255,255,0.9),rgba(255,255,255,0.2)_58%,transparent_100%)] after:opacity-[0.92] after:blur-2xl`;

function SectionDivider({ variant, hidden = false }) {
  if (hidden) return null;
  return (
    <div
      className={variant === 'light-dark' ? DIVIDER_LIGHT_DARK : DIVIDER_DARK_LIGHT}
      aria-hidden="true"
    />
  );
}

export default function LandingTwo() {
  const locale = useLocale();
  const copy = getLandingTwoContent(locale);

  return (
    <div
      className="landing-2 relative min-h-screen bg-[#00040a] font-[Inter,'Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif] text-[var(--l2-white)] antialiased rtl:font-[Cairo,Inter,ui-sans-serif,system-ui,sans-serif]"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <LandingNav copy={copy} />
      <main className="[&>#hero~*]:relative [&>#hero~*]:z-[8]">
        <Hero copy={copy} />
        <SectionDivider variant="dark-light" hidden />
        <Services copy={copy} />
        <SectionDivider variant="light-dark" />
        <Partnerships />
        <SectionDivider variant="dark-light" />
        <Process copy={copy} />
        <SectionDivider variant="light-dark" />
        <About copy={copy} />
        <SectionDivider variant="dark-light" />
        <Work copy={copy} />
        <SectionDivider variant="light-dark" />
        <Testimonials copy={copy} />
        <SectionDivider variant="dark-light" />
        <Contact copy={copy} />
        <SectionDivider variant="light-dark" />
        <Footer copy={copy} />
      </main>
    </div>
  );
}
