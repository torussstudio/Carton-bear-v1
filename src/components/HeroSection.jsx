import { useLayoutEffect, useRef } from 'react';
import Nav from './Nav.jsx';
import { gsap, SplitText, prefersReducedMotion } from '../lib/gsapSetup';
import './HeroSection.css';
import './Nav.css';

function HeroSection() {
  const rootRef = useRef(null);
  const kickerRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !rootRef.current || !kickerRef.current) {
      return undefined;
    }

    let split;

    const ctx = gsap.context(() => {
      split = new SplitText(kickerRef.current, {
        type: 'words',
        wordsClass: 'bear-hero-kicker__word',
      });

      gsap
        .timeline({ defaults: { ease: 'power3.out' }, delay: 0.15 })
        .from('.bear-nav-logo', { opacity: 0, y: -18, duration: 0.7 })
        .from(
          '.bear-nav-links .bear-pill',
          { opacity: 0, y: -16, stagger: 0.1, duration: 0.6 },
          '-=0.4'
        )
                .from(
          split.words,
          {
            // opacity: 0,
            // x: 26,
            // filter: 'blur(28px)',
            // stagger: 0.05,
            // duration: 1.5,
            // ease: 'expo.out',
            // clearProps: 'filter,transform',

              y: 50, opacity: 0,
              filter: 'blur(28px)',
  stagger: 0.03, duration: 1,
  ease: "back.out(1.7)"
          },
          '-=0.2'
        )
        .from(
          '.bear-hero-ctas .bear-pill',
          { opacity: 0, y: 24, stagger: 0.12, duration: 0.7 },
          '-=0.55'
        );
    }, rootRef);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <div className="bear-hero" ref={rootRef}>
      <Nav />

      <div className="bear-hero-content">
        <p className="bear-hero-kicker" ref={kickerRef}>
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