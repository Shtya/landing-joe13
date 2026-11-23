'use client';

/*
 * "Lite" mode for machines that cannot carry the full effects at 60fps:
 * no GPU (hardware acceleration off, Remote Desktop, some battery savers),
 * Save-Data, very little memory, or a measured frame rate under ~30fps.
 *
 * Lite keeps the design and every reveal; it drops the expensive layers:
 * the WebGL scenes fall back to their CSS glow, backdrop blur becomes a solid
 * tint, and the drifting orbs/twinkle stop. Set on <html> as `j13-lite`
 * (with data-lite="<reason>") so CSS and JS read one switch.
 */

export const LITE_EVENT = 'j13:lite';

export function isLite() {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('j13-lite');
}

export function enableLite(reason) {
  if (typeof document === 'undefined' || isLite()) return;
  const html = document.documentElement;
  html.classList.add('j13-lite');
  html.dataset.lite = reason;
  window.dispatchEvent(new CustomEvent(LITE_EVENT, { detail: reason }));
}

/** Signals known before anything renders. */
export function initialLiteReason() {
  if (typeof navigator === 'undefined') return null;
  if (navigator.connection?.saveData) return 'save-data';
  if (navigator.deviceMemory && navigator.deviceMemory <= 2) return 'low-memory';
  try {
    if (new URLSearchParams(window.location.search).has('lite')) return 'forced';
  } catch {}
  return null;
}

/**
 * Measure real frame times for ~1.5s. A median above `threshold` ms
 * (i.e. under ~30fps) switches to lite. Skipped while the tab is hidden,
 * where rAF is throttled and would read as slow.
 */
export function probeFrameRate({ frames = 90, threshold = 34 } = {}) {
  if (typeof window === 'undefined' || isLite()) return () => {};
  let raf = 0;
  let last = 0;
  const deltas = [];
  const step = (now) => {
    if (document.hidden) {
      last = 0;
      raf = requestAnimationFrame(step);
      return;
    }
    if (last) deltas.push(now - last);
    last = now;
    if (deltas.length < frames) {
      raf = requestAnimationFrame(step);
      return;
    }
    const sorted = deltas.slice().sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    if (median > threshold) enableLite(`slow-frames-${Math.round(median)}ms`);
  };
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
}

/**
 * WebGL renderer options shared by the scenes. failIfMajorPerformanceCaveat
 * refuses software rendering (SwiftShader when hardware acceleration is off),
 * which would otherwise run the scene at a few fps and freeze the page.
 */
export const GL_OPTIONS = {
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance',
  failIfMajorPerformanceCaveat: true,
};
