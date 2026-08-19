'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import Accordion from '../ui/Accordion'

const faqs = [
  'timeline', 'techStack', 'pricing', 'support',
  'integrations', 'security', 'revisions', 'ownership',
]

export default function FAQ() {
  const t = useTranslations('faq')
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const filtered = faqs.filter(key =>
    !query ||
    t(`items.${key}.q`).toLowerCase().includes(query.toLowerCase()) ||
    t(`items.${key}.a`).toLowerCase().includes(query.toLowerCase())
  )

  const items = filtered.map(key => ({
    question: t(`items.${key}.q`),
    answer:   t(`items.${key}.a`),
  }))

  const spring = (delay = 0) =>
    `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms`

  const revealStyle = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
    transition: spring(delay),
    willChange: 'transform, opacity',
  })

  return (
    <section
      id="faq"
      ref={ref}
      className="section-base py-28 section-solid"
    >
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12" style={revealStyle(0)}>
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ background: 'var(--color-overlay)', color: 'var(--color-primary)', border: '1px solid var(--color-primary)' }}
          >
            {t('badge')}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
            {t('title')}
          </h2>
          <p className="text-lg" style={{ color: 'var(--color-muted)' }}>{t('subtitle')}</p>
        </div>

        {/* Search */}
        <div className="mb-8" style={revealStyle(150)}>
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: 'var(--color-muted)' }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
              style={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
          </div>
        </div>

        {/* Accordion */}
        <div style={revealStyle(260)}>
          {items.length > 0 ? (
            <Accordion items={items} />
          ) : (
            <p className="text-center py-8" style={{ color: 'var(--color-muted)' }}>
              {t('noResults')}
            </p>
          )}
        </div>

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map(key => ({
                '@type': 'Question',
                name: t(`items.${key}.q`),
                acceptedAnswer: { '@type': 'Answer', text: t(`items.${key}.a`) },
              })),
            }),
          }}
        />
      </div>
    </section>
  )
}
