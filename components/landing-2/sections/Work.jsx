'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import { Reveal, ArrowIcon } from '../ui';
import { L2_GRAD, L2_BTN, L2_BTN_PRIMARY } from '../tokens';

const LABELS = {
  en: { challenge: 'Challenge', solution: 'Solution', results: 'Results' },
  ar: { challenge: 'التحدي', solution: 'الحل', results: 'النتائج' },
};

function padIndex(n) {
  return String(n).padStart(2, '0');
}

function HeaderDivider() {
  return (
    <div className="mx-auto mt-[19px] flex h-4 w-[220px] items-center justify-center gap-3">
      <span className="h-px w-[94px] bg-[linear-gradient(90deg,transparent,#9abaff)]" aria-hidden="true" />
      <span className="h-2 w-2 shrink-0 rounded-full bg-[#2b6cff]" aria-hidden="true" />
      <span className="h-px w-[94px] bg-[linear-gradient(90deg,#a17cff,transparent)]" aria-hidden="true" />
    </div>
  );
}

function ChevronIcon({ direction = 'left', className = 'h-5 w-5' }) {
  const paths = {
    left: 'M12 4 L6 10 L12 16',
    right: 'M4 4 L10 10 L4 16',
    up: 'M4 12 L10 6 L16 12',
    down: 'M4 8 L10 14 L16 8',
  };

  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d={paths[direction]}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CircleNavButton({ direction, onClick, ariaLabel, className = '' }) {
  const chevron = direction === 'prev' ? 'left' : 'right';

  return (
    <button
      type="button"
      className={`group absolute top-1/2 z-[7] grid h-12 w-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-[linear-gradient(135deg,#1591ff,#5d4df5)] text-white shadow-[0_10px_26px_rgba(40,94,221,0.32),inset_0_1px_0_rgba(255,255,255,0.25)] transition-[transform,box-shadow] duration-200 hover:scale-110 hover:shadow-[0_14px_32px_rgba(40,94,221,0.42)] active:scale-95 ${className}`}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <ChevronIcon direction={chevron} className="h-[22px] w-[22px]" />
    </button>
  );
}

function ProjectNavPill({ direction, label, onClick, ariaLabel }) {
  const chevron = direction === 'up' ? 'up' : 'down';

  return (
    <button
      type="button"
      className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-[#dce6f8] bg-white px-3 text-[12px] font-semibold text-[#1767ff] shadow-[0_3px_12px_rgba(23,103,255,0.08)] transition-[border-color,background-color,box-shadow,transform] duration-200 hover:border-[#5590ff] hover:bg-[#f5f9ff] hover:shadow-[0_6px_18px_rgba(23,103,255,0.14)] active:scale-[0.98]"
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <ChevronIcon direction={chevron} className="h-4 w-4" />
      {label}
    </button>
  );
}

function DetailIcon({ type }) {
  if (type === 'challenge') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </svg>
    );
  }

  if (type === 'solution') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
        <path d="M12 3 19 8v8l-7 5-7-5V8l7-5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="M4 18V9M10 18V5M16 18v-7M22 18v-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function DetailBlock({ type, label, children }) {
  return (
    <div className="mb-3.5 grid grid-cols-[32px_1fr] gap-x-3">
      <div className="grid h-7 w-7 place-items-center rounded-full border-2 border-[#286fff] text-[#286fff]">
        <DetailIcon type={type} />
      </div>
      <div>
        <h3 className="mb-1 text-[13px] font-semibold text-[#1264e7]">{label}</h3>
        <div className="text-[13px] leading-[1.55] text-[#4a5d82]">{children}</div>
      </div>
    </div>
  );
}

function CaseStudyCta({ label , cn , className = '' }) {
  return (
    <a
      data-work-animate
      className={`${L2_BTN} ${L2_BTN_PRIMARY} ${cn} absolute bottom-4 end-4 z-[4] inline-flex h-[52px] min-w-[220px] max-w-[calc(100%-2rem)] items-center justify-center rounded-[28px] bg-[linear-gradient(105deg,#079cff_0%,#236cff_48%,#8129f7_100%)] pe-[58px] ps-[22px] text-[0.92rem] font-semibold text-white no-underline shadow-[0_8px_28px_rgba(0,106,255,0.35),inset_0_1px_1px_rgba(255,255,255,0.35)] backdrop-blur-[2px] transition-[transform,box-shadow,filter] duration-[250ms] hover:-translate-y-0.5 hover:brightness-[1.06] hover:shadow-[0_12px_34px_rgba(0,106,255,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)] max-[600px]:bottom-3 max-[600px]:end-3 max-[600px]:h-[48px] max-[600px]:min-w-[200px] max-[600px]:text-[0.85rem] ${className}`}
      href="#contact"
    >
      {label}
      <span className="absolute end-1.5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/25 text-white max-[600px]:h-9 max-[600px]:w-9">
        <ArrowIcon />
      </span>
    </a>
  );
}

export default function Work({ copy }) {
  const isAr = copy.nav?.home === 'الرئيسية';
  const labels = LABELS[isAr ? 'ar' : 'en'];
  const projects = copy.projects.items;
  const total = projects.length;
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  const previewDesktopRef = useRef(null);
  const previewMobileRef = useRef(null);
  const previewShineRef = useRef(null);
  const contentRef = useRef(null);
  const workspaceRef = useRef(null);
  const sidebarListRef = useRef(null);
  const mobileJumpRef = useRef(null);
  const isFirstRender = useRef(true);

  const go = useCallback(
    (index, dir = 1) => {
      setDirection(dir);
      setActive((index + total) % total);
    },
    [total],
  );

  const project = projects[active];
  const counter = `${padIndex(active + 1)} / ${padIndex(total)}`;

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const ctx = gsap.context(() => {
      const slideX = direction >= 0 ? 72 : -72;
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      if (previewDesktopRef.current) {
        tl.fromTo(
          previewDesktopRef.current,
          {
            opacity: 0,
            scale: 0.9,
            x: slideX,
            rotateY: direction >= 0 ? 6 : -6,
            filter: 'blur(14px) saturate(1.1)',
            transformPerspective: 900,
          },
          {
            opacity: 1,
            scale: 1,
            x: 0,
            rotateY: 0,
            filter: 'blur(0px) saturate(1)',
            duration: 0.9,
          },
          0,
        );
      }

      if (previewShineRef.current) {
        tl.fromTo(
          previewShineRef.current,
          { x: '-120%', opacity: 0.85 },
          { x: '220%', opacity: 0, duration: 0.75, ease: 'power2.inOut' },
          0.12,
        );
      }

      if (previewMobileRef.current) {
        tl.fromTo(
          previewMobileRef.current,
          { opacity: 0, scale: 0.94, y: 32, filter: 'blur(10px)' },
          { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: 0.82 },
          0,
        );
      }

      if (contentRef.current) {
        tl.fromTo(
          contentRef.current,
          { opacity: 0, x: direction >= 0 ? 36 : -36, filter: 'blur(4px)' },
          { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.72 },
          0.06,
        );

        tl.fromTo(
          contentRef.current.querySelectorAll('[data-work-animate]'),
          { opacity: 0, y: 22, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.62, stagger: 0.055, ease: 'power3.out' },
          0.16,
        );
      }

      if (sidebarListRef.current) {
        const activeBtn = sidebarListRef.current.querySelector('[data-active="true"]');
        if (activeBtn) {
          tl.fromTo(
            activeBtn,
            { scale: 0.97, boxShadow: '0 4px 14px rgba(72,90,195,0.05)' },
            { scale: 1, boxShadow: '0 10px 26px rgba(72,90,195,0.14)', duration: 0.55, ease: 'back.out(1.6)' },
            0.1,
          );
        }
      }

      if (workspaceRef.current) {
        gsap.fromTo(
          workspaceRef.current,
          { boxShadow: '0 18px 50px rgba(32,79,148,0.07)' },
          {
            boxShadow: '0 24px 60px rgba(46,100,223,0.16)',
            duration: 0.4,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut',
          },
        );
      }
    });

    return () => ctx.revert();
  }, [active, direction]);

  useEffect(() => {
    const desktopList = sidebarListRef.current;
    const mobileList = mobileJumpRef.current;
    const activeBtn =
      desktopList?.querySelector('[data-active="true"]') ??
      mobileList?.querySelector('[data-active="true"]');
    activeBtn?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }, [active]);

  const projectJumpBtnClass = (isActiveItem) =>
    `relative flex shrink-0 cursor-pointer items-center gap-[15px] rounded-[12px] border px-3 py-2.5 ps-4 text-start transition-[background,border-color,box-shadow,transform] duration-200 ${
      isActiveItem
        ? 'border-[#c7d4ff] bg-[linear-gradient(100deg,#f0f4ff,#f9f2ff)] shadow-[0_8px_22px_rgba(72,90,195,0.09)]'
        : 'border-transparent hover:bg-[#f8faff] hover:shadow-[0_4px_14px_rgba(72,90,195,0.05)]'
    }`;

  return (
    <section
      id="work"
      className="relative overflow-x-hidden bg-[radial-gradient(520px_330px_at_50%_12%,rgba(36,93,255,0.028),transparent_74%),linear-gradient(180deg,#ffffff_0%,#fbfcff_100%)] px-[clamp(1.25rem,3.6vw,3.3rem)] pb-[110px] pt-[120px] max-[900px]:px-5 max-[900px]:pb-20 max-[900px]:pt-[90px]"
      aria-labelledby="l2w-heading"
    >
      
      

      <header className="relative z-[4] mx-auto mb-[60px] w-full text-center">
        <Reveal>
          <div className="inline-flex h-10 items-center gap-2.5 rounded-[22px] border border-[#ccdafe] bg-white/76 px-[21px] text-[17px] font-medium tracking-[0.2px] text-[#1659da] shadow-[0_5px_18px_rgba(38,87,183,0.045),inset_0_1px_0_#fff]">
            <span className="block h-2.5 w-2.5 rounded-full bg-[#1768ff]" />
            {copy.projects.badge ?? (isAr ? 'أعمال مميزة' : 'FEATURED WORK')}
          </div>
          <h2
            id="l2w-heading"
            className="mb-[15px] mt-6 text-[70px] font-[750] leading-[0.99] tracking-[-3.2px] text-[#07132d] max-[1200px]:text-[52px] max-md:text-[38px] max-md:tracking-[-1.5px]"
          >
            {isAr ? (
              <>
                أعمال <span className={L2_GRAD}>مميزة</span>
              </>
            ) : (
              <>
                Featured <span className={L2_GRAD}>Work</span>
              </>
            )}
          </h2>
          <p className="m-0 text-xl leading-[1.48] text-[#58637a] max-md:text-base">
            {copy.projects.subtitle}
          </p>
          <HeaderDivider />
        </Reveal>
      </header>

      <div className="relative z-[3] mx-auto w-[1374px] max-w-[92vw]">
        <div
          ref={workspaceRef}
          className="relative flex h-[640px] flex-col overflow-hidden rounded-[31px] border border-[#dbe5f7] bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(252,253,255,0.93))] shadow-[0_18px_50px_rgba(32,79,148,0.07)] max-[1100px]:h-[680px] max-[1100px]:rounded-[24px]"
        >
          {/* Mobile / tablet — horizontal project jump (~5 visible + scroll) */}
          <div
            className="shrink-0 border-b border-[#e5ebf6] px-4 pb-3 pt-4 min-[1101px]:hidden"
            aria-label={isAr ? 'قفز بين المشاريع' : 'Project jump'}
          >
            <div className="mb-2.5 flex items-center gap-[15px] text-[13px] font-semibold text-[#1264ec]">
              {counter}
              <span className="block h-px flex-1 bg-[#dce6f6]" aria-hidden="true" />
            </div>
            <div
              ref={mobileJumpRef}
              className="flex gap-2.5 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#c5d4f5] [&::-webkit-scrollbar-track]:bg-transparent"
            >
              {projects.map((item, i) => {
                const isActiveItem = i === active;
                return (
                  <button
                    key={`jump-${item.title}`}
                    type="button"
                    data-active={isActiveItem ? 'true' : 'false'}
                    onClick={() => go(i, i > active ? 1 : -1)}
                    className={`${projectJumpBtnClass(isActiveItem)} min-h-[68px] min-w-[calc((100%-40px)/5)] max-[600px]:min-w-[148px]`}
                  >
                    {isActiveItem && (
                      <span className="absolute start-[-1px] top-[8px] bottom-[8px] w-[3px] rounded-[3px] bg-[#1767ff]" aria-hidden="true" />
                    )}
                    <div className="relative h-[46px] w-[46px] shrink-0 overflow-hidden rounded-[10px] shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                      <Image src={item.thumb} alt="" fill sizes="46px" className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="mb-0.5 text-[11px] font-medium text-[#5372a7]">{padIndex(i + 1)}</div>
                      <b className="block max-w-[120px] truncate text-[13px] font-semibold text-[#10265b]">{item.title}</b>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden min-[1101px]:flex-row">
            <div
              className="pointer-events-none absolute start-[299px] top-6 bottom-6 hidden w-px bg-[#e5ebf6] min-[1101px]:block"
              aria-hidden="true"
            />

          <aside
            className="relative hidden h-full w-[330px] shrink-0 px-10 pb-6 pt-9 min-[1101px]:flex min-[1101px]:flex-col"
            aria-label={isAr ? 'قائمة المشاريع' : 'Projects sidebar'}
          >
            <div className="mb-[18px] ms-[19px] flex shrink-0 items-center gap-[15px] text-[15px] font-semibold text-[#1264ec]">
              {counter}
              <span className="block h-px w-[66px] bg-[#3677ed]" aria-hidden="true" />
            </div>
            <div
              ref={sidebarListRef}
              className="flex max-h-full flex-col gap-1.5 overflow-y-auto overscroll-y-contain pe-1 [-ms-overflow-style:none] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#c5d4f5] [&::-webkit-scrollbar-track]:bg-transparent"
            >
              {projects.map((item, i) => {
                const isActiveItem = i === active;
                return (
                  <button
                    key={item.title}
                    type="button"
                    data-active={isActiveItem ? 'true' : 'false'}
                    onClick={() => go(i, i > active ? 1 : -1)}
                    className={`${projectJumpBtnClass(isActiveItem)} min-h-[74px]`}
                  >
                    {isActiveItem && (
                      <span className="absolute start-[-1px] top-[9px] bottom-[9px] w-[3px] rounded-[3px] bg-[#1767ff]" aria-hidden="true" />
                    )}
                    <div className="relative h-[54px] w-[54px] shrink-0 overflow-hidden rounded-[10px] shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                      <Image src={item.thumb} alt="" fill sizes="54px" className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="mb-1 text-xs font-medium text-[#5372a7]">{padIndex(i + 1)}</div>
                      <b className="block text-[14px] font-semibold leading-[1.3] text-[#10265b]">{item.title}</b>
                      <small className="mt-1 block text-xs text-[#6375a0]">{item.client}</small>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-auto shrink-0 grid grid-cols-2 gap-2 border-t border-[#e5ebf6] pt-4">
              <ProjectNavPill
                direction="up"
                label={isAr ? 'السابق' : 'Previous'}
                ariaLabel={isAr ? 'المشروع السابق' : 'Previous project'}
                onClick={() => go(active - 1, -1)}
              />
              <ProjectNavPill
                direction="down"
                label={isAr ? 'التالي' : 'Next'}
                ariaLabel={isAr ? 'المشروع التالي' : 'Next project'}
                onClick={() => go(active + 1, 1)}
              />
            </div>
          </aside>

          <article
            ref={contentRef}
            className="flex h-full min-h-0 w-full shrink-0 flex-col overflow-hidden px-[30px] pb-6 pt-9 min-[1101px]:w-[360px] min-[1101px]:px-7 min-[1101px]:ps-[42px] max-[1100px]:min-h-0 max-[1100px]:flex-1 max-[1100px]:px-5 max-[1100px]:pt-5"
          >
            <div className="shrink-0">
              <span
                data-work-animate
                className="mb-4 inline-block rounded-md border border-[#d7e3f9] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.4px] text-[#2164d8]"
              >
                {project.sector ?? project.client}
              </span>
              <h3
                data-work-animate
                className="mb-3 text-[32px] font-bold leading-[1.12] tracking-[-1px] text-[#07132d] max-[600px]:text-[29px]"
              >
                {project.title.split(' ').length > 2 ? (
                  <>
                    {project.title.split(' ').slice(0, -2).join(' ')}
                    <br />
                    {project.title.split(' ').slice(-2).join(' ')}
                  </>
                ) : (
                  project.title
                )}
              </h3>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain pe-1 [-ms-overflow-style:none] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#c5d4f5] [&::-webkit-scrollbar-track]:bg-transparent">
              <p data-work-animate className="mb-6 text-sm leading-[1.6] text-[#586b95]">
                {project.challenge}
              </p>

              <div data-work-animate>
                <DetailBlock type="challenge" label={labels.challenge}>
                  {project.challenge}
                </DetailBlock>
              </div>
              <div data-work-animate>
                <DetailBlock type="solution" label={labels.solution}>
                  {project.solution}
                </DetailBlock>
              </div>
              <div data-work-animate>
                <DetailBlock type="results" label={labels.results}>
                  {project.results.map((r) => (
                    <span key={r} className="block">
                      {r}
                    </span>
                  ))}
                </DetailBlock>
              </div>

              <div data-work-animate className="mt-4 flex flex-wrap gap-2 pb-1">
                {project.stack.map((t) => (
                  <span
                    key={t}
                    className="rounded-lg border border-[#dbe5f3] bg-white px-2.5 py-1.5 text-xs font-medium text-[#405b86]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </article>

          <div className="relative hidden min-h-0 min-w-0 flex-1 items-center pe-[30px] ps-0 pt-8 min-[1101px]:flex">
            <div
              ref={previewDesktopRef}
              className="relative h-full max-h-[518px] w-full overflow-hidden rounded-[15px] shadow-[0_12px_30px_rgba(11,25,53,0.12)]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div
                ref={previewShineRef}
                className="pointer-events-none absolute inset-y-0 z-[2] w-[45%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.42),transparent)] opacity-0"
                aria-hidden="true"
              />
              <Image
                key={`desktop-${project.preview}`}
                src={project.preview}
                alt={project.title}
                fill
                sizes="(max-width: 1100px) 92vw, 671px"
                className="object-cover object-center"
                priority={active === 0}
              />
              {/* <CaseStudyCta cn="absolute end-unset !bottom-4 !right-4" label={copy.projects.readStory} /> */}
            </div>
          </div>

          <div className="block shrink-0 px-5 pb-6 pt-[18px] min-[1101px]:hidden">
            <div
              ref={previewMobileRef}
              className="relative aspect-[671/518] max-h-[320px] w-full overflow-hidden rounded-[15px] shadow-[0_12px_30px_rgba(11,25,53,0.12)]"
            >
              <Image
                key={`mobile-${project.preview}`}
                src={project.preview}
                alt={project.title}
                fill
                sizes="92vw"
                className="object-cover object-center"
              />
              <CaseStudyCta label={copy.projects.readStory} />
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
