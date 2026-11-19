'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import Button from '../ui/Button';
import { gsap, SplitText, EASE, prefersReducedMotion } from '../motion';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/*
 * Hero. The WebGL ribbon (fixed, behind the page) is the interactive object;
 * this layer is the type. After the intro curtain lifts, the headline rises
 * out of its mask letter by letter (word by word in Arabic, so shaping is
 * kept), the accent line sweeps in as one piece, then the rest settles.
 * Scrolling away eases the copy up and out while the ribbon stays.
 */
export default function Hero({ copy, isArabic, onNavigate, introReady, headingId }) {
  const hero = copy.hero;
  const rootRef = useRef(null);
  const titleRef = useRef(null);
  const tlRef = useRef(null);

  // intro: set the hidden state once, play when the shell says the page is ready
  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    const title = titleRef.current;
    if (!root || !title) return undefined;
    if (prefersReducedMotion()) {
      gsap.set(root.querySelectorAll('[data-hero]'), { opacity: 1 });
      return undefined;
    }
    const plain = title.querySelectorAll('.j13-hero__line:not(.is-accent)');
    const split = SplitText.create(plain, { type: isArabic ? 'words' : 'chars,words', wordsClass: 'j13-hero__word', charsClass: 'j13-hero__char' });
    const units = isArabic ? split.words : split.chars;
    const accent = title.querySelectorAll('.j13-hero__line.is-accent');
    const rest = root.querySelectorAll('[data-hero]');

    gsap.set(units, { yPercent: 115, rotate: isArabic ? 0 : 8, opacity: 0 });
    gsap.set(accent, { yPercent: 115, opacity: 0 });
    gsap.set(rest, { opacity: 0, y: 24 });
    gsap.set(title, { opacity: 1 });

    const tl = gsap.timeline({ paused: true });
    tl.to(units, { yPercent: 0, rotate: 0, opacity: 1, duration: 1.2, ease: EASE.out, stagger: { each: isArabic ? 0.08 : 0.024 } }, 0)
      .to(accent, { yPercent: 0, opacity: 1, duration: 1.3, ease: EASE.out }, 0.22)
      .to(rest, { opacity: 1, y: 0, duration: 1, ease: EASE.out, stagger: 0.08, clearProps: 'transform' }, 0.45);
    tlRef.current = tl;

    return () => {
      tl.kill();
      split.revert();
      gsap.set([...accent, ...rest], { clearProps: 'all' });
    };
  }, [isArabic]);

  useEffect(() => {
    if (introReady) tlRef.current?.play();
  }, [introReady]);

  // scroll-out + pointer parallax (fine pointers only)
  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return undefined;
    const inner = root.querySelector('.j13-hero__inner');
    const ctx = gsap.context(() => {
      gsap.to(inner, {
        yPercent: -18,
        opacity: 0.1,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, root);

    let cleanupPointer = () => {};
    if (window.matchMedia('(pointer: fine)').matches) {
      const title = titleRef.current;
      const qx = gsap.quickTo(title, 'x', { duration: 1.2, ease: 'power3.out' });
      const qy = gsap.quickTo(title, 'y', { duration: 1.2, ease: 'power3.out' });
      const onMove = (e) => {
        qx((e.clientX / window.innerWidth - 0.5) * -18);
        qy((e.clientY / window.innerHeight - 0.5) * -12);
      };
      root.addEventListener('pointermove', onMove);
      cleanupPointer = () => root.removeEventListener('pointermove', onMove);
    }
    return () => {
      cleanupPointer();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="j13-hero">
      <div className="j13-container j13-hero__inner">
        <p className="j13-pill" data-hero>
          <span className="j13-pill__dot" aria-hidden="true" />
          {hero.badge}
        </p>

        <h1 id={headingId} ref={titleRef} className="j13-hero__title" aria-label={hero.lines.join(' ')}>
          {hero.lines.map((line, i) => (
            <span key={line} className="j13-hero__mask" aria-hidden="true">
              <span className={`j13-hero__line${i === hero.accentLine ? ' is-accent' : ''}`}>{line}</span>
            </span>
          ))}
        </h1>

        <div className="j13-hero__row">
          <p className="j13-lead j13-hero__sub" data-hero>
            {hero.sub}
          </p>
          <div className="j13-hero__actions" data-hero>
            <Button size="lg" href="#contact" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }}>
              {hero.primary}
            </Button>
            <Button size="lg" variant="secondary" arrow={false} href="#work" onClick={(e) => { e.preventDefault(); onNavigate('work'); }}>
              {hero.secondary}
            </Button>
          </div>
        </div>

        <dl className="j13-hero__proof" data-hero>
          {hero.proof.map((p) => (
            <div key={p.label}>
              <dt>{p.label}</dt>
              <dd>{p.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <a className="j13-scrollcue" href="#impact" data-hero onClick={(e) => { e.preventDefault(); onNavigate('impact'); }}>
        <span className="j13-scrollcue__line" aria-hidden="true">
          <i />
        </span>
        {copy.ui.scroll}
      </a>
    </div>
  );
}
