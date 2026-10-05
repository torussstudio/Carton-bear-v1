'use client';

import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/gsapSetup';
import { lenisRef } from '../lib/lenisInstance';

/**
 * PageBulge — scroll-driven, pixel-level lens distortion of the whole page.
 *
 * How it works
 * ------------
 * A fixed, viewport-sized, pointer-events:none "lens" sits above the page and
 * applies `backdrop-filter: url(#pageBulge)`. That SVG filter runs an
 * feDisplacementMap over whatever is painted underneath (text, images, video,
 * the nav — all of it), so real pixels are re-sampled: the page genuinely bends,
 * it is not a CSS scale/translate.
 *
 *  - The displacement MAP is a static barrel/bulge field, generated once per
 *    viewport size. It is zero along all four screen edges, so the distortion
 *    never samples outside the screen (no gaps or smeared borders).
 *  - The displacement AMOUNT (`scale`) is driven by smoothed scroll velocity
 *    read from the existing Lenis instance, on the existing GSAP ticker. Fast
 *    scroll → strong bulge, stop scrolling → it relaxes back to flat.
 *  - When the amount is ~0 the backdrop-filter is switched off entirely, so
 *    there is zero GPU cost while the page is at rest.
 *
 * Because the filter lives on a viewport-sized layer (not on the tall page
 * wrapper), ScrollTrigger pins, position:fixed and existing GSAP animations
 * are untouched.
 *
 * Browser support: needs `backdrop-filter: url()` (Chromium: Chrome, Edge,
 * Brave, Android Chrome). Elsewhere it silently does nothing.
 */

// ---- Tuning knobs ---------------------------------------------------------
const MAGNIFY = 0.085; // centre magnification at full strength (0.085 ≈ 1.09×)
const MAGNIFY_MOBILE = 0.06; // gentler + cheaper on small screens
const VELOCITY_SOFT = 1400; // px/s at which the bulge reaches ~63% (it saturates, so
                            // speed jitter during a steady scroll doesn't pulse it)
const RISE = 4.5; // how fast the bulge builds   (1/s)
const FALL = 3.5; // release speed (1/s): bigger = drops back faster. Must be > 0.
                  // (0 used to freeze the bulge on permanently.)
                // back down with your scroll speed. Higher = floatier release.
const SHAPE = 1.0; // falloff exponent: higher = tighter bulge in the middle
const MAP_SIZE = 256; // displacement map resolution (bilinear-scaled up)
const OFF_EPS = 0.004; // below this strength the filter is switched off
// ---------------------------------------------------------------------------

const FILTER_ID = 'pageBulge';
const SVG_NS = 'http://www.w3.org/2000/svg';
const XLINK_NS = 'http://www.w3.org/1999/xlink';

/**
 * Builds the displacement map. Per pixel, with u,v in [-1,1] across the screen:
 *   offset = -(u·W, v·H) · (1-u²)^s · (1-v²)^s
 * i.e. every point samples from a spot nearer the centre (→ magnified middle),
 * fading to exactly 0 at the edges. X/Y amplitudes are weighted by W/H so the
 * magnification is equal in both axes at any aspect ratio.
 * Returns { url, norm } where norm is the peak of the base field, needed to
 * convert the wanted magnification into an feDisplacementMap `scale`.
 */
function buildMap(w, h) {
  const size = MAP_SIZE;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(size, size);
  const M = Math.max(w, h);
  const ax = w / M;
  const ay = h / M;

  // peak of u(1-u²)^s·(1-v²)^s along v=0 (analytic-ish, found numerically)
  let norm = 0;
  for (let i = 0; i <= 1000; i++) {
    const u = i / 1000;
    norm = Math.max(norm, u * Math.pow(1 - u * u, SHAPE));
  }

  for (let y = 0; y < size; y++) {
    const v = ((y + 0.5) / size) * 2 - 1;
    const wy = Math.pow(1 - v * v, SHAPE);
    for (let x = 0; x < size; x++) {
      const u = ((x + 0.5) / size) * 2 - 1;
      const wx = Math.pow(1 - u * u, SHAPE);
      const fx = (-u * wx * wy) / norm; // -1..1
      const fy = (-v * wx * wy) / norm;
      const i = (y * size + x) * 4;
      img.data[i] = Math.round(127.5 + fx * ax * 127.5);
      img.data[i + 1] = Math.round(127.5 + fy * ay * 127.5);
      img.data[i + 2] = 128;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return { url: canvas.toDataURL('image/png'), norm };
}

function supportsSvgBackdrop() {
  try {
    return (
      typeof CSS !== 'undefined' &&
      (CSS.supports('backdrop-filter', `url(#${FILTER_ID})`) ||
        CSS.supports('-webkit-backdrop-filter', `url(#${FILTER_ID})`)) &&
      // Firefox parses backdrop-filter but does not run SVG url() filters on it
      /Chrome|Chromium|Edg\//.test(navigator.userAgent)
    );
  } catch {
    return false;
  }
}

function PageBulge() {
  const lensRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    const lens = lensRef.current;
    const svg = svgRef.current;
    if (!lens || !svg || prefersReducedMotion() || !supportsSvgBackdrop()) {
      return undefined;
    }

    const filter = svg.querySelector('filter');
    const feImage = svg.querySelector('feImage');
    const feDisp = svg.querySelector('feDisplacementMap');

    let norm = 0.385;
    let W = 0;
    let H = 0;
    let magnify = MAGNIFY;

    const layout = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w === W && h === H) return;
      W = w;
      H = h;
      magnify = w < 768 ? MAGNIFY_MOBILE : MAGNIFY;
      const map = buildMap(w, h);
      norm = map.norm;
      // Explicit pixel geometry: the filter region == the lens box.
      filter.setAttribute('x', '0');
      filter.setAttribute('y', '0');
      filter.setAttribute('width', String(w));
      filter.setAttribute('height', String(h));
      feImage.setAttribute('x', '0');
      feImage.setAttribute('y', '0');
      feImage.setAttribute('width', String(w));
      feImage.setAttribute('height', String(h));
      feImage.setAttributeNS(XLINK_NS, 'href', map.url);
      feImage.setAttribute('href', map.url);
    };
    layout();

    let resizeT;
    const onResize = () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(layout, 150);
    };
    window.addEventListener('resize', onResize);

    // ---- per-frame driver (rides the same GSAP ticker as Lenis) ----
    let lastY = window.scrollY;
    let lastT = performance.now();
    let vel = 0; // smoothed px/s
    let amt = 0; // 0..1 eased strength
    let active = false;
    let lastScale = -1;

    // Stay completely off until the preloader has finished, so the hero
    // entrance (SplitText / blur reveal) never plays under the lens and a
    // scroll jump during page load can't kick the bulge on.
    let ready = !!window.__preloaderDone;
    const onReady = () => {
      ready = true;
      lastY = lenisRef.current ? lenisRef.current.scroll : window.scrollY;
      vel = 0;
      amt = 0;
    };
    if (!ready) window.addEventListener('preloader:done', onReady, { once: true });

    const setActive = (on) => {
      if (on === active) return;
      active = on;
      const v = on ? `url(#${FILTER_ID})` : 'none';
      lens.style.backdropFilter = v;
      lens.style.webkitBackdropFilter = v;
    };

    const tick = () => {
      const now = performance.now();
      const dt = Math.min(0.05, Math.max(0.001, (now - lastT) / 1000));
      lastT = now;

      const y = lenisRef.current ? lenisRef.current.scroll : window.scrollY;
      if (!ready) {
        lastY = y;
        return;
      }
      // cap so a programmatic jump (anchor link, scroll restoration) is just
      // "fast", not a huge spike
      const instant = Math.min(Math.abs(y - lastY) / dt, VELOCITY_SOFT * 3);
      lastY = y;
      // heavy smoothing on the measured speed: removes per-frame/wheel-tick
      // jitter, which is what made the bulge pulse ("wave") while scrolling
      vel += (instant - vel) * (1 - Math.exp(-dt * 7));

      const target = 1 - Math.exp(-vel / VELOCITY_SOFT); // saturating, 0..1
      if (target >= amt) {
        amt += (target - amt) * (1 - Math.exp(-dt * RISE));
      } else {
        // FALL is floored so a 0 in the config can never freeze the lens on
        amt += (target - amt) * (1 - Math.exp(-dt * Math.max(FALL, 1)));
      }

      if (amt < OFF_EPS) {
        amt = 0;
        setActive(false);
        return;
      }
      setActive(true);

      // scale (px) so that centre magnification == magnify * amt
      const M = Math.max(W, H);
      const scale = amt * magnify * norm * M;
      if (Math.abs(scale - lastScale) > 0.05) {
        lastScale = scale;
        feDisp.setAttribute('scale', scale.toFixed(2));
      }
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('preloader:done', onReady);
      clearTimeout(resizeT);
      lens.style.backdropFilter = 'none';
      lens.style.webkitBackdropFilter = 'none';
    };
  }, []);

  return (
    <>
      <svg
        ref={svgRef}
        width="0"
        height="0"
        aria-hidden="true"
        style={{ position: 'absolute', pointerEvents: 'none' }}
      >
        <defs>
          <filter
            id={FILTER_ID}
            filterUnits="userSpaceOnUse"
            primitiveUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feImage result="map" preserveAspectRatio="none" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <div
        ref={lensRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40, // above page content, below CRT overlay (50) + preloader
          pointerEvents: 'none',
        }}
      />
    </>
  );
}

export default PageBulge;
