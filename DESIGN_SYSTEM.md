# JOE13 home — design system

The home page (`/[locale]`) is one continuous scroll page. The previous slide-deck version is archived in `_archive/redesign-v1/`.

| What | Where |
|---|---|
| Tokens, themes, components, section layouts | `app/[locale]/redesign.css` |
| Fonts (per-locale pairs) | `app/[locale]/fonts.js` |
| Copy, both locales (the page's i18n source) | `components/redesign/content.js` |
| Page shell (scroll, tracking, theme, language) | `components/redesign/JoeRedesign.jsx` |
| Motion helpers (reveals, split text, count-up) | `components/redesign/motion.js` |
| Smooth scroll (Lenis on GSAP's ticker) | `components/redesign/useSmoothScroll.js` |
| Pointer layer (magnetic, tilt, spotlight, ripple) | `components/redesign/useInteractions.js` |
| Button / Logo / SectionHead | `components/redesign/ui/*` |
| Nav + mobile menu, side rail, footer | `components/redesign/chrome/*` |
| Sections | `components/redesign/sections/*` |
| WebGL ribbon (hero object, re-forms per section) | `components/redesign/ribbon/*` |
| Icons: UI line set / 3D illustrations | `Glyph.jsx` / `Icon3D.jsx` → `public/icons` |

## Rules
- **Colours only through tokens.** `.j13` holds the dark theme, and `html[data-theme='light'] .j13` holds the light one. The theme is set on `<html>` before first paint by the script in `app/[locale]/layout.js`, using the saved `j13-theme` value or the system preference.
- **Logical properties only.** Use `margin-inline`, `inset-inline-*` and `padding-inline`. Directional icons take `flip`. Horizontal motion checks `isArabic` and mirrors.
- **Animate `transform` / `opacity` only.** Button lift uses the `translate` property, so magnetic motion (GSAP `transform`) can run at the same time.
- **Reduced motion:** Lenis is off and reveals become fades. Marquees stop and become swipe rows. Work becomes a swipe carousel. There is no cursor, no intro and no tilt.
- **No text in components.** Every string comes from `content.js`.

## Button
`<Button variant="primary|secondary|ghost|icon" size="sm|md|lg" href? arrow? icon? label?>`. It is the /temp CTA: a gradient pill, an inset highlight, layered shadows and a white arrow chip.

## Scroll reveals
Add `data-reveal="up|lines|stagger|scale|draw"` to any element. `[data-count]` with `data-value="180+"` counts up when it comes into view.
