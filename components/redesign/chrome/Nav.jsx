'use client';

import { useEffect, useRef } from 'react';
import Glyph from '../Glyph';
import Button from '../ui/Button';
import Logo from '../ui/Logo';
import { gsap, prefersReducedMotion, EASE } from '../motion';

/*
 * Top bar. Transparent over the hero, glass once the page scrolls, tucks away
 * while scrolling down and returns on the way up (state comes from the shell
 * as data attributes, so this component never re-renders on scroll).
 * Below 1024px the links move into a full-screen menu.
 */
export default function Nav({ copy, sections, active, onNavigate, theme, onToggleTheme, onLanguage, menuOpen, setMenuOpen, locale }) {
  const ui = copy.ui;
  const altLocale = locale === 'ar' ? 'en' : 'ar';
  const links = sections.filter((s) => s.nav);
  const menuRef = useRef(null);
  const burgerRef = useRef(null);
  const origin = useRef({ x: '100%', y: '0%' });
  const circle = (r) => `circle(${r} at ${origin.current.x} ${origin.current.y})`;

  // menu open/close choreography + focus management
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return undefined;
    const reduced = prefersReducedMotion();
    if (menuOpen) {
      menu.hidden = false;
      const items = menu.querySelectorAll('[data-menu-item]');
      if (!reduced) {
        gsap.fromTo(menu, { clipPath: circle('0%') }, { clipPath: circle('150%'), duration: 0.9, ease: EASE.inOut });
        gsap.fromTo(items, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: EASE.out, stagger: 0.05, delay: 0.25 });
      }
      menu.querySelector('a, button')?.focus({ preventScroll: true });
      const onKey = (e) => {
        if (e.key === 'Escape') setMenuOpen(false);
        if (e.key !== 'Tab') return;
        const focusables = [...menu.querySelectorAll('a[href], button:not([disabled])')];
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }
    if (menu.hidden) return undefined;
    if (reduced) {
      menu.hidden = true;
      return undefined;
    }
    const tween = gsap.to(menu, {
      clipPath: circle('0%'),
      duration: 0.6,
      ease: EASE.inOut,
      onComplete: () => {
        menu.hidden = true;
      },
    });
    burgerRef.current?.focus({ preventScroll: true });
    return () => tween.kill();
  }, [menuOpen, setMenuOpen]);

  const go = (id) => (e) => {
    e.preventDefault();
    setMenuOpen(false);
    onNavigate(id);
  };

  const themeLabel = theme === 'dark' ? ui.themeToLight : ui.themeToDark;
  const langHref = `/${altLocale}`;

  return (
    <>
      <header className="j13-nav" data-nav>
        <div className="j13-nav__bar">
          <a className="j13-nav__brand" href={`/${locale}`} aria-label={`${copy.brand} — ${copy.tagline}`} onClick={go('top')}>
            <Logo priority />
          </a>

          <nav className="j13-nav__links" aria-label={ui.mainNav}>
            <ul>
              {links.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="j13-navlink" aria-current={sections[active]?.id === s.id ? 'true' : undefined} onClick={go(s.id)}>
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="j13-nav__tools">
            <a className="j13-tool j13-tool--lang" href={langHref} hrefLang={altLocale} lang={altLocale} aria-label={ui.languageLabel} onClick={onLanguage(langHref)} data-magnetic>
              <Glyph name="globe" size={16} />
              <span>{ui.languageShort}</span>
            </a>
            <button type="button" className="j13-tool" onClick={onToggleTheme} aria-label={themeLabel} title={themeLabel} data-magnetic>
              <span className="j13-tool__swap" data-theme-icon>
                <Glyph name="sun" size={18} className="j13-icon-sun" />
                <Glyph name="moon" size={18} className="j13-icon-moon" />
              </span>
            </button>
            <Button size="sm" className="j13-nav__cta" href="#contact" onClick={go('contact')}>
              {ui.startProject}
            </Button>
            <button
              ref={burgerRef}
              type="button"
              className="j13-tool j13-nav__burger"
              aria-expanded={menuOpen}
              aria-controls="j13-menu"
              aria-label={menuOpen ? ui.menuClose : ui.menuOpen}
              onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                origin.current = { x: `${r.left + r.width / 2}px`, y: `${r.top + r.height / 2}px` };
                setMenuOpen(!menuOpen);
              }}
            >
              <span className="j13-burger" data-open={menuOpen ? '' : undefined} aria-hidden="true">
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div ref={menuRef} id="j13-menu" className="j13-menu" role="dialog" aria-modal="true" aria-label={ui.menu} hidden>
        <nav aria-label={ui.mainNav}>
          <ol className="j13-menu__list">
            {sections.map((s, i) => (
              <li key={s.id} className="j13-menu__item">
                <a href={`#${s.id}`} data-menu-item aria-current={active === i ? 'true' : undefined} onClick={go(s.id)}>
                  <span className="j13-menu__num">{String(i + 1).padStart(2, '0')}</span>
                  {s.name}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="j13-menu__foot" data-menu-item>
          <Button href="#contact" onClick={go('contact')} size="lg">
            {ui.startProject}
          </Button>
          <div className="j13-menu__tools">
            <a className="j13-tool j13-tool--lang" href={langHref} hrefLang={altLocale} lang={altLocale} aria-label={ui.languageLabel} onClick={onLanguage(langHref)}>
              <Glyph name="globe" size={16} />
              <span>{ui.language}</span>
            </a>
            <button type="button" className="j13-tool" onClick={onToggleTheme} aria-label={themeLabel}>
              <span className="j13-tool__swap" data-theme-icon>
                <Glyph name="sun" size={18} className="j13-icon-sun" />
                <Glyph name="moon" size={18} className="j13-icon-moon" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
