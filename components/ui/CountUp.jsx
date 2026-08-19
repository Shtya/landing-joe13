'use client';

import { useEffect, useRef, useState } from 'react';

export default function CountUp({ end, suffix = '', duration = 2000, start = false }) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!start) return;

    const startTime = performance.now();
    const isDecimal = String(end).includes('.');

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * end;

      setValue(isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [end, duration, start]);

  return (
    <span>
      {value}{suffix}
    </span>
  );
}
