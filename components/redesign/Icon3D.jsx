import Image from 'next/image';

/*
 * Icon3D — the JOE13 rendered icon set (public/icons, glossy cobalt glass).
 * These are illustrations, not UI glyphs: use them where an object is being
 * introduced (a service, a value, a channel). For controls use <Glyph>.
 * Sources are 1536×1024 PNGs; next/image serves a small WebP at `size`.
 */
export default function Icon3D({ name, size = 64, className = '', alt = '', priority = false }) {
  return (
    <span className={`j13-icon3d ${className}`} style={{ '--size': `${size}px` }}>
      <Image
        src={`/icons/${name}.png`}
        alt={alt}
        width={Math.round(size * 1.5)}
        height={size}
        sizes={`${Math.round(size * 1.5)}px`}
        quality={80}
        priority={priority}
        draggable={false}
      />
    </span>
  );
}
