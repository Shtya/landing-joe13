'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { damp } from 'maath/easing';

const ORBS = [
  { color: '#4DC9D8', finalPos: [-1.2, 0.6, 0] },
  { color: '#5DBF96', finalPos: [0, 0.6, 0] },
  { color: '#2E6B74', finalPos: [1.2, 0.6, 0] },
  { color: '#4A9E7A', finalPos: [-1.2, -0.6, 0] },
  { color: '#B2DFD8', finalPos: [0, -0.6, 0] },
  { color: '#4DC9D8', finalPos: [1.2, -0.6, 0] },
];

function Orb({ color, finalPos, t, index }) {
  const ref = useRef();
  const ringRef = useRef();
  const ringScale = useRef(1);
  const ringOpacity = useRef(0);

  useFrame((state, delta) => {
    if (!ref.current) return;

    const startT = index / ORBS.length;
    const localT = Math.max(0, Math.min(1, (t - startT * 0.5) / 0.5));

    // Rise from below
    const startY = finalPos[1] - 3;
    ref.current.position.x = finalPos[0];
    ref.current.position.z = finalPos[2];
    ref.current.position.y += ((finalPos[1] - 3 + localT * 3) - ref.current.position.y) * 8 * delta;

    // Scale
    ref.current.scale.setScalar(localT);

    // Bob
    ref.current.position.y += Math.sin(state.clock.elapsedTime * 0.8 + index * 1.2) * 0.02;

    // Ring pulse
    if (ringRef.current) {
      ringScale.current += 3 * delta;
      if (ringScale.current > 3) {
        ringScale.current = 1;
        ringOpacity.current = 0.6;
      }
      ringOpacity.current = Math.max(0, ringOpacity.current - delta * 0.8);
      ringRef.current.scale.setScalar(ringScale.current);
      ringRef.current.material.opacity = ringOpacity.current * localT;
    }
  });

  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>
      <mesh ref={ringRef} position={finalPos} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.12, 0.15, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default function FeatureOrbs({ scroll }) {
  const groupRef = useRef();
  const tRef = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const scrollT = scroll.offset;
    const visible = scrollT >= 0.44 && scrollT < 0.66;
    groupRef.current.visible = visible;
    if (!visible) return;

    const normalized = Math.max(0, Math.min(1, (scrollT - 0.48) / (0.62 - 0.48)));
    tRef.current += (normalized - tRef.current) * 4 * delta;
  });

  return (
    <group ref={groupRef}>
      {ORBS.map((orb, i) => (
        <Orb
          key={i}
          color={orb.color}
          finalPos={orb.finalPos}
          t={tRef.current}
          index={i}
        />
      ))}
    </group>
  );
}
