'use client';

import { useState } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { DeviceCanvas } from '../canvases';
import { FakeImage, Reveal } from '../ui';
import { useCounter, useInView, useScrollFrames } from '../hooks';

const LAPTOP_FRAME_COUNT = 30;
const getLaptopFramePath = (n) => {
  const time = ((n - 1) * 0.1).toFixed(2);
  return `/frames-laptop-01/frame_${String(n).padStart(4, '0')}_${time}s.png`;
};

const ANALYTICS_FRAME_COUNT = 27;
const getAnalyticsFramePath = (n) => {
  const time = ((n - 1) * 0.3).toFixed(2);
  return `/frames-analytics/frame_${String(n).padStart(4, '0')}_${time}s.png`;
};

const MOBILE_FRAME_COUNT = 27;
const getMobileFramePath = (n) => {
  const time = ((n - 1) * 0.3).toFixed(2);
  return `/frames-mobile/frame_${String(n).padStart(4, '0')}_${time}s.png`;
};

function Stat({ item, start }) {
  const value = useCounter(item.value, { start, duration: 1600, decimals: item.decimals || 0 });
  return (
    <div>
      <div className="text-2xl font-black text-sky-300 tabular-nums">{value}{item.suffix}</div>
      <div className="text-xs text-slate-400 mt-1">{item.label}</div>
    </div>
  );
}

function ProjectCopy({ item, inView, alignRight }) {
  return (
    <Reveal inView={inView} variant={alignRight ? 'right' : 'left'} className={alignRight ? 'lg:order-2' : 'lg:order-1'}>
      <span className="l1-kicker">{item.client}</span>
      <h3 className="text-3xl font-bold mt-4 mb-4">{item.title}</h3>
      <p className="text-slate-300 mb-2"><strong>Challenge:</strong> {item.challenge}</p>
      <p className="text-slate-400 mb-5"><strong>Solution:</strong> {item.solution}</p>
      <ul className="space-y-2 mb-6">
        {item.results.map((result) => (
          <li key={result} className="flex items-center gap-2 text-sm text-slate-200">
            <Check size={16} className="text-emerald-400" /> {result}
          </li>
        ))}
      </ul>
      <div className="grid grid-cols-3 gap-4 mb-5">
        {item.stats.map((stat) => <Stat key={stat.label} item={stat} start={inView} />)}
      </div>
      <div className="flex flex-wrap gap-2">
        {item.stack.map((tech) => (
          <span key={tech} className="px-3 py-1 rounded-full text-xs border border-white/10 bg-white/5">{tech}</span>
        ))}
      </div>
    </Reveal>
  );
}

function FrameProject({
  item,
  inView,
  readStory,
  frameCount,
  getPath,
  chromaKey = false,
  containScale = 1,
  imageLeft = false,
  layer = 1,
}) {
  const {
    sectionRef,
    canvasRef,
    loadProgress,
    loaded,
  } = useScrollFrames({
    frameCount,
    getPath,
    sizeTo: 'parent',
    fit: 'contain',
    chromaKey,
    containScale,
    playUntil: 0.5,
  });

  return (
    <article
      ref={sectionRef}
      className="project-frame-scroll"
      style={{ '--layer': layer }}
    >
      <div className="project-frame-pin">
        <div className="grid lg:grid-cols-2 gap-10 items-center w-full">
          <ProjectCopy item={item} inView={inView} alignRight={imageLeft} />

          <div className={imageLeft ? 'lg:order-1' : 'lg:order-2'}>
            <div className="relative group">
              <div className="project-frame-stage">
                <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
                {!loaded && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 text-xs tracking-[0.2em] uppercase text-zinc-400">
                    {Math.round(loadProgress * 100)}%
                  </div>
                )}
              </div>
              <a
                href="#contact"
                className="absolute left-4 right-4 bottom-4 z-20 l1-btn l1-btn-primary text-sm opacity-0 translate-y-8 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100"
              >
                {readStory} <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function Project({ item, index, inView, readStory }) {
  const [hover, setHover] = useState(false);
  const imageLeft = index % 2 === 1;

  return (
    <article
      className="grid lg:grid-cols-2 gap-10 items-center"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Reveal inView={inView} variant={imageLeft ? 'left' : 'right'} className={imageLeft ? 'lg:order-1' : 'lg:order-2'} delay={80}>
        <div className="relative overflow-hidden rounded-2xl group">
          <div className="absolute inset-0 z-0">
            <DeviceCanvas />
          </div>
          <div className={`relative z-10 transition-transform duration-500 ${hover ? 'scale-105' : 'scale-100'}`}>
            <FakeImage
              label={item.title}
              width={600}
              height={400}
              accent={index === 1 ? '#10b981' : index === 2 ? '#8b5cf6' : '#1e40af'}
              variant="device"
            />
          </div>
          <a
            href="#contact"
            className={`absolute left-4 right-4 bottom-4 z-20 l1-btn l1-btn-primary text-sm transition-all duration-400 ${hover ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            {readStory} <ArrowUpRight size={14} />
          </a>
        </div>
      </Reveal>

      <ProjectCopy item={item} inView={inView} alignRight={imageLeft} />
    </article>
  );
}

export default function Projects({ copy }) {
  const [ref, inView] = useInView({ threshold: 0.12 });

  return (
    <section id="work" ref={ref} className="l1-section l1-work-section">
      <div className="l1-container">
        <Reveal inView={inView}>
            <div className="text-center mb-8">
            <span className="l1-kicker">{copy.projects.titleAlt}</span>
            <h2 className="l1-title">{copy.projects.title}</h2>
          </div>
        </Reveal>
        <div className="l1-project-stack">
          {copy.projects.items.map((item, i) => {
            if (i === 0) {
              return (
                <FrameProject
                  key={item.title}
                  item={item}
                  inView={inView}
                  readStory={copy.projects.readStory}
                  frameCount={LAPTOP_FRAME_COUNT}
                  getPath={getLaptopFramePath}
                  chromaKey
                  containScale={0.88}
                  layer={1}
                />
              );
            }

            if (i === 1) {
              return (
                <FrameProject
                  key={item.title}
                  item={item}
                  inView={inView}
                  readStory={copy.projects.readStory}
                  frameCount={ANALYTICS_FRAME_COUNT}
                  getPath={getAnalyticsFramePath}
                  chromaKey
                  imageLeft
                  layer={2}
                />
              );
            }

            if (i === 2) {
              return (
                <FrameProject
                  key={item.title}
                  item={item}
                  inView={inView}
                  readStory={copy.projects.readStory}
                  frameCount={MOBILE_FRAME_COUNT}
                  getPath={getMobileFramePath}
                  chromaKey
                  containScale={0.92}
                  layer={3}
                />
              );
            }

            return (
              <Project
                key={item.title}
                item={item}
                index={i}
                inView={inView}
                readStory={copy.projects.readStory}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
