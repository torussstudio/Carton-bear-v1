import { useLayoutEffect, useRef } from 'react';
import './Marquee.css';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsapSetup';

const ITEMS = [
  'Corrugated Boxes',
  'Mailers',
  'Printed Packaging',
  'Export Cartons',
  'Packaging Systems',
];

function MarqueeSequence() {
  return (
    <div className="marquee-sequence" aria-hidden="true">
      {ITEMS.map((item, index) => (
        <span className="marquee-item" key={`${item}-${index}`}>
          {item}
          <span className="marquee-divider">|</span>
        </span>
      ))}
    </div>
  );
}

function Marquee() {
  const marqueeRef = useRef(null);
  const trackRef = useRef(null);

  useLayoutEffect(() => {
    const marquee = marqueeRef.current;
    const track = trackRef.current;

    if (!marquee || !track) return undefined;

    let resizeHandler;
    let tickHandler;
    let velocityTrigger;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set(marquee, { autoAlpha: 1, clearProps: 'transform' });
        return;
      }

      // One reveal for the whole scroller. No per-line/item animation.
      gsap.fromTo(
        marquee,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: marquee,
            start: 'top 88%',
            once: true,
          },
        }
      );

      let loopWidth = 0;
      let x = 0;
      let currentSpeed = -18;
      let scrollVelocity = 0;
      let lastScrollActivity = performance.now();

      const setX = gsap.quickSetter(track, 'x', 'px');

      const measure = () => {
        const firstSequence = track.querySelector('.marquee-sequence');
        if (!firstSequence) return;

        loopWidth = firstSequence.getBoundingClientRect().width;
        if (!loopWidth) return;

        x = gsap.utils.wrap(-loopWidth, 0, x);
        setX(x);
      };

      measure();

      // Page-wide ScrollTrigger gives us velocity for the entire page.
      velocityTrigger = ScrollTrigger.create({
        start: 0,
        end: () => Math.max(1, ScrollTrigger.maxScroll(window)),
        onUpdate: (self) => {
          const velocity = self.getVelocity();

          if (Math.abs(velocity) > 0.5) {
            scrollVelocity = velocity;
            lastScrollActivity = performance.now();
          }
        },
      });

      tickHandler = (_time, deltaTime) => {
        if (!loopWidth) {
          measure();
          return;
        }

        // GSAP deltaTime is milliseconds.
        const dt = Math.min(deltaTime / 1000, 0.05);

        // Let scroll influence decay smoothly after the user stops.
        if (performance.now() - lastScrollActivity > 45) {
          scrollVelocity *= Math.exp(-dt / 0.18);
        }

        let targetSpeed;

        if (Math.abs(scrollVelocity) > 1) {
          // Scroll down = right-to-left. Scroll up = left-to-right.
          const direction = scrollVelocity > 0 ? -1 : 1;
          const velocityBoost = Math.min(Math.abs(scrollVelocity) * 0.045, 95);
          targetSpeed = direction * (18 + velocityBoost);
        } else {
          // Keep a slow premium idle movement.
          targetSpeed = currentSpeed < 0 ? -18 : 18;
        }

        // Smooth inertia for speed and direction changes.
        const ease = 1 - Math.exp(-dt / 0.16);
        currentSpeed += (targetSpeed - currentSpeed) * ease;

        // Wrap at exactly one sequence width for a seamless loop.
        x = gsap.utils.wrap(-loopWidth, 0, x + currentSpeed * dt);
        setX(x);
      };

      gsap.ticker.add(tickHandler);

      resizeHandler = () => {
        measure();
        ScrollTrigger.refresh();
      };

      window.addEventListener('resize', resizeHandler);

      if (document.fonts?.ready) {
        document.fonts.ready.then(measure).catch(() => {});
      }
    }, marquee);

    return () => {
      if (tickHandler) gsap.ticker.remove(tickHandler);
      if (velocityTrigger) velocityTrigger.kill();
      if (resizeHandler) window.removeEventListener('resize', resizeHandler);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={marqueeRef} className="marquee">
      <div ref={trackRef} className="marquee-track">
        <MarqueeSequence />
        <MarqueeSequence />
      </div>
    </div>
  );
}

export default Marquee;
