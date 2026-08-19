'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { ArrowIcon } from '../ui';
import { useActiveSection } from '../hooks';

const NAV_LINK =
  'relative flex items-center whitespace-nowrap text-[0.92rem] font-medium text-[#f2f2f5] no-underline transition-colors duration-200 hover:text-[#00a4ff]';

const BTN_PRIMARY =
  'relative inline-flex h-[46px] w-fit min-w-0 cursor-pointer items-center justify-center overflow-hidden rounded-3xl border-0 bg-[var(--l2-btn-gradient)] pe-[46px] ps-4 text-[0.9rem] font-medium leading-none text-white no-underline shadow-[0_8px_28px_rgba(0,106,255,0.25),inset_0_1px_1px_rgba(255,255,255,0.35)] transition-[transform,box-shadow,filter] duration-[250ms] hover:-translate-y-0.5 hover:brightness-[1.06] hover:shadow-[0_12px_34px_rgba(0,106,255,0.38),inset_0_1px_1px_rgba(255,255,255,0.4)]';

const BTN_ARROW =
  'absolute end-1.5 grid h-[34px] w-[34px] place-items-center rounded-full bg-[#f8f9ff] text-[#4d42ff]';

export default function LandingNav({ copy }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const sectionIds = ['hero', 'services', 'process', 'about', 'work', 'contact'];
  const links = [
    { href: '#hero', id: 'hero', label: copy.nav.home },
    { href: '#services', id: 'services', label: copy.nav.services },
    { href: '#process', id: 'process', label: copy.nav.process },
    { href: '#about', id: 'about', label: copy.nav.about },
    { href: '#work', id: 'work', label: copy.nav.work },
    { href: '#contact', id: 'contact', label: copy.nav.contact },
  ];
  const active = useActiveSection(sectionIds);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastY;

      if (currentY <= 24) {
        setHidden(false);
      } else if (delta > 8 && !open) {
        setHidden(true);
      } else if (delta < -8) {
        setHidden(false);
      }

      lastY = currentY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [open]);

  const switchLocale = (next) => {
    const segments = pathname.split('/');
    segments[1] = next;
    router.push(segments.join('/'));
  };

  return (
    <>
      <header
        className={`fixed left-1/2 top-3.5 z-40 flex h-[76px] w-[calc(100%-var(--l2-gutter)*2)] -translate-x-1/2 items-center gap-[18px] rounded-[22px] border border-[rgba(106,140,185,0.22)] bg-[linear-gradient(180deg,rgba(6,13,24,0.82),rgba(3,9,18,0.7)),radial-gradient(circle_at_18%_15%,rgba(10,154,255,0.12),transparent_28%)] px-5 ps-[18px] shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_16px_40px_rgba(0,0,0,0.26),0_0_0_1px_rgba(10,123,255,0.03)] backdrop-blur-[20px] backdrop-saturate-150 transition-[transform,opacity,top,box-shadow] duration-[280ms] max-[800px]:top-2.5 max-[800px]:h-[68px] max-[800px]:w-[calc(100%-1rem)] max-[800px]:rounded-[18px] max-[800px]:px-4 max-[800px]:ps-4 ${
          hidden ? '-translate-x-1/2 -translate-y-[140%] opacity-0 pointer-events-none' : ''
        }`}
      >
        <a href="#hero" className="flex min-w-0 shrink-0 items-center gap-[13px] text-inherit no-underline" aria-label={copy.brand}>
          <span className="relative block h-[38px] w-[132px] shrink-0 max-[800px]:h-[34px] max-[800px]:w-[116px]">
            <Image
              src="/logos/logo-white.png"
              alt={copy.brand}
              fill
              sizes="140px"
              priority
              className="object-contain"
            />
          </span>
        </a>

        <nav className="hidden h-full flex-1 items-stretch justify-center gap-[clamp(0.9rem,2.2vw,1.8rem)] max-[1100px]:gap-[1.2rem] min-[901px]:flex" aria-label="Main">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`${NAV_LINK} ${active === link.id ? 'text-[#00a4ff] after:absolute after:inset-x-[10%] after:bottom-[18px] after:h-0.5 after:rounded-full after:bg-[linear-gradient(90deg,#00b9ff,#13ddff)] after:shadow-[0_0_8px_rgba(0,196,255,0.5)] after:content-[\'\']' : ''}`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <div
            className="relative isolate hidden rounded-full border border-[rgba(123,157,202,0.28)] bg-[rgba(4,11,20,0.55)] p-[3px] min-[901px]:flex"
            role="group"
            aria-label="Language"
          >
            <span
              className={`absolute bottom-[3px] top-[3px] left-[3px] z-0 w-[calc((100%-6px)/2)] rounded-full bg-[linear-gradient(135deg,rgba(9,136,255,0.28),rgba(108,50,255,0.22))] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_4px_14px_rgba(7,140,255,0.16)] transition-[transform,background,box-shadow] duration-[280ms] ${locale === 'ar' ? 'translate-x-full' : ''}`}
              aria-hidden="true"
            />
            {['en', 'ar'].map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => switchLocale(loc)}
                className={`relative z-[1] cursor-pointer rounded-full border-0 bg-transparent px-[0.62rem] py-[0.36rem] font-[inherit] text-[0.68rem] font-semibold tracking-[0.08em] ${locale === loc ? 'text-[var(--l2-white)]' : 'text-[#8b95a8]'}`}
              >
                {loc === 'en' ? 'EN' : 'عر'}
              </button>
            ))}
          </div>
          <a className={BTN_PRIMARY} href="#contact">
            {copy.nav.contactCta}
            <span className={BTN_ARROW}>
              <ArrowIcon />
            </span>
          </a>
          <button
            type="button"
            className="hidden h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[rgba(123,157,202,0.28)] bg-[rgba(2,8,16,0.5)] text-[var(--l2-white)] max-[900px]:inline-flex"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {open && (
        <nav className="fixed inset-x-0 top-0 z-[39] flex flex-col gap-[1.1rem] border-b border-[rgba(101,127,162,0.18)] bg-[rgba(2,7,15,0.96)] px-[var(--l2-gutter)] pb-6 pt-[5.3rem] min-[901px]:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-[1.15rem] font-medium no-underline ${active === link.id ? 'text-[#00a4ff]' : 'text-[#f2f2f5]'}`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </>
  );
}
