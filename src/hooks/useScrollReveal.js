import { useEffect } from 'react';
import { initScrollReveals } from '../lib/scrollReveal';

/**
 * Boots the site-wide scroll-reveal system once all sections are mounted.
 * Everything it animates is driven by data-reveal="..." attributes on the
 * markup itself, so this hook never needs to know about individual sections.
 */
export function useScrollReveal() {
  useEffect(() => {
    const cleanup = initScrollReveals();
    return cleanup;
  }, []);
}
