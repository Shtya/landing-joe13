'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import gsap from 'gsap';
import { enableLite } from '../perf';

/**
 * Fixed full-screen WebGL layer. three.js is loaded on demand so the slide
 * copy paints first; if WebGL is unavailable the CSS ambient background
 * (--ambient) carries the page on its own.
 */
const RibbonStage = forwardRef(function RibbonStage({ ids, index, light, mirror, reduced, onReady }, ref) {
  const hostRef = useRef(null);
  const apiRef = useRef(null);
  const indexRef = useRef(index);
  const introRef = useRef(false);
  const [ready, setReady] = useState(false);

  indexRef.current = index;
  const readyCb = useRef(onReady);
  readyCb.current = onReady;

  useImperativeHandle(ref, () => ({
    intro() {
      introRef.current = true;
      return apiRef.current?.intro();
    },
    setPaused(value) {
      apiRef.current?.setPaused(value);
    },
  }));

  useEffect(() => {
    let disposed = false;
    const host = hostRef.current;
    Promise.all([import('three'), import('./createRibbon')]).then(([THREE, mod]) => {
      if (disposed || !host) return;
      apiRef.current = mod.createRibbon(THREE, host, {
        ids,
        index: indexRef.current,
        mirror,
        light,
        reduced,
        gsap,
      });
      if (apiRef.current) {
        if (introRef.current) apiRef.current.intro();
        setReady(true);
      } else {
        // No hardware WebGL: the machine can't carry the effects either.
        enableLite('no-gpu');
      }
      readyCb.current?.(Boolean(apiRef.current));
    }).catch(() => readyCb.current?.(false));
    return () => {
      disposed = true;
      apiRef.current?.dispose();
      apiRef.current = null;
    };
    // mirror/reduced change the geometry and loop; rebuild for them only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mirror, reduced]);

  useEffect(() => {
    apiRef.current?.goTo(index);
  }, [index, ready]);

  useEffect(() => {
    apiRef.current?.setLight(light);
  }, [light, ready]);

  return <div ref={hostRef} className={`j13-canvas${ready ? ' is-ready' : ''}`} aria-hidden="true" />;
});

export default RibbonStage;
