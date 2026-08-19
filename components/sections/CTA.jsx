'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

export default function CTA() {
  const t = useTranslations('cta')
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const spring = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)'

  return (
    <section
      id="cta"
      ref={ref}
      className="section-base relative py-40 overflow-hidden section-with-blur"
    >
      {/* Grid texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Radial glow behind content */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, var(--color-overlay) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        {/* Badge */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.96)',
            transition: spring,
            willChange: 'transform, opacity',
          }}
        >
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
            style={{ background: 'var(--color-overlay)', color: 'var(--color-primary)', border: '1px solid var(--color-primary)' }}
          >
            {t('badge')}
          </span>

          <h2
            className="text-5xl md:text-6xl font-black mb-6 leading-tight"
            style={{ color: 'var(--color-text)' }}
          >
            {t('title')}
            <span className="block shimmer-text">{t('titleHighlight')}</span>
          </h2>

          <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: 'var(--color-muted)' }}>
            {t('subtitle')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:scale-95"
              style={{ background: 'var(--color-primary)', boxShadow: '0 4px 20px var(--color-overlay)' }}
            >
              {t('primaryCta')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="#portfolio"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:-translate-y-1 active:scale-95"
              style={{ border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
            >
              {t('secondaryCta')}
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6" style={{ color: 'var(--color-muted)' }}>
            {[t('trust1'), t('trust2'), t('trust3')].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
