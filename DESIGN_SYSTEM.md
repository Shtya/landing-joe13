# JOE13 "Ribbon" Design System

The master reference for every JOE13 surface. It started as the redesign of the home page at `/[locale]/redesign`. Read this file before redesigning any component. The live implementation is the reference, and this file explains it.

| What | Where |
|---|---|
| Tokens, primitives, components, slide layouts | `app/[locale]/redesign/redesign.css` |
| Fonts | `app/[locale]/redesign/fonts.js` |
| Motion tokens and patterns | `components/redesign/motion.js` |
| UI icons (line) | `components/redesign/Glyph.jsx` |
| Illustrated icons (3D, from the current home) | `components/redesign/Icon3D.jsx` → `public/icons/*.png` |
| Slide shell (deck engine, nav, rail) | `components/redesign/JoeRedesign.jsx`, `SlideRail.jsx` |
| WebGL ribbon | `components/redesign/ribbon/*` |
| Copy | `components/redesign/content.js` (reads the existing content files) |

The original home page (`/[locale]`, `components/landing-2`) is untouched.

**v2 (merge with the current home):** the redesign now carries the current home's identity on top of the Ribbon system:
- Its 3D icon set.
- Its six services.
- Its rhythm of white and dark sections.
- Its live badge.
- Its white arrow chip on CTAs.
- Its Mission / Vision / Approach values.
- Its stats icons and social icons.

The merge also adds two slides a software company is expected to have: **Stack** (the technologies, as an interactive layered object) and **Plans** (engagement models with prices, which pre-fill the contact brief).

---

## 1. Idea

The JOE13 mark is a folded cobalt ribbon (the "J") beside chrome letters. The system is built from that one object:

- **The ribbon** is a single WebGL band that runs through the whole page and takes a new shape on every slide: the J on the intro, a ring around the platforms, a trajectory behind the process, a frame around the case study, a point of signal behind the contact form. It is the one bold element. Everything else stays quiet.
- **The chamfer.** The ribbon's ends are cut on a diagonal. Panels, buttons, icon tiles and timeline nodes use the same cut on the top-start and bottom-end corners. It replaces border-radius as the shape language.
- **Chrome type.** Headlines carry the silver-chrome gradient of the wordmark. It is lit per line, never on a single accented word.

Principles:
1. One bold thing per screen. The ribbon is it. Content surfaces are calm glass.
2. Light, not shadow. Elevation comes from lit edges and cobalt glow, never grey drop shadows.
3. Structure is information. Numbers appear only where content is a real sequence (process phases, slide counter, case index).
4. Motion answers the user or marks a scene change. There is no ambient section-by-section fade-up.

---

## 2. Tokens

All tokens are CSS custom properties on `.j13`. Components never use raw values.

### Colour: brand primitives

| Token | Hex | Use |
|---|---|---|
| `--j13-abyss` | `#020611` | dark background |
| `--j13-deep` | `#06102a` | raised dark surface |
| `--j13-trench` | `#0b1a3f` | deepest panel tone |
| `--j13-cobalt` | `#1456ff` | brand primary (the ribbon body) |
| `--j13-cobalt-hi` | `#3d7bff` | accent on dark |
| `--j13-cyan` | `#2ec5ff` | ribbon highlight, focus, active marks |
| `--j13-violet` | `#7a4dff` | fresnel rim light only, never on UI |
| `--j13-chrome` | `#eef3ff` | primary text on dark |
| `--j13-mist` | `#9aaad0` | secondary text on dark |
| `--j13-paper` | `#edf1f9` | light background |
| `--j13-ink` | `#040a1f` | primary text on light |

### Colour: semantic (switch per theme)

`--bg`, `--bg-raise`, `--surface`, `--surface-strong`, `--line`, `--line-strong`, `--text`, `--text-2`, `--text-3`, `--accent`, `--accent-2`, `--focus`, `--danger`, `--success`, `--chrome-text`, `--cobalt-body`, `--slab-edge`, `--ambient`.

- Dark is the native theme. Light is `.j13[data-theme="light"]`, toggled in the nav and stored in `localStorage['j13-theme']`.
- Text contrast: `--text` and `--text-2` pass 4.5:1 on `--bg` in both themes. `--text-3` is for large display text (inactive list items) and decorative meta only.
- Never add a new colour inside a component. Add a semantic token for both themes first.

### Type

| Role | Latin | Arabic |
|---|---|---|
| Display (`--font-display`) | **Tektur**, variable `wght` 400–900 and `wdth` 75–100 | **Reem Kufi**, variable `wght` 400–700 |
| Text (`--font-text`) | **Readex Pro** | **Readex Pro** |

The fonts switch automatically with `dir="rtl"`. Numbers in Arabic stay in Tektur (`.j13-num`, `.j13-metric__value`).

| Token | Value |
|---|---|
| `--fs-hero` | `clamp(3rem, 8.2vw, 9.25rem)` |
| `--fs-h1` | `clamp(2.5rem, 5.6vw, 6rem)` |
| `--fs-h2` | `clamp(2rem, 4vw, 4.25rem)` |
| `--fs-h3` | `clamp(1.25rem, 1.7vw, 1.75rem)` |
| `--fs-lead` | `clamp(1.0625rem, 1.15vw, 1.25rem)` |
| `--fs-body` / `--fs-small` / `--fs-micro` | `1rem` / `.875rem` / `.75rem` |
| `--lh-display` | `.92` (Latin), `1.18` (Arabic) |
| `--lh-body` | `1.6` |

Rules:
- Use sentence case everywhere. No all-caps labels and no eyebrow text above headings.
- Keep lines under 80 characters. Leads cap at `52ch`.
- Split headlines per **letter** in Latin and per **word** in Arabic, so Arabic shaping is never broken.

### Space, shape, elevation

- Space uses a 4px base: `--s-1` 4 · `--s-2` 8 · `--s-3` 12 · `--s-4` 16 · `--s-5` 24 · `--s-6` 32 · `--s-7` 48 · `--s-8` 64 · `--s-9` 96. Page edge: `--gutter` = `clamp(20px, 4vw, 64px)`.
- Chamfer sizes: `--cut-s` 8px (chips, nodes) · `--cut` 14px (buttons, tiles) · `--cut-l` 24px (slabs). Use `--radius-pill` only for chips and choice pills.
- Elevation: `--shadow-lift` (a deep, soft lift under slabs) and `--glow-accent` (cobalt light under primary actions). Focus: `--glow-focus`.

### Motion

| CSS token | JS (`motion.js`) | Use |
|---|---|---|
| `--ease-out` `cubic-bezier(.16,1,.3,1)` | `EASE.out` (`expo.out`) | entrances, reveals |
| `--ease-in-out` `cubic-bezier(.76,0,.24,1)` | `EASE.inOut` (`power4.inOut`) | scene changes, media wipes |
| `--ease-spring` `cubic-bezier(.34,1.56,.64,1)` | `EASE.spring` | small parts settling (rail pip, nodes) |
| `--t-fast` 160ms | `DUR.fast` | hover colour |
| `--t-base` 320ms | `DUR.base` | state changes |
| `--t-slow` 700ms | `DUR.slow` | indicator travel, bars |
| `--t-scene` 1100ms | `DUR.scene` | slide transition |

Exits are faster than entrances. Every pattern has a `prefers-reduced-motion` path: content renders in its final state with a short opacity fade, the ribbon stops flowing and morphs instantly, and the orbit stops.

---

## 3. Components

All class names use the `j13-` prefix and BEM-style modifiers.

| Component | Class | Notes |
|---|---|---|
| Primary button | `.j13-btn.j13-btn--prime` | Cobalt body, chamfer, inner top light, and a sheen that crosses on hover. One per view. |
| Ghost button | `.j13-btn.j13-btn--ghost` | Lit chamfered edge on `--bg`. |
| Small size | `+ .j13-btn--sm` | 42px tall. |
| Icon button | `.j13-icon-btn` | 44×44 chamfered square. Always needs `aria-label`. |
| Slab | `.j13-slab` | The only surface. Glass with blur, a gradient edge and a chamfer. The ribbon passing behind a slab is blurred by it, which is intended. |
| Chip | `.j13-chip` | Pill used for stacks and metadata. Not interactive. |
| Choice pill | `.j13-choice` (label > radio + span) | Single-select chips in forms. |
| Glyph tile | `.j13-glyph` + `<Glyph name>` | Icon in a lit chamfered tile. |
| Metric | `.j13-metric` (`__value`, `__label`) | `data-count data-value="180+"` counts up on entry. |
| Field | `.j13-field` > `.j13-label` + `.j13-input` + `.j13-hint`/`.j13-error` | Underline inputs. Errors sit under the field with an icon and use `aria-invalid` and `aria-describedby`. |
| Index list (vertical tabs) | `.j13-index` / `.j13-index__item` | Large display-type list. Active item gets the cobalt cut-bar. |
| Track (horizontal steps) | `.j13-track` / `.j13-step` | Only for real sequences. A fill bar shows progress. |
| Bullet rail | `.j13-rail` (`SlideRail.jsx`) | Fixed on the **right in both directions**. See below. |

Icons come from `components/redesign/Glyph.jsx`: 24px grid, 1.6 stroke, square caps and mitred joins. Add new icons there in the same style. Do not use emoji or mix in other icon sets.

### Interaction states

| State | Treatment |
|---|---|
| Hover | Colour shifts within `--t-fast`. The primary button sweeps its sheen. Arrows nudge 3px toward reading direction. |
| Pressed | `translateY(1px) scale(.985)` |
| Focus | 2px `--focus` outline, offset 3px. Chamfered controls use a drop-shadow ring so the clip-path does not hide it. Never remove focus without a replacement. |
| Selected | `aria-selected` or `aria-current` drives the style. There are no styling-only classes for state. |
| Disabled | 60% opacity and `not-allowed` cursor. Busy buttons use `aria-busy` and change their label ("Sending"). |
| Error | `--danger` underline, plus an icon and message under the field. Focus moves to the first invalid field. |

---

### Two icon families

| Family | Component | Use |
|---|---|---|
| Line glyphs | `<Glyph name>` | Controls: arrows, play/pause, check, alert, pin. 24px grid, 1.6 stroke. |
| 3D illustrations | `<Icon3D name size>` | Introducing an object: a service, a value, a process step, a contact channel, a social network. Glossy cobalt glass with a soft cobalt drop shadow. Square box; the 3:2 source is cropped with `object-fit: cover`. |

Never use a 3D icon inside a small control, and never use a line glyph where an object is being introduced.

Useful 3D names (some file names in `public/icons` do not match their picture):
- Services: `product-strategy`, `ux-desinger`, `web-development`, `mobile-service`, `cloud-solution`, `data-analytics`
- Process: `search`, `web-design`, `code`, `qc`, `rocket`, `support`
- Values: `Mission-1`, `mission`, `approach`, `secure-reliable`, `expert-team`, `measurable-results`
- Channels: `archive` (mail tray), `phone-call`, `location-pin`, `clock`, `whatsapp`
- Social: `linkedin`, `twitter`, `facebook`, `instagram`
- Misc: `star`, `verify`, `lightning`, `cube`, `happy-client`, `network-globe`
- Mislabelled files: `eye.png` is TikTok, `tiktok.png` is a globe network, `target.png` is a laptop scene.

### v2 components

| Component | Class | Notes |
|---|---|---|
| Badge | `.j13-badge` + `__dot` | The home's live pill. Once per page, on the intro. Sentence case. |
| Arrow chip | `.j13-btn__chip` inside a button | The home's white CTA circle, chamfered. White on a prime button, cobalt on a ghost one. |
| Nav links | `.j13-nav__links` | Pill bar shown from 1200px. Current slide gets a cobalt pill. Slides opt in with `nav: true`. |
| Isometric stack | `.j13-iso` / `.j13-plate` | Decorative plates (`aria-hidden`). The tablist `.j13-layers` carries meaning, and the active plate lifts. |
| Plan card | `.j13-plan`, `.is-featured` | The featured plan gets a cyan-to-cobalt edge and a 10px lift. Its CTA calls `onNavigate('contact', { message })`. |
| Value tile | `.j13-values li` | 3D icon, title and one line. |
| Channel card | `.j13-channels` | 3D icon, label and value. It is a link when the channel has an `href`. |

## 4. The slide system

### Tone rhythm (from the current home)

Each slide has `tone: 'dark' | 'light'` in `content.slides`. In dark mode, light-toned slides (Services, Process, Plans) render as white sections, like the white sections of the current home. In light mode every slide is light.
- Each `<section>` carries `data-theme`, and every semantic token re-scopes under it. That is why a light slide can sit inside a dark page with no extra CSS.
- The page chrome (background, nav, rail, ribbon colour) follows a `toneIndex` that trails the active slide by half a transition. The switch happens while the screen is empty.
- The background cross-fades between two fixed ambient layers (`.j13-ambient`). The light layer has the home's dotted grid.
- In the scrolling layout, each light section paints its own background.

Current order (10 slides): Intro, Services (light), Process (light), Stack, Work, Clients, About, Why JOE13, Plans (light), Contact.

- **Deck mode** applies at `min-width: 900px` and `min-height: 640px`. The page becomes full-screen slides.
  - Input: wheel (trackpad momentum is absorbed, so one gesture moves one slide), touch swipe, ↑/↓, PageUp/PageDown, Space, Home/End, and the rail.
  - Inactive slides are `inert` and `aria-hidden`. A polite live region announces "Section 3 of 8: Platforms". The URL hash deep-links (`#work`).
- **Flow mode** applies everywhere else. Slides become normal sections that scroll. The rail tracks the section in view and scrolls to sections on click. Nothing is clipped on small or short screens.
- **Transition (one scene):** the outgoing parts lift away in the travel direction, a scan line sweeps across the screen, the ribbon flows into its next shape (the morph travels along its length) and the incoming parts enter. Navigation unlocks at about 1s.
- **Bullet rail:** diamonds on a hairline track. A single glowing pip springs to the active slide, labels slide out on hover and focus, and a counter (`03/08`) sits on top. It stays on the right in RTL, as requested.

### Fitting rules (v5)

- **Deck vs flow:** the deck (full-screen slides) runs only at `min-width: 1101px` and `min-height: 660px`, where every slide has its two-column layout. Below that the page is a normal scroll.
- **Short screens:** at heights up to 860px, a compact mode tightens padding, the form, the cards and the stack.
- **Tall content:** a slide that is still taller than the screen scrolls inside itself. `align-content: safe center` keeps its top from being clipped. Wheel, swipe and arrow keys scroll inside it first and move to the next slide only at the edge.
- **Hero headline:** each line is `white-space: nowrap`, because the letters are separate spans and the browser would otherwise wrap mid-word. Its size is `min(7vw, 12.5vh)`, so three lines plus the copy fit at any aspect ratio.
- **Overflow:** a `clip-path` hides visually but still counts toward layout overflow. Anything parked outside its box (like the button sheen) also needs `overflow: hidden`, or it widens the page in RTL.

### Slide patterns (`data-anim`)

Add these to any element inside a slide. They play in DOM order, and `data-delay` adds seconds.

| Value | Effect |
|---|---|
| `title` | Heading lines rise out of a mask (GSAP SplitText, lines only) |
| `fade` | Lift 24px and fade |
| `slab` | Panel unclips from the top-start corner |
| `draw` | Rules and bars draw from their start edge (RTL-aware) |
| `pop` | Children settle with a spring |
| `data-leave` | Leaves and re-enters with the slide but has its own first entrance (the hero letters) |

### Adding a slide

1. Add `{ id, name, tone, nav? }` to `content.slides` and its copy to `content.js`.
2. Create `slides/MySlide.jsx`. Use `data-anim` on its parts and existing components only.
3. Map its id to the component in `SLIDE_COMPONENTS` in `JoeRedesign.jsx`. It receives `copy`, `isArabic`, `isActive`, `onNavigate(id, payload)` and `prefill`.
4. Add a ribbon shape under the same id in `ribbon/shapes.js`. Without one, the slide falls back to the intro J. Points are `[u, v, z]` in screen space. Keep the band on the end side, away from text, or behind a slab.
5. Check it at 1440×900, 1280×720, 768 and 375, in LTR and RTL, in dark and light.

---

## 4b. Motion layer (v3)

Every effect is pointer- or scene-driven, cheap (transforms, opacity, one shader uniform) and off under `prefers-reduced-motion`.

| Effect | Where | Rule |
|---|---|---|
| Boot screen | `Preloader.jsx` | Once per session (`sessionStorage['j13-booted']`). Shows real progress (fonts, then ribbon). Capped at 3.2s; click or Escape skips. Lifts on a shutter, then the hero intro plays. |
| Light blades | `.j13-blades` (3 bands) | They sweep in the travel direction on every scene change, together with the scan line. GSAP owns their `y` and `skewY`, and they are cleared to opacity 0 at the end. |
| Scene depth | `.j13-slide__inner` | The outgoing scene recedes (scale .94, fade). The incoming one settles from 1.06 to 1. |
| Energy pulse | ribbon `uPulse`/`uPulsePos` | A bright wave races along the band during every morph. |
| Pointer energy | ribbon `uBoost` | A fast pointer makes the band flow faster and shine. It decays on its own. |
| Cursor companion | `Cursor.jsx` | Cyan dot plus a chamfered ring. The ring opens over clickable elements, shows a verb from `data-cursor="Open"`, and hides over inputs. The system cursor stays visible. Fine pointers only. |
| Magnetic pull | `.j13-btn--prime`, `.j13-icon-btn`, `[data-magnetic]` | Pulls up to about 22% / 32% of the pointer offset. |
| Tilt | `[data-tilt="6"]` (value = max degrees) | Rotation only; use the `translate` property for any static offset. Use 3–6° on cards and 8° on objects. |
| Slab spotlight | every `.j13-slab` | A radial light follows the pointer (`--mx`/`--my`, `.is-lit`). |
| Parallax media | `[data-parallax]` | The `img` inside drifts against the pointer (±12px). |
| Press ripple | every `.j13-btn` | A chamfered diamond expands from the press point. |
| Decode | `[data-decode]`, or `decode(el)` from `motion.js` | Text resolves out of code characters. Latin only; Arabic fades. Use on short labels and titles (badge, prices, selected titles). An element whose text changes must be re-keyed in React. |
| Glint | hero letters | A light sweep crosses the chrome letters every 7s, staggered by `--ci`. |
| Counters | `data-count data-value="180+"` | Count up when their slide enters. |
| Rail counter | `.j13-rail__count b` | Rolls in on change. |
| Track flow | `.j13-track__fill` | Light runs along the filled part of the process line. |

| Testimonial rotation | `Voices.jsx` | Advances every 7s while the slide is active. A progress line runs under the selected person. Hover or focus holds it, and the pause button stops it (WCAG auto-rotation control). Off under reduced motion. |
| Phase stepping | `Process.jsx` | The phase panel shows a floating 3D icon, a "Phase n of 6" meta line and Previous/Next controls. |

**Ribbon placement rule (from the v4 audit):** keep the band out of text, the nav bar and the rail. Route it behind a slab (where glass blurs it), below the content, or off the end edge. The rail sits in a glass capsule as a second line of defence.

Keyboard: number keys `1`–`9` jump to slides, in addition to the arrows, PageUp/PageDown, Space and Home/End.

## 5. The ribbon (WebGL)

- One mesh of 562 vertices. Every shape is pre-built with the same layout, so a morph is a GPU mix between two attribute sets. The CPU work per frame is a few uniforms.
- The shader shades by facing (folds go deep cobalt), adds lit bevel edges, a travelling sheen, a violet fresnel rim and fades with depth.
- Performance limits: DPR is capped at 1.75 on desktop and 1.25 on mobile. The loop runs on `setAnimationLoop` and pauses on hidden tabs. three.js is loaded only after first paint. The band is slimmer on portrait screens and dimmed to 42% in flow mode. With reduced motion, it renders on demand only.
- Fallback: without WebGL, the CSS `--ambient` gradient carries the page and nothing breaks.
- Sparing extras: about 360 dust points for depth and a 0.04-lerped pointer parallax on the camera.

---

## 6. Redesigning another component with this system

1. Map its surfaces to `.j13-slab`, its actions to `.j13-btn` variants and its icons to `Glyph`.
2. Replace every colour, size and duration with a token. If a token is missing, add it for both themes.
3. Put the chamfer on containers and controls, and pills on chips only.
4. Headline in display type with `.j13-chrome`. Body in Readex Pro at `--fs-body`, `--lh-body`.
5. Motion: give it a `data-anim` entrance only if it is part of a scene, and response motion only for user actions.
6. Check focus, keyboard, `aria-*` state, reduced motion, RTL, both themes and 375px width.

## 7. Libraries

Only libraries already in the project are used:
- **GSAP 3.15** for timelines, `quickTo` and SplitText (bundled free since 3.13).
- **three 0.184** for the ribbon.
- **next/font** for the self-hosted Google fonts.

No new dependencies were added.
