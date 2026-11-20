/*
 * High-resolution product screens for the hero scene, drawn on canvas and
 * used as textures. They are what the code glyphs "assemble into": a
 * dashboard window, a phone, a KPI card and a call-to-action pill.
 * Content is language-neutral (numbers, charts, skeleton text), mirrored
 * for RTL, and drawn in a dark and a light variant.
 */

const FONT = 'system-ui, -apple-system, "Segoe UI", Inter, Roboto, sans-serif';

function palette(light) {
  return light
    ? {
        bg0: '#ffffff', bg1: '#eef3ff', panel: '#f5f8ff', panel2: '#ffffff', line: 'rgba(29,92,245,0.16)',
        edge: 'rgba(29,92,245,0.45)', text: '#0a1438', text2: 'rgba(10,20,60,0.55)', bar: 'rgba(10,20,60,0.12)',
        bar2: 'rgba(10,20,60,0.07)', accent: '#1d5cf5', accent2: '#079cff', deep: '#0a2a8c', good: '#0b8a64',
        glow: 'rgba(29,92,245,0.0)', active: 'rgba(29,92,245,0.10)',
      }
    : {
        bg0: '#0c1840', bg1: '#050b22', panel: 'rgba(255,255,255,0.045)', panel2: 'rgba(255,255,255,0.07)', line: 'rgba(140,180,255,0.14)',
        edge: 'rgba(120,185,255,0.75)', text: '#eef4ff', text2: 'rgba(200,215,255,0.6)', bar: 'rgba(200,220,255,0.22)',
        bar2: 'rgba(200,220,255,0.1)', accent: '#2f7bff', accent2: '#45c0ff', deep: '#0a2a8c', good: '#3be0b0',
        glow: 'rgba(80,160,255,0.55)', active: 'rgba(47,123,255,0.2)',
      };
}

function rr(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

function frame(g, W, H, R, p, light) {
  // body
  const bg = g.createLinearGradient(0, 0, W * 0.4, H);
  bg.addColorStop(0, p.bg0);
  bg.addColorStop(1, p.bg1);
  rr(g, 6, 6, W - 12, H - 12, R);
  g.fillStyle = bg;
  g.fill();
  // top sheen
  const sh = g.createLinearGradient(0, 0, 0, H * 0.35);
  sh.addColorStop(0, light ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.07)');
  sh.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = sh;
  g.fill();
  // lit edge
  g.lineWidth = 4;
  const eg = g.createLinearGradient(0, 0, W, H);
  eg.addColorStop(0, p.edge);
  eg.addColorStop(0.5, light ? 'rgba(29,92,245,0.18)' : 'rgba(120,185,255,0.25)');
  eg.addColorStop(1, p.edge);
  g.strokeStyle = eg;
  g.stroke();
}

function bar(g, x, y, w, h, color) {
  rr(g, x, y, w, h, h / 2);
  g.fillStyle = color;
  g.fill();
}

function text(g, str, x, y, size, weight, color, align = 'left') {
  g.font = `${weight} ${size}px ${FONT}`;
  g.fillStyle = color;
  g.textAlign = align;
  g.textBaseline = 'alphabetic';
  g.fillText(str, x, y);
}

function smoothLine(g, pts) {
  g.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i += 1) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;
    g.bezierCurveTo(cx, y0, cx, y1, x1, y1);
  }
}

function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

/* ---- dashboard window (3.6 × 2.5) -------------------------------------- */
function drawWindow(scale, light, rtl) {
  const W = Math.round(2048 * scale);
  const H = Math.round(1422 * scale);
  const c = canvas(W, H);
  const g = c.getContext('2d');
  const p = palette(light);
  g.scale(scale, scale);
  const w = 2048;
  const h = 1422;
  // mirror the layout (not the type) for RTL
  const X = (x, width = 0) => (rtl ? w - x - width : x);

  frame(g, w, h, 46, p, light);

  // header
  ['#ff6b86', '#ffc24a', '#3be0b0'].forEach((col, i) => {
    g.beginPath();
    g.arc(X(64 + i * 40), 66, 13, 0, Math.PI * 2);
    g.fillStyle = col;
    g.fill();
  });
  rr(g, X(720, 600), 38, 600, 56, 28);
  g.fillStyle = p.panel2;
  g.fill();
  bar(g, X(760, 220), 58, 220, 16, p.bar);
  const av = g.createLinearGradient(0, 0, 60, 60);
  av.addColorStop(0, p.accent2);
  av.addColorStop(1, p.accent);
  g.beginPath();
  g.arc(X(1960), 66, 28, 0, Math.PI * 2);
  g.fillStyle = av;
  g.fill();
  g.fillStyle = p.line;
  g.fillRect(6, 128, w - 12, 3);

  // sidebar
  const sbX = X(36, 340);
  rr(g, sbX, 160, 340, h - 196, 28);
  g.fillStyle = p.panel;
  g.fill();
  const logo = g.createLinearGradient(0, 0, 80, 80);
  logo.addColorStop(0, p.accent2);
  logo.addColorStop(1, p.deep);
  rr(g, X(72, 64), 196, 64, 64, 18);
  g.fillStyle = logo;
  g.fill();
  bar(g, X(156, 150), 220, 150, 20, p.bar);
  for (let i = 0; i < 7; i += 1) {
    const y = 320 + i * 104;
    if (i === 0) {
      rr(g, X(56, 300), y - 22, 300, 84, 20);
      g.fillStyle = p.active;
      g.fill();
    }
    rr(g, X(80, 40), y, 40, 40, 11);
    g.fillStyle = i === 0 ? p.accent : p.bar;
    g.fill();
    bar(g, X(144, i === 0 ? 170 : 140 + (i % 3) * 20), y + 12, i === 0 ? 170 : 140 + (i % 3) * 20, 16, i === 0 ? p.text : p.bar);
  }

  // KPI row
  const mainX = 412;
  const mainW = w - mainX - 40;
  const kpis = [
    ['128.4K', '+24.6%', p.accent],
    ['98.2%', '+3.1%', p.accent2],
    ['42ms', '−18%', p.good],
  ];
  const kw = (mainW - 2 * 28) / 3;
  kpis.forEach(([v, d, col], i) => {
    const kx = X(mainX + i * (kw + 28), kw);
    rr(g, kx, 160, kw, 220, 26);
    g.fillStyle = p.panel;
    g.fill();
    g.strokeStyle = p.line;
    g.lineWidth = 2;
    g.stroke();
    bar(g, kx + 36, 200, 150, 16, p.bar);
    text(g, v, kx + 36, 300, 76, 700, p.text);
    rr(g, kx + 36, 324, 120, 36, 18);
    g.fillStyle = light ? 'rgba(11,138,100,0.12)' : 'rgba(59,224,176,0.16)';
    g.fill();
    text(g, d, kx + 96, 350, 24, 700, p.good, 'center');
    // sparkline
    g.beginPath();
    const pts = [0, 1, 2, 3, 4, 5, 6].map((k) => [kx + kw - 230 + k * 32, 300 - Math.sin(k * 1.3 + i) * 26 - k * 6]);
    smoothLine(g, pts);
    g.strokeStyle = col;
    g.lineWidth = 6;
    g.lineCap = 'round';
    g.stroke();
  });

  // big chart
  const cx0 = X(mainX, mainW * 0.64);
  const cw = mainW * 0.64;
  const cy0 = 412;
  const ch = h - cy0 - 40;
  rr(g, cx0, cy0, cw, ch, 28);
  g.fillStyle = p.panel;
  g.fill();
  g.strokeStyle = p.line;
  g.lineWidth = 2;
  g.stroke();
  bar(g, cx0 + 40, cy0 + 44, 220, 20, p.text2);
  bar(g, cx0 + 40, cy0 + 82, 140, 14, p.bar);
  const gx = cx0 + 40;
  const gw = cw - 80;
  const gy = cy0 + 150;
  const gh = ch - 210;
  g.strokeStyle = p.line;
  g.lineWidth = 2;
  for (let i = 0; i <= 4; i += 1) {
    g.beginPath();
    g.moveTo(gx, gy + (gh / 4) * i);
    g.lineTo(gx + gw, gy + (gh / 4) * i);
    g.stroke();
  }
  // bars
  const n = 12;
  for (let i = 0; i < n; i += 1) {
    const bh = gh * (0.25 + 0.55 * Math.abs(Math.sin(i * 0.9 + 0.6)));
    const bx = gx + (gw / n) * i + 14;
    const bg = g.createLinearGradient(0, gy + gh - bh, 0, gy + gh);
    bg.addColorStop(0, light ? 'rgba(29,92,245,0.28)' : 'rgba(69,173,255,0.32)');
    bg.addColorStop(1, 'rgba(29,92,245,0.02)');
    rr(g, bx, gy + gh - bh, gw / n - 28, bh, 10);
    g.fillStyle = bg;
    g.fill();
  }
  // area line
  const line = Array.from({ length: 9 }, (_, i) => [gx + (gw / 8) * i, gy + gh * (0.72 - 0.5 * (i / 8) - Math.sin(i * 1.1) * 0.12)]);
  g.beginPath();
  smoothLine(g, line);
  g.lineTo(gx + gw, gy + gh);
  g.lineTo(gx, gy + gh);
  g.closePath();
  const area = g.createLinearGradient(0, gy, 0, gy + gh);
  area.addColorStop(0, light ? 'rgba(29,92,245,0.28)' : 'rgba(69,173,255,0.38)');
  area.addColorStop(1, 'rgba(29,92,245,0)');
  g.fillStyle = area;
  g.fill();
  g.beginPath();
  smoothLine(g, line);
  g.strokeStyle = p.accent2;
  g.lineWidth = 7;
  g.shadowColor = p.glow;
  g.shadowBlur = light ? 0 : 24;
  g.stroke();
  g.shadowBlur = 0;
  line.forEach(([x, y], i) => {
    if (i % 2) return;
    g.beginPath();
    g.arc(x, y, 11, 0, Math.PI * 2);
    g.fillStyle = light ? '#ffffff' : '#0a1640';
    g.fill();
    g.lineWidth = 5;
    g.strokeStyle = p.accent2;
    g.stroke();
  });

  // activity list
  const lx = X(mainX + cw + 28, mainW - cw - 28);
  const lw = mainW - cw - 28;
  rr(g, lx, cy0, lw, ch, 28);
  g.fillStyle = p.panel;
  g.fill();
  g.strokeStyle = p.line;
  g.stroke();
  bar(g, lx + 36, cy0 + 44, 160, 20, p.text2);
  for (let i = 0; i < 6; i += 1) {
    const y = cy0 + 120 + i * 118;
    const ag = g.createLinearGradient(lx, y, lx + 60, y + 60);
    ag.addColorStop(0, i % 2 ? p.accent2 : p.accent);
    ag.addColorStop(1, p.deep);
    g.beginPath();
    g.arc(lx + 66, y + 30, 28, 0, Math.PI * 2);
    g.fillStyle = ag;
    g.fill();
    bar(g, lx + 112, y + 12, lw * 0.42, 16, p.text2);
    bar(g, lx + 112, y + 40, lw * 0.28, 12, p.bar);
    rr(g, lx + lw - 120, y + 14, 84, 32, 16);
    g.fillStyle = i % 3 ? p.active : (light ? 'rgba(11,138,100,0.12)' : 'rgba(59,224,176,0.16)');
    g.fill();
  }
  return c;
}

/* ---- phone (0.82 × 1.55) -------------------------------------------------- */
function drawPhone(scale, light, rtl) {
  const W = Math.round(560 * scale);
  const H = Math.round(1058 * scale);
  const c = canvas(W, H);
  const g = c.getContext('2d');
  const p = palette(light);
  g.scale(scale, scale);
  const w = 560;
  const h = 1058;
  const X = (x, width = 0) => (rtl ? w - x - width : x);
  frame(g, w, h, 72, p, light);
  bar(g, w / 2 - 70, 34, 140, 30, light ? 'rgba(10,20,60,0.85)' : '#000');
  bar(g, X(48, 120), 110, 120, 18, p.bar);
  text(g, '$24,890', rtl ? w - 48 : 48, 210, 64, 800, p.text, rtl ? 'right' : 'left');
  rr(g, 40, 250, w - 80, 230, 30);
  const cg = g.createLinearGradient(40, 250, w - 40, 480);
  cg.addColorStop(0, '#079cff');
  cg.addColorStop(0.55, '#236cff');
  cg.addColorStop(1, '#0a2a8c');
  g.fillStyle = cg;
  g.fill();
  bar(g, X(76, 140), 290, 140, 16, 'rgba(255,255,255,0.6)');
  bar(g, X(76, 230), 410, 230, 22, 'rgba(255,255,255,0.9)');
  for (let i = 0; i < 4; i += 1) {
    const y = 530 + i * 100;
    rr(g, X(48, 64), y, 64, 64, 18);
    g.fillStyle = p.active;
    g.fill();
    bar(g, X(132, 200), y + 12, 200, 16, p.text2);
    bar(g, X(132, 120), y + 40, 120, 12, p.bar);
    bar(g, X(w - 150, 100), y + 22, 100, 18, p.bar);
  }
  rr(g, 40, h - 130, w - 80, 86, 40);
  g.fillStyle = p.panel2;
  g.fill();
  for (let i = 0; i < 4; i += 1) {
    g.beginPath();
    g.arc(110 + i * ((w - 220) / 3), h - 87, 16, 0, Math.PI * 2);
    g.fillStyle = i === 0 ? p.accent : p.bar;
    g.fill();
  }
  return c;
}

/* ---- KPI card (1.35 × 0.8) ------------------------------------------------ */
function drawCard(scale, light, rtl) {
  const W = Math.round(864 * scale);
  const H = Math.round(512 * scale);
  const c = canvas(W, H);
  const g = c.getContext('2d');
  const p = palette(light);
  g.scale(scale, scale);
  const w = 864;
  const h = 512;
  const X = (x, width = 0) => (rtl ? w - x - width : x);
  frame(g, w, h, 40, p, light);
  bar(g, X(48, 180), 60, 180, 20, p.text2);
  text(g, '+38.4%', rtl ? w - 48 : 48, 190, 92, 800, p.text, rtl ? 'right' : 'left');
  const pts = Array.from({ length: 8 }, (_, i) => [X(48 + i * 110), 400 - i * 22 - Math.sin(i * 1.4) * 34]);
  g.beginPath();
  smoothLine(g, pts);
  g.strokeStyle = p.accent2;
  g.lineWidth = 9;
  g.lineCap = 'round';
  g.shadowColor = p.glow;
  g.shadowBlur = light ? 0 : 20;
  g.stroke();
  g.shadowBlur = 0;
  const last = pts[pts.length - 1];
  g.beginPath();
  g.arc(last[0], last[1], 16, 0, Math.PI * 2);
  g.fillStyle = p.accent2;
  g.fill();
  return c;
}

/* ---- CTA pill (1.1 × 0.3) ------------------------------------------------- */
function drawCta(scale, light, rtl) {
  const W = Math.round(880 * scale);
  const H = Math.round(240 * scale);
  const c = canvas(W, H);
  const g = c.getContext('2d');
  g.scale(scale, scale);
  const w = 880;
  const h = 240;
  rr(g, 8, 8, w - 16, h - 16, (h - 16) / 2);
  const bg = g.createLinearGradient(0, 0, w, 0);
  bg.addColorStop(rtl ? 1 : 0, '#079cff');
  bg.addColorStop(0.52, '#236cff');
  bg.addColorStop(rtl ? 0 : 1, '#0a2a8c');
  g.fillStyle = bg;
  g.fill();
  const hi = g.createLinearGradient(0, 0, 0, h);
  hi.addColorStop(0, 'rgba(255,255,255,0.35)');
  hi.addColorStop(0.5, 'rgba(255,255,255,0)');
  g.fillStyle = hi;
  g.fill();
  const chipX = rtl ? 128 : w - 128;
  g.beginPath();
  g.arc(chipX, h / 2, 82, 0, Math.PI * 2);
  g.fillStyle = '#f8f9ff';
  g.fill();
  g.strokeStyle = '#1456ff';
  g.lineWidth = 12;
  g.lineCap = 'round';
  g.lineJoin = 'round';
  const d = rtl ? -1 : 1;
  g.beginPath();
  g.moveTo(chipX - 34 * d, h / 2);
  g.lineTo(chipX + 30 * d, h / 2);
  g.moveTo(chipX + 6 * d, h / 2 - 26);
  g.lineTo(chipX + 32 * d, h / 2);
  g.lineTo(chipX + 6 * d, h / 2 + 26);
  g.stroke();
  bar(g, rtl ? 260 : 90, h / 2 - 16, 400, 32, 'rgba(255,255,255,0.92)');
  if (light) {
    rr(g, 8, 8, w - 16, h - 16, (h - 16) / 2);
    g.strokeStyle = 'rgba(10,42,140,0.25)';
    g.lineWidth = 3;
    g.stroke();
  }
  return c;
}

export const SCREENS = [
  // [draw, width, height, x, y, z]  — scene units, same layout the glyphs assemble
  [drawWindow, 3.6, 2.5, 0, 0, 0],
  [drawCard, 1.35, 0.8, 1.625, -1.35, 0.75],
  [drawPhone, 0.82, 1.55, -2.14, 0.575, -0.65],
  [drawCta, 1.1, 0.3, 0.2, -1.47, 0.45],
];

export function drawScreen(draw, { scale, light, rtl }) {
  return draw(scale, light, rtl);
}
