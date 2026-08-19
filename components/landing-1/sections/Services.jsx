'use client';

import { useEffect, useMemo, useRef } from 'react';
import { EyebrowBadge, HudCorners } from '../hud';
import { useScrollFrames } from '../hooks';

const FRAME_COUNT = 169;
const getPath = (n) => `/frames2/frame_${String(n).padStart(4, '0')}.jpg`;

export default function Services({ copy }) {
  const cine = copy.services.cine;
  const beats = useMemo(() => cine.beats, [cine.beats]);
  const {
    sectionRef,
    canvasRef,
    progressFillRef,
    seqReadoutRef,
    onProgressRef,
    loadProgress,
    loaded,
    visibleCards,
  } = useScrollFrames({ frameCount: FRAME_COUNT, getPath, cards: beats });

  const h2ARef = useRef(null);
  const h2BRef = useRef(null);
  const outroRef = useRef(null);

  useEffect(() => {
    onProgressRef.current = (progress) => {
      if (h2ARef.current) {
        h2ARef.current.style.opacity = String(Math.min(1, Math.max(0, (0.52 - progress) / 0.1)));
      }
      if (h2BRef.current) {
        h2BRef.current.style.opacity = String(Math.min(1, Math.max(0, (progress - 0.48) / 0.1)));
      }
      if (outroRef.current) {
        const op = Math.min(1, Math.max(0, (progress - 0.86) / 0.06));
        outroRef.current.style.opacity = String(op);
        outroRef.current.style.transform = `translateY(${(1 - op) * 14}px)`;
      }
    };
  }, [onProgressRef]);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="scroll-animation border-t border-white/5 bg-[#0a0a0b]"
    >
      <div className="scroll-pin">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
        />

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 80% at 50% 90%, transparent 30%, rgba(10,10,11,0.45) 70%, rgba(10,10,11,0.85) 100%)',
          }}
        />

        <HudCorners />

        <div className="pointer-events-none absolute right-6 top-28 z-10 flex max-w-[46ch] flex-col items-end gap-5 text-right rtl:left-6 rtl:right-auto rtl:items-start rtl:text-right md:right-12 md:top-32 md:rtl:left-12">
          <EyebrowBadge>{cine.badge}</EyebrowBadge>
          <div className="relative self-stretch">
            <h2
              ref={h2ARef}
              className="text-4xl font-semibold leading-[0.98] tracking-tighter text-zinc-100 md:text-6xl lg:text-7xl"
              style={{ transition: 'opacity 240ms ease-out' }}
            >
              {cine.title}
              <br />
              <span className="text-accent">{cine.accent}</span>
            </h2>
            <h2
              ref={h2BRef}
              className="absolute inset-0 text-4xl font-semibold leading-[0.98] tracking-tighter text-zinc-100 md:text-6xl lg:text-7xl"
              style={{ opacity: 0, transition: 'opacity 240ms ease-out' }}
            >
              {cine.title2}
              <br />
              <span className="text-accent">{cine.accent2}</span>
            </h2>
          </div>
          <p className="max-w-[42ch] text-sm leading-relaxed text-zinc-400 md:text-base">
            {cine.sub}
          </p>
        </div>

        <div className="pointer-events-none absolute left-6 top-20 z-10 flex items-center gap-2 md:left-10 md:top-24">
          <div className="h-px w-8 bg-accent/60" />
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-400">
            {cine.log}
          </span>
        </div>

        <div className="pointer-events-none absolute right-6 top-20 z-10 flex items-center gap-3 md:right-10 md:top-24">
          <span ref={seqReadoutRef} className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
            SEQ 001 / {FRAME_COUNT}
          </span>
          <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(212,162,47,0.85)]" />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
          <div className="mx-6 mb-3 h-px bg-white/10 md:mx-10">
            <div
              ref={progressFillRef}
              className="h-full origin-left bg-accent"
              style={{ transform: 'scaleX(0)', transition: 'transform 80ms linear' }}
            />
          </div>
          <div className="mx-6 flex items-center justify-between pb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500 md:mx-10">
            <span>{cine.archive}</span>
            <span>{cine.playback}</span>
            <span>Scroll ↓</span>
          </div>
        </div>

        {beats.map((b, i) => {
          const visible = visibleCards.has(b.id);
          const position = i === 0
            ? 'top-[24%] left-6 md:left-12'
            : i === 1
              ? 'top-1/2 -translate-y-1/2 left-6 md:left-12'
              : 'bottom-24 left-6 md:bottom-28 md:left-12';
          return (
            <div key={b.id} className={`pointer-events-none absolute ${position} z-20 hidden w-[420px] max-w-[90vw] md:block`}>
              <figure className={`card-surface pointer-events-auto p-6 transition-all duration-400 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">{b.label}</span>
                <blockquote className="mt-3 text-xl font-medium leading-snug tracking-tight text-zinc-100">
                  “{b.quote}”
                </blockquote>
                <figcaption className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-zinc-300">{b.speaker}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-400">{b.film}</span>
                </figcaption>
              </figure>
            </div>
          );
        })}

        <div className="pointer-events-none absolute inset-x-0 top-[36%] z-20 flex flex-col gap-3 px-6 md:hidden">
          {beats.map((b) => {
            const visible = visibleCards.has(b.id);
            return (
              <figure key={b.id} className={`card-surface pointer-events-auto p-5 transition-all duration-400 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-accent">{b.label}</span>
                <blockquote className="mt-2 text-base font-medium leading-snug text-zinc-100">“{b.quote}”</blockquote>
                <figcaption className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-zinc-300">{b.speaker}</span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-400">{b.film}</span>
                </figcaption>
              </figure>
            );
          })}
        </div>

        <div
          ref={outroRef}
          className="pointer-events-none absolute bottom-24 right-6 z-10 flex flex-col items-end gap-4 md:bottom-32 md:right-12"
          style={{ opacity: 0, transition: 'opacity 80ms linear' }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">{cine.next}</span>
          <a
            href="#work"
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-5 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-100 backdrop-blur-md transition-all duration-200 hover:bg-white/[0.12] active:translate-y-[1px]"
          >
            {cine.cta} <span aria-hidden>↓</span>
          </a>
        </div>

        {!loaded && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 bg-[#0a0a0b] px-6">
            <EyebrowBadge>{cine.restoring}</EyebrowBadge>
            <div className="h-px w-60 bg-white/10 md:w-80">
              <div className="h-full bg-accent transition-[width] duration-150 ease-out" style={{ width: `${Math.round(loadProgress * 100)}%` }} />
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-zinc-500">
              {cine.loading} · {Math.round(loadProgress * 100)}%
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
