'use client';

import { useTranslations } from 'next-intl';
import { useState, useRef, useEffect } from 'react';

const GRADIENTS = [
  'linear-gradient(135deg, #2E6B74, #4DC9D8)',
  'linear-gradient(135deg, #4A9E7A, #5DBF96)',
  'linear-gradient(135deg, #1E4A52, #4DC9D8)',
  'linear-gradient(135deg, #2E6B74, #4A9E7A)',
  'linear-gradient(135deg, #0C1416, #2E6B74)',
  'linear-gradient(135deg, #4A9E7A, #B2DFD8)',
];

export default function Portfolio() {
  const t = useTranslations('portfolio');
  const filters = t.raw('filters');
  const items = t.raw('items');
  const [active, setActive] = useState(0);
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

  const filtered = active === 0
    ? items
    : items.filter(item => item.tag === filters[active]);

  return (
    <section
      id="portfolio"
      ref={ref}
      className="section-base py-24 section-solid"
      aria-labelledby="portfolio-heading"
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
            id="portfolio-heading"
            className="font-bold"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--color-text)' }}
          >
            {t('headline')}
          </h2>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {filters.map((filter, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
              style={{
                background: active === i ? 'var(--color-primary)' : 'var(--color-surface)',
                color: active === i ? '#fff' : 'var(--color-muted)',
                border: `1px solid ${active === i ? 'var(--color-primary)' : 'var(--color-border)'}`,
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, i) => (
            <div
              key={`${item.title}-${i}`}
              className="group rounded-2xl overflow-hidden card-hover cursor-pointer"
              style={{
                border: '1px solid var(--color-border)',
                background: 'var(--color-card)',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.96)',
                transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 70}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 70}ms`,
                willChange: 'transform, opacity',
              }}
            >
              {/* Image placeholder */}
              <div
                className="relative h-44 overflow-hidden"
                style={{ background: GRADIENTS[i % GRADIENTS.length] }}
              >
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                  style={{ background: 'rgba(0,0,0,0.5)' }}
                >
                  <span
                    className="px-4 py-2 rounded-full text-sm font-semibold text-white"
                    style={{ border: '1.5px solid rgba(255,255,255,0.6)' }}
                  >
                    View Case →
                  </span>
                </div>
                <div className="absolute top-3 start-3">
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{ background: 'rgba(0,0,0,0.4)', color: '#fff' }}
                  >
                    {item.tag}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--color-text)' }}>
                  {item.title}
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
