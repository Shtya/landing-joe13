'use client';

import Glyph from '../Glyph';
import Icon3D from '../Icon3D';

export default function Plans({ copy, onNavigate }) {
  const p = copy.plans;

  return (
    <div className="j13-plans">
      <div className="j13-plans__head">
        <h2 className="j13-h2 j13-chrome" data-anim="title">
          {p.title}
        </h2>
        <p className="j13-lead" data-anim="fade">
          {p.lead}
        </p>
      </div>
      <ul className="j13-plans__grid">
        {p.plans.map((plan, i) => (
          <li key={plan.name} className={`j13-slab j13-plan${plan.featured ? ' is-featured' : ''}`} data-anim="slab" data-tilt="5">
            <div className="j13-plan__top">
              <Icon3D name={p.icons[i]} size={56} />
              {plan.featured && <span className="j13-plan__flag">{p.popular}</span>}
            </div>
            <h3 className="j13-h3">{plan.name}</h3>
            <p className="j13-small">{plan.blurb}</p>
            <p className="j13-plan__price">
              <b data-decode>{plan.price}</b>
              {!plan.custom && <span>{p.month}</span>}
            </p>
            <ul className="j13-plan__features">
              {plan.features.map((f) => (
                <li key={f}>
                  <Glyph name="check" size={16} />
                  {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className={`j13-btn ${plan.featured ? 'j13-btn--prime' : 'j13-btn--ghost'} j13-plan__cta`}
              onClick={() => onNavigate('contact', { message: p.prefill(plan.name) })}
            >
              {plan.custom ? p.custom : p.choose}
              <span className="j13-btn__chip" aria-hidden="true">
                <Glyph name="arrow" size={16} flip />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
