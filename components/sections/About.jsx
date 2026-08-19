'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

export default function About() {
  const t = useTranslations('about');
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={ref}
      className="section-base py-24 section-with-blur"
      aria-labelledby="about-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.97)',
              transition: 'opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1)',
              willChange: 'transform, opacity',
            }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
              style={{
                background: 'var(--color-overlay)',
                color: 'var(--color-primary)',
                border: '1px solid var(--color-primary)',
              }}
            >
              {t('badge')}
            </div>
            <h2
              id="about-heading"
              className="font-bold mb-6"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--color-text)', lineHeight: 1.2 }}
            >
              {t('headline')}
            </h2>
            <p className="text-base mb-8 leading-relaxed" style={{ color: 'var(--color-muted)' }}>
              {t('body')}
            </p>
            <div className="flex flex-wrap gap-3">
              {[t('pill1'), t('pill2'), t('pill3')].map((pill) => (
                <span
                  key={pill}
                  className="px-4 py-2 rounded-full text-sm font-semibold"
                  style={{
                    background: 'var(--color-highlight)',
                    color: 'var(--color-primary)',
                  }}
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>

          {/* Abstract visual */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.97)',
              transition: 'opacity 0.65s cubic-bezier(0.16,1,0.3,1) 160ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) 160ms',
              willChange: 'transform, opacity',
            }}
          >
            <AbstractVisual />
          </div>
        </div>
      </div>
    </section>
  );
}

function AbstractVisual() {
  return (
    <div className="relative h-72 lg:h-96 flex items-center justify-center">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full max-w-sm"
        style={{ filter: 'drop-shadow(0 0 30px rgba(77,201,216,0.3))' }}
      >
        {/* Rotating outer ring */}
        <circle
          cx="200" cy="200" r="160"
          stroke="var(--color-border)"
          strokeWidth="1"
          fill="none"
          strokeDasharray="6 4"
          style={{ animation: 'spin-slow 20s linear infinite', transformOrigin: '200px 200px' }}
        />
        {/* Middle ring */}
        <circle
          cx="200" cy="200" r="110"
          stroke="var(--color-primary)"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="10 5"
          opacity="0.6"
          style={{ animation: 'spin-slow 12s linear infinite reverse', transformOrigin: '200px 200px' }}
        />
        {/* Inner hexagon */}
        <polygon
          points="200,130 255,162 255,230 200,262 145,230 145,162"
          stroke="var(--color-accent)"
          strokeWidth="2"
          fill="none"
          opacity="0.8"
          style={{ animation: 'spin-slow 8s linear infinite', transformOrigin: '200px 200px' }}
        />
        {/* Center */}
        <circle cx="200" cy="200" r="20" fill="var(--color-primary)" opacity="0.9" />
        <circle cx="200" cy="200" r="12" fill="var(--color-accent)" />

        {/* Orbit dots */}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const x = 200 + 110 * Math.cos(rad);
          const y = 200 + 110 * Math.sin(rad);
          return (
            <circle key={i} cx={x} cy={y} r="5" fill="var(--color-primary)" opacity="0.8" />
          );
        })}

        {/* Lines from center to dots */}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const x = 200 + 110 * Math.cos(rad);
          const y = 200 + 110 * Math.sin(rad);
          return (
            <line
              key={i}
              x1="200" y1="200" x2={x} y2={y}
              stroke="var(--color-primary)"
              strokeWidth="0.5"
              opacity="0.3"
            />
          );
        })}
      </svg>
    </div>
  );
}
