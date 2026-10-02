import { gsap } from './gsapSetup';
import { lenisRef } from './lenisInstance';

/**
 * RGB split (chromatic aberration) controller for text — site-wide.
 *
 * It drives ONE CSS custom property, `--rgb-split` (0..1). The shared
 * stylesheet (src/styles/rgb-split.css) turns it into a pair of red / cyan
 * text-shadows offset left/right by a few hundredths of an em, so the effect
 * scales with each text's own font size. The split is always present: at rest
 * it holds a faint IDLE level, movement (the hero intro, or scroll velocity)
 * lifts it, and it eases back down to the idle level when the movement stops.
 *
 * Sources combined:
 *   - `state.intro`  : tweened by the hero's existing GSAP entrance timeline
 *   - `state.scroll` : derived from Lenis scroll velocity, computed on the
 *                      SAME gsap.ticker Lenis already runs on (no extra rAF
 *                      loop), eased up fast and released smoothly.
 *
 * Performance: the property is written only to the page sections that are
 * currently on screen (IntersectionObserver), so a style recalculation never
 * walks the whole page. Nothing is written while the value is unchanged.
 */

const SCROLL_SOFT = 450; //  px/s at which the scroll split reaches ~63%
const SCROLL_MAX = 1; //   cap for the scroll contribution (0..1)
const RISE = 9; //         how fast the split opens (1/s)
const FALL = 4.5; //       how softly it settles back (1/s)
const IDLE = 0.24; //      resting split (0..1): a faint, always-on red/cyan edge

export function createRgbSplit() {
  const state = { intro: 0, scroll: 0 };

  // every top-level block of the page (hero, marquee, packaging, ... footer)
  const host = document.getElementById('crtContent');
  // (a section GSAP has pinned sits inside a .pin-spacer wrapper — look through it)
  const sections = host
    ? Array.from(host.children).flatMap((el) =>
        el.classList.contains('pin-spacer') ? Array.from(el.children) : [el]
      )
    : [];
  const visible = new Set();

  let value = ''; //  current --rgb-split string
  let last = -1;

  const paint = (el) => {
    el.classList.add('rgb-split-on');
    el.style.setProperty('--rgb-split', value);
  };

  const apply = () => {
    // idle floor + movement on top (movement uses the remaining headroom,
    // so a full scroll/intro still peaks at exactly 1)
    const moving = Math.min(1, state.intro + state.scroll);
    const total = IDLE + (1 - IDLE) * moving;

    if (Math.abs(total - last) > 0.001) {
      last = total;
      value = total.toFixed(3);
      visible.forEach((el) => el.style.setProperty('--rgb-split', value));
    }
  };

  // sections get the live value the moment they come on screen (with a
  // margin so it is already in place before they enter)
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          visible.add(e.target);
          paint(e.target);
        } else {
          visible.delete(e.target);
        }
      });
    },
    { rootMargin: '25% 0px 25% 0px' }
  );

  apply(); // start in the idle state straight away
  sections.forEach((el) => io.observe(el));

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
      io.disconnect();
      state.intro = 0;
      state.scroll = 0;
      sections.forEach((el) => {
        el.classList.remove('rgb-split-on');
        el.style.removeProperty('--rgb-split');
      });
      visible.clear();
    },
  };
}
