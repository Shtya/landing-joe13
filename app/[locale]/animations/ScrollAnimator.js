/**
 * ScrollAnimator.js
 * ─────────────────────────────────────────────────────────────
 * المحرك الرئيسي — مش محتاج تعدل فيه.
 * بيقرأ الـ config من scrollAnimations.js ويشغّل كل حاجة أوتوماتيك.
 *
 * ─── طريقة الاستخدام في HTML ────────────────────────────────
 *
 *  <script type="module">
 *    import ScrollAnimator from './ScrollAnimator.js';
 *    const animator = new ScrollAnimator();
 *    animator.init();
 *  </script>
 */

import scrollAnimations from './scrollAnimations.js';

class ScrollAnimator {

  constructor() {
    this.animations  = scrollAnimations;
    this.observers   = [];
    this.activeItems = new Map(); // elementId → animation state
  }

  // ─── Entry Point ──────────────────────────────────────────
  init() {
    this._prepareElements();
    this._setupObservers();
    console.log(`[ScrollAnimator] ✓ loaded ${this.animations.length} animation(s)`);
  }

  // ─── Step 1: إخفاء كل العناصر الأول ──────────────────────
  _prepareElements() {
    for (const config of this.animations) {
      const el = this._getElement(config.elementId);
      if (!el) {
        console.warn(`[ScrollAnimator] element not found: #${config.elementId}`);
        continue;
      }
      el.classList.add('anim-hidden');
      this.activeItems.set(config.elementId, { state: 'hidden', config });
    }
  }

  // ─── Step 2: مراقبة الـ sections ──────────────────────────
  _setupObservers() {
    for (const config of this.animations) {
      const section = this._getElement(config.fromSectionId);
      if (!section) {
        console.warn(`[ScrollAnimator] section not found: #${config.fromSectionId}`);
        continue;
      }

      const observer = new IntersectionObserver(
        (entries) => this._handleIntersection(entries, config),
        { threshold: config.triggerAt ?? 0.3 }
      );

      observer.observe(section);
      this.observers.push(observer);
    }
  }

  // ─── Step 3: اتخاذ القرار لما يدخل أو يخرج الـ section ───
  _handleIntersection(entries, config) {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        this._playAnimation(config);
      } else if (config.reverseOnLeave) {
        this._playExitAnimation(config);
      }
    }
  }

  // ─── تشغيل الـ Enter Animation ────────────────────────────
  _playAnimation(config) {
    const el        = this._getElement(config.elementId);
    const targetPos = this._getElement(config.toPositionId);
    if (!el) return;

    // ─ حساب الـ position بتاع الـ target ───────────────
    if (targetPos) {
      this._moveElementToPosition(el, targetPos);
    }

    // ─ تنظيف الحالة القديمة ─────────────────────────────
    el.classList.remove('anim-hidden', 'anim-exit', 'anim-done');
    void el.offsetWidth; // force reflow

    // ─ تطبيق الـ animation ──────────────────────────────
    el.style.animation = `${config.animationName} ${config.duration ?? 0.8}s ${config.easing ?? 'ease'} forwards`;
    el.classList.add('anim-active');

    // ─ لما تخلص ─────────────────────────────────────────
    el.addEventListener('animationend', () => {
      el.classList.remove('anim-active');
      el.classList.add('anim-done');
      this.activeItems.set(config.elementId, { state: 'done', config });
    }, { once: true });
  }

  // ─── تشغيل الـ Exit Animation ─────────────────────────────
  _playExitAnimation(config) {
    const el = this._getElement(config.elementId);
    if (!el) return;

    const exitAnim = config.exitAnimation;
    const exitDur  = config.exitDuration ?? config.duration ?? 0.5;

    el.classList.remove('anim-active', 'anim-done');
    void el.offsetWidth;

    if (exitAnim) {
      el.style.animation = `${exitAnim} ${exitDur}s ${config.easing ?? 'ease'} forwards`;
    } else {
      // لو مفيش exit animation → fade out بسيط
      el.style.animation = `fadeOut ${exitDur}s ease forwards`;
    }

    el.classList.add('anim-exit');

    el.addEventListener('animationend', () => {
      el.classList.remove('anim-exit');
      el.classList.add('anim-hidden');
      el.style.animation = '';
      el.style.transform = '';
      this.activeItems.set(config.elementId, { state: 'hidden', config });
    }, { once: true });
  }

  // ─── تحريك العنصر للـ position المحددة ───────────────────
  /**
   * بدل ما نعمل position: fixed (ممكن يسبب مشاكل)،
   * بنحسب الفرق بين مكان العنصر الحالي والـ target
   * وبنحطه كـ CSS custom property يستخدمه الـ @keyframes
   */
  _moveElementToPosition(el, targetEl) {
    const elRect     = el.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    const deltaX = targetRect.left - elRect.left;
    const deltaY = targetRect.top  - elRect.top;
    const scaleX = targetRect.width  / (elRect.width  || 1);
    const scaleY = targetRect.height / (elRect.height || 1);

    // بنحط القيم كـ CSS variables علشان الـ keyframes تستخدمها
    el.style.setProperty('--anim-dx',     `${deltaX}px`);
    el.style.setProperty('--anim-dy',     `${deltaY}px`);
    el.style.setProperty('--anim-scaleX', scaleX);
    el.style.setProperty('--anim-scaleY', scaleY);
  }

  // ─── Helper: جيب العنصر ───────────────────────────────────
  _getElement(id) {
    return document.getElementById(id) ?? null;
  }

  // ─── تدمير كل الـ observers لو محتاج cleanup ──────────────
  destroy() {
    for (const observer of this.observers) {
      observer.disconnect();
    }
    this.observers   = [];
    this.activeItems = new Map();
    console.log('[ScrollAnimator] destroyed');
  }
}

export default ScrollAnimator;