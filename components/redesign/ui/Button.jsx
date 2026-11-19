import { forwardRef } from 'react';
import Glyph from '../Glyph';

/*
 * Button — the one button of the home page, built on the /temp CTA pattern:
 * a pill with the sky → cobalt → deep-navy gradient body (brand blue + black), an inset top highlight,
 * layered drop + glow shadows, and the white arrow chip at the inline end.
 *
 *   variant  primary | secondary (glass outline) | ghost (text) | icon (round)
 *   size     sm | md | lg
 *   href     renders an <a>; otherwise a <button>
 *   arrow    show the arrow chip (default: primary + secondary)
 *   icon     leading glyph, or the only content for variant="icon"
 *   label    accessible name (required for variant="icon")
 *
 * States live in redesign.css: hover lifts and glows, active presses down with
 * a tighter shadow, :focus-visible draws a ring, :disabled / aria-disabled dims.
 * Magnetic pull comes from useInteractions via [data-magnetic].
 */
const ARROW = { sm: 14, md: 16, lg: 18 };

const Button = forwardRef(function Button(
  { href, variant = 'primary', size = 'md', arrow, icon, label, magnetic = true, className = '', children, type = 'button', ...rest },
  ref,
) {
  const showArrow = arrow ?? (variant === 'primary' || variant === 'secondary');
  const cls = ['j13-btn', `j13-btn--${variant}`, `j13-btn--${size}`, showArrow ? 'has-chip' : '', className].filter(Boolean).join(' ');

  const content =
    variant === 'icon' ? (
      <span className="j13-btn__icon">{icon}</span>
    ) : (
      <>
        {icon ? (
          <span className="j13-btn__lead" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <span className="j13-btn__label">{children}</span>
        {showArrow ? (
          <span className="j13-btn__chip" aria-hidden="true">
            <Glyph name="arrow" size={ARROW[size] ?? 16} flip />
          </span>
        ) : null}
      </>
    );

  const shared = {
    ref,
    className: cls,
    'aria-label': label,
    'data-magnetic': magnetic && variant !== 'ghost' ? '' : undefined,
    ...rest,
  };

  if (href) {
    return (
      <a href={href} {...shared}>
        {content}
      </a>
    );
  }
  return (
    <button type={type} {...shared}>
      {content}
    </button>
  );
});

export default Button;
