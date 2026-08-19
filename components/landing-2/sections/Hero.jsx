'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowIcon } from '../ui';
import { L2_GRAD, L2_BTN, L2_BTN_PRIMARY } from '../tokens';
import { useInView } from '../hooks';
import { useScrollFrames } from '../../landing-1/hooks';

const FRAME_COUNT = 161;
const getPath = (n) => {
  const seconds = ((n - 1) * 0.05).toFixed(2);
  return `/hero-4-frames/frame_${String(n).padStart(4, '0')}_${seconds}s.png`;
};

const HERO_STAGE_BG =
  "before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:content-[''] before:bg-[radial-gradient(650px_520px_at_73%_38%,rgba(5,52,123,0.13),transparent_67%),radial-gradient(450px_360px_at_88%_15%,rgba(79,13,150,0.07),transparent_70%),radial-gradient(2px_2px_at_73%_20%,rgba(0,172,255,0.7),transparent),radial-gradient(1px_1px_at_66%_55%,rgba(74,145,255,0.45),transparent),radial-gradient(1px_1px_at_81%_67%,rgba(110,44,255,0.45),transparent)] rtl:before:bg-[radial-gradient(650px_520px_at_27%_38%,rgba(5,52,123,0.13),transparent_67%),radial-gradient(450px_360px_at_12%_15%,rgba(79,13,150,0.07),transparent_70%),radial-gradient(2px_2px_at_27%_20%,rgba(0,172,255,0.7),transparent),radial-gradient(1px_1px_at_34%_55%,rgba(74,145,255,0.45),transparent),radial-gradient(1px_1px_at_19%_67%,rgba(110,44,255,0.45),transparent)]";

const BTN_SECONDARY =
  'gap-3 border border-[rgba(77,122,178,0.57)] bg-[rgba(1,8,16,0.32)] text-[#f2f3f7] shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] hover:border-[rgba(8,165,255,0.7)] hover:bg-[rgba(7,20,36,0.55)]';

function Reveal({ children, className = '', delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`translate-y-7 opacity-0 transition-[opacity,transform] duration-700 ease-in-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${inView ? 'translate-y-0 opacity-100' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function setHeroVars(el, vars) {
  if (!el) return;
  Object.entries(vars).forEach(([key, value]) => {
    el.style.setProperty(key, value);
  });
}

export default function Hero({ copy }) {
  const {
    sectionRef,
    canvasRef,
    onProgressRef,
    loadProgress,
    loaded,
  } = useScrollFrames({
    frameCount: FRAME_COUNT,
    getPath,
  });

  const copyRef = useRef(null);
  const topBlockRef = useRef(null);
  const bottomBlockRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const leadRef = useRef(null);
  const actionsRef = useRef(null);
  const [typedCount, setTypedCount] = useState(0);

  const titleLine1 = copy.hero.line1;
  const titleLine2 = copy.hero.line2;
  const totalTitleLength = titleLine1.length + titleLine2.length;

  useEffect(() => {
    setTypedCount(0);
    let cancelled = false;
    let timeoutId;

    const typeNext = (count) => {
      if (cancelled) return;
      setTypedCount(count);
      if (count >= totalTitleLength) return;
      timeoutId = window.setTimeout(() => typeNext(count + 1), count < titleLine1.length ? 34 : 28);
    };

    timeoutId = window.setTimeout(() => typeNext(1), 220);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [titleLine1, titleLine2, totalTitleLength]);

  useEffect(() => {
    onProgressRef.current = (progress) => {
      const start = 0.12;
      const p = progress <= start ? 0 : (progress - start) / (1 - start);
      const eased = p * p;

      const allScale = 1 - (eased * 0.22);
      const topY = eased * 160;
      const topX = eased * 120;
      const bottomY = eased * 180;
      const bottomX = eased * 130;
      const topScale = 1 - (eased * 0.12);
      const bottomScale = 1 - (eased * 0.16);
      const topOpacity = Math.max(0, 1 - (eased * 1.6));
      const bottomOpacity = Math.max(0, 1 - (eased * 1.7));

      setHeroVars(copyRef.current, {
        '--l2-hero-opacity': '1',
        '--l2-hero-scale': String(allScale),
      });

      setHeroVars(topBlockRef.current, {
        '--l2-block-opacity': String(topOpacity),
        '--l2-block-x': `${topX}px`,
        '--l2-block-y': `${topY}px`,
        '--l2-block-scale': String(topScale),
      });

      setHeroVars(bottomBlockRef.current, {
        '--l2-block-opacity': String(bottomOpacity),
        '--l2-block-x': `${bottomX}px`,
        '--l2-block-y': `${bottomY}px`,
        '--l2-block-scale': String(bottomScale),
      });
    };
  }, [onProgressRef]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        badgeRef.current,
        { y: 24, opacity: 0, filter: 'blur(10px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8 },
      )
        .fromTo(
          titleRef.current,
          { y: 36, opacity: 0, filter: 'blur(18px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.05 },
          '-=0.45',
        )
        .fromTo(
          leadRef.current,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          '-=0.45',
        )
        .fromTo(
          actionsRef.current,
          { y: 24, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 0.85 },
          '-=0.45',
        );
    }, copyRef);

    return () => ctx.revert();
  }, []);

  const typedLine1 = titleLine1.slice(0, Math.min(typedCount, titleLine1.length));
  const typedLine2 = titleLine2.slice(0, Math.max(0, typedCount - titleLine1.length));
  const isTypingLine1 = typedCount < titleLine1.length;
  const isTypingLine2 = typedCount >= titleLine1.length && typedCount < totalTitleLength;

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative h-[420vh] [background:var(--l2-dark-gradient)] max-[900px]:h-[340vh] max-[800px]:h-[300vh]"
      aria-labelledby="l2-hero-heading"
    >
      <div
        className={`sticky top-0 z-[1] flex h-screen h-[100dvh] w-full flex-col overflow-hidden [background:var(--l2-dark-gradient)] ${HERO_STAGE_BG}`}
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(105%_82%_at_78%_42%,rgba(8,161,255,0.10),transparent_24%),radial-gradient(82%_58%_at_82%_68%,rgba(129,41,247,0.09),transparent_22%),linear-gradient(90deg,rgba(1,5,12,0.44)_0%,rgba(1,5,12,0.18)_22%,rgba(1,5,12,0.03)_48%,rgba(1,5,12,0.14)_74%,rgba(1,5,12,0.38)_100%),linear-gradient(180deg,rgba(1,5,12,0.14)_0%,rgba(1,5,12,0.03)_28%,rgba(1,5,12,0.12)_100%)] max-[1100px]:bg-[linear-gradient(180deg,rgba(1,5,12,0.22),rgba(1,5,12,0.36)),radial-gradient(120%_80%_at_75%_42%,rgba(8,161,255,0.10),transparent_24%)]"
            aria-hidden="true"
          />

          <div
            ref={copyRef}
            className="relative z-[3] flex flex-1 origin-left items-center px-[var(--l2-gutter)] pb-[100px] pt-[120px] transition-[opacity,transform] duration-[80ms] [opacity:var(--l2-hero-opacity,1)] [transform:scale(var(--l2-hero-scale,1))] rtl:origin-right max-[900px]:h-auto max-[900px]:min-h-0 max-[900px]:px-[var(--l2-gutter)] max-[900px]:pb-10 max-[900px]:pt-[45px]"
          >
            <div className="relative z-[4] w-[min(690px,100%)] max-[900px]:w-full">
              <div
                ref={topBlockRef}
                className="will-change-transform transition-transform duration-[80ms] [opacity:var(--l2-block-opacity,1)] [transform:translate3d(calc(var(--l2-block-x,0px)*-1),calc(var(--l2-block-y,0px)*-1),0)_scale(var(--l2-block-scale,1))]"
              >
                <Reveal>
                  <div
                    ref={badgeRef}
                    className="inline-flex min-h-[43px] items-center gap-[11px] rounded-3xl border border-[rgba(102,124,153,0.34)] bg-[linear-gradient(180deg,rgba(12,21,34,0.78),rgba(3,10,18,0.78))] px-[17px] text-base font-normal text-[#c9ced7] shadow-[inset_0_1px_0_rgba(255,255,255,0.025),0_7px_24px_rgba(0,0,0,0.18)]"
                  >
                    <span className="h-3 w-3 animate-l2-pulse rounded-full bg-[#087ff5] shadow-[0_0_12px_rgba(0,127,255,0.6)] motion-reduce:animate-none" aria-hidden="true" />
                    {copy.hero.badge}
                  </div>
                </Reveal>
                <Reveal delay={80}>
                  <h1
                    id="l2-hero-heading"
                    ref={titleRef}
                    className="my-[30px] mb-7 max-w-[16ch] text-[clamp(2.6rem,6.4vw,4.85rem)] font-extrabold leading-[1.17] tracking-[-0.055em] rtl:max-w-[18ch] rtl:tracking-normal max-[1280px]:text-[3.5rem] max-[1100px]:text-[3.2rem] max-[900px]:max-w-none max-[900px]:text-[clamp(2.2rem,9vw,3rem)] max-[900px]:tracking-[-0.04em]"
                  >
                    {typedLine1}
                    {isTypingLine1 ? (
                      <span className="ms-[0.06em] inline-block h-[0.92em] w-[0.08em] animate-l2-typing-caret bg-current align-[-0.08em] motion-reduce:animate-none" aria-hidden="true" />
                    ) : null}
                    <br />
                    <span className={L2_GRAD}>
                      {typedLine2}
                      {isTypingLine2 ? (
                        <span className="ms-[0.06em] inline-block h-[0.92em] w-[0.08em] animate-l2-typing-caret bg-current align-[-0.08em] motion-reduce:animate-none" aria-hidden="true" />
                      ) : null}
                    </span>
                  </h1>
                </Reveal>
              </div>

              <div
                ref={bottomBlockRef}
                className="will-change-transform transition-transform duration-[80ms] [opacity:var(--l2-block-opacity,1)] [transform:translate3d(calc(var(--l2-block-x,0px)*-1),var(--l2-block-y,0px),0)_scale(var(--l2-block-scale,1))]"
              >
                <Reveal delay={140}>
                  <p ref={leadRef} className="m-0 w-[min(635px,100%)] text-[clamp(1.05rem,1.5vw,1.25rem)] leading-[1.8] tracking-[-0.01em] text-[#b8bec9]">
                    {copy.hero.sub}
                  </p>
                </Reveal>
                <Reveal className="mt-[46px] flex flex-wrap gap-6 max-[800px]:mt-8" delay={200}>
                  <div ref={actionsRef} className="flex w-full flex-wrap gap-6">
                    <a
                      className={`${L2_BTN} ${L2_BTN_PRIMARY}`}
                      href="#contact"
                    >
                      {copy.hero.ctaPrimary}
                      <span className="absolute end-2 grid h-12 w-12 place-items-center rounded-full bg-[#f8f9ff] text-[#4d42ff]">
                        <ArrowIcon />
                      </span>
                    </a>
                    <a
                      className={`${L2_BTN} ${BTN_SECONDARY}`}
                      href="#work"
                    >
                      {copy.hero.ctaSecondary}
                      <ArrowIcon className="h-[22px] w-[22px] opacity-90 rtl:scale-x-[-1]" />
                    </a>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>

          {!loaded && (
            <div className="absolute inset-0 z-[5] flex flex-col items-center justify-center gap-[18px] bg-[rgba(1,5,12,0.86)] backdrop-blur-[8px]">
              <div className="inline-flex min-h-[43px] items-center gap-[11px] rounded-3xl border border-[rgba(102,124,153,0.34)] bg-[linear-gradient(180deg,rgba(12,21,34,0.78),rgba(3,10,18,0.78))] px-[17px] text-base text-[#c9ced7]">
                <span className="h-3 w-3 animate-l2-pulse rounded-full bg-[#087ff5] shadow-[0_0_12px_rgba(0,127,255,0.6)] motion-reduce:animate-none" aria-hidden="true" />
                Loading frames
              </div>
              <div className="h-0.5 w-[min(320px,calc(100%-48px))] overflow-hidden bg-[rgba(255,255,255,0.12)]">
                <div
                  className="h-full bg-[var(--l2-btn-gradient)]"
                  style={{ width: `${Math.round(loadProgress * 100)}%` }}
                />
              </div>
              <p className="m-0 text-[0.9rem] text-[#9db1cf]">{Math.round(loadProgress * 100)}%</p>
            </div>
          )}
      </div>
    </section>
  );
}
