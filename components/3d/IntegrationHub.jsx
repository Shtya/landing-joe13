'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CUBES = [
  { color: '#4DC9D8', speed: 0.004, radius: 1.1, yOffset: 0.2 },
  { color: '#5DBF96', speed: 0.006, radius: 1.3, yOffset: -0.1 },
  { color: '#2E6B74', speed: 0.005, radius: 0.95, yOffset: 0.3 },
  { color: '#4A9E7A', speed: 0.009, radius: 1.45, yOffset: -0.3 },
  { color: '#B2DFD8', speed: 0.007, radius: 1.2, yOffset: 0 },
  { color: '#4DC9D8', speed: 0.004, radius: 1.0, yOffset: -0.2 },
  { color: '#5DBF96', speed: 0.008, radius: 1.35, yOffset: 0.15 },
  { color: '#2E6B74', speed: 0.005, radius: 1.15, yOffset: -0.15 },
];

export default function IntegrationHub({ scroll }) {
  const groupRef = useRef();
  const hubRef = useRef();
  const cubeRefs = useRef([]);
  const angles = useRef(CUBES.map((_, i) => (i / CUBES.length) * Math.PI * 2));
  const mergedCount = useRef(0);
  const tRef = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const scrollT = scroll.offset;
    const visible = scrollT >= 0.74 && scrollT < 0.94;
    groupRef.current.visible = visible;
    if (!visible) return;

    const normalized = Math.max(0, Math.min(1, (scrollT - 0.78) / (0.90 - 0.78)));
    tRef.current += (normalized - tRef.current) * 3 * delta;

    // Hub breathe
    if (hubRef.current) {
      const breathe = 0.5 + 0.4 * Math.sin(state.clock.elapsedTime * 1.5);
      hubRef.current.material.emissiveIntensity = breathe;
      const mergeScale = 1 + mergedCount.current * 0.04;
      hubRef.current.scale.setScalar(mergeScale);
    }

    let mc = 0;

    cubeRefs.current.forEach((ref, i) => {
      if (!ref) return;

      const snapT = i / CUBES.length;
      const merged = tRef.current > snapT;
      if (merged) mc++;

      if (merged) {
        // Snap to hub
        ref.position.x += (0 - ref.position.x) * 8 * delta;
        ref.position.y += (0 - ref.position.y) * 8 * delta;
        ref.position.z += (0 - ref.position.z) * 8 * delta;
        const targetS = Math.max(0, 1 - (tRef.current - snapT) * 4);
        ref.scale.setScalar(targetS);
      } else {
        // Orbit
        angles.current[i] += CUBES[i].speed;
        const cube = CUBES[i];
        ref.position.x = Math.cos(angles.current[i]) * cube.radius;
        ref.position.z = Math.sin(angles.current[i]) * cube.radius;
        ref.position.y = cube.yOffset + Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.1;
        ref.rotation.x += 0.01;
        ref.rotation.y += 0.008;
        ref.scale.setScalar(1);
      }
    });

    mergedCount.current = mc;
  });

  return (
    <group ref={groupRef}>
      {/* Hub sphere */}
      <mesh ref={hubRef}>
        <sphereGeometry args={[0.45, 64, 64]} />
        <meshPhysicalMaterial
          color="#1E4A52"
          emissive="#4DC9D8"
          emissiveIntensity={0.6}
          transmission={0.5}
          roughness={0.1}
          metalness={0.3}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Orbiting cubes */}
      {CUBES.map((cube, i) => (
        <mesh key={i} ref={el => cubeRefs.current[i] = el}>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial
            color={cube.color}
            emissive={cube.color}
            emissiveIntensity={0.3}
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}
