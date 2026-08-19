'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const TRACES = [
  { points: [[-1.8, 0.8, 0.01], [0, 0.8, 0.01], [0, 0, 0.01]] },
  { points: [[0, 0, 0.01], [0, -0.8, 0.01], [1.8, -0.8, 0.01]] },
  { points: [[-1.8, 0, 0.01], [1.8, 0, 0.01]] },
  { points: [[-0.6, 0.8, 0.01], [-0.6, -0.8, 0.01]] },
  { points: [[0.6, 0.8, 0.01], [0.6, -0.8, 0.01]] },
  { points: [[-1.8, -0.4, 0.01], [-0.6, -0.4, 0.01], [-0.6, 0, 0.01]] },
  { points: [[0.6, 0.4, 0.01], [1.8, 0.4, 0.01]] },
  { points: [[-1.2, 0.8, 0.01], [-1.2, 0, 0.01], [0, 0, 0.01]] },
  { points: [[1.2, -0.8, 0.01], [1.2, 0, 0.01]] },
  { points: [[-0.6, 0, 0.01], [0.6, 0, 0.01]] },
];

const NODES = [
  { pos: [0, 0, 0.02], stat: '99.99%', label: 'Uptime' },
  { pos: [-0.6, 0.8, 0.02], stat: '< 10ms', label: 'Latency' },
  { pos: [0.6, -0.8, 0.02], stat: '2M+', label: 'Req/day' },
];

function TraceGeo({ points }) {
  const geo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      points.map(p => new THREE.Vector3(...p))
    );
    const g = new THREE.TubeGeometry(curve, 20, 0.008, 4, false);
    return g;
  }, []);

  useEffect(() => () => geo.dispose(), [geo]);
  return <primitive object={geo} attach="geometry" />;
}

export default function CircuitBoard({ scroll }) {
  const groupRef = useRef();
  const boardRef = useRef();
  const traceRefs = useRef([]);
  const nodeRefs = useRef([]);
  const traceLights = useRef(TRACES.map(() => 0));

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const scrollT = scroll.offset;
    const visible = scrollT >= 0.58 && scrollT < 0.82;
    groupRef.current.visible = visible;
    if (!visible) return;

    const normalized = Math.max(0, Math.min(1, (scrollT - 0.62) / (0.78 - 0.62)));

    // Board wobble
    if (boardRef.current) {
      boardRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.04;

      // Fade in
      const alpha = Math.min(1, normalized * 3);
      boardRef.current.material.opacity = alpha * 0.9;
    }

    // Light up traces sequentially
    traceRefs.current.forEach((ref, i) => {
      if (!ref) return;
      const threshold = i / TRACES.length;
      const target = normalized > threshold ? 1 : 0;
      traceLights.current[i] += (target - traceLights.current[i]) * 5 * delta;
      ref.material.opacity = traceLights.current[i];
      ref.material.emissiveIntensity = traceLights.current[i] * 0.8;
    });

    // Node flashes
    nodeRefs.current.forEach((ref, i) => {
      if (!ref) return;
      const threshold = (i + 1) / (NODES.length + 1);
      const active = normalized > threshold;
      const targetScale = active ? 1 + 0.3 * Math.sin(state.clock.elapsedTime * 3 + i) : 0;
      ref.scale.setScalar(Math.max(0, ref.scale.x + (targetScale - ref.scale.x) * 6 * delta));
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, -0.5]} rotation={[-0.35, 0, 0]}>
      {/* Board */}
      <mesh ref={boardRef}>
        <planeGeometry args={[4.5, 2.8]} />
        <meshStandardMaterial
          color="#0A1F1C"
          roughness={0.8}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Traces */}
      {TRACES.map((trace, i) => (
        <mesh
          key={i}
          ref={el => traceRefs.current[i] = el}
        >
          <TraceGeo points={trace.points} />
          <meshStandardMaterial
            color="#4DC9D8"
            emissive="#4DC9D8"
            emissiveIntensity={0}
            transparent
            opacity={0}
          />
        </mesh>
      ))}

      {/* Nodes */}
      {NODES.map((node, i) => (
        <group key={i} position={node.pos}>
          <mesh ref={el => nodeRefs.current[i] = el} scale={0}>
            <cylinderGeometry args={[0.06, 0.06, 0.03, 16]} />
            <meshStandardMaterial
              color="#4DC9D8"
              emissive="#4DC9D8"
              emissiveIntensity={0.6}
            />
          </mesh>
          <Html center position={[0, 0.15, 0]}>
            <div style={{
              textAlign: 'center',
              color: '#4DC9D8',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '11px',
              fontWeight: '700',
              whiteSpace: 'nowrap',
              textShadow: '0 0 10px rgba(77,201,216,0.8)',
              userSelect: 'none',
            }}>
              <div style={{ fontSize: '14px' }}>{node.stat}</div>
              <div style={{ opacity: 0.7, fontSize: '9px' }}>{node.label}</div>
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}
