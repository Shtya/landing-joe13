'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { CircleCheck, LoaderCircle, Mail, Phone } from 'lucide-react';
import { FloatingShapesCanvas } from '../canvases';
import { Reveal } from '../ui';
import { useInView } from '../hooks';

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
  const [ref, inView] = useInView({ threshold: 0.12 });
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
      `Source: landing-1 consultation request`,
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
    <section id="contact" ref={ref} className="l1-section relative overflow-hidden">
      <FloatingShapesCanvas />
      <div className="l1-container relative">
        <Reveal inView={inView}>
          <div className="text-center mb-10">
            <span className="l1-kicker">{copy.cta.titleAlt}</span>
            <h2 className="l1-title">{copy.cta.title}</h2>
            <p className="l1-sub mx-auto max-w-2xl">{copy.cta.headline}</p>
            <p className="text-sm text-slate-500">{copy.cta.headlineAlt}</p>
          </div>
        </Reveal>

        <Reveal inView={inView} delay={120}>
          <div className="max-w-3xl mx-auto l1-card p-6 md:p-10">
            {status === 'success' ? (
              <div className="text-center py-10">
                <CircleCheck className="mx-auto mb-4 text-emerald-400" size={48} />
                <h3 className="text-2xl font-bold mb-2">{copy.cta.successTitle}</h3>
                <p className="text-slate-400">{copy.cta.successBody}</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="grid md:grid-cols-2 gap-4">
                <label className="text-sm">
                  {copy.cta.fields.name}
                  <input className="l1-input mt-1.5" value={form.name} onChange={(e) => setField('name', e.target.value)} />
                  {errors.name && <span className="text-red-400 text-xs">{errors.name}</span>}
                </label>
                <label className="text-sm">
                  {copy.cta.fields.email}
                  <input type="email" className="l1-input mt-1.5" value={form.email} onChange={(e) => setField('email', e.target.value)} />
                  {errors.email && <span className="text-red-400 text-xs">{errors.email}</span>}
                </label>
                <label className="text-sm">
                  {copy.cta.fields.phone}
                  <input className="l1-input mt-1.5" value={form.phone} onChange={(e) => setField('phone', e.target.value)} placeholder="+966" />
                  {errors.phone && <span className="text-red-400 text-xs">{errors.phone}</span>}
                </label>
                <label className="text-sm">
                  {copy.cta.fields.company}
                  <input className="l1-input mt-1.5" value={form.company} onChange={(e) => setField('company', e.target.value)} />
                </label>
                <label className="text-sm">
                  {copy.cta.fields.type}
                  <select className="l1-select mt-1.5" value={form.type} onChange={(e) => setField('type', e.target.value)}>
                    {copy.cta.types.map((type) => (
                      <option key={type.label} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </label>
                <label className="text-sm">
                  {copy.cta.fields.timeline}
                  <select className="l1-select mt-1.5" value={form.timeline} onChange={(e) => setField('timeline', e.target.value)}>
                    {copy.cta.timelines.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label className="text-sm md:col-span-2">
                  {copy.cta.fields.budget}
                  <select className="l1-select mt-1.5" value={form.budget} onChange={(e) => setField('budget', e.target.value)}>
                    {copy.cta.budgets.map((item) => (
                      <option key={item.label} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </label>
                <label className="text-sm md:col-span-2">
                  {copy.cta.fields.message}
                  <textarea className="l1-textarea mt-1.5 min-h-28" value={form.message} onChange={(e) => setField('message', e.target.value)} />
                </label>
                <input type="text" tabIndex={-1} autoComplete="off" className="hidden" value={form._honeypot} onChange={(e) => setField('_honeypot', e.target.value)} aria-hidden="true" />
                {errors.server && <p className="md:col-span-2 text-sm text-red-400">{errors.server}</p>}
                <div className="md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                  <button type="submit" disabled={status === 'loading'} className="l1-btn l1-btn-primary l1-pulse w-full sm:w-auto">
                    {status === 'loading' ? <LoaderCircle className="animate-spin" size={16} /> : null}
                    {status === 'loading' ? copy.cta.submitting : copy.cta.submit}
                  </button>
                  <p className="text-xs text-slate-500">{copy.cta.disclaimer}</p>
                </div>
              </form>
            )}
            <div className="flex flex-wrap gap-4 mt-8 text-sm text-slate-400">
              <span className="inline-flex items-center gap-2"><Phone size={14} /> {copy.cta.whatsapp}</span>
              <span className="inline-flex items-center gap-2"><Mail size={14} /> {copy.cta.email}</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
