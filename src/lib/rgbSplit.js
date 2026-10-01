import { gsap } from './gsapSetup';
import { lenisRef } from './lenisInstance';

/**
 * RGB split (chromatic aberration) controller for text.
 *
 * It drives ONE CSS custom property, `--rgb-split` (0..1), on a root element.
 * The CSS turns that into a pair of red / cyan text-shadows offset left/right
 * by a few hundredths of an em, so the effect scales with each text's own
 * font size. The split is always present: at rest it holds a faint IDLE
 * level, movement (the intro, or scroll velocity) lifts it, and it eases
 * back down to the idle level when the movement stops.
 *
 * Two sources are combined:
 *   - `state.intro`  : tweened by the hero's existing GSAP entrance timeline
 *   - `state.scroll` : derived from Lenis scroll velocity, computed on the
 *                      SAME gsap.ticker Lenis already runs on (no extra rAF
 *                      loop), eased up fast and released smoothly.
 */

const SCROLL_SOFT = 450; //  px/s at which the scroll split reaches ~63% (a normal
//                           wheel flick on this site's slow Lenis is ~600px/s)
const SCROLL_MAX = 1; //   cap for the scroll contribution (0..1)
const RISE = 9; //         how fast the split opens (1/s)
const FALL = 4.5; //       how softly it settles back (1/s)
const IDLE = 0.24; //      resting split (0..1): a faint, always-on red/cyan edge.
//                          Movement lifts it toward 1, then it eases back to this.

export function createRgbSplit(root, extraRoots = []) {
  // `root` is the hero; `extraRoots` are other elements (e.g. the marquee
  // scroller) that should carry the very same split amount.
  const targets = [root, ...extraRoots.filter(Boolean)];
  const state = { intro: 0, scroll: 0 };

  let last = -1;

  const apply = () => {
    // idle floor + movement on top (movement uses the remaining headroom,
    // so a full scroll/intro still peaks at exactly 1)
    const moving = Math.min(1, state.intro + state.scroll);
    const total = IDLE + (1 - IDLE) * moving;

    if (Math.abs(total - last) > 0.001) {
      last = total;
      const v = total.toFixed(3);
      targets.forEach((el) => {
        el.classList.add('rgb-split-on');
        el.style.setProperty('--rgb-split', v);
      });
    }
  };

  apply(); // start in the idle state straight away

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
    // once it has scrolled well out of view (the idle level stays applied)
    if (y > window.innerHeight * 1.5 && state.scroll === 0 && state.intro === 0) {
      vel = 0;
      return;
    }

    vel += (instant - vel) * (1 - Math.exp(-dt * 8));

    const target = Math.min(SCROLL_MAX, 1 - Math.exp(-vel / SCROLL_SOFT));
    const rate = target > state.scroll ? RISE : FALL;
    state.scroll += (target - state.scroll) * (1 - Math.exp(-dt * rate));

    if (state.scroll < 0.002) state.scroll = 0;

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
      targets.forEach((el) => {
        el.classList.remove('rgb-split-on');
        el.style.removeProperty('--rgb-split');
      });
    },
  };
}
