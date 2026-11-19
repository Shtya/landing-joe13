'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

/*
 * Boot screen — once per browser session. It waits for what the first scene
 * actually needs (fonts and the ribbon), shows real progress, then lifts away
 * on a chamfered shutter. Click or Escape skips it. Reduced motion: skipped.
 */
export default function Preloader({ ready, onDone, label }) {
  const rootRef = useRef(null);
  const barRef = useRef(null);
  const numRef = useRef(null);
  const [show, setShow] = useState(true);
  const doneRef = useRef(false);
  const progress = useRef({ v: 0 });

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    try {
      sessionStorage.setItem('j13-booted', '1');
    } catch {}
    const el = rootRef.current;
    if (!el) {
      onDone();
      return;
    }
    gsap
      .timeline({ onComplete: () => setShow(false) })
      .to(el.querySelectorAll('[data-boot]'), { opacity: 0, y: -16, duration: 0.35, stagger: 0.04, ease: 'power2.in' })
      .call(onDone)
      .to(el, { clipPath: 'polygon(0 0, 100% 0, 100% 0%, 0 0%)', duration: 0.9, ease: 'power4.inOut' }, '-=0.05');
  };

  // Skip entirely when it already ran this session or motion is reduced.
  useEffect(() => {
    let skip = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    try {
      if (sessionStorage.getItem('j13-booted')) skip = true;
    } catch {}
    if (skip) {
      doneRef.current = true;
      setShow(false);
      onDone();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Progress follows the readiness signals; never waits longer than 3.2s.
  useEffect(() => {
    if (doneRef.current) return undefined;
    const target = Math.min(1, ready);
    const tween = gsap.to(progress.current, {
      v: target,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: () => {
        const p = progress.current.v;
        if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
        if (numRef.current) numRef.current.textContent = String(Math.round(p * 100)).padStart(3, '0');
      },
      onComplete: () => {
        if (target >= 1) finish();
      },
    });
    return () => tween.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  useEffect(() => {
    if (doneRef.current) return undefined;
    const cap = window.setTimeout(finish, 3200);
    const onKey = (e) => e.key === 'Escape' && finish();
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(cap);
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!show) return null;

  return (
    <div ref={rootRef} className="j13-boot" role="status" aria-live="polite" aria-label={label} onClick={finish}>
      <div className="j13-boot__mark" data-boot>
        <Image src="/logos/logo-white.png" alt="JOE13" width={260} height={88} sizes="260px" priority />
      </div>
      <div className="j13-boot__meter" data-boot>
        <span className="j13-boot__bar">
          <i ref={barRef} />
        </span>
        <b ref={numRef} className="j13-boot__num">
          000
        </b>
      </div>
    </div>
  );
}
