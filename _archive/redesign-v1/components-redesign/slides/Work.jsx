'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import Glyph from '../Glyph';
import { EASE, decode, prefersReducedMotion } from '../motion';
import { useTabKeys } from '../useTabKeys';

export default function Work({ copy, isArabic }) {
  const w = copy.work;
  const items = w.items;
  const [active, setActive] = useState(0);
  const caseRef = useRef(null);
  const dirRef = useRef(1);
  const first = useRef(true);
  const onKeyDown = useTabKeys(items.length, active, (i) => select(i), 'vertical');

  function select(i) {
    dirRef.current = i > active ? 1 : -1;
    setActive(i);
  }

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const el = caseRef.current;
    if (!el || prefersReducedMotion()) return;
    const media = el.querySelector('.j13-case__media');
    const d = dirRef.current;
    const tl = gsap.timeline();
    tl.fromTo(
      media,
      { clipPath: d > 0 ? 'inset(0% 0% 100% 0%)' : 'inset(100% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: EASE.inOut, clearProps: 'clipPath' },
    ).fromTo(
      el.querySelectorAll('[data-case]'),
      { opacity: 0, y: 16 * d },
      { opacity: 1, y: 0, duration: 0.6, ease: EASE.out, stagger: 0.05, clearProps: 'transform' },
      0.15,
    );
    decode(el.querySelector('.j13-case__media h3'), { duration: 0.7 });
    return () => tl.kill();
  }, [active]);

  const item = items[active];
  const next = items[(active + 1) % items.length];

  return (
    <div className="j13-work">
      <div>
        <h2 className="j13-h2 j13-chrome" data-anim="title">
          {w.title}
        </h2>
        <div className="j13-work__list" role="tablist" aria-orientation="vertical" aria-label={w.title} onKeyDown={onKeyDown} data-anim="fade">
          {items.map((it, i) => (
            <button
              key={it.title}
              id={`work-tab-${i}`}
              type="button"
              role="tab"
              className="j13-work__pick"
              aria-selected={i === active}
              aria-controls="work-panel"
              tabIndex={i === active ? 0 : -1}
              onClick={() => select(i)}
            >
              <Image src={it.thumb} alt="" width={44} height={44} sizes="44px" className="j13-work__thumb" />
              <b>{it.title}</b>
              <span>{it.client}</span>
            </button>
          ))}
        </div>
      </div>

      <article
        ref={caseRef}
        id="work-panel"
        role="tabpanel"
        aria-labelledby={`work-tab-${active}`}
        className="j13-slab j13-case"
        data-anim="slab"
      >
        <figure className="j13-case__media" data-parallax>
          <Image
            key={item.preview}
            src={item.preview}
            alt=""
            fill
            sizes="(max-width: 899px) 100vw, 40vw"
            priority={false}
          />
          <figcaption>
            <p className="j13-small" style={{ color: 'rgba(255,255,255,.75)' }}>
              {item.sector || item.client}
            </p>
            <h3 className="j13-h3" key={item.title}>
              {item.title}
            </h3>
          </figcaption>
        </figure>
        <div className="j13-case__body">
          <div data-case>
            <p className="j13-case__label">{w.challenge}</p>
            <p className="j13-small">{item.challenge}</p>
          </div>
          <div data-case>
            <p className="j13-case__label">{w.solution}</p>
            <p className="j13-small">{item.solution}</p>
          </div>
          <div data-case>
            <p className="j13-case__label">{w.results}</p>
            <ul className="j13-case__results">
              {item.results.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
          <ul className="j13-lens__chips" aria-label={w.stack} data-case>
            {item.stack.map((t) => (
              <li key={t} className="j13-chip">
                {t}
              </li>
            ))}
          </ul>
          <div className="j13-case__nav" data-case>
            <button type="button" className="j13-icon-btn" onClick={() => select((active - 1 + items.length) % items.length)} aria-label={copy.ui.previous}>
              <Glyph name={isArabic ? 'next' : 'prev'} size={18} />
            </button>
            <output aria-live="polite">
              {active + 1}/{items.length}
            </output>
            <button type="button" className="j13-icon-btn" onClick={() => select((active + 1) % items.length)} aria-label={`${copy.ui.next}: ${next.title}`}>
              <Glyph name={isArabic ? 'prev' : 'next'} size={18} />
            </button>
          </div>
        </div>
        {/* warm the next image so the reveal never waits on the network */}
        <div aria-hidden="true" style={{ position: 'absolute', width: 1, height: 1, opacity: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <Image key={next.preview} src={next.preview} alt="" fill sizes="(max-width: 899px) 100vw, 40vw" />
        </div>
      </article>
    </div>
  );
}
