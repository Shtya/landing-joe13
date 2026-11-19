'use client';

import { useEffect, useRef, useState } from 'react';
import Glyph from '../Glyph';
import Icon3D from '../Icon3D';
import Button from '../ui/Button';

const EMPTY = { name: '', email: '', company: '', service: '', message: '', _honeypot: '' };

function validate(values, errors) {
  const out = {};
  if (values.name.trim().length < 2) out.name = errors.name;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) out.email = errors.email;
  if (values.message.trim().length < 20) out.message = errors.message;
  return out;
}

/*
 * Contact = the closing CTA. A huge two-line call to action, then the brief
 * form on a solid glass panel beside the ways to reach us. A plan, a case or
 * a service chosen elsewhere on the page arrives here pre-filled.
 */
export default function Contact({ copy, index, headingId, prefill }) {
  const c = copy.contact;
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [serverError, setServerError] = useState('');
  const formRef = useRef(null);
  const lastPrefill = useRef('');

  useEffect(() => {
    if (!prefill) return;
    setValues((v) => {
      const next = { ...v };
      if (prefill.service) next.service = prefill.service;
      if (prefill.message && (!v.message || v.message === lastPrefill.current)) next.message = prefill.message;
      return next;
    });
    if (prefill.message) lastPrefill.current = prefill.message;
  }, [prefill]);

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    const found = validate(values, c.errors);
    setErrors(found);
    const firstKey = Object.keys(found)[0];
    if (firstKey) {
      formRef.current?.querySelector(`[name="${firstKey}"]`)?.focus();
      return;
    }
    setStatus('sending');
    setServerError('');
    try {
      const res = await fetch(`/${copy.locale}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, service: values.service || undefined }),
      });
      if (res.status === 429) throw new Error(c.errors.rate);
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(c.errors.server);
      setStatus('sent');
      setValues(EMPTY);
    } catch (err) {
      setStatus('error');
      setServerError(err.message || c.errors.server);
    }
  }

  const field = (key, label, props = {}) => (
    <div className="j13-field">
      <label className="j13-label" htmlFor={`c-${key}`}>
        {label}
      </label>
      <input
        id={`c-${key}`}
        name={key}
        className="j13-input"
        value={values[key]}
        onChange={set(key)}
        aria-invalid={errors[key] ? 'true' : undefined}
        aria-describedby={errors[key] ? `c-${key}-err` : undefined}
        {...props}
      />
      {errors[key] ? (
        <p id={`c-${key}-err`} className="j13-error">
          <Glyph name="alert" size={14} />
          {errors[key]}
        </p>
      ) : null}
    </div>
  );

  return (
    <div className="j13-container j13-contact">
      <div className="j13-cta">
        <p className="j13-eyebrow" data-reveal="up">
          <span className="j13-eyebrow__num">{String(index).padStart(2, '0')}</span>
          <span className="j13-eyebrow__bar" aria-hidden="true" />
          {c.eyebrow}
        </p>
        <h2 id={headingId} className="j13-cta__title" data-reveal="lines">
          <span>{c.big[0]}</span> <span className="j13-gradient-text">{c.big[1]}</span>
        </h2>
      </div>

      <div className="j13-contact__grid">
        <div className="j13-contact__info" data-reveal="up">
          <h3 className="j13-h3">{c.title}</h3>
          <p className="j13-lead">{c.lead}</p>
          <ul className="j13-promises">
            {c.promises.map((pr) => (
              <li key={pr.label}>
                <Icon3D name={pr.icon} size={30} />
                {pr.label}
              </li>
            ))}
          </ul>
          <ul className="j13-channels">
            {c.channels.map((ch) => {
              const inner = (
                <>
                  <span className="j13-channel__icon" aria-hidden="true">
                    <Glyph name={ch.icon} size={18} />
                  </span>
                  <span>
                    <small>{ch.label}</small>
                    <b dir={ch.ltr ? 'ltr' : undefined}>{ch.value}</b>
                  </span>
                </>
              );
              return (
                <li key={ch.label}>
                  {ch.href ? (
                    <a className="j13-channel" href={ch.href}>
                      {inner}
                    </a>
                  ) : (
                    <div className="j13-channel">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="j13-glass j13-glass--solid j13-contact__form" data-reveal="scale">
          {status === 'sent' ? (
            <div className="j13-sent" role="status">
              <span className="j13-sent__icon" aria-hidden="true">
                <Glyph name="check" size={32} />
              </span>
              <h3 className="j13-h3">{c.sentTitle}</h3>
              <p className="j13-lead">{c.sentBody}</p>
              <Button variant="secondary" size="md" arrow={false} onClick={() => setStatus('idle')}>
                {c.sendAnother}
              </Button>
            </div>
          ) : (
            <form ref={formRef} className="j13-form" noValidate onSubmit={onSubmit}>
              <div className="j13-form__row">
                {field('name', c.fields.name, { autoComplete: 'name', required: true })}
                {field('email', c.fields.email, { type: 'email', autoComplete: 'email', inputMode: 'email', required: true, dir: 'ltr' })}
              </div>
              {field('company', c.fields.company, { autoComplete: 'organization' })}
              <fieldset className="j13-field j13-fieldset">
                <legend className="j13-label">{c.fields.service}</legend>
                <div className="j13-choices">
                  {c.services.map((opt) => (
                    <label key={opt.value} className="j13-choice">
                      <input type="radio" name="service" value={opt.value} checked={values.service === opt.value} onChange={set('service')} />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="j13-field">
                <label className="j13-label" htmlFor="c-message">
                  {c.fields.message}
                </label>
                <textarea
                  id="c-message"
                  name="message"
                  className="j13-input"
                  rows={4}
                  value={values.message}
                  onChange={set('message')}
                  aria-invalid={errors.message ? 'true' : undefined}
                  aria-describedby={errors.message ? 'c-message-err' : 'c-message-hint'}
                  required
                  data-lenis-prevent
                />
                {errors.message ? (
                  <p id="c-message-err" className="j13-error">
                    <Glyph name="alert" size={14} />
                    {errors.message}
                  </p>
                ) : (
                  <p id="c-message-hint" className="j13-hint-text">
                    {c.fields.messageHint}
                  </p>
                )}
              </div>
              <input type="text" name="_honeypot" tabIndex={-1} autoComplete="off" value={values._honeypot} onChange={set('_honeypot')} className="j13-sr" aria-hidden="true" />
              <div className="j13-contact__submit">
                <Button type="submit" size="lg" disabled={status === 'sending'} aria-busy={status === 'sending'}>
                  {status === 'sending' ? c.sending : c.submit}
                </Button>
                {status === 'error' ? (
                  <p className="j13-error" role="alert">
                    <Glyph name="alert" size={14} />
                    {serverError}
                  </p>
                ) : null}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
