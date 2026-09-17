import { gsap, ScrollTrigger, prefersReducedMotion } from './gsapSetup';

/**
 * Awwards-style "mask reveal" for titles.
 * Each line is pre-wrapped in JSX as:
 *   <span class="reveal-mask"><span class="pt-line">...</span></span>
 * so GSAP only ever reads/animates existing elements — it never has to
 * mutate the DOM at runtime to build the mask (that turned out to be the
 * fragile part: a single element that failed to wrap correctly could
 * silently stop the rest of the page's titles from revealing).
 */
function getLines(container) {
  return container.querySelectorAll(':scope > .reveal-mask > *');
}

/** Splits a plain-text element into per-word spans (idempotent). */
function splitWords(el) {
  if (el.dataset.wordsSplit === 'true') {
    return el.querySelectorAll('.word');
  }
  const text = el.textContent;
  const parts = text.split(/(\s+)/).filter(Boolean);
  el.textContent = '';
  parts.forEach((part) => {
    if (/^\s+$/.test(part)) {
      el.appendChild(document.createTextNode(part));
    } else {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = part;
      el.appendChild(span);
    }
  });
  el.dataset.wordsSplit = 'true';
  return el.querySelectorAll('.word');
}

function initLineReveals() {
  document.querySelectorAll('[data-reveal="lines"]').forEach((container) => {
    try {
      const lines = getLines(container);
      if (!lines.length) return;

      gsap.set(lines, {y: 0, yPercent: 100 });
      gsap.to(lines, {
        yPercent: 0,
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    } catch (err) {
      // Never let one broken title stop the rest of the page's titles
      // from revealing.
      console.error('Line reveal failed for', container, err);
    }
  });
}

function initFadeBatch() {
  ScrollTrigger.batch('[data-reveal="fade"]', {
    start: 'top 88%',
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        overwrite: true,
      }),
    onLeaveBack: (batch) =>
      gsap.to(batch, {
        opacity: 0,
        y: 48,
        duration: 0.5,
        ease: 'power2.in',
        stagger: 0.06,
        overwrite: true,
      }),
  });
}

function initImageBatch() {
  ScrollTrigger.batch('[data-reveal="image"]', {
    start: 'top 92%',
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        scale: 1,
        duration: 1.3,
        ease: 'power3.out',
        stagger: 0.12,
        overwrite: true,
      }),
    onLeaveBack: (batch) =>
      gsap.to(batch, {
        opacity: 0,
        scale: 1.12,
        duration: 0.6,
        ease: 'power2.in',
        stagger: 0.06,
        overwrite: true,
      }),
  });
}

/** Big statement text that fills in word-by-word as you scroll past it. */
function initWordScrub() {
  document.querySelectorAll('[data-reveal="scrub-words"]').forEach((el) => {
    const words = splitWords(el);
    if (!words.length) return;

    gsap.to(words, {
      opacity: 1,
      stagger: 0.06,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top 78%',
        end: 'bottom 55%',
        scrub: 0.4,
      },
    });
  });
}

/** Connector-line draw-in for annotated SVG diagrams (path + dot + label). */
function initConnectorDraw() {
  document.querySelectorAll('[data-reveal="draw"]').forEach((svg) => {
    svg.querySelectorAll('g').forEach((g) => {
      try {
        const path = g.querySelector('path');
        const circle = g.querySelector('circle');
        const text = g.querySelector('text');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: svg,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        });

        if (path) {
          const len = path.getTotalLength();
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
          tl.to(path, { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut' });
        }
        if (circle) {
          gsap.set(circle, { opacity: 0, scale: 0, transformOrigin: '50% 50%' });
          tl.to(circle, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(3)' }, '-=0.35');
        }
        if (text) {
          gsap.set(text, { opacity: 0 });
          tl.to(text, { opacity: 1, duration: 0.4 }, '-=0.2');
        }
      } catch (err) {
        console.error('Connector draw-in failed for', g, err);
      }
    });
  });
}

/** Subtle magnetic pull on pill buttons — cheap, high awwards-per-byte. */
function initMagneticButtons() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  document.querySelectorAll('.bear-pill').forEach((btn) => {
    if (btn.dataset.magnetic === 'true') return;
    btn.dataset.magnetic = 'true';

    const strength = 0.35;

    const handleMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      gsap.to(btn, {
        x: x * strength,
        y: y * strength,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    const handleLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    };

    btn.addEventListener('mousemove', handleMove);
    btn.addEventListener('mouseleave', handleLeave);
  });
}

/**
 * Boots every reveal system for whatever is currently in the DOM.
 * Returns a cleanup function that kills the ScrollTriggers/tweens
 * it created (safe to call on unmount or React StrictMode's double effect).
 */
export function initScrollReveals() {
  if (typeof window === 'undefined') return () => {};
  if (prefersReducedMotion()) return () => {};

  const ctx = gsap.context(() => {
    initLineReveals();
    initFadeBatch();
    initImageBatch();
    initWordScrub();
    initConnectorDraw();
    initHandLiftReveal();
    initMagneticButtons();
  });

  // The page has a lot of async, layout-shifting content — a large video,
  // several images, and custom web fonts — all loading after this effect
  // first runs. ScrollTrigger caches each trigger's pixel position, so if
  // that position is computed before the page reaches its final height,
  // triggers further down the page can end up permanently unreachable.
  // Re-measure at every point the layout is likely to have changed.
  const refresh = () => ScrollTrigger.refresh();

  requestAnimationFrame(refresh);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(refresh).catch(() => {});
  }

  window.addEventListener('load', refresh);

  let resizeObserver;
  if (typeof ResizeObserver !== 'undefined') {
    let pending = null;
    resizeObserver = new ResizeObserver(() => {
      if (pending) clearTimeout(pending);
      pending = setTimeout(refresh, 120);
    });
    resizeObserver.observe(document.body);
  }

  return () => {
    window.removeEventListener('load', refresh);
    if (resizeObserver) resizeObserver.disconnect();
    ctx.revert();
  };
}

/**
 * "Bear lifts the box into place, then the callouts label it" sequence.
 * [data-reveal="hand-lift"] wraps a `.bear-hand-image` and a
 * `.bear-hand-callouts` SVG whose <g> children are (path, circle, text)
 * triples. It's all ONE timeline so the arrows are guaranteed to start
 * only after the hand tween finishes.
 */
function initHandLiftReveal() {
  document.querySelectorAll('[data-reveal="hand-lift"]').forEach((container) => {
    try {
      const hand = container.querySelector('.bear-hand-image');
      if (!hand) return;

      const svg = container.querySelector('.bear-hand-callouts');
      const groups = svg ? Array.from(svg.querySelectorAll('g')) : [];

      // Start below and transparent, like it's being lifted up from out of frame.
      gsap.set(hand, { yPercent: 45, opacity: 0 });

      const groupParts = groups.map((g) => {
        const path = g.querySelector('path');
        const circle = g.querySelector('circle');
        const text = g.querySelector('text');

        if (path) {
          const len = path.getTotalLength();
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        }
        if (circle) gsap.set(circle, { opacity: 0, scale: 0, transformOrigin: '50% 50%' });
        if (text) gsap.set(text, { opacity: 0 });

        return { path, circle, text };
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 95%',
          toggleActions: 'play none none reverse',
        },
      });

      // 1) The lift: hand + box rise up to their resting position.
      tl.to(hand, {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        ease: 'power3.out',
      });

      // 2) Only once the lift above has fully finished do the callouts
      //    start drawing in, one after another.
      groupParts.forEach(({ path, circle, text }, i) => {
        const callout = gsap.timeline();
        if (path) {
          callout.to(path, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut' });
        }
        if (circle) {
          callout.to(circle, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(3)' }, '-=0.3');
        }
        if (text) {
          callout.to(text, { opacity: 1, duration: 0.3 }, '-=0.15');
        }
        // First callout waits a beat after the hand settles; the rest
        // cascade in quick succession right after it.
        tl.add(callout, i === 0 ? '+=0.1' : '-=0.35');
      });
    } catch (err) {
      console.error('Hand lift reveal failed for', container, err);
    }
  });
}