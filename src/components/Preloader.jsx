'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap, prefersReducedMotion } from '../lib/gsapSetup';
import logo from '../logo/carton-bear-logo.png';
import preloaderBg from '../images/preloader-bg.webp';
import './Preloader.css';

/*
 * Carton Bear preloader: "Seal & Ship".
 *
 * Loading: a branded packing tape runs across the screen as the progress bar,
 * with an odometer counter in the corner and the packing stage under the tape.
 * Exit: the tape is cut along the centre line and the screen opens like box
 * flaps (top half up, bottom half down), revealing the hero.
 *
 * How the split works: the scene is rendered twice, once in a top panel and
 * once in a bottom panel. Each panel is half the viewport tall with overflow
 * hidden, and each copy of the scene is positioned so the two halves line up
 * into one picture. Progress is written as CSS variables on the root
 * (--p, --d0..--d2), so both copies update together without React re-renders.
 *
 * Contract with the rest of the site (unchanged):
 *  - root element keeps the `.preloader` class (HeroSection looks for it)
 *  - window.__preloaderDone + the 'preloader:done' event fire the moment the
 *    reveal starts, so the hero entrance plays while the panels open.
 */

const STAGES = ['Folding flaps', 'Taping seams', 'Printing labels', 'Ready to ship'];
const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const TAPE_ITEMS = [0, 1, 2, 3, 4, 5, 6, 7];
const MIN_DISPLAY_MS = 1800;
const FAILSAFE_MS = 8000;

function Globe() {
  return (
    <svg className="cb-pl-globe" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <ellipse cx="12" cy="12" rx="4.2" ry="9.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M2.8 9h18.4M2.8 15h18.4" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function TapeRun() {
  return (
    <div className="cb-pl-tape-group">
      {TAPE_ITEMS.map((i) => (
        <span className="cb-pl-tape-item" key={i}>
          <span className="cb-pl-tape-stripes" />
          Carton World
          <Globe />
        </span>
      ))}
    </div>
  );
}

function Counter() {
  return (
    <div className="cb-pl-count">
      <div className="cb-pl-count-in" data-exit>
        {[2, 1, 0].map((col) => (
          <span className={`cb-pl-digit cb-pl-digit--${col}`} key={col}>
            <span className="cb-pl-digit-strip">
              {DIGITS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </span>
          </span>
        ))}
        <span className="cb-pl-count-pct">%</span>
      </div>
    </div>
  );
}

function Scene({ stage, primary }) {
  return (
    <>
      <div className="cb-pl-grid" />
      <div className="cb-pl-vignette" />

      <div className="cb-pl-frame">
        <span className="cb-pl-corner cb-pl-corner--tl" />
        <span className="cb-pl-corner cb-pl-corner--tr" />
        <span className="cb-pl-corner cb-pl-corner--bl" />
        <span className="cb-pl-corner cb-pl-corner--br" />
      </div>

      <div className="cb-pl-top">
        <div className="cb-pl-clip">
          <span data-exit className="cb-pl-rise cb-pl-brand">
            Carton Bear<sup>&trade;</sup>
          </span>
        </div>
        <div className="cb-pl-clip">
          <span data-exit className="cb-pl-rise cb-pl-rise--2 cb-pl-badge">
            <span className="cb-pl-badge-outline">Carton</span>
            <span className="cb-pl-badge-solid">World</span>
          </span>
        </div>
      </div>

      <div className="cb-pl-mark">
        <div className="cb-pl-mark-in">
          <Image
            className="cb-pl-mark-img"
            src={logo}
            alt=""
            preload={primary}
          />
        </div>
      </div>

      <div className="cb-pl-tape">
        <span className="cb-pl-tape-guide" />
        <div className="cb-pl-tape-fill">
          <div className="cb-pl-tape-run">
            <TapeRun />
            <TapeRun />
          </div>
        </div>
        <span className="cb-pl-tape-edge" />
      </div>

      <div className="cb-pl-stage">
        <div className="cb-pl-clip">
          <span data-exit className="cb-pl-rise cb-pl-rise--3 cb-pl-stage-in">
            <span className="cb-pl-stage-num">[ 0{stage + 1} / 04 ]</span>
            <span className="cb-pl-stage-word">
              <span key={stage}>{STAGES[stage]}</span>
            </span>
          </span>
        </div>
      </div>

      <div className="cb-pl-caption">
        <div className="cb-pl-clip">
          <span data-exit className="cb-pl-rise cb-pl-rise--4">
            Preparing your packages&hellip;
            <br />
            Things are getting real.
          </span>
        </div>
      </div>

      <Counter />
    </>
  );
}

function Preloader({ onComplete }) {
  const [stage, setStage] = useState(0);
  const [phase, setPhase] = useState('loading'); // loading -> exiting -> done

  const rootRef = useRef(null);
  const topRef = useRef(null);
  const bottomRef = useRef(null);
  const cutRef = useRef(null);

  const targetRef = useRef(0);
  const displayRef = useRef(0);
  const lastPctRef = useRef(-1);
  const stageRef = useRef(0);
  const rafRef = useRef(null);
  const tlRef = useRef(null);
  const startTimeRef = useRef(0);
  const doneFiredRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Fresh mount = loading starts over. Reset the shared "preloader done"
  // flag BEFORE any sibling reads it (this layout effect runs ahead of the
  // Hero's and PageBulge's), so a client-side navigation back to the home
  // page can't start the hero entrance underneath a fresh preloader.
  useLayoutEffect(() => {
    startTimeRef.current = performance.now();
    window.__preloaderDone = false;
  }, []);

  // Lock page scroll while the preloader is up.
  //
  // IMPORTANT: this component stays mounted after it finishes (it renders
  // `null`), so a cleanup tied only to unmount would never run and
  // `overflow: hidden` would stay on <html>/<body> forever. That kills
  // native touch scrolling on real phones. So the lock is released when the
  // preloader reaches 'done' (effect re-runs when `isDone` flips), and also
  // on real unmount.
  const isDone = phase === 'done';
  useEffect(() => {
    if (isDone) return undefined;

    const { documentElement: html, body } = document;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, [isDone]);

  // Real-progress tracking: images + fonts + window load, blended with a
  // gentle trickle so the counter always feels alive.
  useEffect(() => {
    let imagesTotal = 0;
    let imagesLoaded = 0;
    let fontsDone = false;
    let windowDone = document.readyState === 'complete';
    const cleanups = [];

    const weights = { images: 0.7, fonts: 0.15, window: 0.15 };

    const computeTarget = () => {
      const imagesFraction = imagesTotal ? imagesLoaded / imagesTotal : 1;
      const real =
        imagesFraction * weights.images +
        (fontsDone ? weights.fonts : 0) +
        (windowDone ? weights.window : 0);

      const elapsed = performance.now() - startTimeRef.current;
      const trickle = Math.min(0.92, elapsed / 3800);

      const allDone = imagesFraction >= 1 && fontsDone && windowDone;
      targetRef.current = allDone
        ? 1
        : Math.max(real, Math.min(real + 0.15, trickle));
    };

    // Only count images the browser is actually fetching now. Lazy images
    // further down the page (e.g. Shipping) don't load until scrolled to,
    // so counting them made every fresh load sit on the 8s failsafe.
    const imgs = Array.from(document.images || []).filter((img) => {
      if (img.complete) return true;
      const lazy =
        img.loading === 'lazy' || img.getAttribute('loading') === 'lazy';
      return !lazy;
    });
    imagesTotal = imgs.length;

    imgs.forEach((img) => {
      if (img.complete) {
        imagesLoaded += 1;
        return;
      }
      const onSettle = () => {
        imagesLoaded += 1;
        computeTarget();
      };
      img.addEventListener('load', onSettle, { once: true });
      img.addEventListener('error', onSettle, { once: true });
      cleanups.push(() => {
        img.removeEventListener('load', onSettle);
        img.removeEventListener('error', onSettle);
      });
    });

    if (document.fonts?.ready) {
      document.fonts.ready
        .then(() => {
          fontsDone = true;
          computeTarget();
        })
        .catch(() => {
          fontsDone = true;
          computeTarget();
        });
    } else {
      fontsDone = true;
    }

    if (!windowDone) {
      const onLoad = () => {
        windowDone = true;
        computeTarget();
      };
      window.addEventListener('load', onLoad, { once: true });
      cleanups.push(() => window.removeEventListener('load', onLoad));
    }

    // Failsafe: never let a stray asset hold the site hostage.
    const failsafe = setTimeout(() => {
      imagesLoaded = imagesTotal;
      fontsDone = true;
      windowDone = true;
      targetRef.current = 1;
    }, FAILSAFE_MS);

    computeTarget();
    const trickleInterval = setInterval(computeTarget, 120);

    return () => {
      clearTimeout(failsafe);
      clearInterval(trickleInterval);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  // Ease the displayed value toward the real target every frame, write it to
  // CSS variables, then run the exit once it settles at 100.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const reduced = prefersReducedMotion();

    const write = (value) => {
      root.style.setProperty('--p', (value / 100).toFixed(4));

      const pct = Math.min(100, Math.floor(value));
      if (pct === lastPctRef.current) return;
      lastPctRef.current = pct;

      root.style.setProperty('--d2', String(Math.floor(pct / 100)));
      root.style.setProperty('--d1', String(Math.floor(pct / 10) % 10));
      root.style.setProperty('--d0', String(pct % 10));
      root.dataset.lead = pct < 10 ? '2' : pct < 100 ? '1' : '0';

      const nextStage = pct >= 100 ? 3 : Math.min(2, Math.floor(pct / 34));
      if (nextStage !== stageRef.current) {
        stageRef.current = nextStage;
        setStage(nextStage);
      }
    };

    const signalDone = () => {
      window.__preloaderDone = true;
      window.dispatchEvent(new Event('preloader:done'));
    };

    const finish = () => {
      setPhase('done');
      if (typeof onCompleteRef.current === 'function') onCompleteRef.current();
    };

    const runExit = () => {
      setPhase('exiting');

      if (reduced) {
        signalDone();
        tlRef.current = gsap.to(root, {
          opacity: 0,
          duration: 0.45,
          ease: 'power1.out',
          onComplete: finish,
        });
        return;
      }

      const q = gsap.utils.selector(root);
      const drift = () => window.innerHeight * 0.18;
      const SPLIT_AT = 1.1;

      tlRef.current = gsap
        .timeline({ onComplete: finish })
        // 1. Small beat at 100%, then the type drops away.
        .to(
          q('[data-exit]'),
          {
            yPercent: -110,
            duration: 0.5,
            ease: 'power3.in',
            stagger: 0.03,
          },
          0.5
        )
        .to(
          q('.cb-pl-mark'),
          { scale: 0.9, opacity: 0.85, duration: 0.6, ease: 'power3.inOut' },
          0.5
        )
        // 2. Knife cut along the tape.
        .fromTo(
          cutRef.current,
          { scaleX: 0, opacity: 1 },
          { scaleX: 1, duration: 0.55, ease: 'expo.inOut' },
          0.55
        )
        // 3. Flaps open and the hero starts its entrance.
        .add(signalDone, SPLIT_AT)
        .to(cutRef.current, { opacity: 0, duration: 0.3, ease: 'power1.out' }, SPLIT_AT)
        .to(topRef.current, { yPercent: -100, duration: 1.15, ease: 'expo.inOut' }, SPLIT_AT)
        .to(bottomRef.current, { yPercent: 100, duration: 1.15, ease: 'expo.inOut' }, SPLIT_AT)
        .to(q('.cb-pl-panel--top .cb-pl-scene'), { y: drift, duration: 1.15, ease: 'expo.inOut' }, SPLIT_AT)
        .to(q('.cb-pl-panel--bottom .cb-pl-scene'), { y: () => -drift(), duration: 1.15, ease: 'expo.inOut' }, SPLIT_AT);
    };

    const tick = () => {
      const target = targetRef.current * 100;
      displayRef.current += (target - displayRef.current) * (reduced ? 0.35 : 0.06);

      if (target >= 99.9 && displayRef.current > 99.5) {
        displayRef.current = 100;
      }

      write(displayRef.current);

      const elapsed = performance.now() - startTimeRef.current;
      const finished = displayRef.current >= 100 && elapsed >= MIN_DISPLAY_MS;

      if (finished && !doneFiredRef.current) {
        doneFiredRef.current = true;
        runExit();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      tlRef.current?.kill();
    };
  }, []);

  if (phase === 'done') return null;

  return (
    <div
      ref={rootRef}
      className={`preloader cb-pl${phase === 'exiting' ? ' is-exiting' : ''}`}
      style={{ '--pl-bg': `url(${preloaderBg.src})` }}
      data-lead="2"
      role="status"
      aria-label="Loading Carton Bear"
      aria-busy={phase === 'loading'}
    >
      <div className="cb-pl-panel cb-pl-panel--top" ref={topRef}>
        <div className="cb-pl-scene">
          <Scene stage={stage} primary />
        </div>
      </div>

      <div className="cb-pl-panel cb-pl-panel--bottom" ref={bottomRef} aria-hidden="true">
        <div className="cb-pl-scene">
          <Scene stage={stage} primary={false} />
        </div>
      </div>

      <span className="cb-pl-cut" ref={cutRef} aria-hidden="true" />
    </div>
  );
}

export default Preloader;
