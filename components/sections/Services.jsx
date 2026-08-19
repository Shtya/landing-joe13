'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

const ICONS = [
  // Web
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
  </svg>,
  // Mobile
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12" y2="18" strokeWidth="3" />
  </svg>,
  // Cloud
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>,
  // AI
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3h-1v1a4 4 0 0 1-8 0v-1H7a3 3 0 0 1-3-3v-2a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4z" /><circle cx="9" cy="10" r="1" fill="currentColor" /><circle cx="15" cy="10" r="1" fill="currentColor" />
  </svg>,
  // DevOps
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" /><polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" />
  </svg>,
  // API
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
  </svg>,
];

export default function Services() {
  const t = useTranslations('services');
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const items = t.raw('items');

  return (
    <section
      id="services"
      ref={ref}
      className="section-base py-24 section-solid"
      aria-labelledby="services-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'var(--color-overlay)', color: 'var(--color-primary)', border: '1px solid var(--color-primary)' }}
          >
            {t('badge')}
          </div>
          <h2
            id="services-heading"
            className="font-bold mb-4"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--color-text)' }}
          >
            {t('headline')}
          </h2>
          <p style={{ color: 'var(--color-muted)' }}>{t('subheadline')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="group p-6 rounded-2xl card-hover cursor-pointer"
              style={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.96)',
                transition: `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms`,
                willChange: 'transform, opacity',
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: 'var(--color-highlight)',
                  color: 'var(--color-primary)',
                }}
              >
                {ICONS[i]}
              </div>

              <span
                className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3"
                style={{ background: 'var(--color-overlay)', color: 'var(--color-primary)' }}
              >
                {item.category}
              </span>

              <h3
                className="font-semibold text-lg mb-2"
                style={{ color: 'var(--color-text)' }}
              >
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-muted)' }}>
                {item.description}
              </p>

              <span
                className="inline-flex items-center gap-1 text-sm font-semibold transition-all duration-200 group-hover:gap-2"
                style={{ color: 'var(--color-primary)' }}
              >
                Explore
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7H11M8 4L11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
