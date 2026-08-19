'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{label}</label>
      {children}
      {error && <p className="text-xs" style={{ color: 'var(--color-error)' }}>{error}</p>}
    </div>
  )
}

const inputClass = `w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2`
const inputStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  color: 'var(--color-text)',
  '--tw-ring-color': 'var(--color-primary)',
}

export default function Contact() {
  const t = useTranslations('contact')
  const locale = useLocale()
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const [status, setStatus] = useState('idle')
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')

  const [form, setForm] = useState({
    name: '', email: '', company: '', service: '', budget: '', message: '', _honeypot: '',
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const validate = () => {
    const e = {}
    if (!form.name || form.name.length < 2) e.name = t('errors.nameRequired')
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t('errors.emailInvalid')
    if (!form.message || form.message.length < 20) e.message = t('errors.messageTooShort')
    return e
  }

  const handleBlur = (field) => {
    const e = validate()
    if (e[field]) setErrors(prev => ({ ...prev, [field]: e[field] }))
    else setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }

    setStatus('loading')
    setServerError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, locale }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setStatus('success')
        setForm({ name: '', email: '', company: '', service: '', budget: '', message: '', _honeypot: '' })
      } else if (res.status === 400 && data.errors) {
        setErrors(data.errors)
        setStatus('idle')
      } else {
        setServerError(data.message || t('errors.serverError'))
        setStatus('error')
      }
    } catch {
      setServerError(t('errors.serverError'))
      setStatus('error')
    }
  }

  const spring = (delay = 0) =>
    `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms`

  return (
    <section
      id="contact"
      ref={ref}
      className="section-base py-28 section-with-blur"
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
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-5 gap-12"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
            transition: spring(180),
            willChange: 'transform, opacity',
          }}
        >
          {/* Form — 3 of 5 cols */}
          <div className="lg:col-span-3">
            <div
              className="rounded-2xl p-8"
              style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
            >
              {status === 'success' ? (
                <div className="flex flex-col items-center py-12 text-center gap-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--color-success-10)' }}
                  >
                    <svg className="w-8 h-8" style={{ color: 'var(--color-success)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>{t('successTitle')}</h3>
                  <p style={{ color: 'var(--color-muted)' }}>{t('successMessage')}</p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-4 px-6 py-2 rounded-xl text-sm font-semibold text-white"
                    style={{ background: 'var(--color-primary)' }}
                  >
                    {t('sendAnother')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                  {/* Honeypot */}
                  <input
                    type="text" name="_honeypot" value={form._honeypot}
                    onChange={e => setForm(f => ({ ...f, _honeypot: e.target.value }))}
                    tabIndex={-1} aria-hidden="true" className="hidden"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label={t('fields.name')} error={errors.name}>
                      <input type="text" value={form.name} className={inputClass} style={inputStyle}
                        placeholder={t('placeholders.name')}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        onBlur={() => handleBlur('name')} />
                    </Field>
                    <Field label={t('fields.email')} error={errors.email}>
                      <input type="email" value={form.email} className={inputClass} style={inputStyle}
                        placeholder={t('placeholders.email')}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        onBlur={() => handleBlur('email')} />
                    </Field>
                  </div>

                  <Field label={`${t('fields.company')} (${t('optional')})`}>
                    <input type="text" value={form.company} className={inputClass} style={inputStyle}
                      placeholder={t('placeholders.company')}
                      onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label={t('fields.service')}>
                      <select value={form.service} className={inputClass} style={inputStyle}
                        onChange={e => setForm(f => ({ ...f, service: e.target.value }))}>
                        <option value="">{t('placeholders.service')}</option>
                        <option value="web">{t('services.web')}</option>
                        <option value="mobile">{t('services.mobile')}</option>
                        <option value="cloud">{t('services.cloud')}</option>
                        <option value="ai">{t('services.ai')}</option>
                        <option value="devops">{t('services.devops')}</option>
                        <option value="other">{t('services.other')}</option>
                      </select>
                    </Field>
                    <Field label={t('fields.budget')}>
                      <select value={form.budget} className={inputClass} style={inputStyle}
                        onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}>
                        <option value="">{t('placeholders.budget')}</option>
                        <option value="<10k">{t('budgets.lt10k')}</option>
                        <option value="10-50k">{t('budgets.10to50k')}</option>
                        <option value="50-100k">{t('budgets.50to100k')}</option>
                        <option value="100k+">{t('budgets.gt100k')}</option>
                      </select>
                    </Field>
                  </div>

                  <Field label={t('fields.message')} error={errors.message}>
                    <textarea rows={5} value={form.message} className={inputClass} style={inputStyle}
                      placeholder={t('placeholders.message')}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      onBlur={() => handleBlur('message')} />
                  </Field>

                  {serverError && (
                    <p
                      className="text-sm px-4 py-3 rounded-xl"
                      style={{ background: 'var(--color-error-10)', color: 'var(--color-error)' }}
                    >
                      {serverError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ background: 'var(--color-primary)' }}
                  >
                    {status === 'loading' ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {t('sending')}
                      </>
                    ) : t('submit')}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Info — 2 of 5 cols */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {[
              { icon: '✉️', label: t('info.email'),   value: 'hello@nexus.dev' },
              { icon: '📞', label: t('info.phone'),   value: '+1 (555) 000-1234' },
              { icon: '📍', label: t('info.address'), value: '123 Innovation Drive\nSan Francisco, CA 94105' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                  style={{ background: 'var(--color-overlay)' }}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--color-muted)' }}>
                    {item.label}
                  </p>
                  <p className="text-sm whitespace-pre-line" style={{ color: 'var(--color-text)' }}>
                    {item.value}
                  </p>
                </div>
              </div>
            ))}

            {/* Social */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-muted)' }}>
                {t('info.followUs')}
              </p>
              <div className="flex gap-3">
                {['Twitter', 'LinkedIn', 'GitHub'].map(s => (
                  <a
                    key={s} href="#"
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold transition-all hover:-translate-y-0.5"
                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-muted)' }}
                  >
                    {s[0]}
                  </a>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div
              className="rounded-xl overflow-hidden flex-1 min-h-[200px] flex items-center justify-center"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              <div className="text-center" style={{ color: 'var(--color-muted)' }}>
                <svg className="w-8 h-8 mx-auto mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-xs">{t('info.mapPlaceholder')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
