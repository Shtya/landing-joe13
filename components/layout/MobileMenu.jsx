'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

export default function MobileMenu({ open, onClose, navLinks, locale, onSwitchLocale }) {
  const t = useTranslations('nav');

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <div
      className={`fixed inset-0 z-40 transition-all duration-300 md:hidden ${
        open ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: 'rgba(0,0,0,0.5)' }}
        onClick={onClose}
      />

      {/* Slide-down panel */}
      <div
        className={`absolute top-0 left-0 right-0 transition-transform duration-300 ${
          open ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{
          background: 'var(--color-background)',
          borderBottom: '1px solid var(--color-border)',
          paddingTop: '4rem',
        }}
      >
        <div className="px-6 py-8 flex flex-col gap-6">
          {navLinks.map((link, i) => (
            <a
              key={link.key}
              href={link.href}
              onClick={onClose}
              className="text-xl font-semibold transition-colors hover:text-[var(--color-primary)]"
              style={{
                color: 'var(--color-text)',
                animationDelay: `${i * 50}ms`,
              }}
            >
              {t(link.key)}
            </a>
          ))}

          <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <button
              onClick={() => { onSwitchLocale('en'); onClose(); }}
              className={`px-3 py-1.5 rounded text-sm font-medium ${
                locale === 'en' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-muted)]'
              }`}
            >
              English
            </button>
            <button
              onClick={() => { onSwitchLocale('ar'); onClose(); }}
              className={`px-3 py-1.5 rounded text-sm font-medium ${
                locale === 'ar' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-muted)]'
              }`}
            >
              العربية
            </button>
          </div>

          <a
            href="#contact"
            onClick={onClose}
            className="w-full text-center px-6 py-3 rounded-full font-semibold text-white"
            style={{ background: 'var(--color-primary)' }}
          >
            {t('getStarted')}
          </a>
        </div>
      </div>
    </div>
  );
}
