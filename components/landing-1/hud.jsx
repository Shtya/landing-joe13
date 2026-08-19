'use client';

export function HudFrame({ corner, size = 26, className = '' }) {
  const paths = {
    tl: `M 2 ${size} L 2 2 L ${size} 2`,
    tr: `M ${size - 20} 2 L ${size} 2 L ${size} ${size}`,
    bl: `M 2 ${size - 20} L 2 ${size} L ${size} ${size}`,
    br: `M ${size - 20} ${size} L ${size} ${size} L ${size} ${size - 20}`,
  };

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className={className}
    >
      <path d={paths[corner]} stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}

export function EyebrowBadge({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-accent backdrop-blur-md ${className}`}
      style={{
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 0 24px -8px rgba(212,162,47,0.25)',
      }}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(212,162,47,0.85)]" />
      {children}
    </span>
  );
}

export function HudCorners() {
  return (
    <>
      <div className="pointer-events-none absolute left-6 top-24 text-accent md:left-10 md:top-28">
        <HudFrame corner="tl" />
      </div>
      <div className="pointer-events-none absolute right-6 top-24 text-accent md:right-10 md:top-28">
        <HudFrame corner="tr" />
      </div>
      <div className="pointer-events-none absolute bottom-14 left-6 text-accent md:bottom-16 md:left-10">
        <HudFrame corner="bl" />
      </div>
      <div className="pointer-events-none absolute bottom-14 right-6 text-accent md:bottom-16 md:right-10">
        <HudFrame corner="br" />
      </div>
    </>
  );
}
