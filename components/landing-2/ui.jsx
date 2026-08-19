'use client';

import Image from 'next/image';
import { useId } from 'react';
import { useInView } from './hooks';

export function Reveal({ children, className = '', delay = 0 }) {
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

export default function BrandMark({ className = 'h-auto w-[38px]' }) {
  const uid = useId().replace(/:/g, '');
  const gradientId = `l2-bm-${uid}`;

  return (
    <svg className={className} viewBox="0 0 48 58" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="5" y1="5" x2="43" y2="53" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00B9FF" />
          <stop offset=".52" stopColor="#1266F7" />
          <stop offset="1" stopColor="#7627FF" />
        </linearGradient>
      </defs>
      <path d="M10 8C17 2 30 2 36 8C42 14 42 23 36 29L20 45C16 49 10 50 7 47C3 43 5 38 9 34L26 17C28 15 28 12 25 11C22 10 19 11 17 13L11 19L7 15C5 13 6 10 10 8Z" fill={`url(#${gradientId})`} />
      <path d="M35 29C41 23 44 26 43 32C42 38 38 43 32 49C28 53 20 57 14 54L10 51L18 42L22 44C25 45 28 43 31 40L36 35C38 33 38 31 35 29Z" fill={`url(#${gradientId})`} opacity=".95" />
      <path d="M12 22L18 16" stroke="#090c16" strokeWidth="3" strokeLinecap="round" opacity=".45" />
    </svg>
  );
}

export function ArrowIcon({ className = 'block h-4 w-4 rtl:scale-x-[-1]' }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconAsset({
  name,
  alt = '',
  className = '',
  size = 28,
  scale = 0.62,
  priority = false,
}) {
  return (
    <span
      className={`relative inline-block shrink-0 ${className}`.trim()}
      style={{ width: size, height: size }}
      aria-hidden={alt ? undefined : 'true'}
    >
      <Image
        src={`/icons/${name}.png`}
        alt={alt}
        fill
        sizes={`${size}px`}
        priority={priority}
        style={{ objectFit: 'contain', transform: `scale(${scale})` }}
      />
    </span>
  );
}
