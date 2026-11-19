import Glyph from '../Glyph';
import Icon3D from '../Icon3D';
import Button from '../ui/Button';
import SectionHead from '../ui/SectionHead';

// which contact-form choice each service pre-selects
const SERVICE_TO_FORM = { strategy: 'other', design: 'other', web: 'web', mobile: 'mobile', cloud: 'cloud', data: 'ai' };

/*
 * Services as a bento: six tiles of different sizes (strategy leads, data &
 * AI closes as a wide band). Each tile tilts toward the pointer under a
 * spotlight; its stack chips slide up on hover / focus; the round arrow opens
 * the brief with that service already chosen.
 */
export default function Services({ copy, index, headingId, onNavigate }) {
  const s = copy.services;
  return (
    <div className="j13-container">
      <SectionHead index={index} id={headingId} eyebrow={s.eyebrow} title={s.title} lead={s.lead} align="split" />
      <ul className="j13-bento" data-reveal="stagger">
        {s.items.map((it, i) => (
          <li key={it.key} className={`j13-glass j13-svc j13-svc--${it.key}`} data-tilt="3">
            <div className="j13-svc__top">
              <span className="j13-svc__num">{String(i + 1).padStart(2, '0')}</span>
              <Icon3D name={it.icon} size={i === 0 ? 150 : 84} className="j13-svc__icon" />
            </div>
            <div className="j13-svc__body">
              <h3 className="j13-h3">{it.title}</h3>
              <p className="j13-svc__desc">{it.desc}</p>
              <ul className="j13-chips j13-svc__chips" aria-label={s.stackLabel}>
                {it.tech.map((tag) => (
                  <li key={tag} className="j13-chip">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
            <Button
              variant="icon"
              size="md"
              className="j13-svc__go"
              label={`${s.cta}: ${it.title}`}
              icon={<Glyph name="arrow" size={18} flip />}
              onClick={() => onNavigate('contact', { service: SERVICE_TO_FORM[it.key] })}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
