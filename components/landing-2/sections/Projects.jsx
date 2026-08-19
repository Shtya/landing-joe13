'use client';

import { Reveal } from '../ui';

export default function Projects({ copy }) {
  return (
    <section id="work" className="l2-section" aria-labelledby="l2-work-heading">
      <div className="l2-container">
        <Reveal>
          <span className="l2-kicker">{copy.projects.titleAlt}</span>
          <h2 id="l2-work-heading" className="l2-title">{copy.projects.title}</h2>
        </Reveal>
        <div className="l2-grid-3" style={{ marginTop: '2rem' }}>
          {copy.projects.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 90}>
              <article className="l2-card l2-project-card">
                <div className="l2-index">{item.client}</div>
                <h3>{item.title}</h3>
                <p>{item.challenge}</p>
                <p style={{ marginTop: '0.75rem' }}>{item.solution}</p>
                <div className="l2-stat-row">
                  {item.stats.map((stat) => (
                    <div key={stat.label} className="l2-mini-stat">
                      <b>{stat.value}{stat.suffix}</b>
                      <span>{stat.label}</span>
                    </div>
                  ))}
                </div>
                <div className="l2-chip-row">
                  {item.stack.map((tech) => (
                    <span key={tech} className="l2-chip">{tech}</span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
