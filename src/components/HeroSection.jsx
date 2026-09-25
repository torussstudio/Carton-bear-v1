import { useLayoutEffect, useRef } from 'react';
import Nav from './Nav.jsx';
import {
  gsap,
  SplitText,
  prefersReducedMotion,
} from '../lib/gsapSetup';
import './HeroSection.css';
import './Nav.css';

import heroVideo from '../Videos/Hero-bear-video.mp4';
import heroVideoMobile from '../Videos/Hero-bear-video-mobile.mp4';

function HeroSection() {
  const rootRef = useRef(null);
  const kickerRef = useRef(null);
  const videoRef = useRef(null);

  // Existing entrance timeline — now held until the preloader signals it's
  // actually done, so it can't play out underneath the overlay unseen.
  useLayoutEffect(() => {
    if (
      prefersReducedMotion() ||
      !rootRef.current ||
      !kickerRef.current
    ) {
      return undefined;
    }

    let split;
    let ctx;
    let hasRun = false;

    const runTimeline = () => {
      if (hasRun) return;

      hasRun = true;

      ctx = gsap.context(() => {
        split = new SplitText(kickerRef.current, {
          type: 'words',
          wordsClass: 'bear-hero-kicker__word',
        });

        gsap
          .timeline({
            defaults: {
              ease: 'power3.out',
            },
            delay: 0.15,
          })

          .from('.bear-nav-logo', {
            opacity: 0,
            y: -18,
            duration: 0.7,
          })

          .from(
            '.bear-nav-links .bear-pill',
            {
              opacity: 0,
              y: -16,
              stagger: 0.1,
              duration: 0.6,
            },
            '-=0.4'
          )

          .from(
            '.bear-hero-title-line',
            {
              y: 60,
              opacity: 0,
              filter: 'blur(28px)',
              stagger: 0.12,
              duration: 0.9,
            },
            '-=0.2'
          )

          .from(
            split.words,
            {
              y: 50,
              opacity: 0,
              filter: 'blur(28px)',
              stagger: 0.03,
              duration: 1,
              ease: 'back.out(1.7)',
            },
            '-=0.35'
          )

          .from(
            '.bear-hero-ctas .bear-pill',
            {
              opacity: 0,
              y: 24,
              stagger: 0.12,
              duration: 0.7,
            },
            '-=0.55'
          );
      }, rootRef);
    };

    // If the preloader already finished (or isn't in the tree at all by the
    // time this mounts), go immediately. Otherwise wait for its signal.
    if (
      typeof window !== 'undefined' &&
      window.__preloaderDone
    ) {
      runTimeline();

      return () => {
        ctx?.revert();
        split?.revert();
      };
    }

    const handlePreloaderDone = () => {
      clearTimeout(fallback);
      runTimeline();
    };

    window.addEventListener(
      'preloader:done',
      handlePreloaderDone,
      { once: true }
    );

    // Safety net: if a page ever renders HeroSection without a Preloader,
    // don't leave the entrance stuck waiting forever.
    const fallback = window.setTimeout(() => {
      window.removeEventListener(
        'preloader:done',
        handlePreloaderDone
      );

      runTimeline();
    }, 4000);

    return () => {
      window.removeEventListener(
        'preloader:done',
        handlePreloaderDone
      );

      clearTimeout(fallback);

      ctx?.revert();
      split?.revert();
    };
  }, []);


  // Existing cinematic 3D pointer-reactive video effect
  useLayoutEffect(() => {
    const hero = rootRef.current;
    const video = videoRef.current;

    if (!hero || !video) {
      return undefined;
    }

    const supportsFinePointer =
      typeof window !== 'undefined' &&
      window.matchMedia(
        '(hover: hover) and (pointer: fine)'
      ).matches;

    if (
      prefersReducedMotion() ||
      !supportsFinePointer
    ) {
      return undefined;
    }

    // Subtle, "premium" ranges — never cheap tilt-card territory
    const MAX_TRANSLATE = 14;
    const MAX_ROTATE = 4;
    const BASE_SCALE = 1.1;
    const ACTIVE_SCALE = 1.14;

    const bounds = {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    };

    const updateBounds = () => {
      const rect =
        hero.getBoundingClientRect();

      bounds.left = rect.left;
      bounds.top = rect.top;
      bounds.width = rect.width;
      bounds.height = rect.height;
    };

    gsap.set(video, {
      transformPerspective: 1200,
      transformOrigin: 'center center',
      scale: BASE_SCALE,
      force3D: true,
    });

    const xTo = gsap.quickTo(
      video,
      'x',
      {
        duration: 1.1,
        ease: 'power3.out',
      }
    );

    const yTo = gsap.quickTo(
      video,
      'y',
      {
        duration: 1.1,
        ease: 'power3.out',
      }
    );

    const rotateXTo = gsap.quickTo(
      video,
      'rotateX',
      {
        duration: 1.3,
        ease: 'power3.out',
      }
    );

    const rotateYTo = gsap.quickTo(
      video,
      'rotateY',
      {
        duration: 1.3,
        ease: 'power3.out',
      }
    );

    const scaleTo = gsap.quickTo(
      video,
      'scale',
      {
        duration: 1.4,
        ease: 'power3.out',
      }
    );

    const handlePointerMove = (event) => {
      if (
        !bounds.width ||
        !bounds.height
      ) {
        return;
      }

      const relX =
        (event.clientX - bounds.left) /
        bounds.width;

      const relY =
        (event.clientY - bounds.top) /
        bounds.height;

      const normX =
        gsap.utils.clamp(
          -1,
          1,
          relX * 2 - 1
        );

      const normY =
        gsap.utils.clamp(
          -1,
          1,
          relY * 2 - 1
        );

      xTo(normX * MAX_TRANSLATE);
      yTo(normY * MAX_TRANSLATE);

      rotateYTo(
        normX * MAX_ROTATE
      );

      rotateXTo(
        -normY * MAX_ROTATE
      );

      scaleTo(ACTIVE_SCALE);
    };

    const handlePointerEnter = () => {
      updateBounds();
    };

    const handlePointerLeave = () => {
      xTo(0);
      yTo(0);

      rotateXTo(0);
      rotateYTo(0);

      scaleTo(BASE_SCALE);
    };

    updateBounds();

    window.addEventListener(
      'resize',
      updateBounds
    );

    hero.addEventListener(
      'mouseenter',
      handlePointerEnter
    );

    hero.addEventListener(
      'mousemove',
      handlePointerMove
    );

    hero.addEventListener(
      'mouseleave',
      handlePointerLeave
    );

    return () => {
      window.removeEventListener(
        'resize',
        updateBounds
      );

      hero.removeEventListener(
        'mouseenter',
        handlePointerEnter
      );

      hero.removeEventListener(
        'mousemove',
        handlePointerMove
      );

      hero.removeEventListener(
        'mouseleave',
        handlePointerLeave
      );

      xTo.tween?.kill();
      yTo.tween?.kill();
      rotateXTo.tween?.kill();
      rotateYTo.tween?.kill();
      scaleTo.tween?.kill();

      gsap.set(video, {
        clearProps: 'transform',
      });
    };
  }, []);


  return (
    <div
      className="bear-hero"
      ref={rootRef}
    >

      {/* =========================================
          RESPONSIVE HERO VIDEO

          Desktop / tablet:
          Hero-bear-video.mp4

          Mobile <= 640px:
          Hero-bear-video-mobile.mp4
      ========================================== */}

      <video
        ref={videoRef}
        className="bear-hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source
          src={heroVideoMobile}
          type="video/mp4"
          media="(max-width: 640px)"
        />

        <source
          src={heroVideo}
          type="video/mp4"
        />
      </video>


      <div
        className="bear-hero-grid"
        aria-hidden="true"
      />


      <div className="bear-hero-layer">

        <Nav />


        <div className="bear-hero-content">

          <h1 className="bear-hero-title">

            <span className="bear-hero-title-line bear-hero-title-line--sub">
              Packaging that actually
            </span>

            <span className="bear-hero-title-line bear-hero-title-line--main">
              Understands
            </span>

            <span className="bear-hero-title-line bear-hero-title-line--main">
              Branding.
            </span>

          </h1>


          <p
            className="bear-hero-kicker"
            ref={kickerRef}
          >
            For D2C brands, ecommerce businesses, agencies, and growing
            consumer brands. From dieline to doorstep.
          </p>


          <div className="bear-hero-ctas">

            <button
              type="button"
              className="bear-pill bear-pill--solid"
            >
              GOT A PACK IDEA ?
            </button>

            <button
              type="button"
              className="bear-pill bear-pill--outline"
            >
              MAKE YOUR MOVE
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default HeroSection;