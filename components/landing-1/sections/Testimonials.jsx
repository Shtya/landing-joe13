'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star } from 'lucide-react';
import { usePrefersReducedMotion } from '../hooks';

const PIN_GAP = 10;
const CARD_FADE = 88;

function initials(value = '') {
  const parts = String(value)
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return 'N';
  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function ReviewCard({ item, index, cta, href }) {
  const tone = index % 3 === 1 ? 'orange' : 'purple';

  return (
    <article className="l1-reviews-card" data-review-card>
      <div className="l1-reviews-card-face">
        <div className="l1-reviews-product">
          <span className={`l1-reviews-logo is-${tone}`} aria-hidden>
            {initials(item.product)}
          </span>
          <span className="l1-reviews-product-name">{item.product}</span>
        </div>

        <p className="l1-reviews-quote">{item.quote}</p>

        <div className="l1-reviews-rating" aria-label={`${item.rating || '5.0'} stars`}>
          <Star className="l1-reviews-star" size={17} fill="currentColor" />
          <strong>{item.rating || '5.0'}</strong>
        </div>

        <div className="l1-reviews-person">
          <span className="l1-reviews-avatar" aria-hidden>
            {initials(item.name)}
          </span>
          <div>
            <p className="l1-reviews-name">{item.name}</p>
            <p className="l1-reviews-meta">{item.role}</p>
            <p className="l1-reviews-meta">{item.country}</p>
          </div>
        </div>

        <a href={href} className="l1-reviews-more">
          {cta}
        </a>
      </div>
    </article>
  );
}

export default function Testimonials({ copy }) {
  const reducedMotion = usePrefersReducedMotion();
  const items = copy.testimonials.items;
  const cta = copy.projects.readStory;

  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const pin = pinRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !pin || !viewport || !track) return undefined;

    const cards = [...track.querySelectorAll('[data-review-card]')];
    const clearLayout = () => {
      section.style.height = '';
      pin.style.height = '';
      gsap.set(track, { y: 0, clearProps: 'transform' });
      cards.forEach((card) => card.style.removeProperty('--enter'));
    };

    if (reducedMotion) {
      clearLayout();
      return clearLayout;
    }

    section.classList.add('is-animated');
    ScrollTrigger.config({ ignoreMobileResize: true });

    const getOverflow = () => Math.max(0, track.scrollHeight - viewport.clientHeight);

    const syncLayout = () => {
      const pinHeight = Math.max(0, window.innerHeight - PIN_GAP);
      pin.style.height = `${pinHeight}px`;
      const overflow = getOverflow();
      const nextHeight = `${pinHeight + overflow}px`;
      if (section.style.height !== nextHeight) {
        section.style.height = nextHeight;
      }
      return overflow;
    };

    const updateCards = () => {
      const bounds = viewport.getBoundingClientRect();
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const enter = gsap.utils.clamp(0, 1, (bounds.bottom - rect.top) / CARD_FADE);
        const leave = gsap.utils.clamp(0, 1, (rect.bottom - bounds.top) / CARD_FADE);
        card.style.setProperty('--enter', String(Math.min(enter, leave)));
      });
    };

    const ctx = gsap.context(() => {
      syncLayout();
      updateCards();

      gsap.to(track, {
        y: () => -getOverflow(),
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          trigger: section,
          start: `top ${PIN_GAP}px`,
          end: () => `+=${Math.max(getOverflow(), 1)}`,
          scrub: true,
          invalidateOnRefresh: true,
          onRefreshInit: syncLayout,
          onUpdate: updateCards,
          onRefresh: updateCards,
        },
      });

      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: updateCards,
        onRefresh: updateCards,
      });
    }, section);

    let cancelled = false;
    const refresh = () => {
      if (cancelled) return;
      syncLayout();
      updateCards();
      ScrollTrigger.refresh();
    };
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(refresh);
    });
    document.fonts?.ready?.then(refresh);
    window.addEventListener('resize', refresh);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', refresh);
      section.classList.remove('is-animated');
      ctx.revert();
      clearLayout();
    };
  }, [items.length, reducedMotion]);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="l1-reviews"
      aria-labelledby="testimonials-heading"
    >
      <div ref={pinRef} className="l1-reviews-pin">
        <div className="l1-reviews-dots l1-reviews-dots-left" aria-hidden />
        <div className="l1-reviews-dots l1-reviews-dots-right" aria-hidden />
        <div className="l1-reviews-shell">
          <header className="l1-reviews-head">
            <h2 id="testimonials-heading" className="l1-reviews-title">
              {copy.testimonials.title}
            </h2>
            <div className="l1-reviews-divider" aria-hidden>
              <span />
              <b>★</b>
              <span />
            </div>
            <p className="l1-reviews-subtitle">{copy.testimonials.subtitle}</p>
          </header>

          <div ref={viewportRef} className="l1-reviews-viewport">
            <div ref={trackRef} className="l1-reviews-track">
              {items.map((item, index) => (
                <ReviewCard
                  key={`${item.name}-${item.product}`}
                  item={item}
                  index={index}
                  cta={cta}
                  href="#work"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
