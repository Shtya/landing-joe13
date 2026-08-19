'use client';

import Image from 'next/image';
import { useId } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useInView } from './hooks';
import { L2_LOGOS } from './logos';
import {
  L2_BTN_PRIMARY_LG,
  L2_BTN_PRIMARY_MD,
  L2_BTN_PRIMARY_SM,
  L2_BTN_ARROW_LG,
  L2_BTN_ARROW_MD,
  L2_BTN_ARROW_SM,
} from './tokens';

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

const PRIMARY_SIZE_CLASSES = {
  lg: { btn: L2_BTN_PRIMARY_LG, arrow: L2_BTN_ARROW_LG, icon: 'h-4 w-4' },
  md: { btn: L2_BTN_PRIMARY_MD, arrow: L2_BTN_ARROW_MD, icon: 'h-4 w-4' },
  sm: { btn: L2_BTN_PRIMARY_SM, arrow: L2_BTN_ARROW_SM, icon: 'h-4 w-4' },
};

export function PrimaryButton({
  children,
  href,
  type = 'button',
  size = 'lg',
  className = '',
  disabled = false,
  showArrow = true,
  ...rest
}) {
  const styles = PRIMARY_SIZE_CLASSES[size] ?? PRIMARY_SIZE_CLASSES.lg;
  const classes = `${styles.btn} ${className}`.trim();

  const content = (
    <>
      {children}
      {showArrow ? (
        <span className={styles.arrow} aria-hidden="true">
          <ArrowIcon className={styles.icon} />
        </span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${classes} disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0`.trim()}
      {...rest}
    >
      {content}
    </button>
  );
}

export function SiteLogo({
  variant = 'white',
  className = 'h-[38px] w-[132px]',
  alt = 'Joe 13',
  priority = false,
}) {
  const src = variant === 'black' ? L2_LOGOS.black : L2_LOGOS.white;

  return (
    <span className={`relative block shrink-0 ${className}`.trim()}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="180px"
        priority={priority}
        className="object-contain object-left rtl:object-right"
      />
    </span>
  );
}

export function LocaleSwitch({ className = '', size = 'md' }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (next) => {
    const segments = pathname.split('/');
    segments[1] = next;
    router.push(segments.join('/'));
  };

  const isSm = size === 'sm';

  return (
    <div
      className={`relative isolate inline-flex rounded-full border border-[rgba(123,157,202,0.28)] bg-[rgba(4,11,20,0.55)] p-[3px] ${className}`.trim()}
      role="group"
      aria-label="Language"
    >
      <span
        className={`absolute bottom-[3px] top-[3px] left-[3px] z-0 w-[calc((100%-6px)/2)] rounded-full bg-[linear-gradient(135deg,rgba(9,136,255,0.28),rgba(108,50,255,0.22))] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_4px_14px_rgba(7,140,255,0.16)] transition-[transform,background,box-shadow] duration-[280ms] ${locale === 'ar' ? 'translate-x-full' : ''}`}
        aria-hidden="true"
      />
      {['en', 'ar'].map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchLocale(loc)}
          className={`relative z-[1] min-w-[2.75rem] cursor-pointer rounded-full border-0 bg-transparent px-[0.62rem] py-[0.36rem] font-[inherit] font-semibold tracking-[0.08em] ${isSm ? 'text-[0.62rem]' : 'text-[0.68rem]'} ${locale === loc ? 'text-[var(--l2-white)]' : 'text-[#8b95a8]'}`}
        >
          {loc === 'en' ? 'EN' : 'عر'}
        </button>
      ))}
    </div>
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
