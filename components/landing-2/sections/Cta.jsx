'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { CircleCheck, LoaderCircle, Mail, Phone } from 'lucide-react';
import { ArrowIcon, Reveal } from '../ui';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function mapBudget(value) {
  if (!value) return undefined;
  if (value === '10-50k-b') return '10-50k';
  return value;
}

function mapService(value) {
  if (value === 'other-misc') return 'other';
  return value || 'other';
}

export default function Cta({ copy }) {
  const locale = useLocale();
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    type: 'web',
    timeline: copy.cta.timelines[0],
    budget: '<10k',
    message: '',
    _honeypot: '',
  });

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validate = () => {
    const next = {};
    if (!form.name || form.name.trim().length < 2) next.name = copy.cta.errors.name;
    if (!EMAIL_RE.test(form.email)) next.email = copy.cta.errors.email;
    if (form.phone && form.phone.replace(/\D/g, '').length < 8) next.phone = copy.cta.errors.phone;
    return next;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setStatus('loading');
    const composed = [
      form.message.trim(),
      form.phone ? `Phone: ${form.phone}` : '',
      `Timeline: ${form.timeline}`,
      'Source: landing-2 consultation request',
    ].filter(Boolean).join('\n');

    try {
      const res = await fetch(`/${locale}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          company: form.company.trim(),
          service: mapService(form.type),
          budget: mapBudget(form.budget),
          message: composed.length >= 20 ? composed : `${composed}\nConsultation request from the landing page.`,
          locale,
          _honeypot: form._honeypot,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('success');
        setForm({
          name: '', email: '', phone: '', company: '', type: 'web',
          timeline: copy.cta.timelines[0], budget: '<10k', message: '', _honeypot: '',
        });
      } else {
        setStatus('error');
        setErrors(data.errors || { server: copy.cta.errors.server });
      }
    } catch {
      setStatus('error');
      setErrors({ server: copy.cta.errors.server });
    }
  };

  return (
    <section id="contact" className="l2-section" aria-labelledby="l2-contact-heading">
      <div className="l2-container">
        <Reveal>
          <span className="l2-kicker">{copy.cta.titleAlt}</span>
          <h2 id="l2-contact-heading" className="l2-title">{copy.cta.title}</h2>
          <p className="l2-sub">{copy.cta.headline}</p>
        </Reveal>
        <Reveal delay={120}>
          <div className="l2-card" style={{ marginTop: '2rem' }}>
            {status === 'success' ? (
              <div className="l2-success">
                <CircleCheck size={48} color="#08a1ff" />
                <h3>{copy.cta.successTitle}</h3>
                <p className="l2-sub" style={{ marginInline: 'auto' }}>{copy.cta.successBody}</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="l2-form">
                <label>
                  {copy.cta.fields.name}
                  <input className="l2-input" value={form.name} onChange={(e) => setField('name', e.target.value)} />
                  {errors.name && <span className="l2-error">{errors.name}</span>}
                </label>
                <label>
                  {copy.cta.fields.email}
                  <input type="email" className="l2-input" value={form.email} onChange={(e) => setField('email', e.target.value)} />
                  {errors.email && <span className="l2-error">{errors.email}</span>}
                </label>
                <label>
                  {copy.cta.fields.phone}
                  <input className="l2-input" value={form.phone} onChange={(e) => setField('phone', e.target.value)} placeholder="+966" />
                  {errors.phone && <span className="l2-error">{errors.phone}</span>}
                </label>
                <label>
                  {copy.cta.fields.company}
                  <input className="l2-input" value={form.company} onChange={(e) => setField('company', e.target.value)} />
                </label>
                <label>
                  {copy.cta.fields.type}
                  <select className="l2-select" value={form.type} onChange={(e) => setField('type', e.target.value)}>
                    {copy.cta.types.map((type) => (
                      <option key={type.label} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </label>
                <label>
                  {copy.cta.fields.timeline}
                  <select className="l2-select" value={form.timeline} onChange={(e) => setField('timeline', e.target.value)}>
                    {copy.cta.timelines.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label className="full">
                  {copy.cta.fields.budget}
                  <select className="l2-select" value={form.budget} onChange={(e) => setField('budget', e.target.value)}>
                    {copy.cta.budgets.map((item) => (
                      <option key={item.label} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </label>
                <label className="full">
                  {copy.cta.fields.message}
                  <textarea className="l2-textarea" value={form.message} onChange={(e) => setField('message', e.target.value)} />
                </label>
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  className="l2-honeypot"
                  value={form._honeypot}
                  onChange={(e) => setField('_honeypot', e.target.value)}
                  aria-hidden="true"
                />
                {errors.server && <p className="full l2-error">{errors.server}</p>}
                <div className="l2-form-foot">
                  <button type="submit" disabled={status === 'loading'} className="l2-btn l2-btn-primary l2-submit">
                    {status === 'loading' ? <LoaderCircle className="animate-spin" size={16} /> : null}
                    {status === 'loading' ? copy.cta.submitting : copy.cta.submit}
                    {status === 'loading' ? null : <span className="l2-btn-arrow"><ArrowIcon /></span>}
                  </button>
                  <p className="l2-sub" style={{ maxWidth: 'none' }}>{copy.cta.disclaimer}</p>
                </div>
              </form>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '0 1.8rem 1.6rem', color: '#aeb5c2', fontSize: '0.92rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}><Phone size={14} /> {copy.cta.whatsapp}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}><Mail size={14} /> {copy.cta.email}</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
