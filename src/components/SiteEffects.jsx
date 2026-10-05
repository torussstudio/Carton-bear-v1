'use client';

import { useLenis } from '../hooks/useLenis';
import { useScrollReveal } from '../hooks/useScrollReveal';

/*
 * The two page-wide hooks that used to be called at the top of <App />:
 * Lenis smooth scrolling (driven by the GSAP ticker) and the
 * data-reveal="..." scroll-reveal system. Renders nothing.
 */
function SiteEffects() {
  useLenis();
  useScrollReveal();

  return null;
}

export default SiteEffects;
