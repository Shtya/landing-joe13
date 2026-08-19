'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

export default function Process() {
  const t = useTranslations('process');
  const steps = t.raw('steps');
  const ref = useRef(null);
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          steps.forEach((_, i) => {
            setTimeout(() => setActiveStep(i), i * 300);
          });
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="process"
      ref={ref}
      className="section-base py-24 section-solid"
      aria-labelledby="process-heading"
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
            id="process-heading"
            className="font-bold"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--color-text)' }}
          >
            {t('headline')}
          </h2>
        </div>

        {/* Desktop stepper */}
        <div className="hidden md:block relative">
          {/* Connector line */}
          <div
            className="absolute top-10 left-0 right-0 h-0.5 mx-16"
            style={{ background: 'var(--color-border)' }}
          >
            <div
              className="h-full transition-all duration-1000"
              style={{
                background: 'var(--color-primary)',
                width: activeStep >= 0 ? `${((activeStep + 1) / steps.length) * 100}%` : '0%',
              }}
            />
          </div>

          <div className="grid grid-cols-6 gap-4">
            {steps.map((step, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center transition-all duration-500"
                style={{
                  opacity: activeStep >= i ? 1 : 0.4,
                  transform: activeStep >= i ? 'translateY(0)' : 'translateY(8px)',
                }}
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-black mb-4 relative z-10 transition-all duration-300"
                  style={{
                    background: activeStep >= i ? 'var(--color-primary)' : 'var(--color-surface)',
                    color: activeStep >= i ? '#fff' : 'var(--color-muted)',
                    border: `2px solid ${activeStep >= i ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    boxShadow: activeStep >= i ? '0 0 0 4px var(--color-overlay)' : 'none',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--color-text)' }}>
                  {step.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile vertical stepper */}
        <div className="md:hidden space-y-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex gap-4 transition-all duration-500"
              style={{
                opacity: activeStep >= i ? 1 : 0.4,
              }}
            >
              <div className="flex flex-col items-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
                  style={{
                    background: activeStep >= i ? 'var(--color-primary)' : 'var(--color-surface)',
                    color: activeStep >= i ? '#fff' : 'var(--color-muted)',
                    border: `2px solid ${activeStep >= i ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className="w-0.5 flex-1 mt-2"
                    style={{ background: activeStep > i ? 'var(--color-primary)' : 'var(--color-border)', minHeight: '24px' }}
                  />
                )}
              </div>
              <div className="pb-6">
                <h3 className="font-bold mb-1" style={{ color: 'var(--color-text)' }}>{step.title}</h3>
                <p className="text-sm" style={{ color: 'var(--color-muted)' }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
