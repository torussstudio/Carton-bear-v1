import { gsap } from './gsapSetup';
import { lenisRef } from './lenisInstance';

/**
 * RGB split (chromatic aberration) controller for text.
 *
 * It drives ONE CSS custom property, `--rgb-split` (0..1), on a root element.
 * The CSS turns that into a pair of red / cyan text-shadows offset left/right
 * by a few hundredths of an em, so the effect scales with each text's own
 * font size and costs nothing while idle (the class `rgb-split-on` is only
 * present while the amount is above a tiny epsilon, so resting text is
 * rendered exactly as before — no shadows at all).
 *
 * Two sources are combined:
 *   - `state.intro`  : tweened by the hero's existing GSAP entrance timeline
 *   - `state.scroll` : derived from Lenis scroll velocity, computed on the
 *                      SAME gsap.ticker Lenis already runs on (no extra rAF
 *                      loop), eased up fast and released smoothly.
 */

const SCROLL_SOFT = 1800; // px/s at which the scroll split reaches ~63%
const SCROLL_MAX = 1; //   cap for the scroll contribution (0..1)
const RISE = 9; //         how fast the split opens (1/s)
const FALL = 4.5; //       how softly it settles back (1/s)
const OFF_EPS = 0.004; //  below this, the effect is switched off entirely

export function createRgbSplit(root) {
  const state = { intro: 0, scroll: 0 };

  let on = false;
  let last = -1;

  const apply = () => {
    const total = Math.min(1, state.intro + state.scroll);

    if (total < OFF_EPS) {
      if (on) {
        on = false;
        last = -1;
        root.classList.remove('rgb-split-on');
        root.style.removeProperty('--rgb-split');
      }
      return;
    }

    if (!on) {
      on = true;
      root.classList.add('rgb-split-on');
    }

    if (Math.abs(total - last) > 0.002) {
      last = total;
      root.style.setProperty('--rgb-split', total.toFixed(3));
    }
  };

  let lastY = lenisRef.current ? lenisRef.current.scroll : window.scrollY;
  let lastT = performance.now();
  let vel = 0;

  const tick = () => {
    const now = performance.now();
    const dt = Math.min(0.05, Math.max(0.001, (now - lastT) / 1000));
    lastT = now;

    const y = lenisRef.current ? lenisRef.current.scroll : window.scrollY;
    const instant = Math.min(Math.abs(y - lastY) / dt, SCROLL_SOFT * 3);
    lastY = y;

    // the hero is only on screen near the top of the page — skip the maths
    // (and keep everything off) once it has scrolled well out of view
    if (y > window.innerHeight * 1.5 && state.scroll === 0 && state.intro === 0) {
      vel = 0;
      return;
    }

    vel += (instant - vel) * (1 - Math.exp(-dt * 8));

    const target = Math.min(SCROLL_MAX, 1 - Math.exp(-vel / SCROLL_SOFT));
    const rate = target > state.scroll ? RISE : FALL;
    state.scroll += (target - state.scroll) * (1 - Math.exp(-dt * rate));

    if (state.scroll < OFF_EPS * 0.5) state.scroll = 0;

    apply();
  };

  gsap.ticker.add(tick);

  return {
    state,
    apply,
    destroy() {
      gsap.ticker.remove(tick);
      state.intro = 0;
      state.scroll = 0;
      root.classList.remove('rgb-split-on');
      root.style.removeProperty('--rgb-split');
    },
  };
}
