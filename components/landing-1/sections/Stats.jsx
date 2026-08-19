'use client';

import { useEffect, useState } from 'react';
import { ParticlesCanvas } from '../canvases';
import { Reveal } from '../ui';
import { useCounter, useInView } from '../hooks';

function StatCard({ item, delay, inView }) {
  const value = useCounter(item.value, { start: inView, duration: 2000 });
  const [fill, setFill] = useState(0);
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    if (!inView) return undefined;
    const timer = setTimeout(() => setFill(100), delay);
    const bounceTimer = setTimeout(() => setBounce(true), delay + 1800);
    return () => {
      clearTimeout(timer);
      clearTimeout(bounceTimer);
    };
  }, [inView, delay]);

  return (
    <article className="l1-card p-6 text-center overflow-hidden">
      <div className={`text-4xl md:text-5xl font-black text-blue-400 tabular-nums mb-2 ${bounce ? 'l1-badge-pop' : ''}`}>
        {value}{item.suffix}
      </div>
      <h3 className="font-semibold mb-1">{item.label}</h3>
      <p className="text-sm text-slate-400">{item.desc}</p>
      <div className="mt-4 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-[2000ms] ease-out"
          style={{ width: `${fill}%` }}
        />
      </div>
    </article>
  );
}

export default function Stats({ copy }) {
  const [ref, inView] = useInView({ threshold: 0.25 });

  return (
    <section id="stats" ref={ref} className="l1-section l1-next-cover relative overflow-hidden">
      <ParticlesCanvas forming />
      <div className="l1-container relative">
        <Reveal inView={inView}>
          <div className="text-center mb-14">
            <h2 className="l1-title">{copy.stats.title}</h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {copy.stats.items.map((item, i) => (
            <Reveal key={item.label} inView={inView} delay={i * 200}>
              <StatCard item={item} delay={i * 200} inView={inView} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
