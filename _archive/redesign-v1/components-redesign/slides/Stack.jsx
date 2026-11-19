'use client';

import { useEffect, useRef, useState } from 'react';
import { decode } from '../motion';
import Icon3D from '../Icon3D';
import { useTabKeys } from '../useTabKeys';

/*
 * The stack as an object: six glass plates stacked in isometric space,
 * bottom (tools) to top (frontend). Choosing a layer lifts its plate and
 * opens its tools. The plates are decorative; the tab list carries meaning.
 */
export default function Stack({ copy }) {
  const s = copy.stack;
  const groups = s.groups;
  const [active, setActive] = useState(0);
  const onKeyDown = useTabKeys(groups.length, active, setActive, 'vertical');
  const g = groups[active];
  const panelRef = useRef(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    decode(panelRef.current?.querySelector('h3'), { duration: 0.55 });
  }, [active]);

  return (
    <div className="j13-stack">
      <div className="j13-stack__copy">
        <h2 className="j13-h2 j13-chrome" data-anim="title">
          {s.title[0]} {s.title[1]}
        </h2>
        <p className="j13-lead" data-anim="fade">
          {s.body}
        </p>
        <div className="j13-layers" role="tablist" aria-orientation="vertical" aria-label={s.pick} onKeyDown={onKeyDown} data-anim="fade">
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
            </button>
          ))}
        </div>
      </div>

      <div className="j13-stack__stage" data-anim="fade">
        <div className="j13-iso" aria-hidden="true">
          {groups.map((grp, i) => (
            <div
              key={grp.label}
              className={`j13-plate${i === active ? ' is-active' : ''}`}
              style={{ '--i': groups.length - 1 - i }}
            >
              <span className="j13-plate__label">{grp.label}</span>
            </div>
          ))}
        </div>
        <section id="layer-panel" role="tabpanel" aria-labelledby={`layer-tab-${active}`} className="j13-slab j13-layer-panel" key={g.label} data-tilt="4" ref={panelRef}>
          <div className="j13-layer-panel__head">
            <Icon3D name={s.icons[active]} size={56} />
            <div>
              <h3 className="j13-h3">
                {g.label}
              </h3>
              <p className="j13-small">{g.blurb}</p>
            </div>
          </div>
          <ul className="j13-lens__chips">
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
