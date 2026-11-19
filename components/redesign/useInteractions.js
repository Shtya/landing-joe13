'use client';

import { useEffect } from 'react';
import gsap from 'gsap';

/*
 * Pointer layer for the whole page, by event delegation (one listener set):
 *   .j13-btn--prime, .j13-icon-btn, [data-magnetic]  → magnetic pull toward the pointer
 *   [data-tilt]                                      → 3D tilt (rotation only, ±deg)
 *   .j13-slab                                        → edge light follows the pointer (--mx/--my)
 *   [data-parallax] > img                            → image drifts against the pointer
 *   .j13-btn                                         → chamfered ripple on press
 * Fine pointers only; nothing runs under reduced motion.
 */

const MAGNET = '.j13-btn--prime, .j13-icon-btn, [data-magnetic]';

export function useInteractions(rootRef, enabled = true) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;

    // ripple works for every pointer type and is quick enough to keep under reduced motion off
    const onDown = (e) => {
      const btn = e.target.closest?.('.j13-btn');
      if (!btn || reduced) return;
      const r = btn.getBoundingClientRect();
      const dot = document.createElement('span');
      dot.className = 'j13-ripple';
      dot.style.left = `${e.clientX - r.left}px`;
      dot.style.top = `${e.clientY - r.top}px`;
      btn.appendChild(dot);
      dot.addEventListener('animationend', () => dot.remove(), { once: true });
    };
    root.addEventListener('pointerdown', onDown);

    if (reduced || !fine) {
      return () => root.removeEventListener('pointerdown', onDown);
    }

    const movers = new WeakMap();
    const getMover = (el, props, duration) => {
      let m = movers.get(el);
      if (!m) {
        if (props.includes('rotationX')) gsap.set(el, { transformPerspective: 900 });
        m = Object.fromEntries(props.map((p) => [p, gsap.quickTo(el, p, { duration, ease: 'power3.out' })]));
        movers.set(el, m);
      }
      return m;
    };

    let magnet = null;
    let tilt = null;
    let slab = null;
    let para = null;

    const release = () => {
      if (magnet) {
        const m = getMover(magnet, ['x', 'y'], 0.6);
        m.x(0);
        m.y(0);
      }
      if (tilt) {
        const m = getMover(tilt, ['rotationX', 'rotationY'], 0.8);
        m.rotationX(0);
        m.rotationY(0);
      }
      if (slab) slab.classList.remove('is-lit');
      if (para) {
        const m = getMover(para, ['x', 'y'], 1);
        m.x(0);
        m.y(0);
      }
    };

    let frame = 0;
    let last = null;
    const onMove = (e) => {
      last = e;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const ev = last;
        const t = ev.target;
        if (!(t instanceof Element)) return;

        const nMagnet = t.closest(MAGNET);
        const nTilt = t.closest('[data-tilt]');
        const nSlab = t.closest('.j13-slab');
        const nParaHost = t.closest('[data-parallax]');
        const nPara = nParaHost?.querySelector('img') ?? null;

        if (nMagnet !== magnet && magnet) {
          const m = getMover(magnet, ['x', 'y'], 0.6);
          m.x(0);
          m.y(0);
        }
        if (nTilt !== tilt && tilt) {
          const m = getMover(tilt, ['rotationX', 'rotationY'], 0.8);
          m.rotationX(0);
          m.rotationY(0);
        }
        if (nSlab !== slab && slab) slab.classList.remove('is-lit');
        if (nPara !== para && para) {
          const m = getMover(para, ['x', 'y'], 1);
          m.x(0);
          m.y(0);
        }
        magnet = nMagnet;
        tilt = nTilt;
        slab = nSlab;
        para = nPara;

        if (magnet) {
          const r = magnet.getBoundingClientRect();
          const m = getMover(magnet, ['x', 'y'], 0.6);
          m.x((ev.clientX - (r.left + r.width / 2)) * 0.22);
          m.y((ev.clientY - (r.top + r.height / 2)) * 0.32);
        }
        if (tilt) {
          const r = tilt.getBoundingClientRect();
          const m = getMover(tilt, ['rotationX', 'rotationY'], 0.8);
          const max = Number(tilt.dataset.tilt) || 6;
          m.rotationY(((ev.clientX - r.left) / r.width - 0.5) * max * 2);
          m.rotationX(-((ev.clientY - r.top) / r.height - 0.5) * max * 2);
        }
        if (slab) {
          const r = slab.getBoundingClientRect();
          slab.style.setProperty('--mx', `${ev.clientX - r.left}px`);
          slab.style.setProperty('--my', `${ev.clientY - r.top}px`);
          slab.classList.add('is-lit');
        }
        if (para) {
          const r = nParaHost.getBoundingClientRect();
          const m = getMover(para, ['x', 'y'], 1);
          m.x(-((ev.clientX - r.left) / r.width - 0.5) * 24);
          m.y(-((ev.clientY - r.top) / r.height - 0.5) * 16);
        }
      });
    };

    root.addEventListener('pointermove', onMove, { passive: true });
    root.addEventListener('pointerleave', release);
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener('pointerdown', onDown);
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', release);
    };
  }, [rootRef, enabled]);
}
