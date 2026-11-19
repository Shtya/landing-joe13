'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { EASE, prefersReducedMotion } from '../motion';
import { useTabKeys } from '../useTabKeys';
import Icon3D from '../Icon3D';
import Glyph from '../Glyph';

export default function Process({ copy, isArabic }) {
  const p = copy.process;
  const [active, setActive] = useState(0);
  const panelRef = useRef(null);
  const first = useRef(true);
  const onKeyDown = useTabKeys(p.phases.length, active, setActive, 'horizontal');

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!panelRef.current || prefersReducedMotion()) return;
    gsap.fromTo(
      panelRef.current.querySelectorAll('[data-phase]'),
      { opacity: 0, x: 18 },
      { opacity: 1, x: 0, duration: 0.55, ease: EASE.out, stagger: 0.04, clearProps: 'transform' },
    );
  }, [active]);

  const phase = p.phases[active];

  return (
    <div className="j13-process">
      <div className="j13-process__head">
        <h2 className="j13-h2 j13-chrome" data-anim="title">
          {p.title}
        </h2>
        <p className="j13-lead" data-anim="fade">
          {p.lead}
        </p>
      </div>

      <div className="j13-track" role="tablist" aria-label={p.title} style={{ '--p': active }} onKeyDown={onKeyDown} data-anim="fade">
        <span className="j13-track__fill" aria-hidden="true" />
        {p.phases.map((ph, i) => (
          <button
            key={ph.title}
            id={`phase-tab-${i}`}
            type="button"
            role="tab"
            className="j13-step"
            aria-selected={i === active}
            aria-controls="phase-panel"
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
          >
            <span className="j13-step__node">
              <Icon3D name={p.icons[i]} size={54} />
              <i>{String(i + 1).padStart(2, '0')}</i>
            </span>
            <span className="j13-step__title">{ph.title}</span>
            <span className="j13-step__time">{ph.duration}</span>
          </button>
        ))}
      </div>

      <div
        ref={panelRef}
        id="phase-panel"
        role="tabpanel"
        aria-labelledby={`phase-tab-${active}`}
        className="j13-slab j13-phase"
        data-anim="slab"
      >
        <div className="j13-phase__art" data-phase aria-hidden="true">
          <Icon3D key={active} name={p.icons[active]} size={120} />
        </div>
        <div className="j13-phase__body" data-phase>
          <p className="j13-phase__meta">
            {p.phaseOf(active + 1, p.phases.length)} <i aria-hidden="true" /> {phase.duration}
          </p>
          <h3 className="j13-h3">{phase.title}</h3>
          <p className="j13-lead">{phase.desc}</p>
        </div>
        <div className="j13-phase__side">
          <ul className="j13-phase__points" data-phase>
            {phase.points.map((pt) => (
              <li key={pt}>{pt}</li>
            ))}
          </ul>
          <div className="j13-case__nav" data-phase>
            <button type="button" className="j13-icon-btn" onClick={() => setActive((active - 1 + p.phases.length) % p.phases.length)} aria-label={copy.ui.previous}>
              <Glyph name={isArabic ? 'next' : 'prev'} size={18} />
            </button>
            <button type="button" className="j13-btn j13-btn--ghost j13-btn--sm" onClick={() => setActive((active + 1) % p.phases.length)}>
              {active === p.phases.length - 1 ? p.restart : `${p.next}: ${p.phases[(active + 1) % p.phases.length].title}`}
              <Glyph name="arrow" size={16} flip />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
