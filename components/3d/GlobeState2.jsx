'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { damp } from 'maath/easing';

const NODE_COUNT = 300;

function generateHemisphereNodes(count) {
  const top = [], bottom = [];
  for (let i = 0; i < count; i++) {
    const theta = Math.acos(1 - 2 * Math.random());
    const phi = 2 * Math.PI * Math.random();
    const r = 1.5;
    const x = r * Math.sin(theta) * Math.cos(phi);
    const y = r * Math.sin(theta) * Math.sin(phi);
    const z = r * Math.cos(theta);
    if (z >= 0) top.push(x, y, z);
    else bottom.push(x, y, z);
  }
  return { top, bottom };
}

function Slab({ position, label, visible }) {
  const ref = useRef();
  const scaleRef = useRef(0);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const targetScale = visible ? 1 : 0;
    scaleRef.current += (targetScale - scaleRef.current) * 5 * delta;
    ref.current.scale.y = Math.max(0.001, scaleRef.current);
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <boxGeometry args={[3.2, 0.12, 1.6]} />
        <meshPhysicalMaterial
          transmission={0.88}
          roughness={0.06}
          metalness={0.1}
          thickness={0.4}
          color={new THREE.Color('#2E6B74')}
          emissive={new THREE.Color('#4DC9D8')}
          emissiveIntensity={0.15}
          transparent
          opacity={0.85}
        />
      </mesh>
      {visible && scaleRef.current > 0.5 && (
        <Html center position={[0, 0.15, 0]}>
          <div style={{
            color: '#4DC9D8',
            fontSize: '13px',
            fontWeight: '600',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            textShadow: '0 0 20px rgba(77,201,216,0.8)',
            userSelect: 'none',
          }}>
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

export default function GlobeState2({ scroll }) {
  const topGroupRef = useRef();
  const bottomGroupRef = useRef();
  const topLinesRef = useRef();
  const bottomLinesRef = useRef();
  const groupRef = useRef();

  const { topGeo, bottomGeo } = useMemo(() => {
    const { top, bottom } = generateHemisphereNodes(NODE_COUNT);

    // Create connections for each hemisphere
    const makeGeo = (pts) => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      return geo;
    };

    // Add some connection lines
    const makeLines = (pts) => {
      const lines = [];
      const count = pts.length / 3;
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = pts[i * 3] - pts[j * 3];
          const dy = pts[i * 3 + 1] - pts[j * 3 + 1];
          const dz = pts[i * 3 + 2] - pts[j * 3 + 2];
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (d < 0.5 && lines.length < 600) {
            lines.push(pts[i * 3], pts[i * 3 + 1], pts[i * 3 + 2],
              pts[j * 3], pts[j * 3 + 1], pts[j * 3 + 2]);
          }
        }
      }
      const lg = new THREE.BufferGeometry();
      lg.setAttribute('position', new THREE.Float32BufferAttribute(lines, 3));
      return lg;
    };

    return {
      topGeo: makeLines(top),
      bottomGeo: makeLines(bottom),
      topPts: makeGeo(top),
      bottomPts: makeGeo(bottom),
    };
  }, []);

  const slabStates = useRef([false, false, false]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const t = scroll.offset;
    const inRange = t >= 0.22 && t < 0.48;
    const normalized = Math.max(0, Math.min(1, (t - 0.22) / (0.48 - 0.22)));

    // Visibility
    const visible = t >= 0.18 && t < 0.55;
    groupRef.current.visible = visible;
    if (!visible) return;

    // Fade in/out the whole group
    const fadeIn = t < 0.25 ? (t - 0.18) / 0.07 : 1;
    const fadeOut = t > 0.48 ? 1 - (t - 0.48) / 0.07 : 1;
    const alpha = Math.max(0, Math.min(1, fadeIn * fadeOut));

    if (topGroupRef.current) {
      damp(topGroupRef.current.position, 'y', normalized * 2.2, 4, delta);
      damp(topGroupRef.current.rotation, 'x', -normalized * 0.25, 4, delta);
      if (topLinesRef.current) {
        topLinesRef.current.material.opacity = (1 - normalized * 0.78) * alpha * 0.4;
      }
    }

    if (bottomGroupRef.current) {
      damp(bottomGroupRef.current.position, 'y', -normalized * 2.2, 4, delta);
      damp(bottomGroupRef.current.rotation, 'x', normalized * 0.25, 4, delta);
      if (bottomLinesRef.current) {
        bottomLinesRef.current.material.opacity = (1 - normalized * 0.5) * alpha * 0.4;
      }
    }

    // Slab appearances
    slabStates.current[0] = normalized > 0.25;
    slabStates.current[1] = normalized > 0.50;
    slabStates.current[2] = normalized > 0.75;
  });

  useEffect(() => {
    return () => {
      topGeo.dispose();
      bottomGeo.dispose();
    };
  }, [topGeo, bottomGeo]);

  return (
    <group ref={groupRef}>
      <group ref={topGroupRef}>
        <lineSegments ref={topLinesRef}>
          <primitive object={topGeo} attach="geometry" />
          <lineBasicMaterial color="#4DC9D8" transparent opacity={0.3} />
        </lineSegments>
      </group>
      <group ref={bottomGroupRef}>
        <lineSegments ref={bottomLinesRef}>
          <primitive object={bottomGeo} attach="geometry" />
          <lineBasicMaterial color="#4DC9D8" transparent opacity={0.3} />
        </lineSegments>
      </group>

      {/* Architecture Slabs */}
      <Slab position={[0, 0.7, 0]} label="Frontend" visible={slabStates.current[0]} />
      <Slab position={[0, 0, 0]} label="API Layer" visible={slabStates.current[1]} />
      <Slab position={[0, -0.7, 0]} label="Database" visible={slabStates.current[2]} />
    </group>
  );
}
