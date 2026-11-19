'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Glyph, { QuoteMark } from '../Glyph';
import Icon3D from '../Icon3D';
import { EASE, prefersReducedMotion } from '../motion';
import { useTabKeys } from '../useTabKeys';

function initials(name) {
  return name
    .replace(/^Al-|^ال/, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.replace(/^(Al-|ال)/, '')[0])
    .join('');
}

export default function Voices({ copy, isActive }) {
  const v = copy.voices;
  const [active, setActive] = useState(0);
  const quoteRef = useRef(null);
  const first = useRef(true);
  const onKeyDown = useTabKeys(v.items.length, active, setActive, 'vertical');
  const peopleRef = useRef(null);
  const rootRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [hold, setHold] = useState(false);

  // Auto-advance while the slide is on screen. Hover or focus holds it; the
  // pause button stops it for good; reduced motion never starts it.
  useEffect(() => {
    const list = peopleRef.current;
    if (!list) return undefined;
    list.style.setProperty('--p', '0');
    if (!isActive || paused || hold || prefersReducedMotion()) return undefined;
    const state = { p: 0 };
    const tween = gsap.to(state, {
      p: 1,
      duration: 7,
      ease: 'none',
      onUpdate: () => list.style.setProperty('--p', String(state.p)),
      onComplete: () => setActive((a) => (a + 1) % v.items.length),
    });
    return () => tween.kill();
  }, [active, isActive, paused, hold, v.items.length]);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!quoteRef.current || prefersReducedMotion()) return;
    const words = quoteRef.current.querySelectorAll('[data-w]');
    gsap.fromTo(
      words,
      { opacity: 0, y: '0.4em', filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: EASE.out, stagger: 0.018, clearProps: 'filter,transform' },
    );
  }, [active]);

  const item = v.items[active];

  return (
    <div
      className="j13-voices"
      ref={rootRef}
      onPointerEnter={() => setHold(true)}
      onPointerLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setHold(false)}
    >
      <figure className="j13-quote" id="voice-panel" role="tabpanel" aria-labelledby={`voice-tab-${active}`}>
        <QuoteMark className="j13-quote__mark" />
        <h2 className="j13-sr">{v.title}</h2>
        <blockquote ref={quoteRef} data-anim="fade">
          <p>
            {item.quote.split(' ').map((word, i) => (
              <span key={`${active}-${i}`} data-w style={{ display: 'inline-block' }}>
                {word}&nbsp;
              </span>
            ))}
          </p>
        </blockquote>
        <figcaption data-anim="fade">
          <span className="j13-stars" role="img" aria-label={v.rating}>
            {[0, 1, 2, 3, 4].map((k) => (
              <Icon3D key={k} name="star" size={20} />
            ))}
          </span>
          <b>{item.name}</b>
          <span>{item.role}</span>
          <span className="j13-place">
            <Glyph name="pin" size={14} />
            {item.country}
            <i aria-hidden="true" />
            {item.product}
          </span>
        </figcaption>
      </figure>

      <div className="j13-slab j13-voices__panel" data-anim="slab">
        <div className="j13-voices__bar">
          <p className="j13-small">{v.pick}</p>
          <button type="button" className="j13-icon-btn j13-icon-btn--sm" onClick={() => setPaused((x) => !x)} aria-label={paused ? v.play : v.pause} aria-pressed={paused}>
            <Glyph name={paused ? 'play' : 'pause'} size={14} />
          </button>
        </div>
        <div className="j13-people" ref={peopleRef} role="tablist" aria-orientation="vertical" aria-label={v.pick} onKeyDown={onKeyDown}>
          {v.items.map((it, i) => (
            <button
              key={it.name}
              id={`voice-tab-${i}`}
              type="button"
              role="tab"
              className="j13-person"
              aria-selected={i === active}
              aria-controls="voice-panel"
              aria-label={`${it.name}, ${it.product}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
            >
              <span className="j13-person__avatar" aria-hidden="true">
                {initials(it.name)}
              </span>
              <div aria-hidden="true">
                <b>{it.name}</b>
                <span>{it.product}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
