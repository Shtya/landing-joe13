'use client';

import { useEffect, useRef, useState } from 'react';
import Icon3D from '../Icon3D';
import SectionHead from '../ui/SectionHead';
import { useTabKeys } from '../useTabKeys';
import { gsap, prefersReducedMotion } from '../motion';

/*
 * The stack as an object: an exploded isometric tower of six glass slabs with
 * real thickness — tools at the bottom, frontend on top. A light beam runs up
 * through every layer with a data pulse travelling along it. Choosing a layer
 * opens a gap above its slab, lights its edges, and raises a hologram of the
 * layer (3D icon + name, always facing the viewer). The tower floats and
 * leans toward the pointer. The tab list carries the meaning; the tower is
 * decorative, but clicking a slab selects it too.
 */
export default function Stack({ copy, index, headingId }) {
  const s = copy.stack;
  const groups = s.groups;
  const n = groups.length;
  const [active, setActive] = useState(0);
  const onKeyDown = useTabKeys(n, active, setActive, 'vertical');
  const g = groups[active];
  const stageRef = useRef(null);
  const isoRef = useRef(null);

  // lean toward the pointer (fine pointers, motion allowed)
  useEffect(() => {
    const stage = stageRef.current;
    const iso = isoRef.current;
    if (!stage || !iso || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return undefined;
    const qx = gsap.quickTo(iso, '--tx', { duration: 1.1, ease: 'power3.out' });
    const qz = gsap.quickTo(iso, '--tz', { duration: 1.1, ease: 'power3.out' });
    const onMove = (e) => {
      const r = stage.getBoundingClientRect();
      qz(((e.clientX - r.left) / r.width - 0.5) * 16);
      qx(-((e.clientY - r.top) / r.height - 0.5) * 10);
    };
    const onLeave = () => {
      qx(0);
      qz(0);
    };
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerleave', onLeave);
    return () => {
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  // slab z-order: index 0 (frontend) sits on top
  const level = (i) => n - 1 - i;
  const activeLevel = level(active);

  return (
    <div className="j13-container j13-stack">
      <div className="j13-stack__copy">
        <SectionHead index={index} id={headingId} eyebrow={s.eyebrow} title={`${s.title[0]} ${s.title[1]}`} lead={s.body} />
        <div className="j13-layers" role="tablist" aria-orientation="vertical" aria-label={s.pick} onKeyDown={onKeyDown} data-reveal="stagger">
          {groups.map((grp, i) => (
            <button
              key={grp.label}
              id={`layer-tab-${i}`}
              type="button"
              role="tab"
              className="j13-layer"
              aria-selected={i === active}
              aria-controls="layer-panel"
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(i)}
            >
              <Icon3D name={s.icons[i]} size={34} />
              <span>{grp.label}</span>
              <span className="j13-layer__count">{String(grp.items.length).padStart(2, '0')}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="j13-stack__stage" ref={stageRef} data-reveal="scale">
        <div className="j13-tower" aria-hidden="true" style={{ '--n': n }}>
          <span className="j13-tower__floor" />
          <div className="j13-tower__iso" ref={isoRef}>
            <span className="j13-tower__beam" style={{ '--h': n - 1 }}>
              <i />
            </span>
            {groups.map((grp, i) => {
              const lv = level(i);
              const state = i === active ? ' is-active' : lv > activeLevel ? ' is-above' : '';
              return (
                <div key={grp.label} className={`j13-slab3${state}`} style={{ '--lv': lv }} onClick={() => setActive(i)}>
                  <span className="j13-slab3__top">
                    <span className="j13-slab3__grid" />
                    <span className="j13-slab3__tag">{String(i + 1).padStart(2, '0')}</span>
                  </span>
                  <span className="j13-slab3__side j13-slab3__side--r" />
                  <span className="j13-slab3__side j13-slab3__side--b" />
                  <span className="j13-slab3__holo">
                    <Icon3D name={s.icons[i]} size={72} />
                    <b>{grp.label}</b>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <section id="layer-panel" role="tabpanel" aria-labelledby={`layer-tab-${active}`} className="j13-glass j13-layer-panel" key={g.label}>
          <div className="j13-layer-panel__head">
            <Icon3D name={s.icons[active]} size={56} />
            <div>
              <h3 className="j13-h3">{g.label}</h3>
              <p>{g.blurb}</p>
            </div>
          </div>
          <ul className="j13-chips">
            {g.items.map((item) => (
              <li key={item} className="j13-chip">
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
