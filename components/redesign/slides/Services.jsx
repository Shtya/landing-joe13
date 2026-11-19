'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Glyph from '../Glyph';
import Icon3D from '../Icon3D';
import { EASE, decode, prefersReducedMotion } from '../motion';
import { useTabKeys } from '../useTabKeys';

export default function Services({ copy, onNavigate }) {
  const s = copy.services;
  const [active, setActive] = useState(0);
  const lensRef = useRef(null);
  const artRef = useRef(null);
  const first = useRef(true);
  const onKeyDown = useTabKeys(s.items.length, active, setActive, 'vertical');

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const el = lensRef.current;
    if (!el || prefersReducedMotion()) return;
    gsap.fromTo(
      el.querySelectorAll('[data-lens]'),
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.6, ease: EASE.out, stagger: 0.05, clearProps: 'transform' },
    );
    gsap.fromTo(artRef.current, { opacity: 0, scale: 0.82, rotate: -6 }, { opacity: 1, scale: 1, rotate: 0, duration: 0.9, ease: EASE.spring });
    decode(el.querySelector('.j13-lens__top h3'), { duration: 0.6 });
  }, [active]);

  // The illustration leans toward the pointer, like an object on a desk.
  useEffect(() => {
    const art = artRef.current;
    const lens = lensRef.current;
    if (!art || !lens || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return undefined;
    const rx = gsap.quickTo(art, 'rotationX', { duration: 0.8, ease: 'power3.out' });
    const ry = gsap.quickTo(art, 'rotationY', { duration: 0.8, ease: 'power3.out' });
    const onMove = (e) => {
      const r = lens.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 18);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 14);
    };
    const onLeave = () => {
      rx(0);
      ry(0);
    };
    lens.addEventListener('pointermove', onMove);
    lens.addEventListener('pointerleave', onLeave);
    return () => {
      lens.removeEventListener('pointermove', onMove);
      lens.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  const item = s.items[active];

  return (
    <div className="j13-services">
      <div>
        <div className="j13-services__head">
          <h2 className="j13-h2 j13-chrome" data-anim="title">
            {s.title}
          </h2>
          <p className="j13-lead" data-anim="fade">
            {s.lead}
          </p>
        </div>
        <div className="j13-index" role="tablist" aria-orientation="vertical" aria-label={s.title} data-anim="fade" onKeyDown={onKeyDown}>
          {s.items.map((it, i) => (
            <button
              key={it.key}
              id={`svc-tab-${i}`}
              type="button"
              role="tab"
              className="j13-index__item"
              aria-selected={i === active}
              aria-controls="svc-panel"
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(i)}
            >
              <Icon3D name={it.icon} size={40} className="j13-index__icon" />
              {it.title}
            </button>
          ))}
        </div>
      </div>

      <section ref={lensRef} id="svc-panel" role="tabpanel" aria-labelledby={`svc-tab-${active}`} className="j13-slab j13-lens" data-anim="slab" data-tilt="3">
        <div className="j13-lens__art" aria-hidden="true">
          <span ref={artRef} className="j13-lens__art-inner">
            {s.items.map((it, i) => (
              <Icon3D key={it.key} name={it.icon} size={220} className={i === active ? 'is-on' : ''} />
            ))}
          </span>
        </div>
        <div className="j13-lens__top" data-lens>
          <h3 className="j13-h3" key={item.key}>
            {item.title}
          </h3>
          <span className="j13-lens__count">
            {String(active + 1).padStart(2, '0')} / {String(s.items.length).padStart(2, '0')}
          </span>
        </div>
        <p className="j13-lead" data-lens>
          {item.desc}
        </p>
        <div data-lens>
          <p className="j13-small" style={{ marginBottom: 10 }}>
            {s.stackLabel}
          </p>
          <ul className="j13-lens__chips">
            {item.tech.map((t) => (
              <li key={t} className="j13-chip">
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div data-lens>
          <button type="button" className="j13-btn j13-btn--ghost j13-btn--sm" onClick={() => onNavigate('contact')}>
            {s.cta}
            <Glyph name="arrow" size={16} flip />
          </button>
        </div>
      </section>
    </div>
  );
}
