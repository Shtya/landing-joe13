/**
 * scrollAnimations.js
 * ─────────────────────────────────────────────────────────────
 * ده الملف الوحيد اللي هتعدل فيه.
 * كل object في الـ array بيمثل حركة واحدة كاملة.
 *
 * ─── شرح كل property ────────────────────────────────────────
 *
 *  fromSectionId   → ID الـ section اللي لما الـ scroll يوصله، الـ animation تبدأ
 *  elementId       → ID العنصر اللي هيتحرك (الصورة أو الشكل)
 *  toPositionId    → ID المكان اللي العنصر هيروح يحط نفسه فيه
 *  animationName   → اسم الـ @keyframes اللي عرّفته في animations.css
 *  duration        → مدة الـ animation بالثانية
 *  easing          → نوع الحركة (ease, ease-in-out, linear, cubic-bezier(...))
 *  triggerAt       → نسبة ظهور الـ section اللي تشغّل الـ animation (0.0 → 1.0)
 *  reverseOnLeave  → true = لما يعمل scroll لفوق يرجع، false = يفضل ثابت
 *  exitAnimation   → (اختياري) animation تشتغل لما يمشي من الـ section
 *  exitDuration    → مدة الـ exit animation
 */

const scrollAnimations = [

  // ─── مثال 1: صورة بتنزل من فوق ───────────────────────────
  {
    fromSectionId : "hero",
    elementId     : "hero-image",
    toPositionId  : "about-image-slot",
    animationName : "slideInFromTop",
    duration      : 0.8,
    easing        : "ease-out",
    triggerAt     : 0.3,
    reverseOnLeave: true,
    exitAnimation : "slideOutToBottom",
    exitDuration  : 0.5,
  },

  // ─── مثال 2: عنوان بيجي من الشمال ───────────────────────
  {
    fromSectionId : "about",
    elementId     : "about-title",
    toPositionId  : "about-title-slot",
    animationName : "slideInFromLeft",
    duration      : 0.7,
    easing        : "cubic-bezier(0.22, 1, 0.36, 1)",
    triggerAt     : 0.4,
    reverseOnLeave: false,
  },

  // ─── مثال 3: شكل بيتحول لنجمة ───────────────────────────
  {
    fromSectionId : "about",
    elementId     : "morphing-shape",
    toPositionId  : "star-slot",
    animationName : "morphToStar",
    duration      : 1.2,
    easing        : "ease-in-out",
    triggerAt     : 0.5,
    reverseOnLeave: true,
    exitAnimation : "morphFromStar",
    exitDuration  : 0.8,
  },

  // ─── مثال 4: كارت بيجي من اليمين ────────────────────────
  {
    fromSectionId : "services",
    elementId     : "services-card",
    toPositionId  : "services-card-slot",
    animationName : "slideInFromRight",
    duration      : 0.9,
    easing        : "ease-out",
    triggerAt     : 0.35,
    reverseOnLeave: true,
    exitAnimation : "fadeOut",
    exitDuration  : 0.4,
  },

];

export default scrollAnimations;