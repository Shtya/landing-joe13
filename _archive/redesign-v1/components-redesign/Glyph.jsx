/*
 * Glyph — the Ribbon icon set. 24px grid, 1.6 stroke, square caps and
 * mitred joins so icons share the chamfered geometry of the components.
 * Decorative by default (aria-hidden); pass `label` when an icon carries meaning alone.
 */

const PATHS = {
  arrow: <path d="M4 12h15M13 6l6 6-6 6" />,
  prev: <path d="M15 5l-7 7 7 7" />,
  next: <path d="M9 5l7 7-7 7" />,
  code: <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16" />,
  mobile: (
    <>
      <path d="M8 2.5h8l2 2v15l-2 2H8l-2-2v-15z" />
      <path d="M10.5 18.5h3" />
    </>
  ),
  spark: <path d="M12 2.5l2.2 6.8 6.8 2.2-6.8 2.2-2.2 6.8-2.2-6.8L3 11.5l6.8-2.2z" />,
  cloud: <path d="M7 18.5h10.5a4 4 0 0 0 .4-8 6 6 0 0 0-11.6 1.2A3.4 3.4 0 0 0 7 18.5z" />,
  link: (
    <>
      <path d="M10 14l4-4" />
      <path d="M8.5 11.5l-3 3a3.2 3.2 0 0 0 4.5 4.5l3-3M15.5 12.5l3-3A3.2 3.2 0 0 0 14 5l-3 3" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2.5l8 3v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10v-6z" />
      <path d="M8.5 12l2.5 2.5 4.5-5" />
    </>
  ),
  team: (
    <>
      <path d="M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5" />
      <path d="M15.5 4.3a3.5 3.5 0 0 1 0 6.4M18 14.8c2 .8 3.2 2.5 3.5 5.2" />
    </>
  ),
  gauge: (
    <>
      <path d="M3.5 17a8.5 8.5 0 1 1 17 0" />
      <path d="M12 17l4.5-6" />
    </>
  ),
  pulse: <path d="M2.5 12h4l2.5-6 4 13 2.8-7h5.7" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
    </>
  ),
  moon: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />,
  mail: (
    <>
      <path d="M3 5.5h18v13H3z" />
      <path d="M3 6l9 7 9-7" />
    </>
  ),
  phone: <path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z" />,
  pin: (
    <>
      <path d="M12 21.5s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  check: <path d="M4 12.5l5 5L20 6.5" />,
  star: <path d="M12 3l2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 16.9l-5.4 2.9 1.1-6.1-4.5-4.3 6.1-.8z" fill="currentColor" />,
  play: <path d="M7 4.5v15l12-7.5z" />,
  pause: <path d="M7.5 5v14M16.5 5v14" />,
  replay: (
    <>
      <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />
      <path d="M4 3.5v4h4" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3l10 18H2z" />
      <path d="M12 10v5M12 17.5v.5" />
    </>
  ),
};

export default function Glyph({ name, size = 20, label, flip = false, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : 'true'}
      focusable="false"
      data-flip={flip ? '' : undefined}
    >
      {PATHS[name]}
    </svg>
  );
}

/** The quotation mark used on the clients slide — two cut ribbon ends. */
export function QuoteMark({ className }) {
  return (
    <svg className={className} viewBox="0 0 88 64" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M14 0h22L22 32h14v32H0V32z" />
      <path d="M66 0h22L74 32h14v32H52V32z" opacity="0.55" />
    </svg>
  );
}
