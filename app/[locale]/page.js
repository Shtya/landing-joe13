'use client';

// ════════════════════════════════════════════════════════════════════════════
// Nexus — Landing Page
// Merged design system: visual language, color tokens, typography, spacing,
// buttons and component patterns from "land1". Hero + global 3D background
// scene from "land3". Architecture/Arsenal visual flavor informed by "land2".
// Single-file production page — no external component imports.
// ════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  Sun, Moon, Menu, X, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight,
  ChevronDown, Mail, Phone, MapPin, Search,
  LayoutDashboard, Smartphone, Cloud, Bot, ShieldCheck, Gauge, Boxes,
  GitBranch, Lock, Activity, Layers, Workflow, Sparkles, Star, Quote,
  CheckCircle2, Globe2, Radio, Compass,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════
   DESIGN TOKENS — color palette, font family and shared visual language
   carried over from land1. Move into globals.css in production if desired.
   ════════════════════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500&display=swap');

  :root {
    --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

    --color-background: #FAFCFC;
    --color-surface: #F1F7F7;
    --color-card: #FFFFFF;
    --color-border: #E2EDEC;
    --color-text: #0C1416;
    --color-muted: #5C7A7D;

    --color-primary: #2E6B74;
    --color-primary-dark: #1E4A52;
    --color-accent: #4DC9D8;
    --color-secondary: #4A9E7A;
    --color-highlight: #DCF3F1;
    --color-overlay: rgba(46,107,116,0.08);

    --color-success: #3FAE7B;
    --color-success-10: rgba(63,174,123,0.10);
    --color-warning: #F2B84B;
    --color-error: #E15554;
    --color-error-10: rgba(225,85,84,0.10);

    --color-ink: #0C1416;
    --shadow-md: 0 8px 30px rgba(12,20,22,0.08);
  }

  .dark {
    --color-background: #0A1214;
    --color-surface: #0F1A1C;
    --color-card: #131F21;
    --color-border: #1E2E30;
    --color-text: #EAF6F6;
    --color-muted: #6FA0A6;

    --color-primary: #4DC9D8;
    --color-primary-dark: #2E6B74;
    --color-accent: #5DBF96;
    --color-secondary: #4A9E7A;
    --color-highlight: rgba(77,201,216,0.14);
    --color-overlay: rgba(77,201,216,0.12);

    --color-success: #4ED38C;
    --color-success-10: rgba(78,211,140,0.12);
    --color-warning: #F2C572;
    --color-error: #F07879;
    --color-error-10: rgba(240,120,121,0.12);
  }

  html { scroll-behavior: smooth; }
  body { background: var(--color-background); color: var(--color-text); font-family: var(--font-sans); }
  * { box-sizing: border-box; }

  ::selection { background: var(--color-primary); color: #fff; }
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: var(--color-background); }
  ::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 8px; }

  @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
  @keyframes shimmer { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
  @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  @keyframes marqueeReverse { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
  @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes pulseDot { 0%, 100% { opacity: 0.3; transform: scale(0.85); } 50% { opacity: 1; transform: scale(1.15); } }

  .shimmer-text {
    background: linear-gradient(100deg, var(--color-primary) 20%, var(--color-accent) 40%, var(--color-secondary) 60%, var(--color-primary) 80%);
    background-size: 200% auto;
    -webkit-background-clip: text; background-clip: text; color: transparent;
    animation: shimmer 6s linear infinite;
  }

  .glass {
    background: color-mix(in srgb, var(--color-card) 55%, transparent);
    border: 1px solid var(--color-border);
    backdrop-filter: blur(16px);
  }

  .section-solid { background: var(--color-background); position: relative; }
  .section-translucent {
    background: color-mix(in srgb, var(--color-background) 78%, transparent);
    backdrop-filter: blur(28px) saturate(120%);
    position: relative;
  }

  .btn-primary {
    display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
    padding: 0.95rem 2rem; border-radius: 9999px; font-weight: 600; font-size: 0.95rem;
    background: var(--color-primary); color: #fff; border: none; cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
    box-shadow: 0 4px 24px var(--color-overlay);
  }
  .btn-primary:hover { transform: scale(1.05) translateY(-1px); opacity: 0.92; box-shadow: 0 8px 32px var(--color-overlay); }
  .btn-ghost {
    display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
    padding: 0.95rem 2rem; border-radius: 9999px; font-weight: 600; font-size: 0.95rem;
    background: transparent; color: var(--color-text); border: 1.5px solid var(--color-border); cursor: pointer;
    transition: background 0.2s ease, border-color 0.2s ease;
  }
  .btn-ghost:hover { background: var(--color-overlay); border-color: var(--color-primary); }

  .card-base {
    background: var(--color-card); border: 1px solid var(--color-border); border-radius: 1.25rem;
    transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.35s ease;
  }
  .card-hover:hover { transform: translateY(-6px); box-shadow: var(--shadow-md); border-color: var(--color-primary); }

  .pill {
    display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.4rem 0.95rem; border-radius: 9999px;
    font-size: 0.78rem; font-weight: 600; background: var(--color-overlay); color: var(--color-primary);
    border: 1px solid var(--color-primary);
  }

  .section-label {
    display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase; color: var(--color-primary);
    padding: 0.35rem 0.9rem; border-radius: 9999px; background: var(--color-overlay); border: 1px solid var(--color-primary);
  }

  .section-title { font-weight: 800; color: var(--color-text); font-size: clamp(1.9rem, 4vw, 2.9rem); line-height: 1.15; letter-spacing: -0.01em; }

  .flip-card { perspective: 1200px; }
  .flip-card-inner { position: relative; width: 100%; height: 100%; transition: transform 0.6s cubic-bezier(0.16,1,0.3,1); transform-style: preserve-3d; }
  .flip-card:hover .flip-card-inner { transform: rotateY(180deg); }
  .flip-card-front, .flip-card-back { position: absolute; inset: 0; backface-visibility: hidden; }
  .flip-card-back { transform: rotateY(180deg); }

  .input-base {
    width: 100%; padding: 0.85rem 1.1rem; border-radius: 0.9rem; font-size: 0.9rem; outline: none;
    background: var(--color-surface); border: 1.5px solid var(--color-border); color: var(--color-text);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .input-base:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-overlay); }

  @media (prefers-reduced-motion: reduce) {
    .shimmer-text, [style*="animation"] { animation: none !important; }
  }
`;

/* ════════════════════════════════════════════════════════════════════════
   3D BACKGROUND — globe → architecture slabs → service orbs → integration
   hub, scroll-driven. Sourced from land3, rendered fixed behind the page
   with a soft blur and a low-opacity overlay above it for readability.
   ════════════════════════════════════════════════════════════════════════ */

const ORB_COLORS = ['#4DC9D8', '#5DBF96', '#2E6B74', '#4A9E7A', '#B2DFD8', '#6FA0A6'];
const CUBE_COLORS = ['#4DC9D8', '#5DBF96', '#2E6B74', '#4A9E7A', '#B2DFD8', '#6FA0A6', '#1E4A52', '#4DC9D8'];

function randomOnSphere(radius) {
  const u = Math.random(), v = Math.random();
  const theta = 2 * Math.PI * u, phi = Math.acos(2 * v - 1);
  return [radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta)];
}
function lerp(a, b, t) { return a + (b - a) * t; }
function damp(current, target, lambda, delta) { return lerp(current, target, 1 - Math.exp(-lambda * delta)); }

function GlobeScene({ isMobile }) {
  const { camera } = useThree();
  const nodeCount = isMobile ? 180 : 460;
  const globeRef = useRef();
  const topHemiRef = useRef();
  const bottomHemiRef = useRef();
  const clockRef = useRef(new THREE.Clock());
  const scrollRef = useRef(0);
  const stateRef = useRef({
    camZ: 5, globeScale: 1, globeOpacity: 1, topY: 0, bottomY: 0, topOpacity: 1, bottomOpacity: 1,
    slabScale: [0, 0, 0], slabOpacity: [0, 0, 0], orbsY: Array(6).fill(-4), orbsOpacity: Array(6).fill(0),
    hubScale: 1, pcbY: -5, pcbOpacity: 0,
    cubeAngles: Array(8).fill(0).map((_, i) => (i / 8) * Math.PI * 2),
    finalGlobeScale: 1,
  });

  const nodePositions = useMemo(() => Array.from({ length: nodeCount }, () => randomOnSphere(1.6)), [nodeCount]);
  const phaseOffsets = useMemo(() => nodePositions.map(() => Math.random() * Math.PI * 2), [nodePositions]);

  const { topLineGeo, bottomLineGeo } = useMemo(() => {
    const topPts = [], bottomPts = [], threshold = 0.55;
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        const dx = nodePositions[i][0] - nodePositions[j][0], dy = nodePositions[i][1] - nodePositions[j][1], dz = nodePositions[i][2] - nodePositions[j][2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < threshold) {
          const target = (nodePositions[i][1] > 0 && nodePositions[j][1] > 0) ? topPts : (nodePositions[i][1] <= 0 && nodePositions[j][1] <= 0) ? bottomPts : null;
          if (target) target.push(...nodePositions[i], ...nodePositions[j]);
        }
      }
    }
    const tg = new THREE.BufferGeometry(); tg.setAttribute('position', new THREE.Float32BufferAttribute(topPts.length ? topPts : [0, 0, 0, 0, 0, 0], 3));
    const bg = new THREE.BufferGeometry(); bg.setAttribute('position', new THREE.Float32BufferAttribute(bottomPts.length ? bottomPts : [0, 0, 0, 0, 0, 0], 3));
    return { topLineGeo: tg, bottomLineGeo: bg };
  }, [nodePositions]);

  const nodeGeo = useMemo(() => new THREE.SphereGeometry(0.018, 6, 6), []);
  const nodeMat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#4DC9D8' }), []);
  const slabGeo = useMemo(() => new THREE.BoxGeometry(3.2, 0.12, 1.6), []);
  const slabMats = useMemo(() => [
    new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#2E6B74'), emissive: new THREE.Color('#4DC9D8'), emissiveIntensity: 0.2, transparent: true, opacity: 0.9, roughness: 0.08, metalness: 0.1 }),
    new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#1E4A52'), emissive: new THREE.Color('#5DBF96'), emissiveIntensity: 0.2, transparent: true, opacity: 0.9, roughness: 0.08, metalness: 0.1 }),
    new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#0A2B30'), emissive: new THREE.Color('#4DC9D8'), emissiveIntensity: 0.15, transparent: true, opacity: 0.9, roughness: 0.08, metalness: 0.1 }),
  ], []);
  const orbGeo = useMemo(() => new THREE.SphereGeometry(0.14, 32, 32), []);
  const orbMats = useMemo(() => ORB_COLORS.map(c => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(c), emissive: new THREE.Color(c), emissiveIntensity: 0.5, transparent: true, opacity: 0 })), []);
  const hubGeo = useMemo(() => new THREE.SphereGeometry(0.45, 64, 64), []);
  const hubMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#0C1416'), emissive: new THREE.Color('#4DC9D8'), emissiveIntensity: 0.6, transparent: true, opacity: 0, roughness: 0.1, metalness: 0.3 }), []);
  const cubeGeo = useMemo(() => new THREE.BoxGeometry(0.22, 0.22, 0.22), []);
  const cubeMats = useMemo(() => CUBE_COLORS.map(c => new THREE.MeshStandardMaterial({ color: new THREE.Color(c), emissive: new THREE.Color(c), emissiveIntensity: 0.4, transparent: true, opacity: 0 })), []);
  const pcbGeo = useMemo(() => new THREE.PlaneGeometry(4.5, 2.8), []);
  const pcbMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#0A1F1C', roughness: 0.8, transparent: true, opacity: 0 }), []);

  const nodesRef = useRef(); const slabRefs = [useRef(), useRef(), useRef()];
  const orbRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const hubRef = useRef(); const cubeRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const pcbRef = useRef(); const topLinesRef = useRef(); const bottomLinesRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = total > 0 ? window.scrollY / total : 0;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!nodesRef.current) return;
    const dummy = new THREE.Object3D();
    nodePositions.forEach((pos, i) => { dummy.position.set(...pos); dummy.updateMatrix(); nodesRef.current.setMatrixAt(i, dummy.matrix); });
    nodesRef.current.instanceMatrix.needsUpdate = true;
  }, [nodePositions]);

  useFrame((_, delta) => {
    const t = clockRef.current.getElapsedTime();
    const scroll = scrollRef.current;
    const s = stateRef.current;
    const s1End = 0.22, s2Start = 0.22, s2End = 0.48, s3Start = 0.48, s3End = 0.62, s4Start = 0.62, s4End = 0.78, s5Start = 0.78, s5End = 0.90, s6Start = 0.90;
    const inS1 = scroll <= s1End, inS2 = scroll > s2Start && scroll <= s2End, inS3 = scroll > s3Start && scroll <= s3End;
    const inS4 = scroll > s4Start && scroll <= s4End, inS5 = scroll > s5Start && scroll <= s5End, inS6 = scroll > s6Start;

    if (inS1) {
      const t1 = scroll / s1End;
      s.camZ = damp(s.camZ, lerp(5.0, 6.2, t1), 3, delta);
      s.globeScale = damp(s.globeScale, lerp(1.0, 0.92, t1), 3, delta);
      s.globeOpacity = damp(s.globeOpacity, lerp(1.0, 0.75, t1), 3, delta);
      s.topY = damp(s.topY, 0, 5, delta); s.bottomY = damp(s.bottomY, 0, 5, delta);
      s.topOpacity = damp(s.topOpacity, 1, 5, delta); s.bottomOpacity = damp(s.bottomOpacity, 1, 5, delta);
      s.finalGlobeScale = damp(s.finalGlobeScale, 1, 3, delta);
    }
    if (inS2) {
      const t2 = (scroll - s2Start) / (s2End - s2Start);
      s.camZ = damp(s.camZ, 6.2, 3, delta);
      s.topY = damp(s.topY, t2 * 2.2, 4, delta); s.bottomY = damp(s.bottomY, -t2 * 2.2, 4, delta);
      s.topOpacity = damp(s.topOpacity, 1 - t2 * 0.78, 4, delta); s.bottomOpacity = damp(s.bottomOpacity, 1 - t2 * 0.4, 4, delta);
      const slabTargets = [Math.max(0, (t2 - 0.25) / 0.75), Math.max(0, (t2 - 0.50) / 0.5), Math.max(0, (t2 - 0.75) / 0.25)];
      s.slabScale = s.slabScale.map((v, i) => damp(v, slabTargets[i], 6, delta));
      s.slabOpacity = s.slabOpacity.map((v, i) => damp(v, slabTargets[i], 6, delta));
    }
    if (inS3) {
      const t3 = (scroll - s3Start) / (s3End - s3Start);
      s.slabScale = s.slabScale.map(v => damp(v, 0, 8, delta)); s.slabOpacity = s.slabOpacity.map(v => damp(v, 0, 8, delta));
      s.topOpacity = damp(s.topOpacity, 0, 5, delta); s.bottomOpacity = damp(s.bottomOpacity, 0, 5, delta);
      const orbFinalY = [1.2, 1.2, 1.2, -0.8, -0.8, -0.8];
      s.orbsY = s.orbsY.map((v, i) => { const startT = (i / 6) * 0.5; const localT = Math.max(0, Math.min(1, (t3 - startT) / 0.5)); return damp(v, lerp(-4, orbFinalY[i], localT), 5, delta); });
      s.orbsOpacity = s.orbsOpacity.map((v, i) => { const startT = (i / 6) * 0.5; const localT = Math.max(0, Math.min(1, (t3 - startT) / 0.5)); return damp(v, localT, 5, delta); });
    }
    if (inS4) {
      const t4 = (scroll - s4Start) / (s4End - s4Start);
      s.orbsOpacity = s.orbsOpacity.map(v => damp(v, 0, 6, delta));
      s.pcbOpacity = damp(s.pcbOpacity, t4, 4, delta); s.pcbY = damp(s.pcbY, lerp(-3, -0.3, t4), 4, delta);
    }
    if (inS5) {
      const t5 = (scroll - s5Start) / (s5End - s5Start);
      s.pcbOpacity = damp(s.pcbOpacity, 0, 5, delta);
      hubMat.opacity = damp(hubMat.opacity, t5, 4, delta);
      s.cubeAngles = s.cubeAngles.map((angle, i) => { const snapT = i / 8; if (t5 < snapT) return angle + (0.004 + i * 0.0006) * delta * 60; return damp(angle, 0, 8, delta); });
      cubeMats.forEach((mat, i) => { const snapT = i / 8; mat.opacity = damp(mat.opacity, t5 > snapT * 0.5 ? 1 : 0, 5, delta); });
      s.hubScale = 1 + Math.min(t5, 1) * 0.3;
    }
    if (inS6) {
      const t6 = Math.min(1, (scroll - s6Start) / 0.10);
      hubMat.opacity = damp(hubMat.opacity, 0, 5, delta); cubeMats.forEach(mat => { mat.opacity = damp(mat.opacity, 0, 5, delta); });
      s.topY = damp(s.topY, 0, 5, delta); s.bottomY = damp(s.bottomY, 0, 5, delta);
      s.topOpacity = damp(s.topOpacity, 1, 5, delta); s.bottomOpacity = damp(s.bottomOpacity, 1, 5, delta);
      s.finalGlobeScale = damp(s.finalGlobeScale, 1.22, 3, delta);
      s.camZ = damp(s.camZ, lerp(6.2, 3.8, t6), 3, delta);
    }

    camera.position.z = s.camZ;

    if (nodesRef.current) {
      const dummy = new THREE.Object3D();
      nodePositions.forEach((pos, i) => { const scale = 1.0 + 0.18 * Math.sin(t * 0.8 + phaseOffsets[i]); dummy.position.set(...pos); dummy.scale.setScalar(scale); dummy.updateMatrix(); nodesRef.current.setMatrixAt(i, dummy.matrix); });
      nodesRef.current.instanceMatrix.needsUpdate = true;
    }
    if (globeRef.current) { globeRef.current.rotation.y += 0.0006; globeRef.current.scale.setScalar(s.globeScale * s.finalGlobeScale); }
    if (topHemiRef.current) { topHemiRef.current.position.y = s.topY; topHemiRef.current.rotation.y += 0.0006; topHemiRef.current.scale.setScalar(s.globeScale * s.finalGlobeScale); if (topLinesRef.current) topLinesRef.current.material.opacity = s.topOpacity * 0.25; }
    if (bottomHemiRef.current) { bottomHemiRef.current.position.y = s.bottomY; bottomHemiRef.current.rotation.y += 0.0006; bottomHemiRef.current.scale.setScalar(s.globeScale * s.finalGlobeScale); if (bottomLinesRef.current) bottomLinesRef.current.material.opacity = s.bottomOpacity * 0.25; }

    const slabFinalY = [0.8, 0, -0.8];
    slabRefs.forEach((ref, i) => { if (ref.current) { ref.current.scale.y = Math.max(0.001, s.slabScale[i]); ref.current.position.y = lerp(0, slabFinalY[i], s.slabScale[i]); slabMats[i].opacity = s.slabOpacity[i] * 0.9; } });
    const orbFinalX = [-1.6, 0, 1.6, -1.6, 0, 1.6];
    orbRefs.forEach((ref, i) => { if (ref.current) { const bob = Math.sin(t * (0.7 + i * 0.1) + i * 1.2) * 0.06; ref.current.position.set(orbFinalX[i], s.orbsY[i] + bob, 0); orbMats[i].opacity = s.orbsOpacity[i]; ref.current.scale.setScalar(s.orbsOpacity[i] > 0.01 ? 1 : 0); } });
    if (pcbRef.current) { pcbRef.current.position.y = s.pcbY; pcbMat.opacity = s.pcbOpacity * 0.85; pcbRef.current.rotation.x = -0.35; pcbRef.current.rotation.y = Math.sin(t * 0.3) * 0.04; }
    if (hubRef.current) { hubRef.current.scale.setScalar(s.hubScale); hubMat.emissiveIntensity = 0.5 + 0.4 * Math.sin(t * 1.2); }
    cubeRefs.forEach((ref, i) => { if (ref.current) { const angle = s.cubeAngles[i]; const radius = 1.0 + (i % 3) * 0.15; const yOff = -0.15 + (i % 5) * 0.1; ref.current.position.set(Math.cos(angle) * radius, yOff, Math.sin(angle) * radius); ref.current.rotation.y += 0.02 * delta * 60; } });
  });

  return (
    <>
      <directionalLight position={[3, 4, 2]} intensity={1.2} color="#B2DFD8" />
      <ambientLight intensity={0.3} color="#0F3D44" />
      <pointLight position={[-3, -2, 1]} intensity={0.4} color="#4A9E7A" />
      <group ref={globeRef}>
        <instancedMesh ref={nodesRef} args={[nodeGeo, nodeMat, nodeCount]} frustumCulled={false} />
      </group>
      <group ref={topHemiRef}><lineSegments ref={topLinesRef} geometry={topLineGeo} material={new THREE.LineBasicMaterial({ color: '#4DC9D8', transparent: true, opacity: 0.25 })} /></group>
      <group ref={bottomHemiRef}><lineSegments ref={bottomLinesRef} geometry={bottomLineGeo} material={new THREE.LineBasicMaterial({ color: '#4DC9D8', transparent: true, opacity: 0.25 })} /></group>
      {slabRefs.map((ref, i) => <mesh key={`slab-${i}`} ref={ref} geometry={slabGeo} material={slabMats[i]} scale={[1, 0.001, 1]} />)}
      {orbRefs.map((ref, i) => <mesh key={`orb-${i}`} ref={ref} geometry={orbGeo} material={orbMats[i]} />)}
      <mesh ref={pcbRef} geometry={pcbGeo} material={pcbMat} position={[0, -5, 0]} rotation={[-0.35, 0, 0]} />
      <mesh ref={hubRef} geometry={hubGeo} material={hubMat} />
      {cubeRefs.map((ref, i) => <mesh key={`cube-${i}`} ref={ref} geometry={cubeGeo} material={cubeMats[i]} />)}
    </>
  );
}

function AnimatedBackground() {
  const [isMobile, setIsMobile] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 768);
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  if (!mounted || reduceMotion) return <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: 'var(--color-background)' }} />;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} aria-hidden="true">
      <div style={{ position: 'absolute', inset: 0, filter: 'blur(9px)', transform: 'scale(1.06)' }}>
        <Canvas
          camera={{ fov: 60, position: [0, 0, 5] }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          dpr={[1, isMobile ? 1.4 : 2]}
          frameloop="always"
        >
          <GlobeScene isMobile={isMobile} />
        </Canvas>
      </div>
      {/* Subtle readability overlay above the animation, ~0.1 opacity */}
      <div style={{ position: 'absolute', inset: 0, background: 'var(--color-background)', opacity: 0.1 }} />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   SHARED HOOKS & SMALL UI ATOMS
   ════════════════════════════════════════════════════════════════════════ */

function useScrolled(threshold = 60) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [threshold]);
  return scrolled;
}

function CountUp({ target, suffix = '', duration = 1800 }) {
  const [value, setValue] = useState(0);
  const ref = useRef();
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const isDecimal = String(target).includes('.');
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = eased * target;
          setValue(isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{value}{suffix}</span>;
}

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored ? stored === 'dark' : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };
  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
      style={{ color: 'var(--color-text)' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-overlay)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {dark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}

function SectionHeader({ label, title, subtitle, align = 'center', aosType = 'fade-up' }) {
  return (
    <div className={align === 'center' ? 'text-center mb-14' : 'mb-14 max-w-2xl'} data-aos={aosType}>
      <span className="section-label">{label}</span>
      <h2 className="section-title mt-4 mb-4" style={{ whiteSpace: 'pre-line' }}>{title}</h2>
      {subtitle && <p className={align === 'center' ? 'max-w-2xl mx-auto text-base' : 'text-base'} style={{ color: 'var(--color-muted)' }}>{subtitle}</p>}
    </div>
  );
}

function Pill({ children }) {
  return <span className="pill">{children}</span>;
}

/* ════════════════════════════════════════════════════════════════════════
   NAVBAR
   ════════════════════════════════════════════════════════════════════════ */

const NAV_LINKS = [
  { href: '#craft', label: 'Craft' },
  { href: '#about', label: 'Who We Are' },
  { href: '#work', label: 'Work' },
  { href: '#process', label: 'Process' },
  { href: '#contact', label: 'Contact' },
];

function Logo({ light = false }) {
  return (
    <a href="#hero" className="flex items-center gap-2 font-bold text-xl" style={{ color: light ? '#EAF6F6' : 'var(--color-text)' }}>
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" stroke="var(--color-primary)" strokeWidth="2" />
        <path d="M8 16 L16 8 L24 16 L16 24 Z" stroke="var(--color-primary)" strokeWidth="1.5" fill="none" />
        <circle cx="16" cy="16" r="3" fill="var(--color-primary)" />
        <circle cx="16" cy="8" r="1.5" fill="var(--color-accent)" />
        <circle cx="24" cy="16" r="1.5" fill="var(--color-accent)" />
        <circle cx="16" cy="24" r="1.5" fill="var(--color-accent)" />
        <circle cx="8" cy="16" r="1.5" fill="var(--color-accent)" />
      </svg>
      <span>Nexus</span>
    </a>
  );
}

function Navbar() {
  const scrolled = useScrolled(60);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <header
        className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'var(--color-background)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 24px rgba(12,20,22,0.05)' : 'none',
        }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between" aria-label="Main navigation">
          <Logo />
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} className="text-sm font-medium transition-colors hover:text-[var(--color-primary)]" style={{ color: 'var(--color-muted)' }}>
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a href="#contact" className="hidden md:inline-flex btn-primary text-sm py-2.5 px-5">Start a project</a>
            <button className="md:hidden p-2 rounded-lg" style={{ color: 'var(--color-text)' }} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" aria-expanded={menuOpen}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      <div
        className="fixed inset-0 z-40 md:hidden transition-all duration-300"
        style={{ background: 'var(--color-background)', transform: menuOpen ? 'translateY(0)' : 'translateY(-100%)', opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? 'auto' : 'none' }}
      >
        <div className="flex flex-col items-center justify-center h-full gap-7">
          {NAV_LINKS.map(link => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>
              {link.label}
            </a>
          ))}
          <a href="#contact" onClick={() => setMenuOpen(false)} className="btn-primary mt-2">Start a project</a>
        </div>
      </div>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   HERO  (content + composition from land3 — sits over the global 3D scene)
   ════════════════════════════════════════════════════════════════════════ */

function Hero() {
  const heroPills = [
    { icon: Sparkles, label: '180+ products launched' },
    { icon: ShieldCheck, label: '99.99% uptime SLA' },
    { icon: Gauge, label: '<48hr first response' },
  ];

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden" aria-labelledby="hero-heading">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, var(--color-overlay) 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-4xl mx-auto text-center pt-24" data-aos="fade-up" data-aos-duration="900">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8" style={{ background: 'var(--color-overlay)', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }}>
          <Radio size={14} /> Now booking Q3 2026 engagements
        </div>

        <h1 id="hero-heading" className="font-bold mb-6" style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', lineHeight: 1.08 }}>
          <span style={{ color: 'var(--color-text)', display: 'block' }}>We build software that</span>
          <span className="shimmer-text">performs like magic.</span>
        </h1>

        <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto" style={{ color: 'var(--color-muted)', lineHeight: 1.8 }}>
          Nexus partners with ambitious teams to design, engineer, and ship products that scale —
          from first prototype to category leader.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <a href="#contact" className="btn-primary text-base px-8 py-4">
            Start a project <ArrowRight size={16} />
          </a>
          <a href="#work" className="btn-ghost text-base px-8 py-4">See our work</a>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {heroPills.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={i} className="glass px-5 py-3.5 rounded-2xl flex items-center gap-3" data-aos="zoom-in" data-aos-delay={i * 100 + 200}>
                <Icon size={18} style={{ color: 'var(--color-primary)' }} />
                <span className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{p.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-70" aria-hidden="true">
        <span className="text-xs font-medium tracking-widest uppercase" style={{ color: 'var(--color-muted)' }}>Scroll</span>
        <div className="w-5 h-8 rounded-full border-2 flex items-start justify-center p-1" style={{ borderColor: 'var(--color-muted)' }}>
          <div className="w-1 h-2 rounded-full" style={{ background: 'var(--color-primary)', animation: 'float 1.5s ease-in-out infinite' }} />
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   STATS BAR  (land1 — full-bleed primary panel with count-up figures)
   ════════════════════════════════════════════════════════════════════════ */

const STATS = [
  { value: 180, suffix: '+', label: 'Products shipped' },
  { value: 46, suffix: '', label: 'Engineers & designers' },
  { value: 96, suffix: '%', label: 'Client retention' },
  { value: 9, suffix: 'yrs', label: 'Building software' },
];

function StatsBar() {
  return (
    <section className="py-20 relative overflow-hidden section-solid" style={{ background: 'var(--color-primary)' }} aria-label="Company statistics">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {[...Array(18)].map((_, i) => (
          <div key={i} className="absolute rounded-full" style={{ width: `${4 + (i % 6) * 3}px`, height: `${4 + (i % 6) * 3}px`, background: 'rgba(255,255,255,0.12)', left: `${(i * 5.4) % 100}%`, top: `${(i * 7.1) % 100}%`, animation: `pulseDot ${2 + (i % 3)}s ease-in-out ${(i % 5) * 0.4}s infinite` }} />
        ))}
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <div key={i} className="text-center" data-aos="zoom-in" data-aos-delay={i * 100}>
              <div className="font-black mb-2 text-white tabular-nums" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1 }}>
                <CountUp target={s.value} suffix={s.suffix} />
              </div>
              <div className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.78)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   OUR CRAFT  (land1 — services grid with icon tiles + category tags)
   ════════════════════════════════════════════════════════════════════════ */

const CRAFT_ITEMS = [
  { icon: LayoutDashboard, category: 'Design', title: 'Product Design', desc: 'Interfaces that feel inevitable — research-led, pixel-precise, built to convert.' },
  { icon: Globe2, category: 'Engineering', title: 'Web Engineering', desc: 'Performant, resilient web platforms built on modern frameworks and clean architecture.' },
  { icon: Smartphone, category: 'Engineering', title: 'Mobile Apps', desc: 'Native-grade experiences for iOS and Android, shipped from a single codebase.' },
  { icon: Cloud, category: 'Infrastructure', title: 'Cloud Architecture', desc: 'Infrastructure that scales without drama, designed for cost and reliability.' },
  { icon: Bot, category: 'AI & Automation', title: 'AI & Automation', desc: 'Intelligent systems that take the busywork off your team\u2019s plate.' },
  { icon: ShieldCheck, category: 'Operations', title: 'DevOps & Security', desc: 'Ship fast without breaking trust — CI/CD, observability, and hardened pipelines.' },
];

function CraftSection() {
  return (
    <section id="craft" className="py-24 md:py-28 px-4 sm:px-6 lg:px-8 section-solid" aria-labelledby="craft-heading">
      <div className="max-w-7xl mx-auto">
        <SectionHeader label="Our Craft" title={'Capability,\nend to end.'} subtitle="From the first sketch to the production deploy — and everything that keeps it running." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CRAFT_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="group p-7 rounded-2xl card-base card-hover cursor-default" data-aos="fade-up" data-aos-delay={i * 80}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110" style={{ background: 'var(--color-highlight)', color: 'var(--color-primary)' }}>
                  <Icon size={22} />
                </div>
                <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3" style={{ background: 'var(--color-overlay)', color: 'var(--color-primary)' }}>
                  {item.category}
                </span>
                <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--color-text)' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-muted)' }}>{item.desc}</p>
                <a href="#contact" className="inline-flex items-center gap-1 text-sm font-semibold transition-all duration-200 group-hover:gap-2" style={{ color: 'var(--color-primary)' }}>
                  Explore <ArrowRight size={14} />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   WHO WE ARE  (land3 — two-column story with orbiting SVG diagram)
   ════════════════════════════════════════════════════════════════════════ */

function OrbitGraphic() {
  return (
    <div className="relative w-full aspect-square max-w-md mx-auto">
      <svg viewBox="0 0 400 400" className="w-full h-full">
        <defs>
          <radialGradient id="orbitGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="160" fill="url(#orbitGrad)" />
        <circle cx="200" cy="200" r="120" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="6 4" opacity="0.7">
          <animateTransform attributeName="transform" type="rotate" from="0 200 200" to="360 200 200" dur="22s" repeatCount="indefinite" />
        </circle>
        <circle cx="200" cy="200" r="80" stroke="var(--color-primary)" strokeWidth="1.5" strokeDasharray="4 8" opacity="0.45">
          <animateTransform attributeName="transform" type="rotate" from="360 200 200" to="0 200 200" dur="15s" repeatCount="indefinite" />
        </circle>
        {[0, 1, 2, 3, 4, 5].map(i => {
          const angle = (i / 6) * Math.PI * 2, r = 120;
          const x = 200 + r * Math.cos(angle), y = 200 + r * Math.sin(angle);
          return (
            <circle key={i} cx={x} cy={y} r="6" fill="var(--color-primary)" opacity="0.75">
              <animate attributeName="r" values="4;8;4" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
            </circle>
          );
        })}
        <circle cx="200" cy="200" r="24" fill="var(--color-primary)" opacity="0.9">
          <animate attributeName="r" values="20;28;20" dur="3s" repeatCount="indefinite" />
        </circle>
        {[0, 1, 2, 3, 4, 5].map(i => {
          const angle = (i / 6) * Math.PI * 2, r = 120;
          const x = 200 + r * Math.cos(angle), y = 200 + r * Math.sin(angle);
          return <line key={i} x1="200" y1="200" x2={x} y2={y} stroke="var(--color-primary)" strokeWidth="0.8" opacity="0.3" />;
        })}
      </svg>
    </div>
  );
}

function WhoWeAre() {
  return (
    <section id="about" className="py-24 md:py-28 px-4 sm:px-6 lg:px-8 section-translucent" aria-labelledby="about-heading">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div data-aos="fade-right">
            <span className="section-label">Who We Are</span>
            <h2 id="about-heading" className="section-title mt-4 mb-6">A studio obsessed with craft</h2>
            <p className="text-base mb-8 leading-relaxed" style={{ color: 'var(--color-muted)' }}>
              Founded by engineers who got tired of watching good ideas die in production, Nexus
              is a small, senior team that partners directly with founders and product leaders.
              We don\u2019t hand work off to a bench — the people who scope your project are the
              people who build it.
            </p>
            <div className="flex flex-wrap gap-3">
              <Pill>Remote-first</Pill>
              <Pill>Founder-led</Pill>
              <Pill>Long-term partners</Pill>
            </div>
          </div>
          <div data-aos="fade-left" data-aos-delay="150">
            <OrbitGraphic />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   ARCHITECTURE THAT BREATHES  (land2 — numbered tilt cards, re-skinned
   into land1's visual language: same radius, border, spacing, color tokens)
   ════════════════════════════════════════════════════════════════════════ */

const ARCHITECTURE_ITEMS = [
  { icon: Boxes, title: 'Composable by default', desc: 'Every system we build is made of small, swappable parts — so tomorrow\u2019s pivot doesn\u2019t mean a rewrite.' },
  { icon: Layers, title: 'Designed for scale', desc: 'Architecture decisions are load-tested before launch, not discovered the hard way at 2am.' },
  { icon: Lock, title: 'Secure at every layer', desc: 'Authentication, data handling, and infrastructure are hardened from day one, not bolted on later.' },
  { icon: Activity, title: 'Observability built-in', desc: 'Logs, traces, and alerts ship with the first release, so issues surface before customers notice.' },
  { icon: Workflow, title: 'Edge-first delivery', desc: 'Content and compute live close to your users, wherever in the world they are.' },
  { icon: GitBranch, title: 'Zero-downtime deploys', desc: 'Releases ship continuously, behind feature flags, with instant rollback if something\u2019s off.' },
];

function TiltCard({ children }) {
  const ref = useRef();
  const [t, setT] = useState({ x: 0, y: 0, gx: 50, gy: 50 });
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    setT({ x: (y - 0.5) * -8, y: (x - 0.5) * 8, gx: x * 100, gy: y * 100 });
  };
  const onLeave = () => setT({ x: 0, y: 0, gx: 50, gy: 50 });
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative h-full"
      style={{ transform: `perspective(900px) rotateX(${t.x}deg) rotateY(${t.y}deg)`, transition: t.x === 0 ? 'transform 0.6s cubic-bezier(0.16,1,0.3,1)' : 'transform 0.05s', transformStyle: 'preserve-3d' }}
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(circle at ${t.gx}% ${t.gy}%, var(--color-overlay) 0%, transparent 65%)` }} />
      {children}
    </div>
  );
}

function ArchitectureSection() {
  return (
    <section id="architecture" className="py-24 md:py-28 px-4 sm:px-6 lg:px-8 section-solid" aria-labelledby="architecture-heading">
      <div className="max-w-7xl mx-auto">
        <SectionHeader label="Architecture" title={'Architecture that\nbreathes.'} subtitle="Systems that flex under real traffic, real edge cases, and real growth — not just the demo." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ARCHITECTURE_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} data-aos="zoom-in" data-aos-delay={i * 70}>
                <TiltCard>
                  <div className="relative rounded-2xl p-8 h-full flex flex-col gap-4 overflow-hidden card-base card-hover">
                    <div className="absolute top-3 right-5 font-black select-none pointer-events-none" style={{ fontSize: '4.5rem', lineHeight: 1, color: 'var(--color-border)', opacity: 0.6 }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="relative z-10 inline-flex items-center justify-center w-11 h-11 rounded-xl" style={{ background: 'var(--color-highlight)', color: 'var(--color-primary)' }}>
                      <Icon size={19} />
                    </div>
                    <h3 className="relative z-10 font-semibold text-lg" style={{ color: 'var(--color-text)' }}>{item.title}</h3>
                    <p className="relative z-10 text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>{item.desc}</p>
                  </div>
                </TiltCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   OUR ARSENAL  (land2 tag-pill flavor + land1 marquee structure)
   ════════════════════════════════════════════════════════════════════════ */

const ARSENAL_GROUPS = [
  { label: 'Frontend', techs: [{ n: 'React', c: '#61DAFB' }, { n: 'Next.js', c: '#9CA3AF' }, { n: 'TypeScript', c: '#3178C6' }, { n: 'Tailwind CSS', c: '#06B6D4' }] },
  { label: 'Backend', techs: [{ n: 'Node.js', c: '#339933' }, { n: 'Go', c: '#00ADD8' }, { n: 'Python', c: '#3776AB' }, { n: 'GraphQL', c: '#E10098' }] },
  { label: 'Data', techs: [{ n: 'PostgreSQL', c: '#4169E1' }, { n: 'Redis', c: '#FF4438' }, { n: 'ClickHouse', c: '#FFCC01' }, { n: 'MongoDB', c: '#47A248' }] },
  { label: 'Platform', techs: [{ n: 'Kubernetes', c: '#326CE5' }, { n: 'Docker', c: '#2496ED' }, { n: 'Terraform', c: '#7B42BC' }, { n: 'AWS', c: '#FF9900' }] },
];

function ArsenalSection() {
  const allTechs = useMemo(() => ARSENAL_GROUPS.flatMap(g => g.techs), []);
  return (
    <section id="arsenal" className="py-24 md:py-28 section-translucent overflow-hidden" aria-labelledby="arsenal-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader label="Our Arsenal" title={'The tools behind\nthe craft.'} subtitle="A modern, battle-tested stack — chosen for fit, not fashion." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {ARSENAL_GROUPS.map((group, gi) => (
            <div key={group.label} data-aos="fade-up" data-aos-delay={gi * 90}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-primary)' }}>{group.label}</span>
                <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
              </div>
              <div className="flex flex-col gap-2.5">
                {group.techs.map(tech => (
                  <div key={tech.n} className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-sm font-medium" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: tech.c }} />
                    {tech.n}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, var(--color-background), transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, var(--color-background), transparent)' }} />
        <div className="overflow-hidden py-2">
          <div className="flex gap-3" style={{ animation: 'marquee 32s linear infinite', width: 'max-content' }}>
            {[...allTechs, ...allTechs].map((tech, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: tech.c }} />
                {tech.n}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   TRUST & CREDIBILITY  (additional conversion section — partner logos +
   trust badges; fills the "missing section" gap for social proof)
   ════════════════════════════════════════════════════════════════════════ */

const PARTNER_NAMES = ['MERIDIAN', 'VOLTA', 'ARCO', 'HELIX', 'CONDUIT', 'ORBIT', 'STRATUM', 'LUMEN'];
const TRUST_BADGES = [
  { icon: ShieldCheck, label: 'SOC 2 Type II certified' },
  { icon: Gauge, label: '99.99% uptime SLA' },
  { icon: Lock, label: 'GDPR & CCPA compliant' },
];

function TrustSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 section-solid" aria-label="Trusted by">
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-sm font-semibold uppercase tracking-widest mb-10" style={{ color: 'var(--color-muted)' }} data-aos="fade-up">
          Trusted by teams who move fast
        </p>
        <div className="relative overflow-hidden mb-12">
          <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, var(--color-background), transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, var(--color-background), transparent)' }} />
          <div className="flex" style={{ animation: 'marqueeReverse 26s linear infinite', width: 'max-content' }}>
            {[...PARTNER_NAMES, ...PARTNER_NAMES].map((name, i) => (
              <span key={i} className="font-bold text-2xl uppercase tracking-[0.25em] mx-10" style={{ color: 'var(--color-muted)', opacity: 0.55 }}>
                {name}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {TRUST_BADGES.map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={i} className="flex items-center gap-2.5 px-5 py-3 rounded-full" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }} data-aos="fade-up" data-aos-delay={i * 90}>
                <Icon size={16} style={{ color: 'var(--color-primary)' }} />
                <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{b.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   CASE STUDIES  (land1 — expandable cards with outcome stats)
   ════════════════════════════════════════════════════════════════════════ */

const CASE_STUDIES = [
  {
    client: 'Meridian Health', challenge: 'A claims pipeline built on a decade-old monolith was causing multi-day processing delays.',
    solution: 'We re-platformed the system as event-driven microservices on Kubernetes, with a real-time validation layer.',
    detail: 'The migration ran in parallel with the legacy system for six weeks with zero data loss, then cut over during a single low-traffic window. Engineering velocity on the new platform is roughly 3x the old monolith.',
    stats: [{ value: '92%', label: 'Faster processing' }, { value: '4.2M', label: 'Claims / month' }, { value: '99.98%', label: 'Uptime' }],
  },
  {
    client: 'Volta Energy', challenge: 'Telemetry from 12 different hardware vendors arrived in incompatible formats, with no unified view.',
    solution: 'We built a custom ingestion layer and real-time data platform that normalizes every feed at the edge.',
    detail: 'Field technicians now see live device health in under a second, and the data team ships new vendor integrations in days rather than months.',
    stats: [{ value: '3.1B', label: 'Events / day' }, { value: '60%', label: 'Cost reduction' }, { value: '<50ms', label: 'Ingest latency' }],
  },
  {
    client: 'Arco Retail', challenge: 'A slow, JavaScript-heavy mobile checkout was driving cart abandonment on every release.',
    solution: 'We rebuilt the commerce experience with edge-rendered pages and an optimistic, offline-first checkout flow.',
    detail: 'The new build ships critical content before the JS bundle finishes loading, and degrades gracefully on spotty mobile networks rather than failing outright.',
    stats: [{ value: '38%', label: 'Conversion lift' }, { value: '1.8s', label: 'Median load time' }, { value: '4.9★', label: 'App store rating' }],
  },
];

function CaseStudyCard({ item, index }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden card-base" data-aos="fade-up" data-aos-delay={index * 100}>
      <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))' }} />
      <div className="p-8">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full mb-4 inline-block" style={{ background: 'var(--color-overlay)', color: 'var(--color-primary)' }}>
          {item.client}
        </span>
        <h3 className="font-bold text-xl mb-2" style={{ color: 'var(--color-text)' }}>{item.challenge}</h3>
        <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--color-muted)' }}>{item.solution}</p>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {item.stats.map((stat, j) => (
            <div key={j} className="text-center">
              <div className="font-black text-2xl mb-1" style={{ color: 'var(--color-primary)' }}>{stat.value}</div>
              <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
        <button onClick={() => setExpanded(!expanded)} className="text-sm font-semibold flex items-center gap-1 transition-all duration-200 hover:gap-2" style={{ color: 'var(--color-primary)' }}>
          {expanded ? 'Close' : 'Read full case study'}
          <ChevronRight size={14} style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s' }} />
        </button>
        {expanded && (
          <p className="mt-6 pt-6 text-sm leading-relaxed" style={{ borderTop: '1px solid var(--color-border)', color: 'var(--color-muted)' }}>
            {item.detail}
          </p>
        )}
      </div>
    </div>
  );
}

function CaseStudiesSection() {
  return (
    <section id="work" className="py-24 md:py-28 px-4 sm:px-6 lg:px-8 section-translucent" aria-labelledby="case-studies-heading">
      <div className="max-w-7xl mx-auto">
        <SectionHeader label="Case Studies" title={'Outcomes,\nnot anecdotes.'} subtitle="A few of the engagements we can talk about publicly." />
        <div className="grid lg:grid-cols-3 gap-8">
          {CASE_STUDIES.map((item, i) => <CaseStudyCard key={i} item={item} index={i} />)}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   HOW WE WORK  (land1 — horizontal stepper with animated progress line)
   ════════════════════════════════════════════════════════════════════════ */

const PROCESS_STEPS = [
  { title: 'Discover', desc: 'We learn your users, constraints, and goals before opening an editor.' },
  { title: 'Define', desc: 'Scope, milestones, and success metrics get written down and agreed on.' },
  { title: 'Design', desc: 'Interfaces and system architecture take shape together, not in sequence.' },
  { title: 'Build', desc: 'Senior engineers ship in small, reviewable increments you can see weekly.' },
  { title: 'Launch', desc: 'We deploy, monitor, and stand by the release through real traffic.' },
  { title: 'Evolve', desc: 'Post-launch, we keep iterating based on what the data actually shows.' },
];

function ProcessSection() {
  const ref = useRef();
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) PROCESS_STEPS.forEach((_, i) => setTimeout(() => setActiveStep(i), i * 220));
    }, { threshold: 0.25 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="process" ref={ref} className="py-24 md:py-28 px-4 sm:px-6 lg:px-8 section-solid" aria-labelledby="process-heading">
      <div className="max-w-7xl mx-auto">
        <SectionHeader label="How We Work" title={'A process built\nfor momentum.'} subtitle="Six stages, repeated as needed — never a black box." />

        <div className="hidden md:block relative">
          <div className="absolute top-10 left-0 right-0 h-0.5 mx-16" style={{ background: 'var(--color-border)' }}>
            <div className="h-full transition-all duration-1000" style={{ background: 'var(--color-primary)', width: activeStep >= 0 ? `${((activeStep + 1) / PROCESS_STEPS.length) * 100}%` : '0%' }} />
          </div>
          <div className="grid grid-cols-6 gap-4">
            {PROCESS_STEPS.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center transition-all duration-500" style={{ opacity: activeStep >= i ? 1 : 0.4, transform: activeStep >= i ? 'translateY(0)' : 'translateY(8px)' }}>
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-black mb-4 relative z-10 transition-all duration-300" style={{ background: activeStep >= i ? 'var(--color-primary)' : 'var(--color-surface)', color: activeStep >= i ? '#fff' : 'var(--color-muted)', border: `2px solid ${activeStep >= i ? 'var(--color-primary)' : 'var(--color-border)'}`, boxShadow: activeStep >= i ? '0 0 0 4px var(--color-overlay)' : 'none' }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--color-text)' }}>{step.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-muted)' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="md:hidden space-y-6">
          {PROCESS_STEPS.map((step, i) => (
            <div key={i} className="flex gap-4 transition-all duration-500" style={{ opacity: activeStep >= i ? 1 : 0.4 }}>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0" style={{ background: activeStep >= i ? 'var(--color-primary)' : 'var(--color-surface)', color: activeStep >= i ? '#fff' : 'var(--color-muted)', border: `2px solid ${activeStep >= i ? 'var(--color-primary)' : 'var(--color-border)'}` }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                {i < PROCESS_STEPS.length - 1 && <div className="w-0.5 flex-1 mt-2" style={{ background: activeStep > i ? 'var(--color-primary)' : 'var(--color-border)', minHeight: '24px' }} />}
              </div>
              <div className="pb-6">
                <h3 className="font-bold mb-1" style={{ color: 'var(--color-text)' }}>{step.title}</h3>
                <p className="text-sm" style={{ color: 'var(--color-muted)' }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   OUR VISION  (land1's grid-pattern + radial-glow statement composition,
   carrying land2's "guiding pillars" idea — forced dark for contrast)
   ════════════════════════════════════════════════════════════════════════ */

const VISION_PILLARS = ['Craft over speed', 'Partnership over projects', 'Outcomes over output', 'Simplicity at scale'];

function VisionSection() {
  return (
    <section id="vision" className="relative py-32 md:py-40 px-4 sm:px-6 lg:px-8 overflow-hidden section-translucent" style={{ background: 'var(--color-ink)' }} aria-labelledby="vision-heading">
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#4DC9D8 1px, transparent 1px), linear-gradient(90deg, #4DC9D8 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(77,201,216,0.16) 0%, transparent 70%)' }} />
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 font-black select-none pointer-events-none"
        style={{ fontSize: '32vw', lineHeight: 1, color: 'rgba(77,201,216,0.04)' }}
        aria-hidden="true"
      >N</div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-6" style={{ background: 'rgba(77,201,216,0.12)', color: '#4DC9D8', border: '1px solid rgba(77,201,216,0.4)' }} data-aos="fade-up">
          Our Vision
        </span>
        <h2 id="vision-heading" className="font-bold mb-8 leading-tight" style={{ fontSize: 'clamp(1.9rem, 5vw, 3.4rem)', color: '#EAF6F6' }} data-aos="fade-up" data-aos-delay="100">
          We believe the best software disappears into the experience —
          invisible, fast, and exactly where you need it.
        </h2>
        <p className="text-base md:text-lg mb-10 max-w-xl mx-auto" style={{ color: 'rgba(234,246,246,0.6)' }} data-aos="fade-up" data-aos-delay="200">
          Founded in 2017, we\u2019ve grown from a two-person consultancy into a studio of 46
          engineers and designers who care about the details most teams skip. We work in
          long-term partnerships, not sprint-and-ship cycles.
        </p>
        <div className="flex flex-wrap justify-center gap-3" data-aos="fade-up" data-aos-delay="300">
          {VISION_PILLARS.map(p => (
            <span key={p} className="text-sm px-4 py-2 rounded-full border" style={{ color: 'rgba(77,201,216,0.85)', borderColor: 'rgba(77,201,216,0.3)' }}>
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   WHAT CLIENTS SAY  (layout/background from land1, testimonial card
   design — star rating, quote mark, avatar — from land3)
   ════════════════════════════════════════════════════════════════════════ */

const TESTIMONIALS = [
  { quote: 'Nexus shipped in eight weeks what our last vendor couldn\u2019t deliver in eight months. The code quality made our own team better.', name: 'Priya Anand', role: 'VP Engineering', company: 'Meridian Health' },
  { quote: 'They scope honestly and push back when something doesn\u2019t make sense — rare in an agency relationship.', name: 'Daniel Cho', role: 'CTO', company: 'Volta Energy' },
  { quote: 'Our checkout conversion jumped almost 40% after the rebuild. The team understood the business, not just the brief.', name: 'Sofia Marin', role: 'Head of Product', company: 'Arco Retail' },
  { quote: 'Two years in and they still treat our roadmap like their own. That\u2019s the partnership we were looking for.', name: 'Marcus Webb', role: 'Founder', company: 'Conduit Labs' },
  { quote: 'Clear communication, realistic timelines, and zero surprises at launch. Exactly what we needed for a regulated industry.', name: 'Elena Voss', role: 'Director of Engineering', company: 'Stratum Finance' },
];

function StarRow() {
  return (
    <div className="flex gap-0.5 mb-3" aria-hidden="true">
      {[...Array(5)].map((_, s) => <Star key={s} size={14} fill="var(--color-warning)" stroke="none" />)}
    </div>
  );
}

function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % TESTIMONIALS.length), 4500);
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <section id="testimonials" className="py-24 md:py-28 section-solid" aria-labelledby="testimonials-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader label="What Clients Say" title={'Trusted by the\nteams we serve.'} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, var(--color-background), transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, var(--color-background), transparent)' }} />
          <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(calc(-${current} * (100% / 3) - ${current} * 1.5rem / 3))` }}>
            {[...TESTIMONIALS, ...TESTIMONIALS].map((item, i) => (
              <div key={i} className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 px-3">
                <div className="p-6 rounded-2xl h-full card-base" data-aos="fade-up" data-aos-delay={(i % TESTIMONIALS.length) * 60}>
                  <StarRow />
                  <Quote size={22} style={{ color: 'var(--color-primary)', opacity: 0.35 }} className="mb-2" />
                  <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--color-text)' }}>{item.quote}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ background: 'var(--color-primary)', color: '#fff' }}>
                      {item.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{item.name}</div>
                      <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{item.role} \u00b7 {item.company}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center gap-2 mt-8">
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => { setCurrent(i); clearInterval(timerRef.current); }} className="rounded-full transition-all duration-300" style={{ width: current === i ? '24px' : '8px', height: '8px', background: current === i ? 'var(--color-primary)' : 'var(--color-border)' }} aria-label={`Go to testimonial ${i + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   FAQ  (land1 — searchable accordion + JSON-LD schema)
   ════════════════════════════════════════════════════════════════════════ */

const FAQ_ITEMS = [
  { q: 'How long does a typical engagement take?', a: 'Most product builds run 8–16 weeks from kickoff to launch, depending on scope. We\u2019ll give you a realistic estimate after a short discovery phase — not before.' },
  { q: 'Can you work with our existing tech stack?', a: 'Usually, yes. We assess what\u2019s worth keeping versus replacing, and we\u2019re comfortable in most modern stacks rather than insisting on our own.' },
  { q: 'How does pricing work?', a: 'Fixed-scope projects are quoted after discovery; ongoing partnerships run on a monthly retainer. Either way, you\u2019ll see the number before any work begins.' },
  { q: 'Do you offer support after launch?', a: 'Yes — every engagement includes a post-launch window, and most clients move into an ongoing maintenance or feature-development retainer afterward.' },
  { q: 'Who owns the code and IP?', a: 'You do, fully, from day one. We don\u2019t retain rights to anything we build for you.' },
  { q: 'How do you handle security and compliance?', a: 'Security review is part of our standard process, not an add-on. We\u2019ve shipped HIPAA, SOC 2, and GDPR-relevant systems and can work within your compliance requirements.' },
];

function Accordion({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="rounded-2xl overflow-hidden transition-all duration-200" style={{ border: `1px solid ${isOpen ? 'var(--color-primary)' : 'var(--color-border)'}`, background: 'var(--color-card)' }}>
            <button className="w-full px-6 py-5 flex items-center justify-between text-left gap-4" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}>
              <span className="font-semibold text-base" style={{ color: isOpen ? 'var(--color-primary)' : 'var(--color-text)' }}>{item.q}</span>
              <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full transition-all duration-300" style={{ background: isOpen ? 'var(--color-primary)' : 'var(--color-surface)', color: isOpen ? '#fff' : 'var(--color-muted)', transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                <ChevronDown size={14} />
              </span>
            </button>
            <div style={{ maxHeight: isOpen ? '400px' : '0px', overflow: 'hidden', transition: 'max-height 0.35s ease' }}>
              <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FAQSection() {
  const [query, setQuery] = useState('');
  const filtered = FAQ_ITEMS.filter(item => !query || item.q.toLowerCase().includes(query.toLowerCase()) || item.a.toLowerCase().includes(query.toLowerCase()));

  return (
    <section id="faq" className="py-24 md:py-28 px-4 sm:px-6 lg:px-8 section-translucent" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto">
        <SectionHeader label="FAQ" title={'Questions, answered\nhonestly.'} />
        <div className="mb-8" data-aos="fade-up" data-aos-delay="100">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-muted)' }} />
            <input type="text" placeholder="Search questions..." value={query} onChange={e => setQuery(e.target.value)} className="input-base" style={{ paddingLeft: '2.75rem' }} />
          </div>
        </div>
        <div data-aos="fade-up" data-aos-delay="200">
          {filtered.length > 0 ? <Accordion items={filtered} /> : <p className="text-center py-8" style={{ color: 'var(--color-muted)' }}>No matching questions — try another search term.</p>}
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ_ITEMS.map(item => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })) }) }} />
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <>
      <AnimatedBackground />
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <CraftSection />
        <WhoWeAre />
        <ArchitectureSection />
        <ArsenalSection />
        <TrustSection />
        <CaseStudiesSection />
        <ProcessSection />
        <VisionSection />
        <TestimonialsSection />
        <FAQSection />
      </main>
    </>
  );
}