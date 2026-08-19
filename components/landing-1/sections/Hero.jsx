'use client';

import { useEffect, useMemo, useRef } from 'react';
import { EyebrowBadge, HudCorners } from '../hud';
import { useScrollFrames } from '../hooks';

const FRAME_COUNT = 169;
const getPath = (n) => `/frames/frame_${String(n).padStart(4, '0')}.jpg`;

export default function Hero({ copy }) {
  const hud = copy.hero.hud;
  const dialogues = useMemo(() => hud.dialogues, [hud.dialogues]);
  const {
    sectionRef,
    canvasRef,
    progressFillRef,
    seqReadoutRef,
    onProgressRef,
    loadProgress,
    loaded,
    visibleCards,
  } = useScrollFrames({ frameCount: FRAME_COUNT, getPath, cards: dialogues });

  const heroTextRef = useRef(null);
  const bigLeftTextRef = useRef(null);
  const powerReadoutRef = useRef(null);

  useEffect(() => {
    onProgressRef.current = (progress) => {
      if (heroTextRef.current) {
        const opacity = Math.max(0, 1 - progress / 0.08);
        heroTextRef.current.style.opacity = String(opacity);
        heroTextRef.current.style.transform = `translateY(${(1 - opacity) * 12}px)`;
      }
      if (bigLeftTextRef.current) {
        const op = Math.min(1, Math.max(0, (progress - 0.1) / 0.08));
        bigLeftTextRef.current.style.opacity = String(op);
        bigLeftTextRef.current.style.transform = `translateY(${(1 - op) * 14}px)`;
      }
      if (powerReadoutRef.current) {
        const pwr = 87.3 + Math.sin(progress * Math.PI * 2) * 6.7;
        powerReadoutRef.current.textContent = `${pwr.toFixed(1)}%`;
      }
    };
  }, [onProgressRef]);

  return (
    <section id="hero" ref={sectionRef} className="scroll-animation">
      <div className="scroll-pin">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
        />

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 80% at 50% 10%, transparent 30%, rgba(10,10,11,0.45) 70%, rgba(10,10,11,0.85) 100%)',
          }}
        />

        <HudCorners />

        <div
          ref={heroTextRef}
          className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-start gap-5 px-6 pb-24 md:px-12 md:pb-28"
          style={{ transition: 'opacity 80ms linear' }}
        >
          <EyebrowBadge>{hud.badge}</EyebrowBadge>
          <h1 className="max-w-[16ch] font-semibold leading-[0.95] tracking-tighter text-zinc-100 text-5xl md:text-7xl lg:text-8xl">
            {hud.line1}
            <br />
            <span className="text-accent">{hud.line2}</span>
          </h1>
          <p className="max-w-[46ch] text-base font-medium leading-snug text-zinc-300 md:text-lg">
            {copy.hero.headlineAlt}
          </p>
          <p className="max-w-[42ch] text-sm leading-relaxed text-zinc-400 md:text-base">
            {copy.hero.sub}
          </p>
          <p className="max-w-[42ch] text-xs leading-relaxed text-zinc-500 md:text-sm">
            {copy.hero.subAlt}
          </p>
          <div className="pointer-events-auto flex flex-col gap-3 sm:flex-row">
            <a href="#contact" className="l1-btn l1-btn-primary">
              {copy.hero.ctaPrimary}
            </a>
            <a href="#work" className="l1-btn l1-btn-outline">
              {copy.hero.ctaSecondary}
            </a>
          </div>
        </div>

        <div
          ref={bigLeftTextRef}
          className="pointer-events-none absolute bottom-24 left-6 z-10 hidden max-w-[58%] flex-col gap-5 md:flex md:bottom-28 md:left-12"
          style={{ opacity: 0, transition: 'opacity 80ms linear' }}
        >
          <span className="inline-flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(212,162,47,0.85)]" />
            {hud.protocol}
          </span>
          <h2 className="font-semibold leading-[0.88] tracking-tighter text-zinc-100 text-[clamp(4rem,9.5vw,9rem)]">
            {hud.bigTitle}
            <br />
            {hud.bigWith} <span className="text-accent">{hud.bigAccent}</span>
          </h2>
          <p className="max-w-[36ch] font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-400">
            {hud.bigSub}
          </p>
        </div>

        <div className="pointer-events-none absolute left-6 top-20 z-10 flex items-center gap-2 md:left-10 md:top-24">
          <div className="h-px w-8 bg-accent/60" />
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-400">
            {hud.telemetry}
          </span>
        </div>

        <div className="pointer-events-none absolute right-6 top-20 z-10 flex items-center gap-3 md:right-10 md:top-24">
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-400">
            {hud.reactor}
          </span>
          <span ref={powerReadoutRef} className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
            87.3%
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
            <span ref={seqReadoutRef}>SEQ 001 / {FRAME_COUNT}</span>
            <span>{hud.seqLabel}</span>
            <span>Scroll ↓</span>
          </div>
        </div>

        {dialogues.map((d, i) => {
          const visible = visibleCards.has(d.id);
          const position = i === 0
            ? 'top-[22%] right-6 md:right-12'
            : i === 1
              ? 'top-1/2 -translate-y-1/2 right-6 md:right-12'
              : 'bottom-24 right-6 md:bottom-28 md:right-12';
          return (
            <div key={d.id} className={`pointer-events-none absolute ${position} z-20 hidden w-[420px] max-w-[90vw] md:block`}>
              <figure className={`card-surface pointer-events-auto p-6 transition-all duration-400 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
                <blockquote className="text-xl font-medium leading-snug tracking-tight text-zinc-100">
                  “{d.quote}”
                </blockquote>
                <figcaption className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-zinc-300">{d.speaker}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">{d.film}</span>
                </figcaption>
              </figure>
            </div>
          );
        })}

        <div className="pointer-events-none absolute inset-x-0 top-[38%] z-20 flex flex-col gap-3 px-6 md:hidden">
          {dialogues.map((d) => {
            const visible = visibleCards.has(d.id);
            return (
              <figure key={d.id} className={`card-surface pointer-events-auto p-5 transition-all duration-400 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <blockquote className="text-base font-medium leading-snug text-zinc-100">“{d.quote}”</blockquote>
                <figcaption className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-zinc-300">{d.speaker}</span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent">{d.film}</span>
                </figcaption>
              </figure>
            );
          })}
        </div>

        {!loaded && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 bg-[#0a0a0b] px-6">
            <EyebrowBadge>{hud.booting}</EyebrowBadge>
            <div className="h-px w-60 bg-white/10 md:w-80">
              <div className="h-full bg-accent transition-[width] duration-150 ease-out" style={{ width: `${Math.round(loadProgress * 100)}%` }} />
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-zinc-500">
              {hud.loading} · {Math.round(loadProgress * 100)}%
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
