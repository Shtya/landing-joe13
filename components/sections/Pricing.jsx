'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'

const checkIcon = (
  <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-success)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)

const dashIcon = (
  <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
  </svg>
)

const plans = [
  {
    key: 'starter',
    monthly: 49,
    annual: 39,
    color: 'var(--color-accent)',
    features: [
      { text: 'Up to 3 projects',      included: true  },
      { text: '10GB storage',           included: true  },
      { text: 'Basic analytics',        included: true  },
      { text: 'Email support',          included: true  },
      { text: 'API access',             included: true  },
      { text: 'Custom integrations',    included: false },
      { text: 'Priority support',       included: false },
      { text: 'SLA guarantee',          included: false },
    ],
  },
  {
    key: 'pro',
    monthly: 149,
    annual: 119,
    color: 'var(--color-primary)',
    popular: true,
    features: [
      { text: 'Unlimited projects',     included: true  },
      { text: '100GB storage',          included: true  },
      { text: 'Advanced analytics',     included: true  },
      { text: 'Priority email & chat',  included: true  },
      { text: 'Full API access',        included: true  },
      { text: 'Custom integrations',    included: true  },
      { text: 'Priority support',       included: true  },
      { text: 'SLA guarantee',          included: false },
    ],
  },
  {
    key: 'enterprise',
    monthly: null,
    annual: null,
    color: 'var(--color-muted)',
    features: [
      { text: 'Unlimited everything',         included: true },
      { text: 'Unlimited storage',            included: true },
      { text: 'Custom analytics',             included: true },
      { text: 'Dedicated account manager',    included: true },
      { text: 'Full API access',              included: true },
      { text: 'Custom integrations',          included: true },
      { text: '24/7 priority support',        included: true },
      { text: '99.99% SLA guarantee',         included: true },
    ],
  },
]

export default function Pricing() {
  const t = useTranslations('pricing')
  const [annual, setAnnual] = useState(false)
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const spring = (delay = 0) =>
    `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms`

  return (
    <section
      id="pricing"
      ref={ref}
      className="section-base py-28 section-solid"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div
          className="text-center mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
            transition: spring(0),
            willChange: 'transform, opacity',
          }}
        >
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ background: 'var(--color-overlay)', color: 'var(--color-primary)', border: '1px solid var(--color-primary)' }}
          >
            {t('badge')}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
            {t('title')}
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--color-muted)' }}>
            {t('subtitle')}
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className="text-sm font-medium" style={{ color: !annual ? 'var(--color-text)' : 'var(--color-muted)' }}>
              {t('monthly')}
            </span>
            <button
              onClick={() => setAnnual(v => !v)}
              className="relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none"
              style={{ background: annual ? 'var(--color-primary)' : 'var(--color-border)' }}
              aria-label="Toggle billing period"
            >
              <span
                className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${annual ? 'left-8' : 'left-1'}`}
              />
            </button>
            <span className="text-sm font-medium" style={{ color: annual ? 'var(--color-text)' : 'var(--color-muted)' }}>
              {t('annual')}
            </span>
            {annual && (
              <span
                className="text-xs font-bold px-2 py-1 rounded-full animate-pulse"
                style={{ background: 'var(--color-accent)', color: '#fff' }}
              >
                {t('discount')}
              </span>
            )}
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div
              key={plan.key}
              className="relative rounded-2xl p-8 flex flex-col"
              style={{
                background: 'var(--color-card)',
                border: plan.popular ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                boxShadow: plan.popular ? '0 0 40px var(--color-overlay)' : undefined,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.96)',
                transition: spring(i * 120),
                willChange: 'transform, opacity',
              }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span
                    className="px-4 py-1 rounded-full text-xs font-bold text-white"
                    style={{ background: 'var(--color-primary)' }}
                  >
                    {t('mostPopular')}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `color-mix(in srgb, ${plan.color} 15%, transparent)` }}
                >
                  <span className="text-lg font-black" style={{ color: plan.color }}>
                    {plan.key === 'starter' ? 'S' : plan.key === 'pro' ? 'P' : 'E'}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>
                  {t(`plans.${plan.key}.name`)}
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                  {t(`plans.${plan.key}.description`)}
                </p>
              </div>

              <div className="mb-8">
                {plan.monthly !== null ? (
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-black" style={{ color: 'var(--color-text)' }}>
                      ${annual ? plan.annual : plan.monthly}
                    </span>
                    <span className="text-sm pb-2" style={{ color: 'var(--color-muted)' }}>/mo</span>
                  </div>
                ) : (
                  <div className="text-3xl font-black" style={{ color: 'var(--color-text)' }}>
                    {t('customPricing')}
                  </div>
                )}
                {annual && plan.monthly !== null && (
                  <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
                    {t('billedAnnually')}
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feat, fi) => (
                  <li
                    key={fi}
                    className="flex items-center gap-3 text-sm"
                    style={{ color: feat.included ? 'var(--color-text)' : 'var(--color-muted)' }}
                  >
                    {feat.included ? checkIcon : dashIcon}
                    {feat.text}
                  </li>
                ))}
              </ul>

              <button
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                style={
                  plan.popular
                    ? { background: 'var(--color-primary)', color: '#fff' }
                    : { background: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }
                }
              >
                {plan.key === 'enterprise' ? t('talkToSales') : t('getStarted')}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
