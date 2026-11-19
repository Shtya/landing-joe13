'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import Button from '../ui/Button';
import SectionHead from '../ui/SectionHead';
import { gsap } from '../motion';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/*
 * Work as a horizontal journey. On desktop the case track pins and vertical
 * scroll drives it sideways (leftward in English, rightward in Arabic); each
 * image drifts inside its frame for depth, and a bar tracks progress.
 * Below 1024px, or with reduced motion, it is a native swipe carousel with
 * scroll-snap — no pinning.
 */
export default function Work({ copy, index, headingId, onNavigate, isArabic }) {
  const w = copy.work;
  const items = w.items;
  const pinRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);

  useIsoLayoutEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!pin || !track || !viewport) return undefined;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
      const sign = isArabic ? 1 : -1;
      const move = gsap.to(track, {
        x: () => sign * distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pin,
          start: 'center center',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => gsap.set(barRef.current, { scaleX: self.progress }),
        },
      });
      track.querySelectorAll('.j13-case__img').forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -6 * sign },
          { xPercent: 6 * sign, ease: 'none', scrollTrigger: { trigger: img.closest('.j13-case'), containerAnimation: move, start: 'left right', end: 'right left', scrub: true } },
        );
      });
    });
    // native carousel: the bar follows the swipe
    const onScroll = () => {
      const max = viewport.scrollWidth - viewport.clientWidth;
      if (max > 0) gsap.set(barRef.current, { scaleX: Math.abs(viewport.scrollLeft) / max });
    };
    viewport.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      viewport.removeEventListener('scroll', onScroll);
      mm.revert();
    };
  }, [isArabic]);

  return (
    <div className="j13-work">
      <div className="j13-container">
        <SectionHead index={index} id={headingId} eyebrow={w.eyebrow} title={w.title} lead={w.lead} align="split">
          <p className="j13-hint">
            <span className="j13-hint__arrow" aria-hidden="true" />
            <span className="j13-hint__wide">{w.hint}</span>
            <span className="j13-hint__narrow">{w.hintTouch}</span>
          </p>
        </SectionHead>
      </div>

      <div ref={pinRef} className="j13-work__pin">
        <div ref={viewportRef} className="j13-work__viewport">
          <ol ref={trackRef} className="j13-work__track">
            {items.map((it, i) => (
              <li key={it.title} className="j13-case">
                <article className="j13-glass j13-case__card" aria-labelledby={`case-${i}`}>
                  <figure className="j13-case__media">
                    <Image className="j13-case__img" src={it.preview} alt="" fill sizes="(max-width: 1023px) 86vw, 46vw" />
                    <span className="j13-case__num" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                      <small>/{String(items.length).padStart(2, '0')}</small>
                    </span>
                  </figure>
                  <div className="j13-case__body">
                    <p className="j13-case__sector">{it.sector || it.client}</p>
                    <h3 id={`case-${i}`} className="j13-h3">
                      {it.title}
                    </h3>
                    <dl className="j13-case__story">
                      <div>
                        <dt>{w.challenge}</dt>
                        <dd>{it.challenge}</dd>
                      </div>
                      <div>
                        <dt>{w.solution}</dt>
                        <dd>{it.solution}</dd>
                      </div>
                    </dl>
                    <ul className="j13-case__results" aria-label={w.results}>
                      {it.results.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                    <div className="j13-case__foot">
                      <ul className="j13-chips" aria-label={w.stack}>
                        {it.stack.map((t) => (
                          <li key={t} className="j13-chip">
                            {t}
                          </li>
                        ))}
                      </ul>
                      <Button variant="secondary" size="sm" onClick={() => onNavigate('contact', { message: w.prefill(it.title) })}>
                        {w.cta}
                      </Button>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
        <div className="j13-container">
          <div className="j13-work__progress" aria-hidden="true">
            <i ref={barRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
