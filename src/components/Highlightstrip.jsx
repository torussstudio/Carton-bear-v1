'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap, prefersReducedMotion, SplitText } from '../lib/gsapSetup';
import './Highlightstrip.css';

function Highlightstrip() {
  const textRef = useRef(null);

  /*
   * Flip-up word reveal — the same motion as the Packaging title
   * ("Packaging That Actually Builds Brands."): each word starts
   * tipped back (rotationX -72, rotationY 7), pushed down 45px and
   * 100px away in z, pivoting on its bottom edge, then flips up to
   * rest. 0.55s power3.out. Words go in reading order with a small
   * stagger. Plays once when the line scrolls into view.
   */

  useLayoutEffect(() => {
    const el = textRef.current;

    if (!el || prefersReducedMotion()) return undefined;

    let split;

    const ctx = gsap.context(() => {
      split = SplitText.create(el, {
        type: 'words',
        wordsClass: 'highlight-strip-word',
      });

      gsap.set(split.words, {
        opacity: 0,
        y: 45,
        rotationX: -72,
        rotationY: 7,
        z: -100,
        transformOrigin: '50% 100%',
        transformStyle: 'preserve-3d',
      });

      gsap.to(split.words, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        z: 0,
        duration: 0.55,
        ease: 'power3.out',
        stagger: 0.09,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }, el);

    return () => {
      ctx.revert();
      if (split) split.revert();
    };
  }, []);

  return (
    <section className="highlight-strip">

      <div className="highlight-strip-inner">

        <p
          className="highlight-strip-text"
          ref={textRef}
        >
          PACKAGING EXECUTION FROM INDIA, BUILT FOR GLOBAL BRANDS.
        </p>

      </div>
    </section>
  );
}

export default Highlightstrip;