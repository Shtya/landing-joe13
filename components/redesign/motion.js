'use client';

import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

/*
 * Motion tokens for the Ribbon system. CSS mirrors these in redesign.css
 * (--ease-*, --t-*). Use these names, never ad-hoc eases or durations.
 *
 * Patterns (attach with data-anim on any element inside a slide):
 *   data-anim="title"  — heading lines rise out of a mask (SplitText lines)
 *   data-anim="fade"   — content lifts 24px and fades in
 *   data-anim="draw"   — rules and tracks draw from their start edge
 *   data-anim="slab"   — panels unclip from the top-start chamfer
 *   data-anim="pop"    — small parts (chips, nodes) settle with a spring
 * Order inside a slide follows DOM order; data-delay adds seconds.
 */

if (typeof window !== 'undefined') gsap.registerPlugin(SplitText);

export const EASE = {
  out: 'expo.out',
  inOut: 'power4.inOut',
  soft: 'power3.out',
  spring: 'back.out(1.7)',
};

export const DUR = {
  fast: 0.16,
  base: 0.32,
  slow: 0.7,
  scene: 1.1,
};

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const splits = new WeakMap();

function getSplit(el) {
  let split = splits.get(el);
  if (!split) {
    split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'j13-split-line' });
    splits.set(el, split);
  }
  return split;
}

export function revertSplits(root) {
  root?.querySelectorAll('[data-anim="title"]').forEach((el) => {
    splits.get(el)?.revert();
    splits.delete(el);
  });
}

/** Animate a slide's [data-anim] parts in. Returns the timeline. */
export function enterSlide(root, { direction = 1, delay = 0 } = {}) {
  const tl = gsap.timeline({ delay });
  if (!root) return tl;
  const parts = root.querySelectorAll('[data-anim]');
  const extras = root.querySelectorAll('[data-leave]');
  gsap.killTweensOf([...parts, ...extras]);

  if (prefersReducedMotion()) {
    tl.fromTo([...parts, ...extras], { opacity: 0 }, { opacity: 1, duration: 0.3, clearProps: 'opacity' });
    return tl;
  }
  // [data-leave] parts have their own first entrance (e.g. the hero letters);
  // on later visits they simply rise back in.
  if (extras.length) {
    tl.fromTo(extras, { opacity: 0, y: 40 * direction }, { opacity: 1, y: 0, duration: 1, ease: EASE.out, clearProps: 'transform' }, 0);
  }

  // [data-decode] text resolves out of code characters once the scene settles
  root.querySelectorAll('[data-decode]').forEach((el, k) => {
    tl.add(() => decode(el, { duration: 0.8 }), 0.35 + k * 0.08);
  });

  let cursor = 0;
  parts.forEach((el) => {
    const kind = el.dataset.anim;
    const at = cursor + Number(el.dataset.delay || 0);
    gsap.set(el, { opacity: 1 });

    if (kind === 'title') {
      const split = getSplit(el);
      tl.fromTo(
        split.lines,
        { yPercent: 110 * direction, rotate: 2 * direction },
        { yPercent: 0, rotate: 0, duration: 1.05, ease: EASE.out, stagger: 0.08 },
        at,
      );
      cursor += 0.12;
    } else if (kind === 'draw') {
      const origin = getComputedStyle(el).direction === 'rtl' ? '100% 50%' : '0% 50%';
      tl.fromTo(el, { scaleX: 0, transformOrigin: origin }, { scaleX: 1, duration: 1.2, ease: EASE.out, clearProps: 'transform' }, at);
    } else if (kind === 'slab') {
      tl.fromTo(
        el,
        { clipPath: 'inset(0% 100% 100% 0%)', y: 30 * direction },
        { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 1.1, ease: EASE.out, clearProps: 'clipPath,transform' },
        at,
      );
      cursor += 0.1;
    } else if (kind === 'pop') {
      const kids = el.children.length ? el.children : [el];
      tl.fromTo(kids, { opacity: 0, scale: 0.6, y: 10 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: EASE.spring, stagger: 0.04, clearProps: 'transform,opacity' }, at);
      cursor += 0.06;
    } else {
      tl.fromTo(el, { opacity: 0, y: 24 * direction }, { opacity: 1, y: 0, duration: 0.9, ease: EASE.out, clearProps: 'transform' }, at);
      cursor += 0.07;
    }
  });
  return tl;
}

/** Animate a slide's parts out in the travel direction. */
export function leaveSlide(root, { direction = 1 } = {}) {
  const tl = gsap.timeline();
  if (!root) return tl;
  const parts = [...root.querySelectorAll('[data-leave], [data-anim]')];
  gsap.killTweensOf(parts);
  if (prefersReducedMotion()) {
    tl.to(parts, { opacity: 0, duration: 0.2 });
    return tl;
  }
  tl.to(parts, {
    opacity: 0,
    y: -48 * direction,
    duration: 0.5,
    ease: 'power3.in',
    stagger: { each: 0.025, from: direction > 0 ? 'start' : 'end' },
  });
  return tl;
}

/** Hide parts before their first entrance so nothing flashes. */
export function primeSlide(root) {
  if (!root || prefersReducedMotion()) return;
  gsap.set(root.querySelectorAll('[data-anim]'), { opacity: 0 });
}

/** Count a number up inside el (text like "180+" keeps its suffix). */
export function countUp(el, { duration = 1.6, delay = 0 } = {}) {
  if (!el) return null;
  const target = el.dataset.value;
  const match = /^([\d.]+)(.*)$/.exec(target || '');
  if (!match || prefersReducedMotion()) {
    el.textContent = target;
    return null;
  }
  const end = parseFloat(match[1]);
  const decimals = (match[1].split('.')[1] || '').length;
  const state = { v: 0 };
  return gsap.to(state, {
    v: end,
    duration,
    delay,
    ease: 'power2.out',
    onUpdate: () => {
      el.textContent = state.v.toFixed(decimals) + match[2];
    },
  });
}

const GLYPHS = '01<>/{}[]#$%&*+=?ABCDEFGHJKLMNPQRSTUVWXYZ';

/**
 * Decode: text resolves out of code characters, left to right — the "software"
 * signature. Latin only (Arabic shaping would break mid-way); RTL just fades.
 */
export function decode(el, { duration = 0.9, delay = 0 } = {}) {
  if (!el) return null;
  const finalText = el.dataset.text ?? el.textContent;
  el.dataset.text = finalText;
  const rtl = getComputedStyle(el).direction === 'rtl' || /[\u0600-\u06ff]/.test(finalText);
  if (prefersReducedMotion() || rtl) {
    el.textContent = finalText;
    return gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.4, delay });
  }
  const state = { p: 0 };
  const chars = Array.from(finalText);
  // keep the final width so the line does not jump while scrambling
  el.style.minWidth = `${el.offsetWidth}px`;
  return gsap.to(state, {
    p: 1,
    duration,
    delay,
    ease: 'power2.out',
    onUpdate() {
      const settled = Math.floor(state.p * chars.length);
      let out = '';
      for (let i = 0; i < chars.length; i += 1) {
        const c = chars[i];
        if (i < settled || c === ' ') out += c;
        else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
    },
    onComplete() {
      el.textContent = finalText;
      el.style.minWidth = '';
    },
  });
}
