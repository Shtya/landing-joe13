'use client';

import { useEffect, useRef, useState } from 'react';

export function useInView(options = {}) {
  const { threshold = 0.18, once = true } = options;
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold]);

  return [ref, inView];
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return reduced;
}

export function useActiveSection(ids, offset = 140) {
  const [active, setActive] = useState(ids[0] || '');

  useEffect(() => {
    const onScroll = () => {
      let current = ids[0] || '';
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (el.getBoundingClientRect().top <= offset) current = id;
      });
      setActive(current);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [ids.join('|'), offset]);

  return active;
}
