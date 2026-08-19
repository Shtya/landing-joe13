'use client';

import { useEffect, useId, useRef } from 'react';
import { Reveal, IconAsset } from '../ui';
import { L2_GRAD } from '../tokens';
import { useInView } from '../hooks';

const STEP_ICONS = ['search', 'web-design', 'code', 'qc', 'rocket', 'phone-call'];

const PERIOD_OVERRIDES = {
  en: ['WEEKS 1-2', 'WEEKS 3-5', 'WEEKS 6-12', 'WEEKS 12-14', 'WEEK 15', 'ALWAYS'],
  ar: ['الأسبوع 1-2', 'الأسبوع 3-5', 'الأسبوع 6-12', 'الأسبوع 12-14', 'الأسبوع 15', 'دائماً'],
};

function HeaderDivider() {
  return (
    <div className="mx-auto mt-[19px] flex h-4 w-[220px] items-center justify-center gap-3">
      <span className="h-px w-[94px] bg-[linear-gradient(90deg,transparent,#9abaff)]" aria-hidden="true" />
      <span className="h-2 w-2 shrink-0 rounded-full bg-[#2b6cff]" aria-hidden="true" />
      <span className="h-px w-[94px] bg-[linear-gradient(90deg,#a17cff,transparent)]" aria-hidden="true" />
    </div>
  );
}

export default function Process({ copy }) {
  const isAr = copy.nav?.home === 'الرئيسية';
  const phases = copy.process?.phases ?? [];
  const periods = PERIOD_OVERRIDES[isAr ? 'ar' : 'en'];
  const [trackRef, trackInView] = useInView({ threshold: 0.2 });
  const pathRef = useRef(null);
  const gradientId = useId().replace(/:/g, '');

  useEffect(() => {
    const path = pathRef.current;
    if (!path || !trackInView) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    path.style.transition = 'none';

    requestAnimationFrame(() => {
      path.style.transition = 'stroke-dashoffset 2.2s ease-out';
      path.style.strokeDashoffset = '0';
    });
  }, [trackInView]);

  return (
    <section
      id="process"
      className="relative overflow-hidden bg-[radial-gradient(520px_330px_at_50%_48%,rgba(36,93,255,0.028),transparent_74%),linear-gradient(180deg,#ffffff_0%,#fbfcff_100%)] px-[clamp(1.25rem,3.6vw,3.3rem)] pb-[110px] pt-[120px] max-[900px]:px-5 max-[900px]:pb-20 max-[900px]:pt-[90px]"
      aria-labelledby="l2p-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(500px_160px_at_50%_91%,rgba(49,95,255,0.045),transparent_75%)]"
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-[37px] top-[99px] h-[126px] w-[170px] bg-[radial-gradient(circle,rgba(106,153,255,0.20)_1.25px,transparent_1.45px)] bg-[length:16px_16px] opacity-70" />
        <div className="absolute right-[38px] top-[62px] h-[126px] w-[170px] bg-[radial-gradient(circle,rgba(106,153,255,0.20)_1.25px,transparent_1.45px)] bg-[length:16px_16px] opacity-70" />
      </div>

      <header className="relative z-[4] mx-auto mb-[60px] w-full text-center">
        <Reveal>
          <div className="inline-flex h-10 items-center gap-2.5 rounded-[22px] border border-[#ccdafe] bg-white/76 px-[21px] text-[17px] font-medium tracking-[0.2px] text-[#1659da] shadow-[0_5px_18px_rgba(38,87,183,0.045),inset_0_1px_0_#fff]">
            <span className="block h-2.5 w-2.5 rounded-full bg-[#1768ff]" />
            {isAr ? 'كيف نعمل' : 'HOW WE WORK'}
          </div>
          <h2
            id="l2p-heading"
            className="mb-[15px] mt-6 text-[70px] font-[750] leading-[0.99] tracking-[-3.2px] text-[#07132d] max-[1200px]:text-[52px] max-md:text-[38px] max-md:tracking-[-1.5px]"
          >
            {isAr ? (
              <>
                رحلتك <span className={L2_GRAD}>معنا</span>
              </>
            ) : (
              <>
                Our <span className={L2_GRAD}>Process</span>
              </>
            )}
          </h2>
          <p className="m-0 text-xl leading-[1.48] text-[#58637a] max-md:text-base">
            {isAr
              ? 'عملية واضحة ومجربة لتقديم نتائج استثنائية.'
              : 'A clear and proven process to deliver exceptional results.'}
          </p>
          <HeaderDivider />
        </Reveal>
      </header>

      <Reveal className="relative z-[3] mx-auto mb-5 w-full" delay={60}>
        <div ref={trackRef} className="relative grid min-h-[141px] grid-cols-6 items-start gap-5 max-[1400px]:min-h-0 max-[1400px]:grid-cols-3 max-[1400px]:gap-7 max-[900px]:grid-cols-2 max-[640px]:hidden">
          <svg
            className="pointer-events-none absolute inset-x-[4%] top-[63px] z-[1] h-[8px] w-[92%]"
            viewBox="0 0 1000 8"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="1000" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1767ff" />
                <stop offset="0.5" stopColor="#4b63ff" />
                <stop offset="1" stopColor="#8129ff" />
              </linearGradient>
            </defs>
            <path
              ref={pathRef}
              d="M0 4 H1000"
              stroke={`url(#${gradientId})`}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </svg>

          {phases.map((phase, index) => {
            const isPurple = index % 2 === 1;

            return (
              <div
                key={`${phase.title}-node`}
                className={`relative z-[2] mx-auto grid h-[132px] w-[132px] place-items-center overflow-visible rounded-full border border-[#d9e4f5] bg-[radial-gradient(circle_at_47%_43%,#fff_0,#fbfdff_61%,#edf3fc_100%)] shadow-[0_12px_28px_rgba(44,88,165,0.12),inset_0_1px_0_#fff] max-[900px]:h-[108px] max-[900px]:w-[108px] before:absolute before:inset-[-1px] before:rotate-[-35deg] before:rounded-full before:border-[5px] before:border-transparent before:content-[''] after:absolute after:inset-[11px] after:rounded-full after:border after:border-[rgba(216,228,247,0.65)] after:content-[''] [&_span.relative]:z-[3] ${
                  isPurple
                    ? 'before:border-r-[#8130ff] before:border-t-[#8130ff]'
                    : 'before:border-r-[#1d6aff] before:border-t-[#1d6aff]'
                }`}
              >
                <IconAsset name={STEP_ICONS[index] ?? STEP_ICONS[0]} size={82} scale={1.14} />
                <div
                  className={`absolute left-1/2 top-[127px] h-[27px] w-px -translate-x-1/2 bg-[#6f9ef4] max-[900px]:hidden after:absolute after:bottom-[-2px] after:left-1/2 after:h-[7px] after:w-[7px] after:-translate-x-1/2 after:rounded-full after:shadow-[0_0_0_2px_#fff] after:content-[''] ${
                    isPurple ? 'after:bg-[#8129ff]' : 'after:bg-[#1767ff]'
                  }`}
                />
              </div>
            );
          })}
        </div>
      </Reveal>

      <div className="relative z-[4] mx-auto grid w-full grid-cols-6 gap-[21px] max-[1400px]:grid-cols-3 max-[900px]:grid-cols-2 max-[640px]:grid-cols-1">
        {phases.map((phase, index) => {
          const isPurple = index % 2 === 1;
          const title = phase.title.replace(' & ', ' &\n');

          return (
            <Reveal key={`${phase.title}-card`} delay={index * 70}>
              <article
                className={`relative min-h-[490px] rounded-[20px] border border-[#e1e8f3] bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(252,253,255,0.93))] px-5 pb-[18px] pt-5 text-center shadow-[0_17px_32px_rgba(38,76,142,0.08),inset_0_1px_0_#fff] max-[640px]:min-h-0 after:absolute after:bottom-[-1px] after:left-1/2 after:h-[5px] after:w-[190px] after:-translate-x-1/2 after:rounded-t-[50%] after:content-[''] ${
                  isPurple
                    ? 'after:bg-[#8129ff] after:shadow-[0_0_12px_rgba(129,41,255,0.30)]'
                    : 'after:bg-[#1767ff] after:shadow-[0_0_12px_rgba(23,103,255,0.35)]'
                }`}
              >
                <div
                  className={`mx-auto mb-[9px] grid h-[49px] w-[49px] place-items-center rounded-full border text-xl ${
                    isPurple
                      ? 'border-[#e1d5ff] bg-[#faf6ff] text-[#8129ff]'
                      : 'border-[#cbdcff] bg-[#f5f9ff] text-[#1767ff]'
                  }`}
                >
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div
                  className={`mb-[18px] text-[13px] font-bold tracking-[0.45px] ${
                    isPurple ? 'text-[#7222f3]' : 'text-[#125cff]'
                  }`}
                >
                  {periods[index] ?? phase.duration.toUpperCase()}
                </div>
                <h3 className="mb-[27px] whitespace-pre-line text-[21px] font-bold leading-[1.35] tracking-[-0.3px] text-[#07132e]">
                  {title}
                </h3>
                <p className="mx-auto mb-5 min-h-[63px] max-w-[185px] text-[13.5px] leading-[1.55] text-[#18233a]">
                  {phase.desc}
                </p>
                <div className="mb-[17px] h-px bg-[#dbe3ef]" />
                <ul className="m-0 list-none space-y-2.5 p-0 text-start">
                  {phase.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-center gap-2.5 text-[12.5px] leading-[1.78] text-[#17233b]"
                    >
                      <IconAsset name="check-circle" size={25}  className="mt-0.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
