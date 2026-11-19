'use client';

import { useState } from 'react';
import Glyph, { QuoteMark } from '../Glyph';
import Button from '../ui/Button';
import SectionHead from '../ui/SectionHead';

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p.replace(/^(Al-|ال)/, ''))
    .slice(0, 2)
    .map((p) => p[0])
    .join('');
}

function Review({ item, rating }) {
  return (
    <figure className="j13-glass j13-review">
      <QuoteMark className="j13-review__mark" />
      <span className="j13-review__stars" role="img" aria-label={rating}>
        {[0, 1, 2, 3, 4].map((k) => (
          <Glyph key={k} name="star" size={14} />
        ))}
      </span>
      <blockquote>
        <p>{item.quote}</p>
      </blockquote>
      <figcaption>
        <span className="j13-review__avatar" aria-hidden="true">
          {initials(item.name)}
        </span>
        <span>
          <b>{item.name}</b>
          <small>
            {item.role} · {item.country}
          </small>
        </span>
      </figcaption>
    </figure>
  );
}

/*
 * Testimonials as two counter-running bands. Hover or keyboard focus holds a
 * band; the pause button stops both (WCAG 2.2.2). Under reduced motion the
 * bands do not move and become swipeable rows instead.
 */
export default function Voices({ copy, index, headingId }) {
  const v = copy.voices;
  const [paused, setPaused] = useState(false);
  const half = Math.ceil(v.items.length / 2);
  const rows = [v.items.slice(0, half), v.items.slice(half)];

  return (
    <div className={`j13-voices${paused ? ' is-paused' : ''}`}>
      <div className="j13-container">
        <SectionHead index={index} id={headingId} eyebrow={v.eyebrow} title={v.title} align="split">
          <Button
            variant="icon"
            size="md"
            label={paused ? v.play : v.pause}
            aria-pressed={paused}
            icon={<Glyph name={paused ? 'play' : 'pause'} size={16} />}
            onClick={() => setPaused((x) => !x)}
          />
        </SectionHead>
      </div>
      <div className="j13-voices__rows" data-reveal="up">
        {rows.map((row, r) => (
          <div key={r} className={`j13-marquee j13-marquee--reviews${r === 1 ? ' is-reverse' : ''}`}>
            {[0, 1].map((dup) => (
              <ul key={dup} className="j13-marquee__track" aria-hidden={dup === 1 ? 'true' : undefined}>
                {row.map((item) => (
                  <li key={item.name}>
                    <Review item={item} rating={v.rating} />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
