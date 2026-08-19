'use client';

import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import GlobeState1 from './GlobeState1';
import GlobeState2 from './GlobeState2';
import FeatureOrbs from './FeatureOrbs';
import CircuitBoard from './CircuitBoard';
import IntegrationHub from './IntegrationHub';
import GlobeReassemble from './GlobeReassemble';

function SceneLighting() {
  return (
    <>
      <directionalLight position={[3, 4, 2]} intensity={1.2} color="#B2DFD8" />
      <ambientLight intensity={0.3} color="#0F3D44" />
      <pointLight position={[-3, -2, 1]} intensity={0.4} color="#4A9E7A" />
    </>
  );
}

// Reads window scroll — no ScrollControls dependency
function CameraController({ scrollRef }) {
  const { camera } = useThree();
  const targetZ = useRef(5);

  useFrame((_, delta) => {
    const t = scrollRef.current;

    if (t < 0.22) {
      targetZ.current = 5 + (t * (6.2 - 5)) / 0.22;
    } else if (t >= 0.9) {
      const t2 = (t - 0.9) / 0.1;
      targetZ.current = 6.2 - t2 * (6.2 - 3.8);
    } else {
      targetZ.current = 6.2;
    }

    camera.position.z += (targetZ.current - camera.position.z) * 4 * delta;
    camera.rotation.x = -0.21;
  });

  return null;
}

// Builds a scroll-like object { offset } updated every frame so child
// components that read scroll.offset get the latest value without re-renders.
function AllScenes({ scrollRef }) {
  const scroll = useRef({ offset: 0 });

  useFrame(() => {
    scroll.current.offset = scrollRef.current;
  });

  return (
    <>
      <CameraController scrollRef={scrollRef} />
      <SceneLighting />
      <GlobeState1 scroll={scroll.current} />
      <GlobeState2 scroll={scroll.current} />
      <FeatureOrbs scroll={scroll.current} />
      <CircuitBoard scroll={scroll.current} />
      <IntegrationHub scroll={scroll.current} />
      <GlobeReassemble scroll={scroll.current} />
    </>
  );
}

export default function SceneManager() {
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  // Shared mutable ref — updated by window scroll, read every rAF by Three.js
  const scrollRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsMobile(mq.matches);
    setReducedMotion(rm.matches);

    const updateScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = max > 0 ? window.scrollY / max : 0;
    };

    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll(); // initialise on mount

    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  if (reducedMotion) return null;

  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      camera={{ fov: 60, position: [0, 0, 5], near: 0.1, far: 100 }}
      gl={{
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      dpr={[1, isMobile ? 1.5 : 2]}
      frameloop="always"
    >
      <color attach="background" args={['transparent']} />
      <Suspense fallback={null}>
        <AllScenes scrollRef={scrollRef} />
      </Suspense>
    </Canvas>
  );
}
