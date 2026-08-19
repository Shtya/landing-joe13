'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowUpRight, Menu, X } from 'lucide-react';

export default function LandingNav({ copy }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const links = [
    { href: '#services', label: copy.nav.services },
    { href: '#work', label: copy.nav.work },
    { href: '#process', label: copy.nav.process },
    { href: '#contact', label: copy.nav.contact },
  ];

  const switchLocale = (next) => {
    const segments = pathname.split('/');
    segments[1] = next;
    router.push(segments.join('/'));
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter,border-color] duration-300 ${
          scrolled
            ? 'border-b border-white/10 bg-black/60 backdrop-blur-2xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-8 md:py-5">
          <a href="#hero" className="flex items-center gap-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.32em] text-zinc-100">
            <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_rgba(212,162,47,0.9)]" />
            Nexus / Systems
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-[11px] uppercase tracking-[0.24em] text-zinc-400 transition-colors hover:text-zinc-100"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex rounded-full border border-white/10 p-0.5 font-mono text-[10px] uppercase tracking-[0.18em]">
              {['en', 'ar'].map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => switchLocale(loc)}
                  className={`px-2.5 py-1 rounded-full ${locale === loc ? 'bg-white/10 text-zinc-100' : 'text-zinc-500'}`}
                >
                  {loc === 'en' ? 'EN' : 'عر'}
                </button>
              ))}
            </div>
            <a
              href="#contact"
              className="group hidden md:inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-100 backdrop-blur-md transition-all duration-200 hover:bg-white/[0.1] active:translate-y-[1px]"
            >
              {copy.nav.cta}
              <ArrowUpRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <button type="button" className="md:hidden p-2 text-zinc-100" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label="Menu">
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-30 bg-[#0a0a0b]/96 flex flex-col items-center justify-center gap-6 md:hidden">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="font-mono text-sm uppercase tracking-[0.28em]">
              {link.label}
            </a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)} className="l1-btn l1-btn-primary mt-2">{copy.nav.cta}</a>
        </div>
      )}
    </>
  );
}
