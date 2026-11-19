'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/*
 * Cursor companion: a cobalt dot glued to the pointer and a chamfered ring
 * that trails it. The ring opens over anything clickable and shows a short
 * verb when the element asks for one (data-cursor="Play"). The system cursor
 * stays visible — this is an accent, not a replacement.
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return undefined;
    if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const dx = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3.out' });
    const dy = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3.out' });
    const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' });
    const ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });
    let state = '';

    const onMove = (e) => {
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      document.documentElement.classList.add('j13-has-cursor');
      const t = e.target instanceof Element ? e.target : null;
      const labelled = t?.closest('[data-cursor]');
      const hot = t?.closest('a, button, [role="tab"], label, summary');
      const text = t?.closest('input, textarea');
      const next = text ? 'text' : labelled ? 'label' : hot ? 'hot' : '';
      if (next !== state) {
        state = next;
        ring.dataset.state = next;
      }
      if (labelRef.current) labelRef.current.textContent = labelled ? labelled.dataset.cursor : '';
    };
    const onDown = () => ring.classList.add('is-down');
    const onUp = () => ring.classList.remove('is-down');
    const onLeave = () => document.documentElement.classList.remove('j13-has-cursor');

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerleave', onLeave);
      document.documentElement.classList.remove('j13-has-cursor');
    };
  }, []);

  return (
    <div className="j13-cursor" aria-hidden="true">
      <span ref={ringRef} className="j13-cursor__ring">
        <i ref={labelRef} />
      </span>
      <span ref={dotRef} className="j13-cursor__dot" />
    </div>
  );
}
