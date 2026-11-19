'use client';

/**
 * Vertical bullet rail — fixed on the right edge in both LTR and RTL.
 * Diamonds mark each slide; a single light pip travels along the track to
 * the active one. Labels slide out on hover and keyboard focus.
 */
export default function SlideRail({ slides, active, onSelect, label, hint }) {
  return (
    <nav className="j13-rail" aria-label={label} style={{ '--rail-i': active }}>
      <p className="j13-rail__count" aria-hidden="true">
        <b key={active}>{String(active + 1).padStart(2, '0')}</b>
        <span>/{String(slides.length).padStart(2, '0')}</span>
      </p>
      <div className="j13-rail__list">
        <span className="j13-rail__pip" aria-hidden="true" />
        <ol>
        {slides.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              className="j13-rail__btn"
              aria-current={i === active ? 'true' : undefined}
              aria-label={s.name}
              onClick={() => onSelect(i)}
            >
              <span className="j13-rail__mark" aria-hidden="true" />
              <span className="j13-rail__label" aria-hidden="true">
                {s.name}
              </span>
            </button>
          </li>
        ))}
        </ol>
      </div>
      <p className="j13-rail__hint" aria-hidden="true">
        {hint}
      </p>
    </nav>
  );
}
