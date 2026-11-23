'use client';

import { useEffect, useRef, useState } from 'react';
import Glyph from '../Glyph';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../motion';
import { LITE_EVENT, enableLite, isLite } from '../perf';

/*
 * Hero 3D: "Code → Product" (hero3d/createCodeScene.js).
 * three.js and the scene load lazily, after the headline has painted.
 * Pointer events are read on the whole hero section (so the field reacts
 * anywhere), but a drag can only start on the scene's own cell, so the
 * copy and buttons stay fully clickable. A short press without movement
 * toggles code ↔ product. If WebGL is missing, a CSS glow stands in.
 */
export default function HeroScene({ introReady, theme, isArabic, hint, cursorLabel }) {
  const cellRef = useRef(null);
  const hostRef = useRef(null);
  const apiRef = useRef(null);
  const introRef = useRef(false);
  const [state, setState] = useState('loading'); // loading | ready | fallback

  // load + create
  useEffect(() => {
    let disposed = false;
    const host = hostRef.current;
    const begin = () => {
      // Lite (no GPU / slow device): keep the CSS glow, skip three.js entirely.
      if (isLite()) {
        setState('fallback');
        return;
      }
      return Promise.all([import('three'), import('three/examples/jsm/environments/RoomEnvironment.js'), import('../hero3d/createCodeScene')])
        .then(([THREE, env, mod]) => {
          if (disposed || !host) return;
          if (isLite()) {
            setState('fallback');
            return;
          }
          const api = mod.createCodeScene(THREE, host, {
            gsap,
            mirror: isArabic,
            light: document.documentElement.dataset.theme === 'light',
            reduced: prefersReducedMotion(),
            mobile: window.matchMedia('(max-width: 1023px)').matches,
            RoomEnvironment: env.RoomEnvironment,
          });
          if (!api) {
            enableLite('no-gpu');
            setState('fallback');
            return;
          }
          apiRef.current = api;
          if (process.env.NODE_ENV !== 'production') window.__j13scene = api;
          setState('ready');
          if (introRef.current) api.intro();
        })
        .catch(() => !disposed && setState('fallback'));
    };
    // Switched to lite after the scene started (slow frames): drop it for the glow.
    const onLite = () => {
      apiRef.current?.dispose();
      apiRef.current = null;
      if (!disposed) setState('fallback');
    };
    window.addEventListener(LITE_EVENT, onLite);
    const idle = window.requestIdleCallback ? window.requestIdleCallback(begin, { timeout: 900 }) : window.setTimeout(begin, 200);
    return () => {
      disposed = true;
      window.removeEventListener(LITE_EVENT, onLite);
      if (window.cancelIdleCallback && typeof idle === 'number') window.cancelIdleCallback(idle);
      apiRef.current?.dispose();
      apiRef.current = null;
    };
  }, [isArabic]);

  useEffect(() => {
    if (!introReady || introRef.current) return;
    introRef.current = true;
    apiRef.current?.intro();
  }, [introReady]);

  useEffect(() => {
    apiRef.current?.setLight(theme === 'light');
  }, [theme, state]);

  // scroll: glyphs blow outward as the hero leaves
  useEffect(() => {
    const cell = cellRef.current;
    const section = cell?.closest('.j13-section');
    if (!section || prefersReducedMotion()) return undefined;
    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => apiRef.current?.setScatter(self.progress * 0.9),
    });
    return () => st.kill();
  }, []);

  // pointer field (whole section), drag + click (scene cell only)
  useEffect(() => {
    const cell = cellRef.current;
    const host = hostRef.current;
    const section = cell?.closest('.j13-section');
    if (!cell || !host || !section) return undefined;
    let press = null;
    let last = null;

    const toNdc = (e) => {
      const r = host.getBoundingClientRect();
      return [((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1)];
    };
    const onMove = (e) => {
      const api = apiRef.current;
      if (!api) return;
      if (e.pointerType === 'mouse') {
        const [nx, ny] = toNdc(e);
        api.pointer(nx, ny, true);
      }
      if (press && last) {
        const dx = e.clientX - last.x;
        const dy = e.clientY - last.y;
        if (Math.abs(e.clientX - press.x) + Math.abs(e.clientY - press.y) > 6) press.moved = true;
        if (press.moved) api.dragBy(dx, dy);
        last = { x: e.clientX, y: e.clientY };
      }
    };
    const onLeave = () => apiRef.current?.pointer(9, 9, false);
    const onDown = (e) => {
      if (e.button !== 0) return;
      press = { x: e.clientX, y: e.clientY, t: performance.now(), moved: false };
      last = { x: e.clientX, y: e.clientY };
      cell.classList.add('is-dragging');
      cell.setPointerCapture?.(e.pointerId);
    };
    const onUp = (e) => {
      if (!press) return;
      const api = apiRef.current;
      if (!press.moved && performance.now() - press.t < 350) api?.toggle();
      api?.dragEnd();
      press = null;
      last = null;
      cell.classList.remove('is-dragging');
      cell.releasePointerCapture?.(e.pointerId);
    };
    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        apiRef.current?.toggle();
      }
    };

    section.addEventListener('pointermove', onMove);
    section.addEventListener('pointerleave', onLeave);
    cell.addEventListener('pointerdown', onDown);
    cell.addEventListener('pointerup', onUp);
    cell.addEventListener('pointercancel', onUp);
    cell.addEventListener('keydown', onKey);
    return () => {
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerleave', onLeave);
      cell.removeEventListener('pointerdown', onDown);
      cell.removeEventListener('pointerup', onUp);
      cell.removeEventListener('pointercancel', onUp);
      cell.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div ref={cellRef} className={`j13-scene is-${state}`} data-cursor={cursorLabel} role="button" tabIndex={0} aria-label={hint}>
      <span className="j13-scene__glow" aria-hidden="true" />
      <div ref={hostRef} className="j13-scene__canvas" aria-hidden="true" />
      <p className="j13-scene__hint" aria-hidden="true">
        <Glyph name="prev" size={14} flip />
        {hint}
        <Glyph name="next" size={14} flip />
      </p>
    </div>
  );
}
