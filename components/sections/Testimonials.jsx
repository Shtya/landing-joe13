'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

export default function Testimonials() {
  const t = useTranslations('testimonials');
  const items = t.raw('items');
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % items.length);
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, [items.length]);

  return (
    <section
      id="testimonials"
      className="section-base py-24 section-solid"
      aria-labelledby="testimonials-heading"
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
            id="testimonials-heading"
            className="font-bold"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--color-text)' }}
          >
            {t('headline')}
          </h2>
        </div>

        {/* Carousel */}
        <div className="relative overflow-hidden">
          {/* Gradient fades */}
          <div
            className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, var(--color-background), transparent)' }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, var(--color-background), transparent)' }}
          />

          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(calc(-${current} * (100% / 3) - ${current} * 1.5rem / 3))` }}
          >
            {[...items, ...items].map((item, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 px-3"
              >
                <div
                  className="p-6 rounded-2xl h-full"
                  style={{
                    background: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, s) => (
                      <svg key={s} width="14" height="14" viewBox="0 0 14 14" fill="var(--color-warning)">
                        <path d="M7 1L8.8 5.1H13.2L9.7 7.7L11 12L7 9.3L3 12L4.3 7.7L0.8 5.1H5.2L7 1Z" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote */}
                  <p
                    className="text-sm leading-relaxed mb-6 italic"
                    style={{ color: 'var(--color-text)' }}
                  >
                    "{item.quote}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ background: 'var(--color-primary)', color: '#fff' }}
                    >
                      {item.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                        {item.name}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--color-muted)' }}>
                        {item.role} · {item.company}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); clearInterval(timerRef.current); }}
              className="rounded-full transition-all duration-300"
              style={{
                width: current === i ? '24px' : '8px',
                height: '8px',
                background: current === i ? 'var(--color-primary)' : 'var(--color-border)',
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
