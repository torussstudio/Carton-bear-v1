'use client';

import { useLayoutEffect, useRef } from 'react';
import './PackagingSection.css';

import {
  gsap,
  ScrollTrigger,
  SplitText,
  prefersReducedMotion,
} from '../lib/gsapSetup';

const DESCRIPTION =
  "BECAUSE PACKAGING ISN'T JUST PROTECTION. IT'S PERCEPTION. IT'S RECALL. IT'S RETENTION. IT'S ONE OF THE BIGGEST BRAND TOUCHPOINTS YOU HAVE>>";

/*
 * Scroll-scrubbed video zoom.
 *
 * The video starts at this scale and eases down to 1
 * (fully zoomed out) by the time it is completely on screen.
 * 1.1 = subtle zoom. Raise for a stronger zoom.
 */

const VIDEO_START_SCALE = 1.1;

// Served from /public/videos (Next.js doesn't bundle video imports).
const girlVideo = '/videos/eye-closing-video-animation.mp4';

function PackagingSection() {
  const rootRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const videoWrapRef = useRef(null);
  const videoRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const title = titleRef.current;
    const description = descriptionRef.current;

    if (!root || !title || !description) {
      return undefined;
    }

    let ctx;

    /*
     * Hoisted so the cleanup function can revert / kill them.
     */

    let split = null;
    let revealTween = null;

    ctx = gsap.context(() => {
      const words =
        title.querySelectorAll('.word');

      const backgrounds =
        title.querySelectorAll('.word-bg');

      /*
       * ========================================================
       * DESCRIPTION WORDS  (same staggering reveal as the Hero)
       * ========================================================
       *
       * Reuses the Hero kicker animation exactly: SplitText into
       * words, then words rise 50px from below with a 28px blur,
       * fading in with a 0.03s stagger and a back.out(1.7) ease
       * (see HeroSection.jsx).
       *
       * The tween is created paused. `gsap.from` renders the
       * hidden start state immediately, so the words stay hidden
       * until the BRANDS flip lands and we play it.
       */

      description.textContent = DESCRIPTION;

      split = new SplitText(description, {
        type: 'words',
        wordsClass: 'packaging-desc-word',
      });

      /*
       * The paragraph itself is visible; each word hides itself.
       */

      gsap.set(description, {
        opacity: 1,
      });

      revealTween = gsap.from(split.words, {
        y: 50,
        opacity: 0,
        filter: 'blur(28px)',
        stagger: 0.03,
        duration: 1,
        ease: 'back.out(1.7)',
        paused: true,
      });

      /*
       * ========================================================
       * TITLE INITIAL STATE
       * ========================================================
       */

      gsap.set(words, {
        opacity: 0,
        y: 45,
        rotationX: -72,
        rotationY: 7,
        z: -100,
        transformOrigin: '50% 100%',
        transformStyle: 'preserve-3d',
      });

      gsap.set(backgrounds, {
        scaleX: 0,
        transformOrigin: 'left center',
      });

      /*
       * ========================================================
       * REDUCED MOTION
       * ========================================================
       */

      if (prefersReducedMotion()) {
        gsap.set(words, {
          opacity: 1,
          y: 0,
          rotationX: 0,
          rotationY: 0,
          z: 0,
        });

        gsap.set(backgrounds, {
          scaleX: 1,
        });

        revealTween.progress(1).pause();

        return;
      }

      /*
       * ========================================================
       * MASTER TITLE TIMELINE
       * ========================================================
       */

      const masterTimeline =
        gsap.timeline({
          scrollTrigger: {
            trigger: title,

            start: 'top 90%',

            toggleActions:
              'play none none reverse',

            invalidateOnRefresh: true,
          },

          defaults: {
            ease: 'power3.out',
          },

          /*
           * Scrolling back above the section rewinds the title;
           * re-hide the description words so the stagger can
           * play again next time.
           */

          onReverseComplete: () => {
            revealTween.pause(0);
          },
        });

      /*
       * ========================================================
       * PACKAGING
       * ========================================================
       */

      masterTimeline.to(words[0], {
        opacity: 1,

        y: 0,

        rotationX: 0,

        rotationY: 0,

        z: 0,

        duration: 0.55,

        ease: 'power3.out',
      });

      /*
       * ========================================================
       * PACKAGING WIPE
       * ========================================================
       */

      masterTimeline.to(
        backgrounds[0],
        {
          scaleX: 1,

          duration: 0.85,

          ease: 'power2.inOut',
        },
        '>-0.02'
      );

      /*
       * ========================================================
       * THAT / ACTUALLY / BUILDS
       * ========================================================
       *
       * No stagger.
       */

      masterTimeline.to(
        [
          words[1],
          words[2],
          words[3],
        ],
        {
          opacity: 1,

          y: 0,

          rotationX: 0,

          rotationY: 0,

          z: 0,

          duration: 0.55,

          ease: 'power3.out',

          stagger: 0,
        },
        '>-0.02'
      );

      /*
       * ========================================================
       * BUILDS WIPE
       * ========================================================
       */

      masterTimeline.to(
        backgrounds[1],
        {
          scaleX: 1,

          duration: 0.85,

          ease: 'power2.inOut',
        },
        '>-0.02'
      );

      /*
       * ========================================================
       * BRANDS FLIP
       * ========================================================
       */

      masterTimeline.to(
        words[4],
        {
          opacity: 1,

          y: 0,

          rotationX: 0,

          rotationY: 0,

          z: 0,

          duration: 0.55,

          ease: 'power3.out',

          /*
           * Start the description stagger the moment the
           * BRANDS flip lands, without waiting for the white
           * wipe behind it.
           */

          onComplete: () => {
            revealTween.restart();
          },
        },
        '<'
      );

      /*
       * ========================================================
       * BRANDS WIPE
       * ========================================================
       *
       * The master timeline DOES NOT finish until
       * this wipe is completely finished.
       *
       * Only then does onComplete() run.
       */

      masterTimeline.to(
        backgrounds[2],
        {
          scaleX: 1,

          duration: 0.85,

          ease: 'power2.inOut',
        },
        '>-0.02'
      );

      /*
       * ========================================================
       * VIDEO SCROLL ZOOM
       * ========================================================
       *
       * Fully scroll-driven (scrub): scrolling down zooms the
       * video out, scrolling up zooms it back in.
       *
       * start: wrapper top touches the bottom of the viewport
       * end:   wrapper bottom reaches the bottom of the viewport
       *        (video fully on screen) -> scale is exactly 1.
       */

      const videoWrap = videoWrapRef.current;
      const video = videoRef.current;

      if (videoWrap && video) {
        gsap.fromTo(
          video,
          {
            scale: VIDEO_START_SCALE,
            transformOrigin: '50% 50%',
          },
          {
            scale: 1,

            ease: 'none',

            force3D: true,

            scrollTrigger: {
              trigger: videoWrap,

              start: 'top bottom',

              end: 'bottom bottom',

              scrub: 0.5,

              invalidateOnRefresh: true,
            },
          }
        );
      }
    }, root);

    return () => {
      revealTween?.kill();

      ctx?.revert();

      split?.revert();
    };
  }, []);

  return (
    <section
      className="packaging"
      ref={rootRef}
    >
      {/* ======================================================
          TITLE
          ====================================================== */}

      <h2
        ref={titleRef}
        className="packaging-title"
      >
        <span className="title-line">
          <span className="word-wrap">
            <span className="word-bg" />

            <span className="word word-blue">
              Packaging
            </span>
          </span>
        </span>

        <span className="title-line">
          <span className="word-wrap">
            <span className="word">
              That
            </span>
          </span>

          <span className="word-wrap">
            <span className="word">
              Actually
            </span>
          </span>

          <span className="word-wrap word-wrap--builds">
            <span className="word word-gold">
              Builds
            </span>

            <span className="word-bg" />
          </span>
        </span>

        <span className="title-line">
          <span className="word-wrap">
            <span className="word word-gold">
              Brands.
            </span>

            <span className="word-bg" />
          </span>
        </span>
      </h2>

      {/* ======================================================
          DESCRIPTION
          ====================================================== */}

      <p
        ref={descriptionRef}
        className="packaging-desc"
        aria-label={DESCRIPTION}
      />

      {/* ======================================================
          VIDEO
          ====================================================== */}

      <div
        ref={videoWrapRef}
        className="packaging-video-wrap"
      >
        <video
          ref={videoRef}
          className="packaging-video"
          src={girlVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </div>
    </section>
  );
}

export default PackagingSection;