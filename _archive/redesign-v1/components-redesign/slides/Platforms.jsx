'use client';

import Icon3D from '../Icon3D';

const NAMES = {
  amazonaws: 'AWS', google: 'Google Cloud', microsoft: 'Microsoft Azure', openai: 'OpenAI', vercel: 'Vercel',
  cloudflare: 'Cloudflare', docker: 'Docker', github: 'GitHub', stripe: 'Stripe', mongodb: 'MongoDB',
  redis: 'Redis', figma: 'Figma', shopify: 'Shopify', slack: 'Slack', twilio: 'Twilio', salesforce: 'Salesforce',
};

export default function Platforms({ copy }) {
  const p = copy.platforms;
  const n = p.logos.length;

  return (
    <div className="j13-platforms">
      <div className="j13-platforms__copy">
        <h2 className="j13-h2 j13-chrome" data-anim="title">
          {p.title}
        </h2>
        <p className="j13-lead" data-anim="fade">
          {p.lead}
        </p>
        <ul className="j13-commit">
          {p.commitments.map((c) => (
            <li key={c.title} data-anim="fade">
              <Icon3D name={c.icon} size={60} />
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </li>
          ))}
        </ul>
      </div>

      <figure className="j13-orbit" data-anim="fade" data-tilt="8">
        <div className="j13-orbit__ring">
          {p.logos.map((slug, i) => (
            <span
              key={slug}
              className="j13-orbit__logo"
              style={{ '--a': `${(360 / n) * i}deg`, '--src': `url(/partners/${slug}.svg)` }}
            >
              <i />
            </span>
          ))}
        </div>
        <figcaption className="j13-orbit__core">
          <span>
            <b className="j13-chrome">{n}</b>
            <span>{p.ring}</span>
          </span>
        </figcaption>
        <ul className="j13-sr">
          {p.logos.map((slug) => (
            <li key={slug}>{NAMES[slug]}</li>
          ))}
        </ul>
      </figure>
    </div>
  );
}
