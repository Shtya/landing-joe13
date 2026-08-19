'use client';

export function FakeImage({
  label,
  width = 1200,
  height = 700,
  accent = '#3b82f6',
  variant = 'ui',
  className = '',
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        aspectRatio: `${width} / ${height}`,
        background: `linear-gradient(145deg, ${accent}33 0%, #0b1224 48%, #020617 100%)`,
        border: '1px solid rgba(148,163,184,0.2)',
      }}
      role="img"
      aria-label={label}
    >
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />

      {variant === 'ui' && (
        <div className="absolute inset-6 md:inset-8 flex flex-col gap-3">
          <div className="flex gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <div className="grid grid-cols-3 gap-3 flex-1">
            <div className="col-span-2 rounded-xl" style={{ background: `${accent}22`, border: `1px solid ${accent}55` }} />
            <div className="rounded-xl bg-white/5 border border-white/10" />
            <div className="rounded-xl bg-white/5 border border-white/10" />
            <div className="col-span-2 rounded-xl" style={{ background: `${accent}18` }} />
          </div>
        </div>
      )}

      {variant === 'device' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[46%] max-w-[220px] rounded-[2rem] p-2 border border-white/20 bg-black/40 shadow-2xl">
            <div className="rounded-[1.5rem] overflow-hidden" style={{ background: `${accent}30`, minHeight: '58%' }}>
              <div className="h-8 bg-black/30" />
              <div className="p-4 space-y-2">
                <div className="h-3 w-2/3 rounded bg-white/30" />
                <div className="h-3 w-full rounded bg-white/15" />
                <div className="h-20 rounded-xl bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      )}

      {variant === 'avatar' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg" style={{ background: accent }}>
            {label.slice(0, 1)}
          </div>
        </div>
      )}

      {variant !== 'avatar' && (
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <span className="text-xs md:text-sm font-semibold tracking-wide text-white/80">{label}</span>
          <span className="text-[10px] uppercase tracking-widest text-white/40">Placeholder</span>
        </div>
      )}
    </div>
  );
}

export function SectionHeader({ kicker, title, subtitle, align = 'center' }) {
  return (
    <div className={`mb-14 ${align === 'center' ? 'text-center' : ''}`}>
      {kicker && <span className="l1-kicker">{kicker}</span>}
      <h2 className="l1-title">{title}</h2>
      {subtitle && <p className={`l1-sub ${align === 'center' ? 'mx-auto max-w-2xl' : ''}`}>{subtitle}</p>}
    </div>
  );
}

export function Reveal({ children, className = '', variant = 'up', delay = 0, inView }) {
  const cls = variant === 'left' ? 'l1-reveal-left' : variant === 'right' ? 'l1-reveal-right' : 'l1-reveal';
  return (
    <div className={`${cls} ${inView ? 'is-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
