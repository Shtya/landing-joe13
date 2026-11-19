'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { getRedesignContent } from './content';
import { countUp, enterSlide, leaveSlide, prefersReducedMotion, primeSlide } from './motion';
import RibbonStage from './ribbon/RibbonStage';
import SlideRail from './SlideRail';
import Glyph from './Glyph';
import Cursor from './Cursor';
import Preloader from './Preloader';
import { useInteractions } from './useInteractions';
import Hero from './slides/Hero';
import Services from './slides/Services';
import Platforms from './slides/Platforms';
import Process from './slides/Process';
import Studio from './slides/Studio';
import Work from './slides/Work';
import Voices from './slides/Voices';
import Contact from './slides/Contact';
import Stack from './slides/Stack';
import Plans from './slides/Plans';

// Slide order and tone live in content.slides; components are looked up by id.
const SLIDE_COMPONENTS = {
  top: Hero,
  services: Services,
  process: Process,
  stack: Stack,
  work: Work,
  voices: Voices,
  studio: Studio,
  platforms: Platforms,
  plans: Plans,
  contact: Contact,
};
const DECK_QUERY = '(min-width: 1101px) and (min-height: 660px)';
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** Elements where wheel/keys belong to the element, not the deck. */
function ownsInput(target) {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest('input, textarea, select, [contenteditable="true"], [role="tablist"], [data-own-keys]'));
}

export default function JoeRedesign({ locale, fontClassName }) {
  const copy = useMemo(() => getRedesignContent(locale), [locale]);
  const isArabic = locale === 'ar';
  const slides = copy.slides;

  const [mode, setMode] = useState('deck');
  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [reduced, setReduced] = useState(false);
  const [announce, setAnnounce] = useState('');
  // index of the slide whose tone the page chrome shows; it trails `active`
  // by half a transition so the switch happens while the screen is empty
  const [toneIndex, setToneIndex] = useState(0);
  const [prefill, setPrefill] = useState(null);
  const [booted, setBooted] = useState(false);
  const [fontsOk, setFontsOk] = useState(false);
  const [ribbonOk, setRibbonOk] = useState(false);

  const slideRefs = useRef([]);
  const scanRef = useRef(null);
  const ribbonRef = useRef(null);
  const lockRef = useRef(false);
  const activeRef = useRef(0);
  const prevRef = useRef(0);
  const enteredRef = useRef(new Set());
  const tlRef = useRef(null);
  const rootRef = useRef(null);
  const bladesRef = useRef(null);

  useInteractions(rootRef);

  activeRef.current = active;
  const ids = useMemo(() => slides.map((s) => s.id), [slides]);
  // A slide's effective theme: light mode makes everything light; in dark mode
  // the light-toned slides echo the white sections of the current home.
  const toneOf = useCallback((i) => (theme === 'light' ? 'light' : slides[i].tone), [theme, slides]);
  const rootTone = toneOf(toneIndex);

  // ---- environment -------------------------------------------------------
  useIsoLayoutEffect(() => {
    const mq = window.matchMedia(DECK_QUERY);
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setMode(mq.matches ? 'deck' : 'flow');
    update();
    setReduced(rm.matches);
    mq.addEventListener('change', update);
    const onRm = () => setReduced(rm.matches);
    rm.addEventListener('change', onRm);
    try {
      const stored = localStorage.getItem('j13-theme');
      if (stored === 'light' || stored === 'dark') setTheme(stored);
    } catch {}
    const fromHash = slides.findIndex((s) => `#${s.id}` === window.location.hash);
    if (fromHash > 0) {
      setActive(fromHash);
      prevRef.current = fromHash;
    }
    setToneIndex(Math.max(0, fromHash));
    return () => {
      mq.removeEventListener('change', update);
      rm.removeEventListener('change', onRm);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('j13-theme', next);
      } catch {}
      return next;
    });
  }, []);

  // ---- slide entrance helpers ---------------------------------------------
  const runEnter = useCallback((i, direction = 1, delay = 0) => {
    const root = slideRefs.current[i];
    if (!root) return null;
    const tl = enterSlide(root, { direction, delay });
    root.querySelectorAll('[data-count]').forEach((el, k) => countUp(el, { delay: delay + 0.3 + k * 0.08 }));
    enteredRef.current.add(i);
    return tl;
  }, []);

  // ---- intro: one orchestrated moment on first paint ----------------------
  // everything starts hidden; the boot screen covers the page meanwhile
  const bootedRef = useRef(false);
  bootedRef.current = booted;
  useIsoLayoutEffect(() => {
    // Only before the first reveal: a re-run (Fast Refresh, remount) after the
    // page has been shown must not hide content that nothing will reveal again.
    if (!bootedRef.current) slideRefs.current.forEach((root) => primeSlide(root));
    const fonts = document.fonts?.ready ?? Promise.resolve();
    Promise.race([fonts, new Promise((r) => setTimeout(r, 1500))]).then(() => setFontsOk(true));
  }, []);

  useEffect(() => {
    if (!booted) return;
    const start = Math.max(0, slides.findIndex((s) => `#${s.id}` === window.location.hash));
    ribbonRef.current?.intro();
    if (start === 0) {
      runEnter(0, 1, 0.45);
    } else {
      runEnter(start, 1, 0.2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booted]);

  // ---- deck navigation --------------------------------------------------------
  const goTo = useCallback(
    (target) => {
      const i = Math.max(0, Math.min(slides.length - 1, target));
      if (mode === 'flow') {
        slideRefs.current[i]?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
        return;
      }
      if (i === activeRef.current || lockRef.current) return;
      lockRef.current = true;
      setLeaving(activeRef.current);
      setActive(i);
    },
    [mode, slides.length],
  );

  const goToId = useCallback(
    (id, payload) => {
      if (payload) setPrefill(payload);
      goTo(slides.findIndex((s) => s.id === id));
    },
    [goTo, slides],
  );

  // Transition timeline: leave → scan → enter. Runs before paint so nothing flashes.
  useIsoLayoutEffect(() => {
    const prev = prevRef.current;
    if (prev === active) return;
    prevRef.current = active;
    const name = slides[active].name;
    setAnnounce(copy.ui.slideOf(active + 1, slides.length, name));
    try {
      window.history.replaceState(null, '', active === 0 ? window.location.pathname : `#${slides[active].id}`);
    } catch {}
    if (mode !== 'deck') {
      setToneIndex(active);
      return;
    }

    const direction = active > prev ? 1 : -1;
    const from = slideRefs.current[prev];
    const to = slideRefs.current[active];
    tlRef.current?.kill();
    primeSlide(to);
    if (to) to.scrollTop = 0;
    // Focus follows only if it was inside the slide that is now going inert.
    const focusWasInside = from?.contains(document.activeElement);
    if (focusWasInside) to?.focus({ preventScroll: true });
    const tl = gsap.timeline({
      onComplete: () => {
        setLeaving(null);
        lockRef.current = false;
      },
    });
    tl.add(leaveSlide(from, { direction }), 0);
    if (!prefersReducedMotion()) {
      const h = window.innerHeight;
      // light blades sweep through in the travel direction
      const blades = bladesRef.current ? Array.from(bladesRef.current.children) : [];
      blades.forEach((b, k) => {
        const bh = b.offsetHeight;
        // the skew lifts the ends ~12% of the width, so travel that much further
        const off = 0.14 * window.innerWidth + 40;
        tl.fromTo(
          b,
          { y: direction > 0 ? h + off : -bh - off, opacity: 1, skewY: -7 },
          { y: direction > 0 ? -bh - off : h + off, duration: 0.95, ease: 'power3.inOut' },
          0.02 + k * 0.07,
        ).set(b, { opacity: 0 }, 0.98 + k * 0.07);
      });
      if (scanRef.current) {
        tl.fromTo(
          scanRef.current,
          { y: direction > 0 ? h : 0, opacity: 0 },
          { y: direction > 0 ? 0 : h, opacity: 1, duration: 0.9, ease: 'power3.inOut' },
          0.05,
        ).to(scanRef.current, { opacity: 0, duration: 0.3 }, 0.75);
      }
      // the outgoing scene recedes, the incoming one settles from slightly closer
      const fromInner = from?.querySelector('.j13-slide__inner');
      const toInner = to?.querySelector('.j13-slide__inner');
      if (fromInner) tl.to(fromInner, { scale: 0.94, opacity: 0.4, duration: 0.6, ease: 'power3.in', clearProps: 'all' }, 0);
      if (toInner) tl.fromTo(toInner, { scale: 1.06 }, { scale: 1, duration: 1.3, ease: 'expo.out', clearProps: 'transform' }, 0.38);
    }
    // the page changes tone (dark/light) while the screen is empty, mid-scene
    tl.call(() => setToneIndex(active), [], prefersReducedMotion() ? 0.1 : 0.4);
    tl.add(runEnter(active, direction), prefersReducedMotion() ? 0.15 : 0.42);
    tl.add(() => {
      lockRef.current = false;
    }, 1.0);
    tlRef.current = tl;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Wheel / touch / keys (deck only)
  useEffect(() => {
    if (mode !== 'deck') return undefined;
    // A slide taller than the screen scrolls inside itself first; the deck
    // only moves on once that inner scroll reaches its edge.
    const canScrollInside = (dir) => {
      const el = slideRefs.current[activeRef.current];
      if (!el || el.scrollHeight <= el.clientHeight + 2) return false;
      return dir > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 2 : el.scrollTop > 2;
    };
    let last = 0;
    let acc = 0;
    let quiet = false;
    const onWheel = (e) => {
      if (e.ctrlKey) return; // pinch-zoom
      const scrollable = e.target instanceof Element && e.target.closest('textarea');
      if (scrollable && scrollable.scrollHeight > scrollable.clientHeight) return;
      const now = performance.now();
      const gap = now - last;
      last = now;
      if (!lockRef.current && canScrollInside(Math.sign(e.deltaY))) {
        // native scroll inside the slide; require a pause before leaving it
        quiet = true;
        acc = 0;
        return;
      }
      e.preventDefault();
      if (lockRef.current) {
        quiet = true;
        return;
      }
      // trackpads keep firing momentum events; wait for a pause before the next move
      if (quiet) {
        if (gap < 180) return;
        quiet = false;
      }
      if (gap > 200) acc = 0;
      acc += Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : 0;
      if (Math.abs(acc) > 48) {
        goTo(activeRef.current + Math.sign(acc));
        acc = 0;
      }
    };
    let touchY = null;
    const onTouchStart = (e) => {
      touchY = ownsInput(e.target) ? null : e.touches[0].clientY;
    };
    const onTouchEnd = (e) => {
      if (touchY === null) return;
      const dy = touchY - e.changedTouches[0].clientY;
      touchY = null;
      if (Math.abs(dy) > 56 && !canScrollInside(Math.sign(dy))) goTo(activeRef.current + Math.sign(dy));
    };
    const onKey = (e) => {
      if (e.defaultPrevented || e.altKey || e.metaKey || e.ctrlKey || ownsInput(e.target)) return;
      const onControl = e.target instanceof Element && e.target.closest('button, a');
      let next = null;
      if (['ArrowDown', 'PageDown'].includes(e.key) || (e.key === ' ' && !onControl && !e.shiftKey)) next = activeRef.current + 1;
      else if (['ArrowUp', 'PageUp'].includes(e.key) || (e.key === ' ' && !onControl && e.shiftKey)) next = activeRef.current - 1;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = slides.length - 1;
      else if (/^[1-9]$/.test(e.key)) next = Number(e.key) - 1;
      if (next === null) return;
      const step = next - activeRef.current;
      if (Math.abs(step) === 1 && ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' '].includes(e.key) && canScrollInside(step)) {
        e.preventDefault();
        const el = slideRefs.current[activeRef.current];
        el.scrollBy({ top: step * el.clientHeight * 0.7, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
        return;
      }
      e.preventDefault();
      goTo(next);
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKey);
    };
  }, [mode, goTo, slides.length]);

  // Flow mode: the page scrolls; track the section in view and reveal once.
  useEffect(() => {
    if (mode !== 'flow') return undefined;
    tlRef.current?.kill();
    lockRef.current = false;
    setLeaving(null);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const i = slideRefs.current.indexOf(entry.target);
          if (entry.isIntersecting && entry.intersectionRatio > 0.35) {
            prevRef.current = i;
            setActive(i);
            setToneIndex(i);
            if (!enteredRef.current.has(i)) runEnter(i, 1);
          }
        });
      },
      { threshold: [0, 0.35, 0.6] },
    );
    slideRefs.current.forEach((el) => el && io.observe(el));
    const start = Math.max(activeRef.current, slides.findIndex((sl) => `#${sl.id}` === window.location.hash));
    if (start > 0) window.setTimeout(() => slideRefs.current[start]?.scrollIntoView({ block: 'start' }), 60);
    return () => io.disconnect();
  }, [mode, runEnter]);

  // Expose a dev hook for QA in hidden panes (rAF can be frozen there).
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') window.__j13 = { gsap, goTo };
  }, [goTo]);

  const altLocale = isArabic ? 'en' : 'ar';

  return (
    <div ref={rootRef} className={`j13 ${fontClassName}`} dir={copy.dir} lang={locale} data-theme={rootTone} data-mode={mode}>
      <Preloader ready={0.12 + (fontsOk ? 0.44 : 0) + (ribbonOk ? 0.44 : 0)} onDone={() => setBooted(true)} label={copy.brand} />
      <Cursor />
      <div className="j13-ambient" aria-hidden="true">
        <i />
        <i />
      </div>
      <a className="j13-skip" href={`#${slides[active].id}`} onClick={(e) => { e.preventDefault(); slideRefs.current[active]?.focus(); }}>
        {copy.ui.skip}
      </a>

      <RibbonStage ref={ribbonRef} ids={ids} index={active} light={rootTone === 'light'} mirror={isArabic} reduced={reduced} onReady={() => setRibbonOk(true)} />

      <header className="j13-nav">
        <a className="j13-nav__brand" href={`/${locale}/redesign`} aria-label={`${copy.brand}, ${copy.tagline}`} onClick={(e) => { e.preventDefault(); goTo(0); }}>
          <Image
            src={rootTone === 'light' ? '/logos/logo-black.png' : '/logos/logo-white.png'}
            alt=""
            width={300}
            height={101}
            sizes="150px"
            priority
          />
        </a>
        <nav className="j13-nav__links" aria-label={copy.ui.mainNav}>
          {slides.map((sl, i) =>
            sl.nav ? (
              <a
                key={sl.id}
                href={`#${sl.id}`}
                aria-current={i === active ? 'true' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  goTo(i);
                }}
              >
                {sl.name}
              </a>
            ) : null,
          )}
        </nav>
        <div className="j13-nav__tools">
          <a className="j13-icon-btn j13-lang" href={`/${altLocale}/redesign`} hrefLang={altLocale} lang={altLocale} aria-label={copy.ui.language}>
            {copy.ui.languageShort}
          </a>
          <button type="button" className="j13-icon-btn" onClick={toggleTheme} aria-label={theme === 'dark' ? copy.ui.themeToLight : copy.ui.themeToDark}>
            <Glyph name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
          </button>
          <button type="button" className="j13-btn j13-btn--prime j13-btn--sm j13-nav__cta" onClick={() => goToId('contact')}>
            {copy.ui.startProject}
          </button>
        </div>
      </header>

      <SlideRail slides={slides} active={active} onSelect={goTo} label={copy.ui.railLabel} hint={copy.ui.scrollHint} />

      <div className="j13-scan" ref={scanRef} aria-hidden="true" />
      <div className="j13-blades" ref={bladesRef} aria-hidden="true">
        <i />
        <i />
        <i />
      </div>

      <main className="j13-deck" id="main">
        {slides.map((meta, i) => {
          const Slide = SLIDE_COMPONENTS[meta.id];
          const isActive = i === active;
          const hidden = mode === 'deck' && !isActive;
          return (
            <section
              key={slides[i].id}
              id={slides[i].id}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              className={`j13-slide j13-slide--${slides[i].id}${isActive ? ' is-active' : ''}${leaving === i ? ' is-leaving' : ''}`}
              data-theme={toneOf(i)}
              aria-label={slides[i].name}
              aria-hidden={hidden ? 'true' : undefined}
              inert={hidden ? '' : undefined}
              tabIndex={-1}
            >
              <div className="j13-slide__inner">
                <Slide
                  copy={copy}
                  isArabic={isArabic}
                  isActive={isActive}
                  onNavigate={goToId}
                  prefill={meta.id === 'contact' ? prefill : undefined}
                  introReady={booted}
                />
              </div>
            </section>
          );
        })}
      </main>

      <p className="j13-sr" aria-live="polite">
        {announce}
      </p>
    </div>
  );
}

