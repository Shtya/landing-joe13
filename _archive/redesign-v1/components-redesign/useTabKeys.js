'use client';

import { useCallback } from 'react';

/**
 * Roving-tabindex keyboard support for a tablist (WAI-ARIA tabs pattern).
 * Arrow keys move selection and focus; Home/End jump to the ends.
 * The slide engine ignores key events that start inside [role="tablist"].
 */
export function useTabKeys(count, active, setActive, orientation = 'horizontal') {
  return useCallback(
    (e) => {
      const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
      const prevKeys = orientation === 'vertical' ? ['ArrowUp'] : [rtl ? 'ArrowRight' : 'ArrowLeft'];
      const nextKeys = orientation === 'vertical' ? ['ArrowDown'] : [rtl ? 'ArrowLeft' : 'ArrowRight'];
      let next = null;
      if (nextKeys.includes(e.key)) next = (active + 1) % count;
      else if (prevKeys.includes(e.key)) next = (active - 1 + count) % count;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = count - 1;
      if (next === null) return;
      e.preventDefault();
      setActive(next);
      const tabs = e.currentTarget.querySelectorAll('[role="tab"]');
      tabs[next]?.focus();
    },
    [active, count, orientation, setActive],
  );
}
