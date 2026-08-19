'use client';

import { useTranslations } from 'next-intl';

const TECHS = {
  Frontend: [
    { name: 'React', color: '#61DAFB' },
    { name: 'Next.js', color: '#000000' },
    { name: 'Vue', color: '#42B883' },
    { name: 'TypeScript', color: '#3178C6' },
    { name: 'Tailwind', color: '#06B6D4' },
    { name: 'Three.js', color: '#000000' },
  ],
  Backend: [
    { name: 'Node.js', color: '#339933' },
    { name: 'Go', color: '#00ADD8' },
    { name: 'Python', color: '#3776AB' },
    { name: 'Rust', color: '#000000' },
    { name: 'GraphQL', color: '#E10098' },
  ],
  Database: [
    { name: 'PostgreSQL', color: '#4169E1' },
    { name: 'Redis', color: '#FF4438' },
    { name: 'MongoDB', color: '#47A248' },
    { name: 'ClickHouse', color: '#FFCC01' },
  ],
  DevOps: [
    { name: 'Kubernetes', color: '#326CE5' },
    { name: 'Docker', color: '#2496ED' },
    { name: 'Terraform', color: '#7B42BC' },
    { name: 'GitHub Actions', color: '#2088FF' },
  ],
  Cloud: [
    { name: 'AWS', color: '#FF9900' },
    { name: 'GCP', color: '#4285F4' },
    { name: 'Vercel', color: '#000000' },
    { name: 'Cloudflare', color: '#F38020' },
  ],
};

function TechBadge({ name, color }) {
  return (
    <div
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 hover:scale-110 cursor-default group"
      style={{
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        color: 'var(--color-text)',
      }}
    >
      <span
        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{ background: color }}
      />
      {name}
    </div>
  );
}

function MarqueeRow({ techs, reverse = false }) {
  return (
    <div className="relative overflow-hidden py-2">
      <div
        className="flex gap-3"
        style={{
          animation: `${reverse ? 'marqueeReverse' : 'marquee'} ${30 + Math.random() * 10}s linear infinite`,
          width: 'max-content',
        }}
      >
        {[...techs, ...techs].map((tech, i) => (
          <TechBadge key={i} name={tech.name} color={tech.color} />
        ))}
      </div>
    </div>
  );
}

export default function TechStack() {
  const t = useTranslations('techstack');

  return (
    <section
      id="techstack"
      className="section-base py-24 section-with-blur overflow-hidden"
      aria-labelledby="tech-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'var(--color-overlay)', color: 'var(--color-primary)', border: '1px solid var(--color-primary)' }}
          >
            {t('badge')}
          </div>
          <h2
            id="tech-heading"
            className="font-bold mb-3"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--color-text)' }}
          >
            {t('headline')}
          </h2>
          <p style={{ color: 'var(--color-muted)' }}>{t('subheadline')}</p>
        </div>
      </div>

      {/* Marquee rows with gradient fades */}
      <div className="relative">
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, var(--color-background), transparent)' }}
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, var(--color-background), transparent)' }}
        />

        <div className="space-y-3 py-4">
          <MarqueeRow techs={[...TECHS.Frontend, ...TECHS.Backend]} />
          <MarqueeRow techs={[...TECHS.Database, ...TECHS.DevOps, ...TECHS.Cloud]} reverse />
        </div>
      </div>

      {/* Group labels below */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-wrap justify-center gap-4">
          {Object.keys(TECHS).map((group) => (
            <span
              key={group}
              className="px-4 py-2 rounded-full text-xs font-semibold"
              style={{
                background: 'var(--color-surface)',
                color: 'var(--color-muted)',
                border: '1px solid var(--color-border)',
              }}
            >
              {group}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
