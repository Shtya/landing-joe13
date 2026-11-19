import Image from 'next/image';

/*
 * The JOE13 wordmark in both inks. CSS shows the one that matches the active
 * theme (html[data-theme]), so the logo is right on the very first paint —
 * no React state, no flash.
 */
export default function Logo({ priority = false, className = '' }) {
  return (
    <span className={`j13-logo ${className}`}>
      <Image className="j13-logo__on-dark" src="/logos/logo-white.png" alt="" width={300} height={101} sizes="150px" priority={priority} />
      <Image className="j13-logo__on-light" src="/logos/logo-black.png" alt="" width={300} height={101} sizes="150px" priority={priority} />
    </span>
  );
}
