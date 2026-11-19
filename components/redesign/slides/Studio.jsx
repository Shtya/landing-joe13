'use client';

import Icon3D from '../Icon3D';

export default function Studio({ copy }) {
  const s = copy.studio;
  return (
    <div className="j13-studio">
      <div className="j13-studio__top">
        <h2 className="j13-studio__statement j13-chrome" data-anim="title">
          {s.statement}
        </h2>
        <p className="j13-lead" data-anim="fade">
          {s.body}
        </p>
      </div>
      <ul className="j13-values">
        {s.values.map((v) => (
          <li key={v.title} data-anim="fade" data-tilt="6">
            <Icon3D name={v.icon} size={72} />
            <h3 className="j13-h3">{v.title}</h3>
            <p className="j13-small">{v.body}</p>
          </li>
        ))}
      </ul>
      <dl className="j13-studio__metrics">
        {s.stats.map((stat) => (
          <div key={stat.label} className="j13-metric" data-anim="fade">
            <dt className="j13-metric__label">
              <Icon3D name={stat.icon} size={30} />
              {stat.label}
            </dt>
            <dd className="j13-metric__value j13-chrome" data-count data-value={`${stat.value}${stat.suffix}`}>
              {`${stat.value}${stat.suffix}`}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
