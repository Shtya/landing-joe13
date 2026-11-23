'use client';

import { useEffect, useState } from 'react';

/*
 * Support badge, shown only with ?j13debug in the URL. Ask someone whose
 * animations look wrong to open /en?j13debug and send a screenshot: it shows
 * the switches that change how the page animates on their machine.
 */
function webglInfo() {
  try {
    const c = document.createElement('canvas');
    const strict = c.getContext('webgl2', { failIfMajorPerformanceCaveat: true }) || c.getContext('webgl', { failIfMajorPerformanceCaveat: true });
    const any = strict || document.createElement('canvas').getContext('webgl');
    if (!any) return 'none (WebGL disabled)';
    const ext = any.getExtension('WEBGL_debug_renderer_info');
    const name = ext ? any.getParameter(ext.UNMASKED_RENDERER_WEBGL) : 'unknown';
    return `${strict ? 'hardware' : 'SOFTWARE'} · ${name}`;
  } catch {
    return 'error';
  }
}

export default function Diagnostics() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    let on = false;
    try {
      on = new URLSearchParams(window.location.search).has('j13debug');
    } catch {}
    if (!on) return undefined;
    const read = () =>
      setInfo({
        'Reduced motion (Windows "Show animations" off)': window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'ON → lighter motion' : 'off',
        'Lite mode': document.documentElement.dataset.lite || 'off',
        WebGL: webglInfo(),
        'Save-Data': navigator.connection?.saveData ? 'on' : 'off',
        'Pixel ratio': window.devicePixelRatio,
        Viewport: `${window.innerWidth}×${window.innerHeight}`,
        Browser: navigator.userAgent.replace(/^Mozilla\/5\.0 /, ''),
      });
    read();
    const t = window.setInterval(read, 2000);
    return () => window.clearInterval(t);
  }, []);

  if (!info) return null;
  return (
    <aside className="j13-diag" dir="ltr" aria-label="Diagnostics">
      {Object.entries(info).map(([k, v]) => (
        <p key={k}>
          <b>{k}:</b> {String(v)}
        </p>
      ))}
    </aside>
  );
}
