/**
 * GSAP Animation Utilities for TopZone
 * Adds entrance animations, scroll-triggered reveals, and micro-interactions.
 * Requires: gsap package (npm install gsap)
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Check for reduced motion preference
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Animate elements with staggered entrance (fade + slide up).
 * Call on DOMContentLoaded.
 */
export function initEntranceAnimations(container?: HTMLElement) {
  if (prefersReducedMotion()) return;
  const root = container || document;
  const targets = root.querySelectorAll('[data-animate]');
  if (targets.length === 0) return;

  gsap.fromTo(
    targets,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.12,
      clearProps: 'transform',
    }
  );
}

/**
 * Animate cards with staggered entrance — fade + scale up.
 */
export function initCardEntrance(container?: HTMLElement) {
  if (prefersReducedMotion()) return;
  const root = container || document;
  const cards = root.querySelectorAll('[data-card-animate]');
  if (cards.length === 0) return;

  gsap.fromTo(
    cards,
    { opacity: 0, y: 30, scale: 0.96 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: 'back.out(1.4)',
      stagger: 0.08,
      clearProps: 'transform',
    }
  );
}

/**
 * Scroll-triggered reveal: elements animate when entering viewport.
 */
export function initScrollReveal() {
  if (prefersReducedMotion()) return;
  const triggers = document.querySelectorAll('[data-scroll-reveal]');
  if (triggers.length === 0) return;

  triggers.forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
        clearProps: 'transform',
      }
    );
  });
}

/**
 * Count-up animation for stats/numbers.
 */
export function initCountUp(trigger?: HTMLElement) {
  if (prefersReducedMotion()) return;
  const counters = document.querySelectorAll('[data-countup]') as NodeListOf<HTMLElement>;
  if (counters.length === 0) return;

  counters.forEach((counter) => {
    const target = parseFloat(counter.dataset.countup || '0');
    const isDecimal = counter.dataset.countup.includes('.');
    const obj = { val: 0 };

    gsap.to(obj, {
      val: target,
      duration: 1.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: trigger || counter,
        start: 'top 85%',
        once: true,
      },
      onUpdate() {
        counter.textContent = isDecimal
          ? obj.val.toFixed(1)
          : Math.round(obj.val).toLocaleString('id-ID');
      },
    });
  });
}

/**
 * Hero section: animated text reveal on load.
 */
export function initHeroAnimation() {
  if (prefersReducedMotion()) {
    // Just show immediately
    gsap.set('[data-hero-animate]', { opacity: 1 });
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  tl.fromTo(
    '[data-hero-badge]',
    { opacity: 0, y: -20, scale: 0.9 },
    { opacity: 1, y: 0, scale: 1, duration: 0.5 }
  )
    .fromTo(
      '[data-hero-title]',
      { opacity: 0, y: 60, skewY: 3 },
      { opacity: 1, y: 0, skewY: 0, duration: 0.7 },
      '-=0.2'
    )
    .fromTo(
      '[data-hero-sub]',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5 },
      '-=0.3'
    )
    .fromTo(
      '[data-hero-cta]',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4 },
      '-=0.2'
    )
    .fromTo(
      '[data-hero-stat]',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 },
      '-=0.1'
    );
}

/**
 * Featured section: scroll-triggered card entrance.
 */
export function initFeaturedAnimation() {
  if (prefersReducedMotion()) return;

  ['#games', '#gear'].forEach((sectionId) => {
    const section = document.querySelector(sectionId);
    if (!section) return;

    const cards = section.querySelectorAll('.game-card, .gear-card');
    if (cards.length === 0) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 40, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.07,
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          once: true,
        },
        clearProps: 'transform',
      }
    );
  });
}

/**
 * Button hover micro-interaction (GSAP hover scale).
 */
export function initButtonHover() {
  const buttons = document.querySelectorAll('[data-gsap-hover]') as NodeListOf<HTMLElement>;
  buttons.forEach((btn) => {
    btn.addEventListener('mouseenter', () => {
      if (!prefersReducedMotion()) {
        gsap.to(btn, { scale: 1.04, duration: 0.15, ease: 'power2.out' });
      }
    });
    btn.addEventListener('mouseleave', () => {
      if (!prefersReducedMotion()) {
        gsap.to(btn, { scale: 1, duration: 0.15, ease: 'power2.out' });
      }
    });
  });
}

/**
 * Footer entrance animation.
 */
export function initFooterAnimation() {
  if (prefersReducedMotion()) return;
  const footer = document.querySelector('footer');
  if (!footer) return;

  gsap.fromTo(
    footer.children,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: footer,
        start: 'top 95%',
        once: true,
      },
    }
  );
}

/**
 * Initialize all animations. Call once on DOMContentLoaded.
 */
export function initAnimations() {
  if (typeof window === 'undefined') return;
  initHeroAnimation();
  initEntranceAnimations();
  initScrollReveal();
  initCountUp();
  initFeaturedAnimation();
  initButtonHover();
  initFooterAnimation();
}

// Auto-init if DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    // DOM already loaded — still use requestAnimationFrame to ensure layout
    requestAnimationFrame(initAnimations);
  }
}