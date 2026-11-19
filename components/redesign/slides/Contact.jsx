'use client';

import { useEffect, useRef, useState } from 'react';
import Glyph from '../Glyph';
import Icon3D from '../Icon3D';

const EMPTY = { name: '', email: '', company: '', service: '', message: '', _honeypot: '' };

function validate(values, errors) {
  const out = {};
  if (values.name.trim().length < 2) out.name = errors.name;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) out.email = errors.email;
  if (values.message.trim().length < 20) out.message = errors.message;
  return out;
}

export default function Contact({ copy, prefill }) {
  const c = copy.contact;
  const [values, setValues] = useState(EMPTY);

  // A plan chosen on the plans slide arrives as a starting message.
  const lastPrefill = useRef('');
  useEffect(() => {
    const msg = prefill?.message;
    if (!msg) return;
    setValues((v) => (!v.message || v.message === lastPrefill.current ? { ...v, message: msg } : v));
    lastPrefill.current = msg;
  }, [prefill]);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [serverError, setServerError] = useState('');
  const formRef = useRef(null);

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
      {errors[key] && (
        <p id={`c-${key}-err`} className="j13-error">
          <Glyph name="alert" size={14} />
          {errors[key]}
        </p>
      )}
    </div>
  );

  return (
    <div className="j13-contact">
      <div className="j13-contact__copy">
        <h2 className="j13-h2 j13-chrome" data-anim="title">
          {c.title}
        </h2>
        <p className="j13-lead" data-anim="fade">
          {c.lead}
        </p>
        <ul className="j13-promises" data-anim="pop">
          {c.promises.map((pr) => (
            <li key={pr.label}>
              <Icon3D name={pr.icon} size={30} />
              {pr.label}
            </li>
          ))}
        </ul>
        <ul className="j13-channels" data-anim="fade">
          {c.channels.map((ch) => {
            const inner = (
              <>
                <Icon3D name={ch.icon} size={40} />
                <span>
                  <small>{ch.label}</small>
                  <b dir={ch.ltr ? 'ltr' : undefined}>{ch.value}</b>
                </span>
              </>
            );
            return (
              <li key={ch.label} data-tilt="6">
                {ch.href ? <a href={ch.href}>{inner}</a> : <div>{inner}</div>}
              </li>
            );
          })}
        </ul>
        <footer className="j13-foot" data-anim="fade">
          <span>{c.copyright}</span>
          <span>{copy.tagline}</span>
          <ul className="j13-socials" aria-label={c.follow}>
            {c.socials.map((so) => (
              <li key={so.key}>
                {so.href ? (
                  <a href={so.href} target="_blank" rel="noopener noreferrer" aria-label={so.label}>
                    <Icon3D name={so.icon} size={28} />
                  </a>
                ) : (
                  <span title={so.label}>
                    <Icon3D name={so.icon} size={28} alt={so.label} />
                  </span>
                )}
              </li>
            ))}
          </ul>
        </footer>
      </div>

      <div className="j13-slab j13-contact__form" data-anim="slab">
        {status === 'sent' ? (
          <div className="j13-sent" role="status">
            <Glyph name="check" size={40} />
            <h3 className="j13-h3">{c.sentTitle}</h3>
            <p className="j13-lead">{c.sentBody}</p>
            <button type="button" className="j13-btn j13-btn--ghost j13-btn--sm" onClick={() => setStatus('idle')}>
              {c.sendAnother}
            </button>
          </div>
        ) : (
          <form ref={formRef} className="j13-form" noValidate onSubmit={onSubmit}>
            <div className="j13-form__row">
              {field('name', c.fields.name, { autoComplete: 'name', required: true })}
              {field('email', c.fields.email, { type: 'email', autoComplete: 'email', inputMode: 'email', required: true, dir: 'ltr' })}
              {field('company', c.fields.company, { autoComplete: 'organization' })}
            </div>
            <fieldset className="j13-field" style={{ border: 0, padding: 0, margin: 0 }}>
              <legend className="j13-label" style={{ marginBottom: 8 }}>
                {c.fields.service}
              </legend>
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
                rows={3}
                value={values.message}
                onChange={set('message')}
                aria-invalid={errors.message ? 'true' : undefined}
                aria-describedby={errors.message ? 'c-message-err' : 'c-message-hint'}
                required
              />
              {errors.message ? (
                <p id="c-message-err" className="j13-error">
                  <Glyph name="alert" size={14} />
                  {errors.message}
                </p>
              ) : (
                <p id="c-message-hint" className="j13-hint">
                  {c.fields.messageHint}
                </p>
              )}
            </div>
            <input type="text" name="_honeypot" tabIndex={-1} autoComplete="off" value={values._honeypot} onChange={set('_honeypot')} className="j13-sr" aria-hidden="true" />
            <div className="j13-contact__submit">
              <button type="submit" className="j13-btn j13-btn--prime" disabled={status === 'sending'} aria-busy={status === 'sending'}>
                {status === 'sending' ? c.sending : c.submit}
                <span className="j13-btn__chip" aria-hidden="true">
                  <Glyph name="arrow" size={16} flip />
                </span>
              </button>
              {status === 'error' && (
                <p className="j13-error" role="alert">
                  <Glyph name="alert" size={14} />
                  {serverError}
                </p>
              )}
            </div>
          </form>
        )}
      </div>

    </div>
  );
}
