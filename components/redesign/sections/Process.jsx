'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Icon3D from '../Icon3D';
import SectionHead from '../ui/SectionHead';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../motion';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/*
 * Process as a scroll-driven timeline. The left column stays pinned (CSS
 * sticky) with a big phase counter and a stepper; the right column is the
 * timeline itself. A light fills the rail as you scroll, the phase reaching
 * the middle of the screen lights up, and the stepper follows. Clicking a
 * step scrolls to that phase. On small screens the aside simply stacks.
 */
export default function Process({ copy, index, headingId, scrollToEl }) {
  const p = copy.process;
  const n = p.phases.length;
  const [cur, setCur] = useState(0);
  const listRef = useRef(null);
  const fillRef = useRef(null);
  const phaseRefs = useRef([]);

  useIsoLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;
    const ctx = gsap.context(() => {
      if (!prefersReducedMotion()) {
        gsap.fromTo(
          fillRef.current,
          { scaleY: 0 },
          { scaleY: 1, ease: 'none', scrollTrigger: { trigger: list, start: 'top 55%', end: 'bottom 55%', scrub: 0.6 } },
        );
      } else {
        gsap.set(fillRef.current, { scaleY: 1 });
      }
      phaseRefs.current.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => self.isActive && setCur(i),
        });
      });
    }, list);
    return () => ctx.revert();
  }, []);

  const phase = p.phases[cur];

  return (
    <div className="j13-container j13-process">
      <div className="j13-process__aside">
        <SectionHead index={index} id={headingId} eyebrow={p.eyebrow} title={p.title} lead={p.lead} />
        <div className="j13-process__meter" aria-hidden="true">
          <p className="j13-process__big">
            <span className="j13-roll">
              <b key={cur}>{String(cur + 1).padStart(2, '0')}</b>
            </span>
            <small>/{String(n).padStart(2, '0')}</small>
          </p>
          <p className="j13-process__now" key={phase.title}>
            {phase.title}
          </p>
        </div>
        <ol className="j13-stepper" aria-label={p.pick}>
          {p.phases.map((ph, i) => (
            <li key={ph.title}>
              <button
                type="button"
                className="j13-stepper__btn"
                aria-current={i === cur ? 'step' : undefined}
                onClick={() => scrollToEl(phaseRefs.current[i], -window.innerHeight * 0.3)}
              >
                <span className="j13-stepper__dot" aria-hidden="true" />
                <span className="j13-stepper__label">{ph.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div ref={listRef} className="j13-timeline">
        <span className="j13-timeline__rail" aria-hidden="true">
          <i ref={fillRef} className="j13-timeline__fill" />
        </span>
        <ol className="j13-timeline__list">
        {p.phases.map((ph, i) => (
          <li
            key={ph.title}
            ref={(el) => {
              phaseRefs.current[i] = el;
            }}
            className={`j13-phase${i === cur ? ' is-active' : ''}${i < cur ? ' is-done' : ''}`}
          >
            <span className="j13-phase__node" aria-hidden="true">
              <Icon3D name={p.icons[i]} size={44} />
            </span>
            <article className="j13-glass j13-phase__card">
              <p className="j13-phase__meta">
                <span>{p.phaseOf(i + 1, n)}</span>
                <span className="j13-phase__time">{ph.duration}</span>
              </p>
              <h3 className="j13-h3">{ph.title}</h3>
              <p className="j13-phase__desc">{ph.desc}</p>
              <ul className="j13-phase__points">
                {ph.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </article>
          </li>
        ))}
        </ol>
      </div>
    </div>
  );
}
