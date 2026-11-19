/*
 * Ribbon shape per slide. Points are [u, v, z]:
 *   u, v — screen space, -1..1 (u = -1 is the left edge, v = 1 the top)
 *   z    — world depth; 0 is the content plane, negative is further away
 * Content sits on the start side (left in LTR), so most shapes live on the
 * end side. RTL mirrors u automatically. Keyed by slide id (content.slides);
 * a slide without its own shape falls back to the intro J.
 */

function ring({ cu, cv, ru, rv, from, to, tilt = 1, steps = 14, zBase = -0.4 }) {
  const pts = [];
  for (let i = 0; i <= steps; i += 1) {
    const a = from + ((to - from) * i) / steps;
    pts.push([cu + Math.cos(a) * ru, cv + Math.sin(a) * rv, zBase + Math.sin(a) * tilt]);
  }
  return pts;
}

function helix({ cu, r, v0, v1, turns, steps = 22, depth = 0.6, zBase = -0.6 }) {
  const pts = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const a = t * turns * Math.PI * 2;
    pts.push([cu + Math.cos(a) * r, v0 + (v1 - v0) * t, zBase + Math.sin(a) * depth]);
  }
  return pts;
}

function spiral({ cu, cv, r0, r1, turns, steps = 20, zFrom = -2, zTo = 0.4, aspect = 0.56 }) {
  const pts = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const a = t * turns * Math.PI * 2 + Math.PI * 0.5;
    const r = r0 + (r1 - r0) * t;
    pts.push([cu + Math.cos(a) * r * aspect, cv + Math.sin(a) * r, zFrom + (zTo - zFrom) * t]);
  }
  return pts;
}

export const SHAPES = {
  // 0 · Intro — the hooked "J" of the mark, dropping in from the top corner
  top: {
    width: 0.44,
    twist: 0.55,
    phase: 0.4,
    points: [
      [1.2, 1.35, -0.8],
      [0.8, 0.92, 0.1],
      [0.64, 0.32, 0.5],
      [0.6, -0.16, 0.7],
      [0.5, -0.5, 0.45],
      [0.32, -0.62, 0.15],
      [0.17, -0.44, -0.3],
      [0.19, -0.06, -1.2],
      [0.38, 0.36, -2.8],
      [0.7, 0.78, -4.4],
    ],
  },
  // 1 · Services — a long low wave carrying the lens panel
  services: {
    width: 0.46,
    twist: 1.4,
    points: [
      [-1.4, -0.98, -3],
      [-0.6, -0.72, -1.6],
      [0.0, -0.9, -0.6],
      [0.42, -0.62, 0.1],
      [0.82, -0.82, 0.2],
      [1.08, -0.2, -0.5],
      [0.88, 0.5, -1.3],
      [1.35, 1.15, -2.4],
    ],
  },
  // 2 · Platforms — a tilted orbit around the logo ring
  platforms: {
    width: 0.36,
    twist: 0.5,
    points: [
      [1.4, -1.2, -2.4],
      ...ring({ cu: 0.42, cv: -0.04, ru: 0.44, rv: 0.36, from: -Math.PI * 0.35, to: Math.PI * 1.85, tilt: 0.9, steps: 18, zBase: -0.9 }),
      [1.4, 0.95, -3],
    ],
  },
  // 3 · Process — a long trajectory running under the phase panel
  process: {
    width: 0.4,
    twist: 2.2,
    points: [
      [-1.4, -0.95, -2.6],
      [-0.6, -0.8, -1.6],
      [0.2, -0.82, -1.3],
      [0.7, -0.72, -1.5],
      [1.0, -0.88, -2],
      [1.4, -1.25, -3],
    ],
  },
  // 4 · Studio — a low horizon under the numbers
  studio: {
    width: 0.38,
    twist: 1.6,
    points: [
      [-1.4, -0.82, -3],
      [-0.7, -1.0, -1.8],
      [0.0, -0.92, -1.4],
      [0.6, -1.04, -1.6],
      [1.0, -0.9, -2],
      [1.4, -0.7, -3],
    ],
  },
  // 5 · Work — a frame that wraps the case file
  work: {
    width: 0.32,
    twist: 1.1,
    points: [
      [1.35, 1.0, -2.6],
      [0.8, 0.72, -0.9],
      [0.2, 0.74, -0.7],
      [-0.26, 0.64, -0.8],
      [-0.3, 0.0, -0.8],
      [-0.26, -0.66, -0.8],
      [0.3, -0.78, -0.7],
      [0.8, -0.74, -0.8],
      [1.35, -1.1, -2.6],
    ],
  },
  // 6 · Clients — an open curl behind the quote, like a drawn quotation mark
  voices: {
    width: 0.3,
    twist: 0.7,
    points: [
      [1.4, -1.1, -3],
      [0.7, -0.75, -1.6],
      ...spiral({ cu: 0.5, cv: 0.06, r0: 0.8, r1: 0.1, turns: 1.4, steps: 16, zFrom: -2.4, zTo: -1.6 }),
    ],
  },
  // 7 · Contact — everything converges into one point of signal behind the form
  contact: {
    width: 0.4,
    twist: 1.6,
    points: [[1.4, -1.3, -3.6], ...spiral({ cu: 0.48, cv: -0.06, r0: 0.95, r1: 0.02, turns: 2.1, steps: 22, zFrom: -2.8, zTo: -0.6 })],
  },
  // Stack — a wide helix climbing around the layered plates
  stack: {
    width: 0.32,
    twist: 0.9,
    points: [[0.1, -1.4, -3], ...helix({ cu: 0.46, r: 0.26, v0: -0.95, v1: 0.95, turns: 1.6, steps: 22, depth: 0.9, zBase: -1.6 }), [0.9, 1.4, -3.2]],
  },
  // Plans — one long sweep rising behind the three plan cards
  plans: {
    width: 0.4,
    twist: 1.8,
    points: [
      [-1.4, -1.0, -2.6],
      [-0.7, -0.78, -1.8],
      [0.0, -0.9, -1.6],
      [0.6, -0.6, -1.8],
      [1.0, -0.1, -2.2],
      [1.4, 0.9, -3],
    ],
  },
};
