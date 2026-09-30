import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '../lib/gsapSetup';
import { lenisRef } from '../lib/lenisInstance';

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 3,
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // Keep ScrollTrigger's internal scroll position in sync with Lenis,
    // and let GSAP's ticker drive Lenis's raf loop so both stay
    // frame-perfectly in sync (recommended GSAP + Lenis integration).
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      if (lenisRef.current === lenis) lenisRef.current = null;
      lenis.destroy();
    };
  }, []);
}
