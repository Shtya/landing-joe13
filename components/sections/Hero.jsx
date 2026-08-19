'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

export default function Hero() {
  const t = useTranslations('hero');
  const heroRef = useRef(null);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-center items-center text-center px-4"
      aria-labelledby="hero-heading"
      style={{ paddingTop: '80px' }}
    >
      {/* Subtle radial gradient to help text readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, var(--color-overlay) 0%, transparent 70%)',
          zIndex: 0,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto" style={{ animation: 'fadeUp 0.8s ease-out forwards' }}>
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8"
          style={{
            background: 'var(--color-overlay)',
            border: '1px solid var(--color-primary)',
            color: 'var(--color-primary)',
          }}
        >
          {t('badge')}
        </div>

        {/* Headline */}
        <h1 id="hero-heading" className="font-bold mb-6" style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', lineHeight: 1.1 }}>
          <span style={{ color: 'var(--color-text)', display: 'block' }}>{t('headline')}</span>
          <span className="shimmer-text">{t('headlineAccent')}</span>
        </h1>

        {/* Subheadline */}
        <p
          className="text-lg md:text-xl mb-10 max-w-2xl mx-auto"
          style={{ color: 'var(--color-muted)', lineHeight: 1.8 }}
        >
          {t('subheadline')}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-base transition-all duration-200 hover:opacity-90 hover:scale-105 hover:shadow-lg"
            style={{
              background: 'var(--color-primary)',
              color: '#fff',
              boxShadow: '0 4px 30px rgba(46, 107, 116, 0.3)',
            }}
          >
            {t('ctaPrimary')}
            <svg className="ms-2" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </a>
          <a
            href="#portfolio"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-base transition-all duration-200 hover:bg-[var(--color-overlay)]"
            style={{
              border: '1.5px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            {t('ctaSecondary')}
          </a>
        </div>

        {/* Stats cards */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {[
            { stat: t('stat1'), icon: '⚡' },
            { stat: t('stat2'), icon: '🛡' },
            { stat: t('stat3'), icon: '🚀' },
          ].map((item, i) => (
            <div
              key={i}
              className="glass px-6 py-4 rounded-2xl flex items-center gap-3"
              style={{
                animation: 'fadeUp 0.6s ease-out both',
                animationDelay: `${i * 100 + 400}ms`,
              }}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                {item.stat}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60"
        aria-hidden="true"
      >
        <span className="text-xs font-medium tracking-widest uppercase" style={{ color: 'var(--color-muted)' }}>
          Scroll
        </span>
        <div
          className="w-5 h-8 rounded-full border-2 flex items-start justify-center p-1"
          style={{ borderColor: 'var(--color-muted)' }}
        >
          <div
            className="w-1 h-2 rounded-full"
            style={{
              background: 'var(--color-primary)',
              animation: 'float 1.5s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </section>
  );
}
