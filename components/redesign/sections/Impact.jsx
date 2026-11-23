import Icon3D from '../Icon3D';
import SectionHead from '../ui/SectionHead';

/*
 * Impact (stats). A bento of six numbers — the headline figure gets the big
 * tile — that count up as they scroll into view, then a running band of the
 * platforms we ship on (the logos take the text colour, so they fit both themes).
 */
export default function Impact({ copy, index, headingId }) {
  const s = copy.impact;
  const logos = s.logos;

  return (
    <>
      <div className="j13-container">
        <SectionHead index={index} id={headingId} eyebrow={s.eyebrow} title={s.title} lead={s.lead} align="split" />
        <ul className="j13-impact" data-reveal="stagger">
          {s.items.map((it, i) => (
            <li key={it.label} className={`j13-glass j13-stat j13-stat--${i}`} data-tilt="3">
              <Icon3D name={it.icon} size={i === 0 ? 156 : 84} className="j13-stat__icon" />
              <p className="j13-stat__value">
                <span data-count data-value={`${it.value}${it.suffix}`}>{`${it.value}${it.suffix}`}</span>
              </p>
              <h3 className="j13-stat__label">{it.label}</h3>
              <p className="j13-stat__desc">{it.desc}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="j13-band" data-reveal="up">
        <p className="j13-band__label">{s.platformsLabel}</p>
        <div className="j13-marquee">
          {[0, 1].map((copyIndex) => (
            <ul key={copyIndex} className="j13-marquee__track" aria-hidden={copyIndex === 1 ? 'true' : undefined}>
              {logos.map((l) => (
                <li key={l.slug} className="j13-brandmark">
                  <span className="j13-brandmark__img" style={{ '--src': `url(/partners/${l.slug}.svg)` }} aria-hidden="true" />
                  <span className="j13-brandmark__name">{l.name}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </>
  );
}
