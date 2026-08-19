'use client';

import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion, useScrollFrames } from '../hooks';

const FRAME_COUNT = 0;
const getTechFramePath = (n) => `/frames-tech/frame_${String(n).padStart(4, '0')}.jpg`;

const LAYER_TONES = [
  { fill: '#8ec8f0', fillHi: '#c8e7fb', glow: 'rgba(90, 168, 220, 0.45)', label: '#3e86c2' },
  { fill: '#b8a8e8', fillHi: '#ddd4f8', glow: 'rgba(122, 98, 196, 0.4)', label: '#6d54b8' },
  { fill: '#f0a8a0', fillHi: '#f8d4ce', glow: 'rgba(196, 107, 102, 0.4)', label: '#c45d57' },
  { fill: '#f0c090', fillHi: '#f8e0c0', glow: 'rgba(212, 137, 58, 0.38)', label: '#d4893a' },
  { fill: '#e8d080', fillHi: '#f4e8b8', glow: 'rgba(196, 160, 36, 0.38)', label: '#c4a024' },
  { fill: '#f4f1ea', fillHi: '#ffffff', glow: 'rgba(38, 32, 28, 0.12)', label: '#8a8478' },
];

export default function TechStack({ copy }) {
  const reducedMotion = usePrefersReducedMotion();
  const groups = copy.tech.groups;
  const lastLitRef = useRef(-1);
  const [litCount, setLitCount] = useState(0);

  const {
    sectionRef,
    canvasRef,
    onProgressRef,
    loaded,
  } = useScrollFrames({
    frameCount: FRAME_COUNT,
    getPath: getTechFramePath,
    sizeTo: 'parent',
    fit: 'contain',
  });

  useEffect(() => {
    onProgressRef.current = (progress) => {
      const count = groups.length || 1;
      const next = reducedMotion
        ? count
        : Math.min(count, Math.max(0, Math.ceil(progress * count - 1e-6)));
      if (next !== lastLitRef.current) {
        lastLitRef.current = next;
        setLitCount(next);
      }
    };
  }, [groups.length, onProgressRef, reducedMotion]);

  const current = groups[Math.max(0, litCount - 1)] || groups[0];

  return (
    <section
      id="tech"
      ref={sectionRef}
      className={`l1-tech-scroll${reducedMotion ? ' is-static' : ''}`}
      aria-labelledby="tech-heading"
    >
      <div className="l1-tech-pin">
        <div className="l1-tech-shell">
          <div className="l1-tech-copy">
            <p className="l1-tech-kicker">{copy.tech.title}</p>
            <h2 id="tech-heading" className="l1-tech-title">
              {copy.tech.headline}
            </h2>
            <p className="l1-tech-body">{copy.tech.body}</p>
            <div className="l1-tech-highlights">
              {copy.tech.highlights.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className="l1-tech-current" aria-live="polite">
              <p className="l1-tech-current-label">{current?.label}</p>
              <p className="l1-tech-current-blurb">{current?.blurb}</p>
              <ul className="l1-tech-current-items">
                {current?.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="l1-tech-visual">
            <div className="l1-tech-iso-block">
              <ul className="l1-tech-labels">
                {groups.map((group, index) => {
                  const lit = reducedMotion || index < litCount;
                  const active = index === litCount - 1 || (reducedMotion && index === groups.length - 1);
                  return (
                    <li
                      key={group.label}
                      className={`l1-tech-label${lit ? ' is-lit' : ''}${active ? ' is-active' : ''}`}
                      style={{
                        '--label': LAYER_TONES[index % LAYER_TONES.length].label,
                        '--i': index,
                      }}
                    >
                      {group.label}
                    </li>
                  );
                })}
              </ul>

              <div className="l1-tech-iso" aria-hidden>
                <div className="l1-tech-iso-guides">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <div className="l1-tech-plate is-base">
                  <span className="l1-tech-plate-depth" />
                  <span className="l1-tech-plate-face" />
                  <span className="l1-tech-plate-mark" />
                </div>
                {groups.map((group, index) => {
                  const lit = reducedMotion || index < litCount;
                  const active = index === litCount - 1;
                  const tone = LAYER_TONES[index % LAYER_TONES.length];
                  return (
                    <div
                      key={group.label}
                      className={`l1-tech-plate${lit ? ' is-lit' : ''}${active ? ' is-active' : ''}`}
                      style={{
                        '--plate': tone.fill,
                        '--plate-hi': tone.fillHi,
                        '--glow': tone.glow,
                        '--i': index,
                      }}
                    >
                      <span className="l1-tech-plate-depth" />
                      <span className="l1-tech-plate-face" />
                    </div>
                  );
                })}
              </div>

              <div className="l1-tech-frames">
                <canvas ref={canvasRef} className="l1-tech-frames-canvas" />
                {!FRAME_COUNT && (
                  <div className="l1-tech-frames-empty">
                    <span>{current?.label}</span>
                    <small>{current?.items.slice(0, 2).join(' · ')}</small>
                  </div>
                )}
                {FRAME_COUNT > 0 && !loaded && (
                  <div className="l1-tech-frames-empty">Loading frames</div>
                )}
              </div>
            </div>
            <p className="l1-tech-hint">{copy.tech.hint}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
