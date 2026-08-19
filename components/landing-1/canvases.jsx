'use client';

import { useMemo, useRef } from 'react';
import { useCanvasLoop, useInView, usePrefersReducedMotion } from './hooks';

function rotateX(p, a) {
  const s = Math.sin(a);
  const c = Math.cos(a);
  return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c };
}

function rotateY(p, a) {
  const s = Math.sin(a);
  const c = Math.cos(a);
  return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c };
}

function project(p, w, h, dist = 4, originX, originY) {
  const z = p.z + dist;
  const scale = (Math.min(w, h) * 0.42) / z;
  return {
    x: (originX ?? w / 2) + p.x * scale,
    y: (originY ?? h / 2) + p.y * scale,
    s: scale,
  };
}

const CUBE_VERTS = [
  { x: -1, y: -1, z: -1 }, { x: 1, y: -1, z: -1 }, { x: 1, y: 1, z: -1 }, { x: -1, y: 1, z: -1 },
  { x: -1, y: -1, z: 1 }, { x: 1, y: -1, z: 1 }, { x: 1, y: 1, z: 1 }, { x: -1, y: 1, z: 1 },
];

const CUBE_EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 0],
  [4, 5], [5, 6], [6, 7], [7, 4],
  [0, 4], [1, 5], [2, 6], [3, 7],
];

function drawCube(ctx, w, h, rotX, rotY, color, size = 1, originX, originY) {
  const pts = CUBE_VERTS.map((v) => {
    const p = rotateY(rotateX({ x: v.x * size, y: v.y * size, z: v.z * size }, rotX), rotY);
    return project(p, w, h, 4, originX, originY);
  });

  ctx.strokeStyle = color;
  ctx.lineWidth = 1.4;
  ctx.shadowColor = color;
  ctx.shadowBlur = 12;
  ctx.beginPath();
  CUBE_EDGES.forEach(([a, b]) => {
    ctx.moveTo(pts[a].x, pts[a].y);
    ctx.lineTo(pts[b].x, pts[b].y);
  });
  ctx.stroke();
  ctx.shadowBlur = 0;

  pts.forEach((p) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
    ctx.fill();
  });
}

export function HeroCanvas({ progressRef }) {
  const canvasRef = useRef(null);
  const [wrapRef, inView] = useInView({ threshold: 0.05, once: false });
  const reduced = usePrefersReducedMotion();
  const nodes = useMemo(
    () => Array.from({ length: 48 }, (_, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / 48);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      return {
        x: Math.sin(phi) * Math.cos(theta),
        y: Math.sin(phi) * Math.sin(theta),
        z: Math.cos(phi),
      };
    }),
    [],
  );

  const drawRef = useRef(null);
  drawRef.current = (ctx, w, h, now) => {
    ctx.clearRect(0, 0, w, h);
    const t = now * 0.001;
    const scroll = progressRef?.current || 0;
    const rx = 0.45 + scroll * 1.8 + t * 0.12;
    const ry = t * 0.35 + scroll * Math.PI * 2.2;

    const grd = ctx.createRadialGradient(w * 0.5, h * 0.42, 20, w * 0.5, h * 0.42, Math.max(w, h) * 0.55);
    grd.addColorStop(0, 'rgba(30, 64, 175, 0.28)');
    grd.addColorStop(0.45, 'rgba(14, 165, 233, 0.08)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);

    drawCube(ctx, w, h, rx, ry, 'rgba(56, 189, 248, 0.85)', 1.05);

    ctx.strokeStyle = 'rgba(139, 92, 246, 0.35)';
    ctx.lineWidth = 1;
    const projected = nodes.map((n) => project(rotateY(rotateX(n, rx * 0.7), -ry * 0.8), w, h, 3.4));
    projected.forEach((p, i) => {
      if (i % 3 === 0 && projected[i + 1]) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(projected[i + 1].x, projected[i + 1].y);
        ctx.stroke();
      }
      ctx.fillStyle = i % 2 ? '#22d3ee' : '#818cf8';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  useCanvasLoop(canvasRef, drawRef, { active: inView && !reduced });

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}

export function CubesCanvas() {
  const canvasRef = useRef(null);
  const [wrapRef, inView] = useInView({ threshold: 0.1, once: false });
  const reduced = usePrefersReducedMotion();
  const drawRef = useRef(null);

  drawRef.current = (ctx, w, h, now) => {
    ctx.clearRect(0, 0, w, h);
    const t = now * 0.001;
    const colors = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#22d3ee'];
    colors.forEach((color, i) => {
      const cx = (w / (colors.length + 1)) * (i + 1);
      drawCube(ctx, w, h, t * 0.4 + i, t * 0.55 + i * 0.4, color, 0.32, cx, h / 2);
    });
  };

  useCanvasLoop(canvasRef, drawRef, { active: inView && !reduced });

  return (
    <div ref={wrapRef} className="absolute inset-0 pointer-events-none opacity-40">
      <canvas ref={canvasRef} className="w-full h-full" aria-hidden="true" />
    </div>
  );
}

export function ParticlesCanvas({ forming = false }) {
  const canvasRef = useRef(null);
  const [wrapRef, inView] = useInView({ threshold: 0.1, once: false });
  const reduced = usePrefersReducedMotion();
  const particles = useMemo(
    () => Array.from({ length: 70 }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      s: 0.6 + Math.random() * 1.8,
      vx: (Math.random() - 0.5) * 0.0004,
      vy: (Math.random() - 0.5) * 0.0004,
    })),
    [],
  );
  const drawRef = useRef(null);

  drawRef.current = (ctx, w, h, now) => {
    ctx.clearRect(0, 0, w, h);
    const t = now * 0.001;
    particles.forEach((p, i) => {
      p.x = (p.x + p.vx + 1) % 1;
      p.y = (p.y + p.vy + 1) % 1;
      const pulse = forming ? 0.5 + Math.sin(t * 2 + i) * 0.5 : 1;
      const x = p.x * w;
      const y = p.y * h;
      ctx.fillStyle = i % 3 === 0 ? 'rgba(34,211,238,0.7)' : 'rgba(59,130,246,0.55)';
      ctx.beginPath();
      ctx.arc(x, y, p.s * pulse, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  useCanvasLoop(canvasRef, drawRef, { active: inView && !reduced });

  return (
    <div ref={wrapRef} className="absolute inset-0 pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full" aria-hidden="true" />
    </div>
  );
}

export function DeviceCanvas() {
  const canvasRef = useRef(null);
  const [wrapRef, inView] = useInView({ threshold: 0.15, once: false });
  const reduced = usePrefersReducedMotion();
  const drawRef = useRef(null);

  drawRef.current = (ctx, w, h, now) => {
    ctx.clearRect(0, 0, w, h);
    const t = now * 0.001;
    const rx = 0.55 + Math.sin(t * 0.4) * 0.12;
    const ry = t * 0.35;
    drawCube(ctx, w, h, rx, ry, 'rgba(59,130,246,0.9)', 0.72);

    ctx.save();
    ctx.translate(0, h * 0.02);
    ctx.strokeStyle = 'rgba(34,211,238,0.7)';
    ctx.lineWidth = 2;
    const screen = [
      rotateY(rotateX({ x: -0.55, y: -0.35, z: 0.72 }, rx), ry),
      rotateY(rotateX({ x: 0.55, y: -0.35, z: 0.72 }, rx), ry),
      rotateY(rotateX({ x: 0.55, y: 0.35, z: 0.72 }, rx), ry),
      rotateY(rotateX({ x: -0.55, y: 0.35, z: 0.72 }, rx), ry),
    ].map((p) => project(p, w, h));
    ctx.beginPath();
    ctx.moveTo(screen[0].x, screen[0].y);
    screen.forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  };

  useCanvasLoop(canvasRef, drawRef, { active: inView && !reduced });

  return (
    <div ref={wrapRef} className="absolute inset-0 pointer-events-none opacity-70">
      <canvas ref={canvasRef} className="w-full h-full" aria-hidden="true" />
    </div>
  );
}

export function TechOrbitCanvas() {
  const canvasRef = useRef(null);
  const [wrapRef, inView] = useInView({ threshold: 0.12, once: false });
  const reduced = usePrefersReducedMotion();
  const logos = useMemo(() => ['React', 'Node', 'AWS', 'Go', 'SQL', 'K8s', 'TS', 'RN'], []);
  const drawRef = useRef(null);

  drawRef.current = (ctx, w, h, now) => {
    ctx.clearRect(0, 0, w, h);
    const t = now * 0.001;
    const cx = w / 2;
    const cy = h / 2;
    logos.forEach((label, i) => {
      const a = t * 0.35 + (i / logos.length) * Math.PI * 2;
      const r = Math.min(w, h) * 0.32;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a * 0.9) * r * 0.45;
      ctx.fillStyle = 'rgba(15,23,42,0.85)';
      ctx.strokeStyle = 'rgba(59,130,246,0.55)';
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x, y);
    });
  };

  useCanvasLoop(canvasRef, drawRef, { active: inView && !reduced });

  return (
    <div ref={wrapRef} className="absolute inset-0 pointer-events-none opacity-50">
      <canvas ref={canvasRef} className="w-full h-full" aria-hidden="true" />
    </div>
  );
}

export function FloatingShapesCanvas() {
  const canvasRef = useRef(null);
  const [wrapRef, inView] = useInView({ threshold: 0.1, once: false });
  const reduced = usePrefersReducedMotion();
  const drawRef = useRef(null);

  drawRef.current = (ctx, w, h, now) => {
    ctx.clearRect(0, 0, w, h);
    const t = now * 0.001;
    const shapes = 8;
    for (let i = 0; i < shapes; i += 1) {
      const x = (w / shapes) * i + Math.sin(t + i) * 18;
      const y = h * 0.35 + Math.cos(t * 0.8 + i) * 40;
      ctx.strokeStyle = i % 2 ? 'rgba(34,211,238,0.45)' : 'rgba(59,130,246,0.4)';
      ctx.lineWidth = 1.2;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(t * 0.3 + i);
      ctx.strokeRect(-16, -16, 32, 32);
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  };

  useCanvasLoop(canvasRef, drawRef, { active: inView && !reduced });

  return (
    <div ref={wrapRef} className="absolute inset-0 pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full" aria-hidden="true" />
    </div>
  );
}
