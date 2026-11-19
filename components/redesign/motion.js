'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

/*
 * Motion system. CSS mirrors the tokens (--ease-*, --t-*) in redesign.css.
 * Only transform and opacity are animated. Under prefers-reduced-motion every
 * pattern resolves to a short fade (or nothing) and scroll is native.
 *
 * Scroll reveals — put data-reveal on any element:
 *   "up"      lifts 32px and fades in
 *   "lines"   heading lines rise out of a mask (SplitText)
 *   "stagger" its direct children rise in one after another
 *   "scale"   settles from 94% with a fade
 *   "draw"    scales in from its inline-start edge (rules, bars)
 * data-delay="0.2" adds seconds. [data-count] numbers count up when seen.
 */

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };

export const EASE = {
  out: 'expo.out',
  inOut: 'power4.inOut',
  soft: 'power3.out',
  spring: 'back.out(1.6)',
};

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isRtl(el) {
  return typeof window !== 'undefined' && el ? getComputedStyle(el).direction === 'rtl' : false;
}

/** Count a number up inside el (data-value like "180+" or "99.9%" keeps its suffix). */
export function countUp(el, { duration = 1.8, delay = 0 } = {}) {
  if (!el) return null;
  const target = el.dataset.value || '';
  const match = /^([\d.,]+)(.*)$/.exec(target);
  if (!match || prefersReducedMotion()) {
    el.textContent = target;
    return null;
  }
  const raw = match[1].replace(/,/g, '');
  const end = parseFloat(raw);
  const decimals = (raw.split('.')[1] || '').length;
  const state = { v: 0 };
  el.textContent = `${(0).toFixed(decimals)}${match[2]}`;
  return gsap.to(state, {
    v: end,
    duration,
    delay,
    ease: 'power3.out',
    onUpdate: () => {
      el.textContent = state.v.toFixed(decimals) + match[2];
    },
    onComplete: () => {
      el.textContent = target;
    },
  });
}

/**
 * Wire every [data-reveal] and [data-count] under root to ScrollTrigger.
 * Returns a cleanup function. Each element animates once.
 */
export function setupReveals(root) {
  if (!root) return () => {};
  const reduced = prefersReducedMotion();
  const splits = [];
  const ctx = gsap.context(() => {
    root.querySelectorAll('[data-reveal]').forEach((el) => {
      const kind = el.dataset.reveal;
      const delay = Number(el.dataset.delay || 0);
      const trigger = { trigger: el, start: 'top 88%', once: true };

      if (reduced) {
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.4, delay, scrollTrigger: trigger });
        return;
      }
      if (kind === 'lines') {
        const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'j13-line', autoSplit: true, onSplit: (self) =>
          gsap.from(self.lines, { yPercent: 105, duration: 1.1, ease: EASE.out, stagger: 0.09, delay, scrollTrigger: trigger }),
        });
        splits.push(split);
      } else if (kind === 'stagger') {
        gsap.from(el.children, { opacity: 0, y: 36, duration: 0.9, ease: EASE.out, stagger: 0.08, delay, scrollTrigger: trigger, clearProps: 'transform' });
      } else if (kind === 'scale') {
        gsap.from(el, { opacity: 0, scale: 0.94, y: 24, duration: 1.1, ease: EASE.out, delay, scrollTrigger: trigger, clearProps: 'transform' });
      } else if (kind === 'draw') {
        gsap.from(el, { scaleX: 0, transformOrigin: isRtl(el) ? '100% 50%' : '0% 50%', duration: 1.2, ease: EASE.out, delay, scrollTrigger: trigger });
      } else {
        gsap.from(el, { opacity: 0, y: 32, duration: 0.9, ease: EASE.out, delay, scrollTrigger: trigger, clearProps: 'transform' });
      }
    });

    root.querySelectorAll('[data-count]').forEach((el, i) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () => countUp(el, { delay: (i % 6) * 0.06 }),
      });
    });
  }, root);

  return () => {
    splits.forEach((s) => s.revert());
    ctx.revert();
  };
}
