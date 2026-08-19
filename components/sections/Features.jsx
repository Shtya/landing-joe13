'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

function FeatureRow({ item, index, reverse }) {
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
    <div
      ref={ref}
      className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center py-16 ${
        reverse ? 'lg:py-16' : ''
      }`}
      style={{
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div
        className={reverse ? 'lg:order-2' : ''}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateX(0) scale(1)' : `translateX(${reverse ? '28px' : '-28px'}) scale(0.97)`,
          transition: 'opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1)',
          willChange: 'transform, opacity',
        }}
      >
        <div
          className="text-5xl font-black mb-4 tabular-nums"
          style={{ color: 'var(--color-primary)', opacity: 0.15 }}
        >
          {String(index + 1).padStart(2, '0')}
        </div>
        <h3
          className="font-bold text-2xl mb-4"
          style={{ color: 'var(--color-text)' }}
        >
          {item.title}
        </h3>
        <p className="mb-6 leading-relaxed" style={{ color: 'var(--color-muted)' }}>
          {item.body}
        </p>
        <ul className="space-y-3">
          {item.checks.map((check) => (
            <li key={check} className="flex items-center gap-3 text-sm font-medium" style={{ color: 'var(--color-text)' }}>
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--color-accent)', color: '#fff' }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              {check}
            </li>
          ))}
        </ul>
      </div>

      <div
        className={reverse ? 'lg:order-1' : ''}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateX(0) scale(1)' : `translateX(${reverse ? '-28px' : '28px'}) scale(0.97)`,
          transition: 'opacity 0.65s cubic-bezier(0.16,1,0.3,1) 160ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) 160ms',
          willChange: 'transform, opacity',
        }}
      >
        <FeatureIllustration index={index} />
      </div>
    </div>
  );
}

function FeatureIllustration({ index }) {
  const colors = ['#4DC9D8', '#5DBF96', '#4A9E7A', '#B2DFD8'];
  const c = colors[index % colors.length];

  return (
    <div
      className="rounded-3xl p-8 h-64 flex items-center justify-center relative overflow-hidden"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      <svg viewBox="0 0 300 200" className="w-full h-full">
        {index === 0 && (
          <>
            <rect x="20" y="40" width="260" height="120" rx="12" fill="none" stroke={c} strokeWidth="1.5" opacity="0.3" />
            {[0, 1, 2, 3, 4].map(i => (
              <rect key={i} x={40 + i * 48} y="70" width="32" height={40 + i * 12} rx="4" fill={c} opacity={0.3 + i * 0.1} />
            ))}
            <circle cx="150" cy="40" r="15" fill={c} opacity="0.8" />
            <path d="M140 40 L150 30 L160 40 L155 40 L155 50 L145 50 L145 40 Z" fill="white" opacity="0.9" />
          </>
        )}
        {index === 1 && (
          <>
            <rect x="100" y="20" width="100" height="160" rx="16" fill="none" stroke={c} strokeWidth="2" />
            <rect x="110" y="40" width="80" height="110" rx="8" fill={c} opacity="0.15" />
            <rect x="120" y="55" width="60" height="8" rx="4" fill={c} opacity="0.6" />
            <rect x="120" y="70" width="40" height="8" rx="4" fill={c} opacity="0.4" />
            <rect x="120" y="85" width="50" height="8" rx="4" fill={c} opacity="0.5" />
            <circle cx="150" cy="165" r="5" fill={c} opacity="0.8" />
          </>
        )}
        {index === 2 && (
          <>
            {[0, 1, 2].map(i => (
              <g key={i}>
                <circle cx={80 + i * 70} cy="100" r="30" fill={c} opacity={0.1 + i * 0.05} stroke={c} strokeWidth="1.5" />
                <circle cx={80 + i * 70} cy="100" r="8" fill={c} opacity="0.7" />
              </g>
            ))}
            <line x1="110" y1="100" x2="150" y2="100" stroke={c} strokeWidth="1.5" strokeDasharray="4 3" />
            <line x1="180" y1="100" x2="220" y2="100" stroke={c} strokeWidth="1.5" strokeDasharray="4 3" />
          </>
        )}
        {index === 3 && (
          <>
            <rect x="60" y="50" width="180" height="100" rx="12" fill="none" stroke={c} strokeWidth="2" />
            <rect x="75" y="65" width="150" height="70" rx="8" fill={c} opacity="0.1" />
            <path d="M75 80 L130 60 L180 80 L225 65 L225 120 L75 120 Z" fill={c} opacity="0.2" />
            <circle cx="150" cy="50" r="16" fill={c} />
            <path d="M144 50 L148 54 L158 44" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
          </>
        )}
      </svg>
    </div>
  );
}

export default function Features() {
  const t = useTranslations('features');
  const items = t.raw('items');

  return (
    <section
      id="features"
      className="section-base py-12 section-with-blur"
      aria-labelledby="features-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'var(--color-overlay)', color: 'var(--color-primary)', border: '1px solid var(--color-primary)' }}
          >
            {t('badge')}
          </div>
          <h2
            id="features-heading"
            className="font-bold"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--color-text)' }}
          >
            {t('headline')}
          </h2>
        </div>

        {items.map((item, i) => (
          <FeatureRow key={i} item={item} index={i} reverse={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}
