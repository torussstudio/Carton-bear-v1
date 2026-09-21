import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../lib/gsapSetup';
import logo from '../logo/carton-bear-logo.png';
import preloaderBg from '../images/preloader-bg.webp';
import preloaderBox from '../images/preloader-box.png';
import './Preloader.css';

const TICKER_ITEMS = new Array(6).fill(null);

function TickerSequence() {
  return (
    <div className="preloader-ticker-sequence" aria-hidden="true">
      {TICKER_ITEMS.map((_, i) => (
        <span className="preloader-ticker-item" key={i}>
          <span className="preloader-ticker-stripes" />
          <span className="preloader-ticker-word">Carton World</span>
          <span className="preloader-ticker-globe">&#127760;</span>
          <span className="preloader-ticker-stripes" />
        </span>
      ))}
    </div>
  );
}

function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('loading'); // loading -> exiting -> done
  const targetRef = useRef(0);
  const displayRef = useRef(0);
  const rafRef = useRef(null);
  const startTimeRef = useRef(performance.now());
  const doneFiredRef = useRef(false);

  // Lock page scroll while the preloader is up.
  //
  // IMPORTANT: this component is never unmounted — once it finishes it just
  // renders `null` but stays mounted in <App />. So an effect cleanup tied to
  // unmount would NEVER run, and `overflow: hidden` would stay on <html>/<body>
  // forever. That silently kills native touch scrolling on real phones (Lenis
  // hands touch input to the browser), while desktop and DevTools still scroll
  // because Lenis drives wheel scrolling via window.scrollTo(), which works
  // even under `overflow: hidden`. So the lock is released when the preloader
  // reaches its 'done' phase (effect re-runs when `isDone` flips), and also on
  // real unmount.
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
  // gentle trickle so the bar always feels alive, never fake-perfect.
  useEffect(() => {
    let imagesTotal = 0;
    let imagesLoaded = 0;
    let fontsDone = false;
    let windowDone = document.readyState === 'complete';
    const cleanups = [];

    const weights = { images: 0.7, fonts: 0.15, window: 0.15 };

    const computeTarget = () => {
      const imagesFraction = imagesTotal
        ? imagesLoaded / imagesTotal
        : 1;
      const real =
        imagesFraction * weights.images +
        (fontsDone ? weights.fonts : 0) +
        (windowDone ? weights.window : 0);

      const elapsed = performance.now() - startTimeRef.current;
      // Slow idle trickle so short/cached loads still feel like something
      // is happening, capped well below 100 until the real signals land.
      const trickle = Math.min(0.92, elapsed / 3800);

      const allDone = imagesFraction >= 1 && fontsDone && windowDone;
      targetRef.current = allDone ? 1 : Math.max(real, Math.min(real + 0.15, trickle));
    };

    const imgs = Array.from(document.images || []);
    imagesTotal = imgs.length;

    imgs.forEach((img) => {
      if (img.complete && img.naturalWidth > 0) {
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
    }, 8000);

    computeTarget();
    const trickleInterval = setInterval(computeTarget, 120);

    return () => {
      clearTimeout(failsafe);
      clearInterval(trickleInterval);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  // Smoothly ease the displayed percentage toward the real target every
  // frame, then hand off to the exit sequence once it settles at 100.
  useEffect(() => {
    const reduced = prefersReducedMotion();
    const minDisplayMs = 1100;

    const tick = () => {
      const target = targetRef.current * 100;
      const diff = target - displayRef.current;
      displayRef.current += diff * (reduced ? 0.35 : 0.09);

      if (target >= 99.9 && displayRef.current > 99.6) {
        displayRef.current = 100;
      }

      setProgress(displayRef.current);

      const elapsed = performance.now() - startTimeRef.current;
      const finished = displayRef.current >= 100 && elapsed >= minDisplayMs;

      if (finished && !doneFiredRef.current) {
        doneFiredRef.current = true;
        setPhase('exiting');
        // Signal the rest of the app the instant loading is truly done, so
        // things like the hero entrance timeline can start right on cue
        // instead of racing the preloader underneath it.
        window.__preloaderDone = true;
        window.dispatchEvent(new Event('preloader:done'));
        window.setTimeout(() => {
          setPhase('done');
          if (typeof onComplete === 'function') onComplete();
        }, 820);
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onComplete]);

  if (phase === 'done') return null;

  const pct = Math.round(progress);

  return (
    <div
      className={`preloader ${phase === 'exiting' ? 'preloader--exiting' : ''}`}
      style={{ backgroundImage: `url(${preloaderBg})` }}
      role="status"
      aria-live="polite"
      aria-busy={phase === 'loading'}
    >
      <img className="preloader-watermark" src={logo} alt="" aria-hidden="true" />

      <div className="preloader-topbar">
        <img className="preloader-logo" src={logo} alt="Carton Bear" />
        <div className="preloader-badge">
          <span className="preloader-badge-outline">Carton</span>
          <span className="preloader-badge-solid">World</span>
        </div>
      </div>

      <div className="preloader-stamp preloader-stamp--left" aria-hidden="true">
        Quality packaging<br />for a safer<br />tomorrow
      </div>

      <div className="preloader-stamp preloader-stamp--right" aria-hidden="true">
        Pack<br />Ship<br />Smile&nbsp;&#9786;
      </div>

      <div className="preloader-chevrons" aria-hidden="true">
        <span>&#187;</span>
        <span>&#187;</span>
      </div>

      <div className="preloader-center">
        <h1 className="preloader-title">
          <span className="preloader-title-line preloader-title-line--white">
            Packing
          </span>
          <span className="preloader-title-line preloader-title-line--yellow">
            In Progress
            <svg
              className="preloader-crown"
              viewBox="0 0 60 46"
              aria-hidden="true"
            >
              <path
                d="M4 40 L10 6 L20 24 L30 2 L40 24 L50 6 L56 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line x1="42" y1="4" x2="56" y2="14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <line x1="46" y1="16" x2="58" y2="12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </span>
        </h1>

        <div className="preloader-box-stage">
          <svg className="preloader-orbit" viewBox="0 0 420 260" aria-hidden="true">
            <ellipse
              cx="210"
              cy="130"
              rx="200"
              ry="70"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray="1 14"
              strokeLinecap="round"
            />
          </svg>

          <span className="preloader-dash preloader-dash--1" aria-hidden="true" />
          <span className="preloader-dash preloader-dash--2" aria-hidden="true" />
          <span className="preloader-dash preloader-dash--3" aria-hidden="true" />
          <span className="preloader-dash preloader-dash--4" aria-hidden="true" />

          <div className="preloader-box-float">
            <img className="preloader-box-img" src={preloaderBox} alt="" aria-hidden="true" />
            <span className="preloader-box-shadow" />
          </div>
        </div>

        <div className="preloader-progress">
          <div className="preloader-progress-track">
            <div
              className="preloader-progress-fill"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="preloader-progress-pct">{pct}%</div>
          <p className="preloader-caption">
            Preparing your packages&hellip;
            <br />
            Things are getting real.
          </p>
        </div>
      </div>

      <div className="preloader-ticker" aria-hidden="true">
        <div className="preloader-ticker-track">
          <TickerSequence />
          <TickerSequence />
        </div>
      </div>
    </div>
  );
}

export default Preloader;