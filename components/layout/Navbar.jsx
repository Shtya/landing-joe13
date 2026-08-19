'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import ThemeToggle from '@/components/ui/ThemeToggle';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navLinks = [
    { key: 'services', href: '#services' },
    { key: 'work', href: '#portfolio' },
    { key: 'about', href: '#about' },
    { key: 'contact', href: '#contact' },
  ];

  const switchLocale = (newLocale) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  return (
    <>
      <header
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[var(--color-background)] backdrop-blur-md border-b border-[var(--color-border)] shadow-sm'
            : 'bg-transparent'
        }`}
        style={{ backdropFilter: scrolled ? 'blur(20px)' : 'none' }}
      >
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-2 group">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="var(--color-primary)" strokeWidth="2" />
              <path d="M8 16 L16 8 L24 16 L16 24 Z" stroke="var(--color-primary)" strokeWidth="1.5" fill="none" />
              <circle cx="16" cy="16" r="3" fill="var(--color-primary)" />
              <circle cx="16" cy="8" r="1.5" fill="var(--color-accent)" />
              <circle cx="24" cy="16" r="1.5" fill="var(--color-accent)" />
              <circle cx="16" cy="24" r="1.5" fill="var(--color-accent)" />
              <circle cx="8" cy="16" r="1.5" fill="var(--color-accent)" />
            </svg>
            <span className="font-bold text-xl tracking-tight" style={{ color: 'var(--color-text)' }}>
              Nexus
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="text-sm font-medium transition-colors duration-200 hover:text-[var(--color-primary)]"
                style={{ color: 'var(--color-muted)' }}
              >
                {t(link.key)}
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <div className="hidden sm:flex items-center gap-1 text-xs font-medium">
              <button
                onClick={() => switchLocale('en')}
                className={`px-2 py-1 rounded transition-all ${
                  locale === 'en'
                    ? 'text-[var(--color-primary)] font-semibold'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                EN
              </button>
              <span style={{ color: 'var(--color-border)' }}>|</span>
              <button
                onClick={() => switchLocale('ar')}
                className={`px-2 py-1 rounded transition-all ${
                  locale === 'ar'
                    ? 'text-[var(--color-primary)] font-semibold'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                AR
              </button>
            </div>

            <ThemeToggle />

            <a
              href="#contact"
              className="hidden md:flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:scale-105"
              style={{
                background: 'var(--color-primary)',
                color: '#fff',
              }}
            >
              {t('getStarted')}
            </a>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              style={{ color: 'var(--color-text)' }}
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span
                  className={`block h-0.5 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}
                  style={{ background: 'var(--color-text)' }}
                />
                <span
                  className={`block h-0.5 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}
                  style={{ background: 'var(--color-text)' }}
                />
                <span
                  className={`block h-0.5 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
                  style={{ background: 'var(--color-text)' }}
                />
              </div>
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        navLinks={navLinks}
        locale={locale}
        onSwitchLocale={switchLocale}
      />
    </>
  );
}
