import Glyph from '../Glyph';
import Icon3D from '../Icon3D';
import Button from '../ui/Button';
import SectionHead from '../ui/SectionHead';

/*
 * Plans. Three comparable cards on one baseline: same anatomy (icon, name,
 * blurb, price, included list, CTA), so the eye compares straight across.
 * The popular plan stands taller with a live gradient border.
 * Choosing a plan opens the brief with the plan already written in.
 */
export default function Plans({ copy, index, headingId, onNavigate }) {
  const p = copy.plans;
  return (
    <div className="j13-container">
      <SectionHead index={index} id={headingId} eyebrow={p.eyebrow} title={p.title} lead={p.lead} align="split" />
      <ul className="j13-plans" data-reveal="stagger">
        {p.plans.map((plan, i) => (
          <li key={plan.name} className={`j13-plan${plan.featured ? ' is-featured' : ''}`}>
            <article className="j13-glass j13-plan__card" aria-labelledby={`plan-${i}`}>
              {plan.featured ? <span className="j13-plan__flag">{p.popular}</span> : null}
              <div className="j13-plan__top">
                <Icon3D name={p.icons[i]} size={64} />
                <div>
                  <h3 id={`plan-${i}`} className="j13-h3">
                    {plan.name}
                  </h3>
                  <p className="j13-plan__blurb">{plan.blurb}</p>
                </div>
              </div>
              <p className="j13-plan__price">
                <b>{plan.price}</b>
                {!plan.custom ? <span>{p.month}</span> : null}
              </p>
              <p className="j13-plan__included">{p.included}</p>
              <ul className="j13-plan__features">
                {plan.features.map((f) => (
                  <li key={f}>
                    <span className="j13-plan__check" aria-hidden="true">
                      <Glyph name="check" size={14} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className="j13-plan__cta"
                variant={plan.featured ? 'primary' : 'secondary'}
                size="md"
                onClick={() => onNavigate('contact', { message: p.prefill(plan.name) })}
              >
                {plan.custom ? p.custom : p.choose}
              </Button>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
