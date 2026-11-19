'use client';

import { forwardRef } from 'react';

/*
 * Side progress indicator. Fixed at the inline end (right in English, left in
 * Arabic). The counter rolls to the current section; the track fills with the
 * page's scroll progress (--progress is written by the shell, no re-render);
 * each mark jumps to its section and names it on hover / focus.
 * Hidden below 1024px, where a thin progress bar runs along the top instead.
 */
const SectionRail = forwardRef(function SectionRail({ sections, active, onSelect, label }, ref) {
  const n = sections.length;
  return (
    <>
      <nav ref={ref} className="j13-rail" aria-label={label} style={{ '--n': n }}>
        <p className="j13-rail__count" aria-hidden="true">
          <span className="j13-rail__roll">
            <b key={active}>{String(active + 1).padStart(2, '0')}</b>
          </span>
          <span className="j13-rail__total">/{String(n).padStart(2, '0')}</span>
        </p>
        <div className="j13-rail__track" aria-hidden="true">
          <i className="j13-rail__fill" />
        </div>
        <ol className="j13-rail__list">
          {sections.map((s, i) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="j13-rail__mark"
                aria-current={i === active ? 'true' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  onSelect(s.id);
                }}
              >
                <span className="j13-rail__dot" aria-hidden="true" />
                <span className="j13-rail__label">{s.name}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="j13-topbar" aria-hidden="true">
        <i />
      </div>
    </>
  );
});

export default SectionRail;
