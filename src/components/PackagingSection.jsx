import { useLayoutEffect, useRef } from 'react';
import girlVideo from '../Videos/Eye Closing Video Animation.mp4';
import './PackagingSection.css';

import {
  gsap,
  ScrollTrigger,
  prefersReducedMotion,
} from '../lib/gsapSetup';

const DESCRIPTION =
  "BECAUSE PACKAGING ISN'T JUST PROTECTION. IT'S PERCEPTION. IT'S RECALL. IT'S RETENTION. IT'S ONE OF THE BIGGEST BRAND TOUCHPOINTS YOU HAVE>>";

/*
 * Decode timing knobs.
 *
 * CHAR_INTERVAL - delay between one character starting its
 *                 decode and the next (in shuffled order).
 *                 0.02 = 50 chars/sec (~2.3s total).
 *
 * STAGE_GAP     - time between line -> block -> visible
 *                 for a single character (demo used 100ms).
 */

const CHAR_INTERVAL = 0.02;
const STAGE_GAP = 0.06;

const STATE_CLASSES = ['state-1', 'state-2', 'state-3'];

/*
 * Scroll-scrubbed video zoom.
 *
 * The video starts at this scale and eases down to 1
 * (fully zoomed out) by the time it is completely on screen.
 * 1.1 = subtle zoom. Raise for a stronger zoom.
 */

const VIDEO_START_SCALE = 1.1;

function shuffle(array) {
  const result = array.slice();

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

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
     * Hoisted so the cleanup function can kill it.
     */

    let decodeTimeline = null;

    ctx = gsap.context(() => {
      const words =
        title.querySelectorAll('.word');

      const backgrounds =
        title.querySelectorAll('.word-bg');

      /*
       * ========================================================
       * DESCRIPTION CHARACTERS
       * ========================================================
       *
       * Words stay inline-block so wrapping is identical to
       * before. Every character inside a word is its own span,
       * which is the unit that decodes:
       *
       * Transparent -> Line -> Block -> Visible
       */

      const descriptionWords =
        DESCRIPTION.split(' ');

      description.innerHTML = '';

      /*
       * Every animated character, in reading order.
       */

      const charElements = [];

      descriptionWords.forEach(
        (word, index) => {
          const wordEl =
            document.createElement('span');

          wordEl.className =
            'packaging-desc-word';

          wordEl.setAttribute(
            'aria-hidden',
            'true'
          );

          Array.from(word).forEach(
            (character) => {
              const charEl =
                document.createElement('span');

              charEl.className =
                'packaging-desc-char';

              charEl.textContent = character;

              wordEl.appendChild(charEl);

              charElements.push(charEl);
            }
          );

          /*
           * Trailing space stays a plain text node
           * (the word is white-space: pre), so the
           * gap between words never animates and
           * layout is unchanged.
           */

          if (
            index <
            descriptionWords.length - 1
          ) {
            wordEl.appendChild(
              document.createTextNode(' ')
            );
          }

          description.appendChild(wordEl);
        }
      );

      /*
       * ========================================================
       * INITIAL DESCRIPTION STATE
       * ========================================================
       *
       * The ENTIRE description is hidden.
       *
       * It does not decode or reveal until the
       * BRANDS animation has completely finished.
       *
       * Individual characters are transparent via CSS
       * until their own decode turn.
       */

      gsap.set(description, {
        opacity: 0,
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

        gsap.set(description, {
          opacity: 1,
        });

        charElements.forEach((el) =>
          el.classList.add('state-3')
        );

        return;
      }

      /*
       * ========================================================
       * DESCRIPTION DECODING
       * ========================================================
       *
       * Ported from the demo: each character steps through
       * state-1 (line), state-2 (block), state-3 (visible),
       * in a shuffled order. Driven by one GSAP timeline
       * instead of setTimeout, so it can be killed cleanly.
       *
       * No hover trigger, no refresh button, no setInterval.
       */

      function resetDescription() {
        decodeTimeline?.kill();

        decodeTimeline = null;

        charElements.forEach((el) =>
          el.classList.remove(...STATE_CLASSES)
        );
      }

      function decodeDescription() {
        resetDescription();

        decodeTimeline = gsap.timeline();

        shuffle(charElements).forEach(
          (el, order) => {
            const start =
              order * CHAR_INTERVAL;

            decodeTimeline
              .call(
                () =>
                  el.classList.add('state-1'),
                null,
                start
              )
              .call(
                () =>
                  el.classList.add('state-2'),
                null,
                start + STAGE_GAP
              )
              .call(
                () =>
                  el.classList.add('state-3'),
                null,
                start + STAGE_GAP * 2
              );
          }
        );
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
           * Start decoding the moment the BRANDS flip
           * lands, without waiting for the white wipe
           * behind it. The container appears instantly;
           * every character is still transparent until
           * its own randomized turn.
           */

          onComplete: () => {
            gsap.set(description, {
              opacity: 1,
            });

            decodeDescription();
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
      decodeTimeline?.kill();

      ctx?.revert();
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