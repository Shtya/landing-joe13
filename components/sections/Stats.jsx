'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import CountUp from '@/components/ui/CountUp';

export default function Stats() {
  const t = useTranslations('stats');
  const items = t.raw('items');
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="section-base py-24 relative overflow-hidden"
      style={{
        background: 'var(--color-primary)',
      }}
      aria-labelledby="stats-heading"
    >
      {/* Background particles (CSS) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${4 + Math.random() * 8}px`,
              height: `${4 + Math.random() * 8}px`,
              background: 'rgba(255,255,255,0.1)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2
          id="stats-heading"
          className="text-center font-bold mb-12 text-white"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', opacity: 0.9 }}
        >
          {t('headline')}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <div
              key={i}
              className="text-center"
              style={{
                opacity: started ? 1 : 0,
                transform: started ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
                transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 100}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 100}ms`,
                willChange: 'transform, opacity',
              }}
            >
              <div
                className="font-black mb-2 text-white tabular-nums"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1 }}
              >
                <CountUp end={item.value} suffix={item.suffix} start={started} />
              </div>
              <div className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
