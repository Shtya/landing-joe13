'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function getHeroScrollDistancePx() {
  const w = window.innerWidth;
  const vh = w <= 800 ? 280 : w <= 900 ? 260 : 320;
  return (vh / 100) * window.innerHeight;
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}

export function usePageProgress(progressRef) {
  useEffect(() => {
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current = total > 0 ? window.scrollY / total : 0;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [progressRef]);
}

export function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const { threshold = 0.2, once = true, rootMargin = '0px' } = options;

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, once, rootMargin]);

  return [ref, inView];
}

export function useCounter(target, { duration = 2000, start = false, decimals = 0 } = {}) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!start) return undefined;

    const from = 0;
    const startedAt = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      const current = from + (target - from) * eased;
      setValue(decimals > 0 ? Number(current.toFixed(decimals)) : Math.floor(current));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, start, decimals]);

  return value;
}

export function useCanvasLoop(canvasRef, drawRef, { active = true, fillParent = true } = {}) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return undefined;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return undefined;

    let raf = 0;
    let running = true;

    const resize = () => {
      const parent = canvas.parentElement;
      const width = fillParent && parent ? parent.clientWidth : canvas.clientWidth;
      const height = fillParent && parent ? parent.clientHeight : canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const loop = (now) => {
      if (!running) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (drawRef.current) drawRef.current(ctx, width, height, now);
      raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [canvasRef, drawRef, active, fillParent]);
}

export function useParallax(strength = 0.25) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    let raf = 0;
    const update = () => {
      const rect = node.getBoundingClientRect();
      const viewH = window.innerHeight || 1;
      const offset = (rect.top + rect.height / 2 - viewH / 2) * strength;
      node.style.transform = `translate3d(0, ${offset}px, 0)`;
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, [strength]);

  return ref;
}

export function useSwipe(onSwipe, threshold = 40) {
  const startX = useRef(0);

  const onTouchStart = useCallback((e) => {
    startX.current = e.changedTouches[0].clientX;
  }, []);

  const onTouchEnd = useCallback((e) => {
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) < threshold) return;
    onSwipe(dx < 0 ? 1 : -1);
  }, [onSwipe, threshold]);

  return { onTouchStart, onTouchEnd };
}

function applyChromaKey(ctx, width, height) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    if (g <= 80 || g <= r + 24 || g <= b + 24) continue;

    const spill = Math.min(1, (g - Math.max(r, b)) / 72);
    pixels[i + 3] = Math.round(pixels[i + 3] * (1 - spill));
    if (pixels[i + 3] > 0) {
      pixels[i + 1] = Math.min(g, Math.max(r, b) + 10);
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

export function useScrollFrames({
  frameCount,
  getPath,
  cards = [],
  sizeTo = 'viewport',
  fit = 'cover',
  chromaKey = false,
  containScale = 1,
  playUntil = 1,
  progressMode = 'section',
  pinRef = null,
  pinMode = 'sticky',
}) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const progressFillRef = useRef(null);
  const framesRef = useRef([]);
  const tickingRef = useRef(false);
  const loadedRef = useRef(false);
  const lastFrameRef = useRef(-1);
  const prevVisibleIdsRef = useRef('');
  const onProgressRef = useRef(null);
  const seqReadoutRef = useRef(null);

  const [loadProgress, setLoadProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [visibleCards, setVisibleCards] = useState(() => new Set());

  useEffect(() => {
    let cancelled = false;
    let loadedCount = 0;
    const imgs = [];

    if (frameCount < 1) {
      loadedRef.current = true;
      setLoaded(true);
      setLoadProgress(1);
      return undefined;
    }

    for (let i = 1; i <= frameCount; i += 1) {
      const img = new Image();
      img.src = getPath(i);
      const mark = () => {
        if (cancelled) return;
        loadedCount += 1;
        setLoadProgress(loadedCount / frameCount);
        if (loadedCount === frameCount) {
          loadedRef.current = true;
          setLoaded(true);
        }
      };
      img.onload = mark;
      img.onerror = mark;
      imgs.push(img);
    }
    framesRef.current = imgs;

    return () => {
      cancelled = true;
    };
  }, [frameCount, getPath]);

  const drawFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    const img = framesRef.current[index];
    if (!canvas || !img || !img.complete || !img.naturalWidth) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = cw / ch;

    let drawW;
    let drawH;
    if (fit === 'contain') {
      if (canvasRatio > imgRatio) {
        drawH = ch;
        drawW = ch * imgRatio;
      } else {
        drawW = cw;
        drawH = cw / imgRatio;
      }
    } else if (canvasRatio > imgRatio) {
      drawW = cw;
      drawH = cw / imgRatio;
    } else {
      drawH = ch;
      drawW = ch * imgRatio;
    }

    if (fit === 'contain' && containScale !== 1) {
      drawW *= containScale;
      drawH *= containScale;
    }

    if (fit === 'cover' && window.innerWidth <= 768) {
      drawW *= 1.3;
      drawH *= 1.3;
    }

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - drawW) / 2, (ch - drawH) / 2, drawW, drawH);
    if (chromaKey) {
      try {
        applyChromaKey(ctx, cw, ch);
      } catch {
        /* same-origin frames only; skip keying if the canvas is tainted */
      }
    }
  }, [chromaKey, containScale, fit]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const parent = canvas.parentElement;
    const width = sizeTo === 'parent'
      ? Math.max(1, parent?.clientWidth || 0)
      : window.innerWidth;
    const height = sizeTo === 'parent'
      ? Math.max(1, parent?.clientHeight || 0)
      : window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    drawFrame(lastFrameRef.current >= 0 ? lastFrameRef.current : 0);
  }, [drawFrame, sizeTo]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    const parent = canvasRef.current?.parentElement;
    const observer = sizeTo === 'parent' && parent
      ? new ResizeObserver(resizeCanvas)
      : null;
    observer?.observe(parent);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      observer?.disconnect();
    };
  }, [resizeCanvas, sizeTo]);

  const applyProgress = useCallback((rawProgress) => {
    if (!loadedRef.current) return;

    const progress = playUntil > 0 && playUntil < 1
      ? Math.min(1, rawProgress / playUntil)
      : Math.min(1, Math.max(0, rawProgress));

    const nextFrame = Math.min(frameCount - 1, Math.floor(progress * frameCount));
    if (nextFrame !== lastFrameRef.current) {
      lastFrameRef.current = nextFrame;
      drawFrame(nextFrame);
    }

    if (seqReadoutRef.current) {
      seqReadoutRef.current.textContent = `SEQ ${String(nextFrame + 1).padStart(3, '0')} / ${frameCount}`;
    }

    if (progressFillRef.current) {
      progressFillRef.current.style.transform = `scaleX(${progress})`;
    }

    if (onProgressRef.current) onProgressRef.current(progress);

    const nextVisible = new Set();
    cards.forEach((card) => {
      if (progress >= card.show && progress <= card.hide) nextVisible.add(card.id);
    });
    const ids = [...nextVisible].sort().join(',');
    if (ids !== prevVisibleIdsRef.current) {
      prevVisibleIdsRef.current = ids;
      setVisibleCards(nextVisible);
    }
  }, [cards, drawFrame, frameCount, playUntil]);

  useEffect(() => {
    if (!loaded) return;
    drawFrame(0);
    lastFrameRef.current = 0;

    if (pinMode === 'scrollTrigger') {
      ScrollTrigger.refresh(true);
      const section = sectionRef.current;
      const heroTrigger = ScrollTrigger.getAll().find((trigger) => trigger.trigger === section);
      if (heroTrigger) applyProgress(heroTrigger.progress);
    }
  }, [loaded, drawFrame, applyProgress, pinMode]);

  useEffect(() => {
    if (pinMode === 'scrollTrigger') {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });

      const section = sectionRef.current;
      const pin = pinRef?.current || canvasRef.current?.parentElement;
      if (!section || !pin) return undefined;

      section.classList.add('is-hero-scroll-pinned');

      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: () => `+=${getHeroScrollDistancePx()}`,
          pin,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          onUpdate: (self) => applyProgress(self.progress),
        });
      }, section);

      const refresh = () => {
        ScrollTrigger.refresh(true);
      };
      requestAnimationFrame(refresh);
      window.addEventListener('resize', refresh);
      window.addEventListener('load', refresh);

      return () => {
        window.removeEventListener('resize', refresh);
        window.removeEventListener('load', refresh);
        section.classList.remove('is-hero-scroll-pinned');
        ctx.revert();
      };
    }

    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        tickingRef.current = false;
        const section = sectionRef.current;
        if (!section || !loadedRef.current) return;

        const rect = section.getBoundingClientRect();
        const scrollable = section.offsetHeight - window.innerHeight;
        const raw = progressMode === 'travel'
          ? Math.min(1, Math.max(0, -rect.top / Math.max(1, section.offsetHeight)))
          : scrollable <= 0
            ? 0
            : Math.min(1, Math.max(0, -rect.top / scrollable));

        applyProgress(raw);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [applyProgress, pinMode, pinRef, progressMode]);

  return {
    sectionRef,
    canvasRef,
    progressFillRef,
    onProgressRef,
    seqReadoutRef,
    loadProgress,
    loaded,
    visibleCards,
  };
}
