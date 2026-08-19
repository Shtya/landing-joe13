'use client';

import { useState, useRef, useEffect } from 'react';

export default function Accordion({ items }) {
  const [open, setOpen] = useState(null);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          question={item.q}
          answer={item.a}
          isOpen={open === i}
          onToggle={() => setOpen(open === i ? null : i)}
        />
      ))}
    </div>
  );
}

function AccordionItem({ question, answer, isOpen, onToggle }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        border: `1px solid ${isOpen ? 'var(--color-primary)' : 'var(--color-border)'}`,
        background: 'var(--color-card)',
      }}
    >
      <button
        className="w-full px-6 py-5 flex items-center justify-between text-left gap-4"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span
          className="font-semibold text-base"
          style={{ color: isOpen ? 'var(--color-primary)' : 'var(--color-text)' }}
        >
          {question}
        </span>
        <span
          className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          style={{
            background: isOpen ? 'var(--color-primary)' : 'var(--color-surface)',
            color: isOpen ? '#fff' : 'var(--color-muted)',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      <div
        style={{
          height: `${height}px`,
          overflow: 'hidden',
          transition: 'height 0.3s ease',
        }}
      >
        <div
          ref={contentRef}
          className="px-6 pb-5 text-sm leading-relaxed"
          style={{ color: 'var(--color-muted)' }}
        >
          {answer}
        </div>
      </div>
    </div>
  );
}
