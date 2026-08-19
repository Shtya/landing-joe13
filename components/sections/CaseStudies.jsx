'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function CaseStudies() {
  const t = useTranslations('caseStudies');
  const items = t.raw('items');
  const [expanded, setExpanded] = useState(null);

  return (
    <section
      id="case-studies"
      className="section-base py-24 section-with-blur"
      aria-labelledby="case-studies-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'var(--color-overlay)', color: 'var(--color-primary)', border: '1px solid var(--color-primary)' }}
          >
            {t('badge')}
          </div>
          <h2
            id="case-studies-heading"
            className="font-bold"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--color-text)' }}
          >
            {t('headline')}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
              }}
            >
              {/* Accent bar */}
              <div
                className="h-1.5 w-full"
                style={{ background: `linear-gradient(90deg, var(--color-primary), var(--color-accent))` }}
              />

              <div className="p-8">
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full mb-4 inline-block"
                  style={{ background: 'var(--color-overlay)', color: 'var(--color-primary)' }}
                >
                  {item.client}
                </span>

                <h3 className="font-bold text-xl mb-2" style={{ color: 'var(--color-text)' }}>
                  {item.challenge}
                </h3>
                <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                  {item.solution}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {item.stats.map((stat, j) => (
                    <div key={j} className="text-center">
                      <div
                        className="font-black text-2xl mb-1"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        {stat.value}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--color-muted)' }}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className="text-sm font-semibold flex items-center gap-1 transition-all duration-200 hover:gap-2"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {expanded === i ? 'Close' : 'Read full case study'}
                  <span
                    className={`transition-transform duration-300 ${expanded === i ? 'rotate-90' : ''}`}
                  >
                    →
                  </span>
                </button>

                {/* Expanded */}
                {expanded === i && (
                  <div
                    className="mt-6 pt-6 text-sm leading-relaxed"
                    style={{ borderTop: '1px solid var(--color-border)', color: 'var(--color-muted)' }}
                  >
                    <p className="mb-3"><strong style={{ color: 'var(--color-text)' }}>Challenge:</strong> {item.challenge}</p>
                    <p className="mb-3"><strong style={{ color: 'var(--color-text)' }}>Solution:</strong> {item.solution}</p>
                    <p><strong style={{ color: 'var(--color-text)' }}>Outcome:</strong> The results exceeded client expectations across all key metrics, establishing a new performance benchmark in the industry.</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
