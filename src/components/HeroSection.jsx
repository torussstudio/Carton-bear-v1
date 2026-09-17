import { useLayoutEffect, useRef } from 'react';
import Nav from './Nav.jsx';
import { gsap, prefersReducedMotion } from '../lib/gsapSetup';
import './HeroSection.css';
import './Nav.css';

function HeroSection() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !rootRef.current) return undefined;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' }, delay: 0.15 })
        .from('.bear-nav-logo', { opacity: 0, y: -18, duration: 0.7 })
        .from(
          '.bear-nav-links .bear-pill',
          { opacity: 0, y: -16, stagger: 0.1, duration: 0.6 },
          '-=0.4'
        )
        .from(
          '.bear-hero-kicker',
          { opacity: 0, y: 34, duration: 0.9 },
          '-=0.2'
        )
        .from(
          '.bear-hero-ctas .bear-pill',
          { opacity: 0, y: 24, stagger: 0.12, duration: 0.7 },
          '-=0.55'
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="bear-hero" ref={rootRef}>
      <Nav />

      <div className="bear-hero-content">
        <p className="bear-hero-kicker">
          For D2C brands, ecommerce businesses, agencies, and growing
          consumer brands. From dieline to doorstep.
        </p>

        <div className="bear-hero-ctas">
          <button type="button" className="bear-pill bear-pill--solid">
           GOT A PACK IDEA ?
          </button>
          <button type="button" className="bear-pill bear-pill--outline">
            MAKE YOUR MOVE
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
