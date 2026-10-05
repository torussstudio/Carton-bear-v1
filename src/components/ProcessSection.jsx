'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap, prefersReducedMotion, SplitText } from '../lib/gsapSetup';
import './ProcessSection.css';


/*
 * =========================================================
 * PROCESS DATA
 * =========================================================
 */

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Understand',
    description:
      'We gather dimensions, quantities, branding requirements, logistics considerations, timelines, and budget expectations before production starts.',
  },

  {
    number: '02',
    title: 'Coordinate',
    description:
      'We gather dimensions, quantities, branding requirements, logistics considerations, timelines, and budget expectations before production starts.',
  },

  {
    number: '03',
    title: 'Quote & Optimize',
    description:
      'We gather dimensions, quantities, branding requirements, logistics considerations, timelines, and budget expectations before production starts.',
  },

  {
    number: '04',
    title: 'Produce',
    description:
      'We gather dimensions, quantities, branding requirements, logistics considerations, timelines, and budget expectations before production starts.',
  },

  {
    number: '05',
    title: 'Review',
    description:
      'We gather dimensions, quantities, branding requirements, logistics considerations, timelines, and budget expectations before production starts.',
  },

  {
    number: '06',
    title: 'Dispatch',
    description:
      'We gather dimensions, quantities, branding requirements, logistics considerations, timelines, and budget expectations before production starts.',
  },
];


function ProcessSection() {
  const rootRef = useRef(null);
  const titleRef = useRef(null);
  const rowsRef = useRef(null);


  /*
   * =========================================================
   * GSAP / SCROLL ANIMATIONS
   * =========================================================
   */

  useLayoutEffect(() => {
    if (!rootRef.current) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const reducedMotion = prefersReducedMotion();

      const titleLines = Array.from(
        titleRef.current?.querySelectorAll(
          '.process-title-line-text'
        ) || []
      );

      const rows = Array.from(
        rowsRef.current?.querySelectorAll(
          '.process-row'
        ) || []
      );

      /*
       * =========================================================
       * MAIN TITLE
       * Same entrance language as the Hero headline:
       * y movement + blur + opacity + stagger.
       * =========================================================
       */

      let titleSplits = [];
      let titleChars = [];

      if (titleLines.length) {
        if (reducedMotion) {
          gsap.set(titleLines, {
            opacity: 1,
            y: 0,
            filter: 'none',
            rotationX: 0,
          });
        } else {
          titleSplits = titleLines.map((line) =>
            SplitText.create(line, { type: 'words,chars' })
          );

          titleChars = titleSplits.flatMap((split) => split.chars);

          gsap.set(titleChars, { opacity: 0, y: 50 });
        }
      }


      /*
       * =========================================================
       * TITLE STAGGER
       * Same character stagger as the Services headings
       * (replaces the old decode effect).
       * =========================================================
       */

      const decodeCleanups = [];

      const staggerTitle = (element) => {
        if (!element || element.dataset.decoded === 'true') {
          return null;
        }

        element.dataset.decoded = 'true';

        const split = SplitText.create(element, {
          type: 'words,chars',
        });

        gsap.set(split.chars, { y: 18, opacity: 0 });

        const timeline = gsap.timeline();

        timeline.to(split.chars, {
          y: 0,
          opacity: 1,
          stagger: 0.025,
          duration: 0.55,
          ease: 'back.out(1.7)',
        });

        decodeCleanups.push(() => {
          timeline.kill();
        });

        return timeline;
      };


      /*
       * =========================================================
       * DESCRIPTION WIPE
       * Left -> right, with no fade.
       * =========================================================
       */

      const wipeDescription = (element) => {
        if (!element) {
          return;
        }

        gsap.fromTo(
          element,
          {
            clipPath:
              'inset(0 100% 0 0)',
            webkitClipPath:
              'inset(0 100% 0 0)',
          },
          {
            clipPath:
              'inset(0 0% 0 0)',
            webkitClipPath:
              'inset(0 0% 0 0)',
            duration: 0.9,
            ease: 'power3.inOut',
            overwrite: true,
          }
        );
      };


      /*
       * =========================================================
       * SECTION ENTRY
       * Trigger the large title once the section enters
       * the viewport, using the same timing language as Hero.
       * =========================================================
       */

      if (reducedMotion) {
        gsap.set(titleLines, {
          opacity: 1,
          y: 0,
          filter: 'none',
        });

        rows.forEach((row) => {
          gsap.set(row, {
            opacity: 1,
            y: 0,
          });

          const title =
            row.querySelector(
              '.process-step-title'
            );

          const description =
            row.querySelector(
              '.process-description'
            );

          if (title) {
            title.dataset.decoded = 'true';
          }

          if (description) {
            gsap.set(description, {
              clipPath: 'none',
              webkitClipPath: 'none',
            });
          }
        });

        return;
      }


      const sectionObserver =
        new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) {
                return;
              }

              gsap
                .timeline({
                  defaults: {
                    ease: 'power3.out',
                  },
                })
                .to(titleChars, {
                  y: 0,
                  opacity: 1,
                  stagger: 0.03,
                  duration: 0.8,
                  ease: 'power3.out',
                });

              sectionObserver.unobserve(
                entry.target
              );
            });
          },
          {
            threshold: 0.18,
          }
        );


      sectionObserver.observe(
        rootRef.current
      );


      /*
       * =========================================================
       * PROCESS ROWS
       *
       * Each row gets its own:
       * 1. title decoding
       * 2. description left -> right wipe
       *
       * They trigger naturally as each row enters the viewport.
       * =========================================================
       */

      const rowObservers = [];

      rows.forEach((row) => {
        const title =
          row.querySelector(
            '.process-step-title'
          );

        const description =
          row.querySelector(
            '.process-description'
          );

        if (!title && !description) {
          return;
        }

        if (description) {
          gsap.set(description, {
            clipPath:
              'inset(0 100% 0 0)',
            webkitClipPath:
              'inset(0 100% 0 0)',
          });
        }

        const observer =
          new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                  return;
                }

                /*
                 * Decode title first.
                 * The wipe starts immediately after the
                 * decoder completes, keeping the two effects
                 * visually connected without a fade.
                 */

                if (title) {
                  const staggerTimeline = staggerTitle(title);

                  if (staggerTimeline) {
                    /* description wipe starts while the title is still landing */
                    staggerTimeline.call(
                      () => wipeDescription(description),
                      null,
                      0.35
                    );
                  } else {
                    wipeDescription(description);
                  }
                } else {
                  wipeDescription(description);
                }

                observer.unobserve(
                  entry.target
                );
              });
            },
            {
              threshold: 0.22,
            }
          );

        observer.observe(row);
        rowObservers.push(observer);
      });


      return () => {
        sectionObserver.disconnect();

        rowObservers.forEach(
          (observer) =>
            observer.disconnect()
        );

        decodeCleanups.forEach(
          (cleanup) => cleanup()
        );

        gsap.killTweensOf(
          '.process-description'
        );
      };

    }, rootRef);


    return () => {
      ctx.revert();
    };

  }, []);


  return (
    <section
      ref={rootRef}
      className="
        process-section
        relative
        overflow-hidden
        bg-[#d3d818]
      "
    >

      {/* =====================================================
          NOISE TEXTURE
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-10
          mix-blend-multiply
        "
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />


      {/* =====================================================
          HEADING
      ====================================================== */}

      <div
        className="
          relative
          mx-auto
          process-heading-wrap
        "
      >

        {/* SVG intentionally hidden */}

        <svg
          className="hidden"
          viewBox="0 0 620 260"
          aria-hidden="true"
        >
          <path
            d="M64,158 C58,86 182,42 322,42 C464,42 566,78 566,142 C566,198 462,228 320,228 C214,228 128,210 78,180"
            fill="none"
            stroke="rgba(43, 58, 87, 0.55)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>


        {/* STAR intentionally hidden */}

        <svg
          className="hidden"
          viewBox="0 0 40 40"
          aria-hidden="true"
        >
          <path
            d="M20 1 C21.5 14 26 18.5 39 20 C26 21.5 21.5 26 20 39 C18.5 26 14 21.5 1 20 C14 18.5 18.5 14 20 1 Z"
            fill="#ff0000"
          />
        </svg>


        <h2
          ref={titleRef}
          className="
            relative
            z-[1]
            m-0
            text-center
            font-['Sharp_Grotesk_PE_Trial_Black',sans-serif]
            font-normal
            uppercase
            leading-[0.8]
            text-[#ff0000]
            process-main-title
          "
        >

          <span className="process-title-line block">

            <span className="block process-title-line-text">
              Clear Process
            </span>

          </span>


          <span className="process-title-line block">

            <span
              className="
                block
                process-title-line-text
              "
            >
              No Chaos
            </span>

          </span>

        </h2>

      </div>


      {/* =====================================================
          PROCESS LIST
      ====================================================== */}

      <div
        ref={rowsRef}
        className="
          relative
          z-[1]
          w-full
        "
      >

        {PROCESS_STEPS.map((step) => (

          <div
            key={step.number}
            className="
              process-row
              border-b
              border-[rgba(23,20,15,0.28)]
            "
          >

            <div className="process-row-inner">


              {/* =================================================
                  NUMBER
              ================================================== */}

              <div className="process-number">
                {step.number}
              </div>


              {/* =================================================
                  TITLE
              ================================================== */}

              <div className="process-title-wrap">

                <span
                  className="process-dash"
                  aria-hidden="true"
                />

                <h3 className="process-step-title">
                  {step.title}
                </h3>

              </div>


              {/* =================================================
                  DIVIDER
              ================================================== */}

              <div
                className="process-divider"
                aria-hidden="true"
              />


              {/* =================================================
                  DESCRIPTION
              ================================================== */}

              <div className="process-description-wrap">

                <p className="process-description">
                  {step.description}
                </p>

              </div>

            </div>

          </div>

        ))}

      </div>


      {/* Responsive CSS lives in ./ProcessSection.css */}
    </section>
  );
}


export default ProcessSection;