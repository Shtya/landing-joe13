import Image from 'next/image';

/*
 * Icon3D — the JOE13 rendered icon set (glossy cobalt glass).
 * These are illustrations, not UI glyphs: use them where an object is being
 * introduced (a service, a value, a channel). For controls use <Glyph>.
 * Sources live in public/icons/*.png; scripts/normalize-icons.cjs turns them
 * into public/icons/3d/*.webp — 512×512, trimmed and centred with an even
 * margin — so every icon has the same optical size and fits its square box.
 */
export default function Icon3D({ name, size = 64, className = '', alt = '', priority = false }) {
  return (
    <span className={`j13-icon3d ${className}`} style={{ '--size': `${size}px` }}>
      <Image
        src={`/icons/3d/${name}.webp`}
        alt={alt}
        width={size}
        height={size}
        sizes={`${size}px`}
        quality={85}
        priority={priority}
        draggable={false}
      />
    </span>
  );
}
