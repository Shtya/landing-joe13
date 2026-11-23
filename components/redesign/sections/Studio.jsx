'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import Icon3D from '../Icon3D';
import { gsap, prefersReducedMotion } from '../motion';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/*
 * About. The statement is read with the scroll: each word lights up as the
 * reader moves through it. Below, Mission / Vision / Approach as tall glass
 * tiles, then the four commitments in a tighter row.
 */
export default function Studio({ copy, index, headingId }) {
  const s = copy.studio;
  const statementRef = useRef(null);

  useIsoLayoutEffect(() => {
    const el = statementRef.current;
    if (!el || prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('.j13-word'),
        { opacity: 0.16 },
        { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: 0.5 } },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div className="j13-container j13-studio">
      <p className="j13-eyebrow" data-reveal="up">
        <span className="j13-eyebrow__num">{String(index).padStart(2, '0')}</span>
        <span className="j13-eyebrow__bar" aria-hidden="true" />
        {s.eyebrow}
      </p>
      <h2 id={headingId} ref={statementRef} className="j13-statement">
        {s.statement.split(' ').map((word, i) => (
          <span key={i} className="j13-word">
            {word}{' '}
          </span>
        ))}
      </h2>
      <p className="j13-lead j13-studio__body" data-reveal="up">
        {s.body}
      </p>

      <ul className="j13-values" data-reveal="stagger">
        {s.values.map((v, i) => (
          <li key={v.title} className="j13-glass j13-value" data-tilt="4">
            <span className="j13-value__num">{String(i + 1).padStart(2, '0')}</span>
            <Icon3D name={v.icon} size={120} className="j13-value__icon" />
            <h3 className="j13-h3">{v.title}</h3>
            <p>{v.body}</p>
          </li>
        ))}
      </ul>

      <h3 className="j13-studio__sub" data-reveal="up">
        {s.commitTitle}
      </h3>
      <ul className="j13-commit" data-reveal="stagger">
        {s.commitments.map((c) => (
          <li key={c.title} className="j13-glass j13-commit__item">
            <Icon3D name={c.icon} size={72} />
            <div>
              <h4>{c.title}</h4>
              <p>{c.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
