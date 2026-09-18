import { useLayoutEffect, useRef } from 'react';
import girlVideo from '../Videos/Eye Closing Video Animation.mp4';
import './PackagingSection.css';
import {
  gsap,
  ScrollTrigger,
  SplitText,
  prefersReducedMotion,
} from '../lib/gsapSetup';

function PackagingSection() {
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const videoRef = useRef(null);

  useLayoutEffect(() => {
    const title = titleRef.current;
    const description = descriptionRef.current;
    const video = videoRef.current;

    if (!title) return;

    const ctx = gsap.context(() => {
      const words = title.querySelectorAll('.word');
      const backgrounds = title.querySelectorAll('.word-bg');

      if (!words.length) return;

      /*
       * ==========================================================
       * REDUCED MOTION
       * ==========================================================
       */

      if (prefersReducedMotion()) {
        gsap.set(words, {
          clearProps: 'all',
          opacity: 1,
        });

        gsap.set(backgrounds, {
          clearProps: 'all',
          scaleX: 1,
        });

        if (description) {
          gsap.set(description, {
            clearProps: 'all',
            opacity: 1,
          });
        }

        return;
      }

      /*
       * ==========================================================
       * TITLE INITIAL STATE
       * ==========================================================
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

      /*
       * White backgrounds start closed.
       */

      gsap.set(backgrounds, {
        scaleX: 0,
        transformOrigin: 'left center',
      });

      /*
       * ==========================================================
       * DESCRIPTION SPLIT
       * ==========================================================
       */

      let descriptionSplit = null;

      if (description && SplitText) {
        descriptionSplit = SplitText.create(description, {
          type: 'chars',
        });

        gsap.set(descriptionSplit.chars, {
          y: 22,
          opacity: 0,
        });
      }

      /*
       * ==========================================================
       * TITLE MASTER TIMELINE
       * ==========================================================
       */

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: title,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
          invalidateOnRefresh: true,
        },
      });

      /*
       * ==========================================================
       * 1. PACKAGING
       * ==========================================================
       */

      tl.to(words[0], {
        opacity: 1,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        z: 0,

        duration: 0.55,

        ease: 'power3.out',
      });

      /*
       * Packaging white wipe
       */

      tl.to(
        backgrounds[0],
        {
          scaleX: 1,

          duration: 0.85,

          ease: 'power2.inOut',
        },
        '>-0.02'
      );

      /*
       * ==========================================================
       * 2. THAT + ACTUALLY + BUILDS
       * ==========================================================
       *
       * All three words flip together.
       */

      tl.to(
        [words[1], words[2], words[3]],
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
       * ==========================================================
       * 3. BUILDS WHITE WIPE
       * ==========================================================
       */

      tl.to(
        backgrounds[1],
        {
          scaleX: 1,

          duration: 0.85,

          ease: 'power2.inOut',
        },
        '>-0.02'
      );

      /*
       * ==========================================================
       * 4. BRANDS
       * ==========================================================
       */

      tl.to(
        words[4],
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          rotationY: 0,
          z: 0,

          duration: 0.55,

          ease: 'power3.out',
        },
        '<'
      );

      /*
       * ==========================================================
       * 5. BRANDS WHITE WIPE
       * ==========================================================
       */

      tl.to(
        backgrounds[2],
        {
          scaleX: 1,

          duration: 0.85,

          ease: 'power2.inOut',
        },
        '>-0.02'
      );

      /*
       * ==========================================================
       * 6. DESCRIPTION
       * ==========================================================
       */

      if (descriptionSplit) {
        tl.to(
          descriptionSplit.chars,
          {
            y: 0,
            opacity: 1,

            stagger: 0.03,

            duration: 0.6,

            ease: 'back.out(1.7)',
          },
          '<'
        );
      }

      /*
       * ==========================================================
       * VIDEO CURSOR INTERACTION
       * ==========================================================
       */

      if (video) {
        const videoX = gsap.quickTo(video, 'x', {
          duration: 0.55,
          ease: 'power3.out',
        });

        const videoY = gsap.quickTo(video, 'y', {
          duration: 0.55,
          ease: 'power3.out',
        });

        const videoRotationX = gsap.quickTo(
          video,
          'rotationX',
          {
            duration: 0.65,
            ease: 'power3.out',
          }
        );

        const videoRotationY = gsap.quickTo(
          video,
          'rotationY',
          {
            duration: 0.65,
            ease: 'power3.out',
          }
        );

        const handlePointerMove = (event) => {
          if (event.pointerType === 'touch') return;

          const rect = video.getBoundingClientRect();

          if (!rect.width || !rect.height) return;

          const relativeX =
            ((event.clientX - rect.left) / rect.width) * 2 - 1;

          const relativeY =
            ((event.clientY - rect.top) / rect.height) * 2 - 1;

          const x = gsap.utils.clamp(
            -1,
            1,
            relativeX
          );

          const y = gsap.utils.clamp(
            -1,
            1,
            relativeY
          );

          videoX(x * 10);
          videoY(y * 8);

          videoRotationX(y * -5);
          videoRotationY(x * 7);
        };

        const handlePointerLeave = () => {
          videoX(0);
          videoY(0);
          videoRotationX(0);
          videoRotationY(0);
        };

        video.addEventListener(
          'pointermove',
          handlePointerMove,
          { passive: true }
        );

        video.addEventListener(
          'pointerleave',
          handlePointerLeave
        );

        video._packagingCursorCleanup = () => {
          video.removeEventListener(
            'pointermove',
            handlePointerMove
          );

          video.removeEventListener(
            'pointerleave',
            handlePointerLeave
          );
        };
      }

      /*
       * ==========================================================
       * CLEANUP
       * ==========================================================
       */

      return () => {
        if (descriptionSplit) {
          descriptionSplit.revert();
        }

        if (
          video &&
          video._packagingCursorCleanup
        ) {
          video._packagingCursorCleanup();

          delete video._packagingCursorCleanup;
        }
      };
    }, title);

    return () => {
      ctx.revert();

      if (
        video &&
        video._packagingCursorCleanup
      ) {
        video._packagingCursorCleanup();

        delete video._packagingCursorCleanup;
      }
    };
  }, []);

  return (
    <div className="packaging">

      {/* ======================================================
          MAIN TITLE
          ====================================================== */}

      <h2
        ref={titleRef}
        className="packaging-title"
        style={{
          textAlign: 'left',
        }}
      >

        {/* ====================================================
            LINE 1 — PACKAGING
            ==================================================== */}

        <span
          className="title-line"
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'left',
          }}
        >
          <span
            className="word-wrap"
            style={{
              display: 'inline-block',
            }}
          >
            <span className="word-bg" />

            <span className="word word-blue">
              Packaging
            </span>
          </span>
        </span>


        {/* ====================================================
            LINE 2 — THAT ACTUALLY BUILDS
            ==================================================== */}

        <span
          className="title-line"
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'left',
          }}
        >
          <span
            className="word-wrap"
            style={{
              display: 'inline-block',
            }}
          >
            <span className="word">
              That
            </span>
          </span>

          <span
            className="word-wrap"
            style={{
              display: 'inline-block',
            }}
          >
            <span className="word">
              Actually
            </span>
          </span>

          <span
            className="word-wrap"
            style={{
              display: 'inline-block',
            }}
          >
            <span className="word word-gold">
              Builds
            </span>

            <span className="word-bg" />
          </span>
        </span>


        {/* ====================================================
            LINE 3 — BRANDS.
            ==================================================== */}

        <span
          className="title-line"
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'left',
          }}
        >
          <span
            className="word-wrap"
            style={{
              display: 'inline-block',
            }}
          >
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
      >
        Because packaging isn&apos;t just protection. It&apos;s perception.
        It&apos;s recall. It&apos;s retention. It&apos;s one of the biggest
        brand touchpoints you have&gt;&gt;
      </p>


      {/* ======================================================
          VIDEO
          ====================================================== */}

      <video
        ref={videoRef}
        className="packaging-video"
        src={girlVideo}
        autoPlay
        muted
        loop
        playsInline
      />

    </div>
  );
}

export default PackagingSection;