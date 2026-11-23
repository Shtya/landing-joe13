'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { getRedesignContent } from './content';
import { gsap, ScrollTrigger, prefersReducedMotion, setupReveals } from './motion';
import { useSmoothScroll, scrollToTarget } from './useSmoothScroll';
import { useInteractions } from './useInteractions';
import { enableLite, initialLiteReason, probeFrameRate } from './perf';
import RibbonStage from './ribbon/RibbonStage';
import Cursor from './Cursor';
import Diagnostics from './Diagnostics';
import Preloader from './Preloader';
import Nav from './chrome/Nav';
import SectionRail from './chrome/SectionRail';
import Footer from './chrome/Footer';
import Hero from './sections/Hero';
import Impact from './sections/Impact';
import Services from './sections/Services';
import Process from './sections/Process';
import Work from './sections/Work';
import Studio from './sections/Studio';
import Stack from './sections/Stack';
import Voices from './sections/Voices';
import Plans from './sections/Plans';
import Contact from './sections/Contact';

const SECTION_COMPONENTS = {
  top: Hero,
  impact: Impact,
  services: Services,
  process: Process,
  work: Work,
  studio: Studio,
  stack: Stack,
  voices: Voices,
  plans: Plans,
  contact: Contact,
};

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/*
 * The home page shell: one continuous scroll page.
 *   - Lenis smooth scroll on GSAP's clock (native scroll under reduced motion)
 *   - ScrollTrigger tracks the section in view → nav, side rail, ribbon shape
 *   - the fixed backdrop (WebGL ribbon, starfield, grid, grain) sits behind
 *   - theme lives on <html data-theme> (set before paint by the layout script)
 */
export default function JoeRedesign({ locale, fontClassName }) {
  const copy = useMemo(() => getRedesignContent(locale), [locale]);
  const isArabic = locale === 'ar';
  const sections = copy.sections;

  const [active, setActive] = useState(0);
  const [theme, setTheme] = useState('dark');
  const [envReady, setEnvReady] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [booted, setBooted] = useState(false);
  const [fontsOk, setFontsOk] = useState(false);
  const [ribbonOk, setRibbonOk] = useState(false);
  const [prefill, setPrefill] = useState(null);

  const rootRef = useRef(null);
  const sectionRefs = useRef([]);
  const ribbonRef = useRef(null);
  const railRef = useRef(null);
  const menuOpenRef = useRef(false);
  menuOpenRef.current = menuOpen;

  useInteractions(rootRef);

  // ---- environment ------------------------------------------------------------
  useIsoLayoutEffect(() => {
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(rm.matches);
    setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
    setEnvReady(true);
    const onRm = () => setReduced(rm.matches);
    rm.addEventListener('change', onRm);
    const fonts = document.fonts?.ready ?? Promise.resolve();
    Promise.race([fonts, new Promise((r) => setTimeout(r, 1500))]).then(() => setFontsOk(true));
    // follow the OS theme until the visitor picks one
    const sys = window.matchMedia('(prefers-color-scheme: dark)');
    const onSys = () => {
      let saved = null;
      try {
        saved = localStorage.getItem('j13-theme');
      } catch {}
      if (saved) return;
      const next = sys.matches ? 'dark' : 'light';
      document.documentElement.dataset.theme = next;
      setTheme(next);
    };
    sys.addEventListener('change', onSys);
    return () => {
      rm.removeEventListener('change', onRm);
      sys.removeEventListener('change', onSys);
    };
  }, []);

  const lenisRef = useSmoothScroll(envReady && !reduced);

  // ---- navigation ---------------------------------------------------------------
  const navHeight = () => document.querySelector('[data-nav]')?.offsetHeight ?? 72;

  const scrollToId = useCallback(
    (id, payload) => {
      if (payload) setPrefill({ ...payload, at: Date.now() });
      if (menuOpenRef.current) {
        // unlock now: a stopped Lenis / locked page would ignore the scroll below
        lenisRef.current?.start();
        document.documentElement.classList.remove('j13-locked');
      }
      setMenuOpen(false);
      const el = document.getElementById(id);
      if (!el) return;
      scrollToTarget(lenisRef.current, id === 'top' ? 0 : el, { offset: -navHeight() + 1 });
      try {
        window.history.replaceState(null, '', id === 'top' ? window.location.pathname : `#${id}`);
      } catch {}
      // move focus for keyboard and screen-reader users, without a second jump
      window.setTimeout(() => el.focus({ preventScroll: true }), prefersReducedMotion() ? 0 : 900);
    },
    [lenisRef],
  );

  const scrollToEl = useCallback((el, offset = 0) => scrollToTarget(lenisRef.current, el, { offset }), [lenisRef]);

  // ---- theme: circular reveal from the toggle (View Transitions), else a cross-fade
  const toggleTheme = useCallback(
    (e) => {
      const next = theme === 'dark' ? 'light' : 'dark';
      const apply = () => {
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem('j13-theme', next);
        } catch {}
        flushSync(() => setTheme(next));
      };
      const html = document.documentElement;
      if (reduced || !document.startViewTransition) {
        html.classList.add('j13-theming');
        apply();
        window.setTimeout(() => html.classList.remove('j13-theming'), 600);
        return;
      }
      const r = e?.currentTarget?.getBoundingClientRect?.();
      const x = r ? r.left + r.width / 2 : window.innerWidth / 2;
      const y = r ? r.top + r.height / 2 : 0;
      const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      const vt = document.startViewTransition(apply);
      vt.ready
        .then(() => {
          html.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
            { duration: 750, easing: 'cubic-bezier(0.76, 0, 0.24, 1)', pseudoElement: '::view-transition-new(root)' },
          );
        })
        .catch(() => {});
    },
    [theme, reduced],
  );

  // ---- language: fade the page out, then load the other locale
  const onLanguage = useCallback(
    (href) => (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      e.preventDefault();
      const target = href + window.location.hash;
      if (reduced) {
        window.location.href = target;
        return;
      }
      rootRef.current?.classList.add('is-leaving');
      window.setTimeout(() => {
        window.location.href = target;
      }, 380);
    },
    [reduced],
  );

  // menu: freeze the page behind it
  useEffect(() => {
    const lenis = lenisRef.current;
    if (menuOpen) {
      lenis?.stop();
      document.documentElement.classList.add('j13-locked');
    } else {
      lenis?.start();
      document.documentElement.classList.remove('j13-locked');
    }
  }, [menuOpen, lenisRef]);

  // ---- scroll wiring: active section, progress, nav state, backdrop parallax
  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const nav = root.querySelector('[data-nav]');
    // Motion must never take the content down with it: if a reveal or trigger
    // throws (old browser, blocked chunk), the page stays fully visible and static.
    let cleanReveals = () => {};
    try {
      cleanReveals = setupReveals(root);
    } catch (err) {
      console.warn('[j13] reveals disabled:', err);
    }
    // Scroll-driven values are written on the few elements that read them, not
    // on the root: an inherited custom property changing on the root forces a
    // style recalc of the whole page on every scroll frame.
    const progressEls = root.querySelectorAll('.j13-rail__fill, .j13-topbar i');
    const canvasEl = root.querySelector('.j13-canvas');
    let ctx = null;
    try {
    ctx = gsap.context(() => {
      sectionRefs.current.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 45%',
          end: 'bottom 45%',
          onToggle: (self) => self.isActive && setActive(i),
        });
      });

      let lastY = 0;
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const p = self.progress.toFixed(4);
          progressEls.forEach((el) => el.style.setProperty('--progress', p));
          const y = self.scroll();
          nav.toggleAttribute('data-scrolled', y > 24);
          const down = y > lastY;
          lastY = y;
          nav.toggleAttribute('data-hidden', down && y > window.innerHeight * 0.8 && !menuOpenRef.current);
        },
      });

      if (!prefersReducedMotion()) {
        // the ribbon is the hero's object; past the hero it recedes into atmosphere
        // the 3D scene owns the hero: the ribbon is hidden there and fades in after it
        gsap.fromTo(canvasEl, { '--ribbon-o': 0 }, {
          '--ribbon-o': 0.45,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRefs.current[0],
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            // the band is invisible at the top of the hero: stop drawing it there,
            // so only one WebGL scene renders at a time
            onUpdate: (self) => ribbonRef.current?.setPaused(self.progress < 0.02),
          },
        });
        // two starfield layers drift at different speeds
        root.querySelectorAll('.j13-stars i').forEach((layer, k) => {
          gsap.to(layer, { yPercent: -(k + 1) * 9, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
        });
      }
    }, root);
    } catch (err) {
      console.warn('[j13] scroll effects disabled:', err);
    }
    return () => {
      ctx?.revert();
      cleanReveals();
    };
  }, []);

  // ---- performance guards ---------------------------------------------------------
  // Lite mode on weak devices (see perf.js), then a frame-rate probe once the
  // intro has settled: under ~30fps the heavy layers switch off by themselves.
  useEffect(() => {
    const reason = initialLiteReason();
    if (reason) enableLite(reason);
  }, []);
  useEffect(() => {
    if (!booted) return undefined;
    let stopProbe = () => {};
    const t = window.setTimeout(() => {
      stopProbe = probeFrameRate();
    }, 1500);
    return () => {
      window.clearTimeout(t);
      stopProbe();
    };
  }, [booted]);

  // Pause CSS animations in sections that are off screen (marquee, beams,
  // spinning border…): CSS keeps running them otherwise.
  useEffect(() => {
    const els = sectionRefs.current.filter(Boolean);
    if (!els.length || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.toggleAttribute('data-offscreen', !e.isIntersecting)),
      { rootMargin: '200px 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // page-load: refresh measurements once fonts + intro are done, honour #hash
  useEffect(() => {
    if (!booted) return undefined;
    rootRef.current?.classList.add('is-ready');
    ribbonRef.current?.intro();
    const t = window.setTimeout(() => {
      ScrollTrigger.refresh();
      const id = window.location.hash.slice(1);
      if (id && document.getElementById(id)) scrollToTarget(lenisRef.current, document.getElementById(id), { offset: -navHeight() + 1, immediate: true });
    }, 60);
    return () => window.clearTimeout(t);
  }, [booted, lenisRef]);

  useEffect(() => {
    if (fontsOk) ScrollTrigger.refresh();
  }, [fontsOk]);

  return (
    <div ref={rootRef} className={`j13 ${fontClassName}`} dir={copy.dir} lang={locale}>
      <noscript>
        <style>{'.j13 [data-hero]{opacity:1!important}.j13-boot{display:none!important}'}</style>
      </noscript>
      <Preloader ready={0.12 + (fontsOk ? 0.44 : 0) + (ribbonOk ? 0.44 : 0)} onDone={() => setBooted(true)} label={copy.ui.loading} />
      <Cursor />
      <Diagnostics />
      <a className="j13-skip" href="#main">
        {copy.ui.skip}
      </a>

      <div className="j13-backdrop" aria-hidden="true">
        <div className="j13-orbs">
          <i />
          <i />
          <i />
        </div>
        <div className="j13-stars">
          <i />
          <i />
        </div>
        <RibbonStage
          ref={ribbonRef}
          ids={sections.map((s) => s.shape)}
          index={active}
          light={theme === 'light'}
          mirror={isArabic}
          reduced={reduced}
          onReady={() => setRibbonOk(true)}
        />
        <div className="j13-grid" />
        <div className="j13-noise" />
      </div>

      <Nav
        copy={copy}
        sections={sections}
        active={active}
        onNavigate={scrollToId}
        theme={theme}
        onToggleTheme={toggleTheme}
        onLanguage={onLanguage}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        locale={locale}
      />
      <SectionRail ref={railRef} sections={sections} active={active} onSelect={scrollToId} label={copy.ui.railLabel} />

      <main id="main" className="j13-main" tabIndex={-1}>
        {sections.map((meta, i) => {
          const Section = SECTION_COMPONENTS[meta.id];
          return (
            <section
              key={meta.id}
              id={meta.id}
              ref={(el) => {
                sectionRefs.current[i] = el;
              }}
              className={`j13-section j13-section--${meta.id}`}
              aria-labelledby={`${meta.id}-title`}
              tabIndex={-1}
            >
              <Section
                copy={copy}
                index={i + 1}
                headingId={`${meta.id}-title`}
                isArabic={isArabic}
                onNavigate={scrollToId}
                scrollToEl={scrollToEl}
                introReady={booted}
                theme={theme}
                prefill={meta.id === 'contact' ? prefill : undefined}
              />
            </section>
          );
        })}
      </main>

      <Footer copy={copy} sections={sections} onNavigate={scrollToId} />
    </div>
  );
}
