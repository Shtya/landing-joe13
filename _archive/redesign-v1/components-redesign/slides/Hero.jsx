'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Glyph from '../Glyph';
import { prefersReducedMotion } from '../motion';

/*
 * Intro. The headline is the instrument: each letter (word, in Arabic, so
 * shaping is kept) is a variable-font cell. On load the letters condense in
 * from a thin, narrow cut; afterwards they thin out around the pointer.
 */

function splitUnits(text, isArabic) {
  if (isArabic) return text.split(/(\s+)/).filter(Boolean);
  return Array.from(text);
}

export default function Hero({ copy, isArabic, onNavigate, introReady }) {
  const titleRef = useRef(null);
  const BASE_W = isArabic ? 700 : 820;
  const THIN_W = isArabic ? 400 : 420;

  // The letters wait behind the boot screen, then condense in once the shell
  // says the page is ready. Owning the whole intro here (instead of handing a
  // callback up) means a re-run of this effect can never strand the letters hidden.
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return undefined;
    const units = el.querySelectorAll('.j13-char');
    if (prefersReducedMotion()) {
      gsap.set(units, { opacity: 1, yPercent: 0, '--w': BASE_W, '--wd': 100 });
      return undefined;
    }
    gsap.set(units, { opacity: 0, yPercent: 70, '--w': THIN_W, '--wd': 75 });
    if (!introReady) return () => gsap.killTweensOf(units);
    const tween = gsap.to(units, {
      opacity: 1,
      yPercent: 0,
      '--w': BASE_W,
      '--wd': 100,
      duration: 1.3,
      ease: 'expo.out',
      stagger: { each: isArabic ? 0.09 : 0.028 },
    });
    return () => {
      // never leave the headline invisible if the intro is interrupted
      tween.kill();
      gsap.set(units, { opacity: 1, yPercent: 0, '--w': BASE_W, '--wd': 100 });
    };
  }, [BASE_W, THIN_W, introReady, isArabic]);

  // Pointer lens on fine pointers only.
  useEffect(() => {
    const el = titleRef.current;
    if (!el || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return undefined;
    const units = Array.from(el.querySelectorAll('.j13-char'));
    const setters = units.map((u) => ({
      w: gsap.quickTo(u, '--w', { duration: 0.7, ease: 'power3.out' }),
      wd: isArabic ? null : gsap.quickTo(u, '--wd', { duration: 0.7, ease: 'power3.out' }),
    }));
    let rects = [];
    const measure = () => {
      rects = units.map((u) => {
        const r = u.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
    };
    let frame = 0;
    const onMove = (e) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!rects.length) measure();
        rects.forEach((r, i) => {
          const d = Math.hypot(e.clientX - r.x, e.clientY - r.y);
          const f = Math.max(0, 1 - d / 240);
          const e2 = f * f * (3 - 2 * f);
          setters[i].w(BASE_W - (BASE_W - THIN_W) * e2);
          setters[i].wd?.(100 - 18 * e2);
        });
      });
    };
    const onLeave = () => {
      setters.forEach((s) => {
        s.w(BASE_W);
        s.wd?.(100);
      });
    };
    const onResize = () => {
      rects = [];
    };
    const host = el.closest('.j13-slide');
    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frame);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', onResize);
    };
  }, [BASE_W, THIN_W, isArabic]);

  const hero = copy.hero;

  return (
    <div className="j13-hero">
      <div className="j13-hero__copy">
        <p className="j13-badge" data-anim="fade">
          <span className="j13-badge__dot" aria-hidden="true" />
          <span data-decode>{hero.badge}</span>
        </p>
        <h1 ref={titleRef} data-leave className="j13-display j13-hero__title" aria-label={hero.lines.join(' ')}>
          {hero.lines.map((line, li) => (
            <span key={li} className="j13-line" aria-hidden="true">
              <span className="j13-chrome-wrap">
                {splitUnits(line, isArabic).map((u, ui, arr) =>
                  /^\s+$/.test(u) ? (
                    <span key={ui}> </span>
                  ) : (
                    <span key={ui} className="j13-char j13-chrome" style={{ '--w': BASE_W, '--ci': li * 12 + ui }}>
                      {u === ' ' ? ' ' : u}
                    </span>
                  ),
                )}
              </span>
            </span>
          ))}
        </h1>
        <p className="j13-lead" data-anim="fade">
          {hero.sub}
        </p>
        <div className="j13-hero__actions" data-anim="fade">
          <button type="button" className="j13-btn j13-btn--prime" onClick={() => onNavigate('contact')}>
            {hero.primary}
            <span className="j13-btn__chip" aria-hidden="true">
              <Glyph name="arrow" size={16} flip />
            </span>
          </button>
          <button type="button" className="j13-btn j13-btn--ghost" onClick={() => onNavigate('work')}>
            {hero.secondary}
          </button>
        </div>
      </div>
      <dl className="j13-telemetry" data-anim="fade">
        {hero.telemetry.map((item) => (
          <div key={item.label}>
            <dt className="j13-sr">{item.label}</dt>
            <dd style={{ display: 'contents' }}>
              <b data-count data-value={item.value}>
                {item.value}
              </b>
              <span>{item.label}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

