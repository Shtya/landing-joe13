'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import Button from '../ui/Button';
import HeroScene from './HeroScene';
import { gsap, SplitText, EASE, prefersReducedMotion } from '../motion';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const WEIGHT = 700; // Sora headline weight (variable 100–800)

/*
 * Hero. Left: the type. Right: the "Code → Product" 3D scene (HeroScene).
 * After the intro curtain lifts the headline rises letter by letter (word by
 * word in Arabic, so joining is kept) and each letter fills in from a thin
 * cut to its weight. The accent word carries the brand gradient, one slice
 * per letter so it survives the split.
 */
export default function Hero({ copy, isArabic, onNavigate, introReady, headingId, theme }) {
  const hero = copy.hero;
  const rootRef = useRef(null);
  const titleRef = useRef(null);
  const tlRef = useRef(null);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    const title = titleRef.current;
    if (!root || !title) return undefined;
    const lines = [...title.querySelectorAll('.j13-hero__line')];
    const toSplit = isArabic ? lines.filter((l) => !l.classList.contains('is-accent')) : lines;
    const split = SplitText.create(toSplit, { type: isArabic ? 'words' : 'chars,words', wordsClass: 'j13-hero__word', charsClass: 'j13-hero__char' });

    if (!isArabic) {
      const accent = title.querySelector('.j13-hero__line.is-accent');
      const chars = accent ? [...accent.querySelectorAll('.j13-hero__char')] : [];
      accent?.classList.add('is-split');
      chars.forEach((c, i) => {
        c.style.backgroundSize = `${chars.length * 100}% 100%`;
        c.style.backgroundPosition = `${chars.length > 1 ? (i / (chars.length - 1)) * 100 : 0}% 0`;
      });
    }

    const units = isArabic ? [...split.words] : [...split.chars];
    const wholeLines = isArabic ? lines.filter((l) => l.classList.contains('is-accent')) : [];
    const rest = root.querySelectorAll('[data-hero]');

    if (prefersReducedMotion()) {
      gsap.set([title, ...rest], { opacity: 1 });
      return () => split.revert();
    }
    gsap.set(units, { yPercent: 115, rotate: isArabic ? 0 : 6, opacity: 0, '--hw': 200 });
    gsap.set(wholeLines, { yPercent: 115, opacity: 0 });
    gsap.set(rest, { opacity: 0, y: 24 });
    gsap.set(title, { opacity: 1 });

    const each = isArabic ? 0.08 : 0.024;
    const tl = gsap.timeline({ paused: true });
    tl.to(units, { yPercent: 0, rotate: 0, opacity: 1, duration: 1.2, ease: EASE.out, stagger: { each } }, 0)
      .to(units, { '--hw': WEIGHT, duration: 1.6, ease: 'power3.out', stagger: { each } }, 0.12)
      .to(wholeLines, { yPercent: 0, opacity: 1, duration: 1.3, ease: EASE.out }, 0.22)
      .to(rest, { opacity: 1, y: 0, duration: 1, ease: EASE.out, stagger: 0.08, clearProps: 'transform' }, 0.45);
    tlRef.current = tl;

    return () => {
      tl.kill();
      split.revert();
      title.querySelector('.is-accent')?.classList.remove('is-split');
      gsap.set([...wholeLines, ...rest], { clearProps: 'all' });
    };
  }, [isArabic]);

  useEffect(() => {
    if (introReady) tlRef.current?.play();
  }, [introReady]);

  // scroll-out of the copy
  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return undefined;
    const copyCol = root.querySelector('.j13-hero__copy');
    const ctx = gsap.context(() => {
      gsap.to(copyCol, {
        yPercent: -14,
        opacity: 0.15,
        ease: 'none',
        scrollTrigger: { trigger: root.closest('.j13-section') || root, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="j13-hero">
      <div className="j13-container j13-hero__inner">
        <div className="j13-hero__copy">
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

        <div className="j13-hero__art" data-hero>
          <HeroScene introReady={introReady} theme={theme} isArabic={isArabic} hint={hero.sceneHint} cursorLabel={hero.dragShort} />
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
