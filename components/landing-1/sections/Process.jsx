'use client';

import { useEffect, useRef } from 'react';
import { CircleCheck, CodeXml, Headphones, PenTool, Rocket, Search } from 'lucide-react';
import { Reveal } from '../ui';
import { useInView } from '../hooks';

const ICONS = [Search, PenTool, CodeXml, CircleCheck, Rocket, Headphones];

export default function Process({ copy }) {
  const [ref, inView] = useInView({ threshold: 0.15 });
  const pathRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path || !inView) return;
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    requestAnimationFrame(() => {
      path.style.transition = 'stroke-dashoffset 1.8s ease-out';
      path.style.strokeDashoffset = '0';
    });
  }, [inView]);

  return (
    <section id="process" ref={ref} className="l1-section">
      <div className="l1-container">
        <Reveal inView={inView}>
          <div className="text-center mb-16">
            <span className="l1-kicker">{copy.process.titleAlt}</span>
            <h2 className="l1-title">{copy.process.title}</h2>
          </div>
        </Reveal>

        <div className="hidden lg:block relative mb-10">
          <svg className="absolute top-8 left-8 right-8 h-2 w-[calc(100%-4rem)]" viewBox="0 0 1000 8" preserveAspectRatio="none" aria-hidden="true">
            <path ref={pathRef} d="M0 4 H1000" stroke="#3b82f6" strokeWidth="3" fill="none" />
          </svg>
          <div className="grid grid-cols-6 gap-4">
            {copy.process.phases.map((phase, i) => {
              const Icon = ICONS[i];
              return (
                <Reveal key={phase.title} inView={inView} delay={i * 140} className="text-center">
                  <div className="relative z-10 mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-blue-400/40 bg-[#0c1224] text-cyan-300">
                    <Icon size={22} />
                  </div>
                  <div className="text-[11px] uppercase tracking-widest text-cyan-400 mb-1">{phase.duration}</div>
                  <h3 className="font-semibold text-sm mb-2">{phase.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{phase.desc}</p>
                </Reveal>
              );
            })}
          </div>
        </div>

        <div className="lg:hidden space-y-6">
          {copy.process.phases.map((phase, i) => {
            const Icon = ICONS[i];
            return (
              <Reveal key={phase.title} inView={inView} variant={i % 2 ? 'right' : 'left'} delay={i * 80}>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center border border-blue-400/40 text-cyan-300">
                      <Icon size={18} />
                    </div>
                    {i < copy.process.phases.length - 1 && <div className="w-px flex-1 bg-blue-500/30 mt-2" />}
                  </div>
                  <div className="l1-card p-5 flex-1">
                    <div className="text-[11px] uppercase tracking-widest text-cyan-400 mb-1">{phase.duration}</div>
                    <h3 className="font-semibold mb-2">{phase.title}</h3>
                    <p className="text-sm text-slate-400 mb-3">{phase.desc}</p>
                    <ul className="text-sm text-slate-300 space-y-1">
                      {phase.points.map((point) => <li key={point}>• {point}</li>)}
                    </ul>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
