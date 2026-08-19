'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { damp } from 'maath/easing';

const NODE_COUNT = 500;
const MOBILE_NODE_COUNT = 200;
const CONNECTION_THRESHOLD = 0.45;

function generateGlobeNodes(count) {
  const positions = [];
  const phases = [];
  for (let i = 0; i < count; i++) {
    const theta = Math.acos(1 - 2 * Math.random());
    const phi = 2 * Math.PI * Math.random();
    const r = 1.5;
    positions.push(
      r * Math.sin(theta) * Math.cos(phi),
      r * Math.sin(theta) * Math.sin(phi),
      r * Math.cos(theta)
    );
    phases.push(Math.random() * Math.PI * 2);
  }
  return { positions, phases };
}

function generateConnections(positions, count, threshold) {
  const lines = [];
  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      const dx = positions[i * 3] - positions[j * 3];
      const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
      const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < threshold && lines.length < 2000) {
        lines.push(
          positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
          positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
        );
      }
    }
  }
  return lines;
}

export default function GlobeState1({ scroll }) {
  const globeRef = useRef();
  const nodesRef = useRef();
  const linesRef = useRef();
  const particlesRef = useRef();
  const isDark = useRef(true);
  const isMobile = useRef(false);

  useEffect(() => {
    isDark.current = document.documentElement.classList.contains('dark');
    isMobile.current = window.innerWidth < 768;
  }, []);

  const nodeCount = isMobile.current ? MOBILE_NODE_COUNT : NODE_COUNT;

  const { nodeGeo, lineGeo, particleGeo, phases } = useMemo(() => {
    const { positions, phases } = generateGlobeNodes(NODE_COUNT);
    const connections = generateConnections(positions, NODE_COUNT, CONNECTION_THRESHOLD);

    const nodeGeo = new THREE.SphereGeometry(0.018, 6, 6);

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(connections, 3));

    // Particles
    const particleCount = isMobile.current ? 200 : 800;
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 8;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));

    // Instance transforms for nodes
    const instanceGeo = new THREE.SphereGeometry(0.018, 6, 6);

    return { nodeGeo: instanceGeo, lineGeo, particleGeo, phases, rawPositions: positions };
  }, []);

  // Set up instanced mesh positions
  const instancedRef = useRef();
  const rawPositions = useMemo(() => {
    const { positions } = generateGlobeNodes(NODE_COUNT);
    return positions;
  }, []);

  useEffect(() => {
    if (!instancedRef.current) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < NODE_COUNT; i++) {
      dummy.position.set(rawPositions[i * 3], rawPositions[i * 3 + 1], rawPositions[i * 3 + 2]);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      instancedRef.current.setMatrixAt(i, dummy.matrix);
    }
    instancedRef.current.instanceMatrix.needsUpdate = true;
  }, [rawPositions]);

  useFrame((state, delta) => {
    if (!globeRef.current) return;

    const t = scroll.offset;
    const visible = t < 0.5;

    // Opacity/visibility
    const targetOpacity = t < 0.22 ? 1 - (t / 0.22) * 0.25 : Math.max(0, 1 - (t - 0.22) / 0.15);

    if (linesRef.current) {
      linesRef.current.material.opacity = targetOpacity * 0.3;
    }
    if (instancedRef.current) {
      instancedRef.current.material.opacity = targetOpacity;
      instancedRef.current.visible = targetOpacity > 0.01;
    }

    // Globe rotation
    globeRef.current.rotation.y += 0.0006 + (t < 0.22 ? t * 0.002 : 0);

    // Globe scale
    const targetScale = t < 0.22 ? 1.0 - (t / 0.22) * 0.08 : Math.max(0, 1 - (t - 0.22) / 0.15);
    globeRef.current.scale.setScalar(targetScale);

    // Node breathing
    if (instancedRef.current) {
      const dummy = new THREE.Object3D();
      for (let i = 0; i < NODE_COUNT; i++) {
        const phase = (i / NODE_COUNT) * Math.PI * 2;
        const breathe = 1.0 + 0.18 * Math.sin(state.clock.elapsedTime * 0.8 + phase);
        dummy.position.set(rawPositions[i * 3], rawPositions[i * 3 + 1], rawPositions[i * 3 + 2]);
        dummy.scale.setScalar(breathe);
        dummy.updateMatrix();
        instancedRef.current.setMatrixAt(i, dummy.matrix);
      }
      instancedRef.current.instanceMatrix.needsUpdate = true;
    }

    // Particles drift upward
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      const bounds = 4;
      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3 + 1] += 0.003;
        if (positions[i * 3 + 1] > bounds) {
          positions[i * 3 + 1] = -bounds;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.material.opacity = Math.min(targetOpacity * 0.4, 0.3);
    }
  });

  useEffect(() => {
    return () => {
      nodeGeo.dispose();
      lineGeo.dispose();
      particleGeo.dispose();
    };
  }, [nodeGeo, lineGeo, particleGeo]);

  const color = '#4DC9D8';

  return (
    <group ref={globeRef}>
      {/* Connection lines */}
      <lineSegments ref={linesRef}>
        <primitive object={lineGeo} attach="geometry" />
        <lineBasicMaterial color={color} transparent opacity={0.3} />
      </lineSegments>

      {/* Nodes as instanced mesh */}
      <instancedMesh ref={instancedRef} args={[nodeGeo, null, NODE_COUNT]} frustumCulled={false}>
        <meshBasicMaterial color={color} transparent opacity={1} />
      </instancedMesh>

      {/* Ambient particles */}
      <points ref={particlesRef}>
        <primitive object={particleGeo} attach="geometry" />
        <pointsMaterial color={color} size={0.015} transparent opacity={0.25} sizeAttenuation />
      </points>
    </group>
  );
}
