'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { damp } from 'maath/easing';

const NODE_COUNT = 400;

function generateNodes(count) {
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

function Particles({ triggerRef }) {
  const ref = useRef();
  const velocities = useRef([]);
  const lifetimes = useRef([]);
  const active = useRef(false);

  const count = 60;

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      velocities.current.push(
        Math.cos(angle) * (1.5 + Math.random()),
        (Math.random() - 0.3) * 0.5,
        Math.sin(angle) * (1.5 + Math.random())
      );
      lifetimes.current.push(0);
    }
    return g;
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;

    if (triggerRef.current && !active.current) {
      active.current = true;
      lifetimes.current.fill(1.2);
    }

    if (!active.current) return;

    const pos = ref.current.geometry.attributes.position.array;
    let anyAlive = false;

    for (let i = 0; i < count; i++) {
      lifetimes.current[i] = Math.max(0, lifetimes.current[i] - delta);
      if (lifetimes.current[i] > 0) {
        anyAlive = true;
        pos[i * 3] += velocities.current[i * 3] * delta;
        pos[i * 3 + 1] += velocities.current[i * 3 + 1] * delta - 0.3 * delta;
        pos[i * 3 + 2] += velocities.current[i * 3 + 2] * delta;
      }
    }

    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.material.opacity = lifetimes.current[0] / 1.2;

    if (!anyAlive) {
      active.current = false;
      triggerRef.current = false;
    }
  });

  useEffect(() => () => geo.dispose(), [geo]);

  return (
    <points ref={ref}>
      <primitive object={geo} attach="geometry" />
      <pointsMaterial color="#4DC9D8" size={0.04} transparent opacity={0} sizeAttenuation />
    </points>
  );
}

export default function GlobeReassemble({ scroll }) {
  const groupRef = useRef();
  const topRef = useRef();
  const bottomRef = useRef();
  const topLinesRef = useRef();
  const bottomLinesRef = useRef();
  const burstTrigger = useRef(false);
  const snapped = useRef(false);
  const rotSpeedRef = useRef(0.0006);

  const { topGeo, bottomGeo } = useMemo(() => {
    const { top, bottom } = generateNodes(NODE_COUNT);

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
    };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const scrollT = scroll.offset;
    const visible = scrollT >= 0.86;
    groupRef.current.visible = visible;
    if (!visible) return;

    const normalized = Math.max(0, Math.min(1, (scrollT - 0.90) / 0.10));

    // Hemispheres return
    if (topRef.current) {
      damp(topRef.current.position, 'y', (1 - normalized) * 2.2, 6, delta);
      damp(topRef.current.rotation, 'x', -(1 - normalized) * 0.25, 6, delta);
    }
    if (bottomRef.current) {
      damp(bottomRef.current.position, 'y', -(1 - normalized) * 2.2, 6, delta);
      damp(bottomRef.current.rotation, 'x', (1 - normalized) * 0.25, 6, delta);
    }

    // Snap trigger at t≈0.6
    if (normalized > 0.6 && !snapped.current) {
      snapped.current = true;
      burstTrigger.current = true;
    }

    // Post-snap effects
    const postSnap = snapped.current ? 1 : 0;
    const targetScale = 1 + postSnap * 0.22;
    groupRef.current.scale.x += (targetScale - groupRef.current.scale.x) * 3 * delta;
    groupRef.current.scale.y += (targetScale - groupRef.current.scale.y) * 3 * delta;
    groupRef.current.scale.z += (targetScale - groupRef.current.scale.z) * 3 * delta;

    // Faster rotation post-snap
    rotSpeedRef.current += ((snapped.current ? 0.0012 : 0.0006) - rotSpeedRef.current) * 2 * delta;
    groupRef.current.rotation.y += rotSpeedRef.current;

    // Opacity
    const alpha = Math.min(1, (scrollT - 0.86) / 0.06);
    if (topLinesRef.current) topLinesRef.current.material.opacity = alpha * 0.5;
    if (bottomLinesRef.current) bottomLinesRef.current.material.opacity = alpha * 0.5;
  });

  useEffect(() => {
    return () => {
      topGeo.dispose();
      bottomGeo.dispose();
    };
  }, [topGeo, bottomGeo]);

  return (
    <group ref={groupRef}>
      <group ref={topRef}>
        <lineSegments ref={topLinesRef}>
          <primitive object={topGeo} attach="geometry" />
          <lineBasicMaterial color="#4DC9D8" transparent opacity={0} />
        </lineSegments>
      </group>
      <group ref={bottomRef}>
        <lineSegments ref={bottomLinesRef}>
          <primitive object={bottomGeo} attach="geometry" />
          <lineBasicMaterial color="#4DC9D8" transparent opacity={0} />
        </lineSegments>
      </group>
      <Particles triggerRef={burstTrigger} />
    </group>
  );
}
