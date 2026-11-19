'use client';

import { useState } from 'react';
import Icon3D from '../Icon3D';
import SectionHead from '../ui/SectionHead';
import { useTabKeys } from '../useTabKeys';

/*
 * The stack as an object: six glass plates in isometric space, tools at the
 * bottom, frontend on top. Choosing a layer lifts its plate and opens its
 * tools. The plates are decorative; the tab list carries the meaning.
 */
export default function Stack({ copy, index, headingId }) {
  const s = copy.stack;
  const groups = s.groups;
  const [active, setActive] = useState(0);
  const onKeyDown = useTabKeys(groups.length, active, setActive, 'vertical');
  const g = groups[active];

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

      <div className="j13-stack__stage" data-reveal="scale">
        <div className="j13-iso" aria-hidden="true">
          {groups.map((grp, i) => (
            <div key={grp.label} className={`j13-plate${i === active ? ' is-active' : ''}`} style={{ '--i': groups.length - 1 - i }}>
              <span className="j13-plate__label">{grp.label}</span>
            </div>
          ))}
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
