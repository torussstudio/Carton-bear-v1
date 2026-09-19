import { useLayoutEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/gsapSetup';


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

      if (titleLines.length) {
        if (reducedMotion) {
          gsap.set(titleLines, {
            opacity: 1,
            y: 0,
            filter: 'none',
            rotationX: 0,
          });
        } else {
          gsap.set(titleLines, {
            opacity: 0,
            y: 60,
            filter: 'blur(28px)',
            rotationX: 0,
          });
        }
      }


      /*
       * =========================================================
       * TEXT DECODER
       * Same visual language as the Packaging description:
       *
       * transparent
       *      ↓
       * thin line
       *      ↓
       * block
       *      ↓
       * original character
       * =========================================================
       */

      const RANDOM_CHARS =
        'abcdefghijklmnopqrstuvwxyz1234567890!@#$^&*()…æ_+-=;[]/~`';

      const decodeCleanups = [];

      const randomChar = () =>
        RANDOM_CHARS[
          Math.floor(
            Math.random() * RANDOM_CHARS.length
          )
        ];


      const decodeElement = (element) => {
        if (!element || element.dataset.decoded === 'true') {
          return null;
        }

        element.dataset.decoded = 'true';

        const originalText =
          element.textContent || '';

        /*
         * Build character spans while preserving spaces
         * as normal text nodes so the original layout stays intact.
         */

        element.innerHTML = '';

        const chars = [];

        Array.from(originalText).forEach((character) => {
          if (character === ' ') {
            element.appendChild(
              document.createTextNode(' ')
            );
            return;
          }

          const span =
            document.createElement('span');

          span.className =
            'process-decode-char';

          span.dataset.original = character;

          span.textContent = randomChar();

          element.appendChild(span);

          chars.push(span);
        });

        if (!chars.length) {
          return null;
        }

        /*
         * Keep the decoder from changing the width of the title.
         * Every character keeps the width of its original glyph.
         */

        const originalWidths = chars.map(
          (char, index) => {
            const original =
              char.dataset.original;

            char.textContent = original;

            const width =
              char.getBoundingClientRect().width;

            char.textContent = randomChar();

            return width;
          }
        );

        chars.forEach((char, index) => {
          char.style.width =
            `${originalWidths[index]}px`;
        });


        const state = {
          progress: 0,
        };

        const totalCharacters =
          chars.length;

        const duration = Math.max(
          0.38,
          totalCharacters * 0.035
        );

        let lastStep = -1;

        const timeline = gsap.timeline();

        timeline.to(
          state,
          {
            progress: 1,
            duration,
            ease: 'none',

            onUpdate: () => {
              const currentStep =
                Math.min(
                  3,
                  Math.floor(
                    state.progress * 4
                  )
                );

              if (
                currentStep === lastStep
              ) {
                /*
                 * Continue changing the random glyphs
                 * even between state transitions.
                 */

                chars.forEach((char) => {
                  if (
                    !char.classList.contains(
                      'state-3'
                    )
                  ) {
                    char.textContent =
                      randomChar();
                  }
                });

                return;
              }

              lastStep = currentStep;

              chars.forEach((char) => {
                char.classList.remove(
                  'state-1',
                  'state-2',
                  'state-3'
                );

                if (currentStep >= 1) {
                  char.classList.add(
                    'state-1'
                  );
                }

                if (currentStep >= 2) {
                  char.classList.add(
                    'state-2'
                  );
                }

                if (currentStep >= 3) {
                  char.classList.add(
                    'state-3'
                  );

                  char.textContent =
                    char.dataset.original;
                }
              });
            },

            onComplete: () => {
              chars.forEach((char) => {
                char.classList.remove(
                  'state-1',
                  'state-2'
                );

                char.classList.add(
                  'state-3'
                );

                char.textContent =
                  char.dataset.original;
              });
            },
          }
        );

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
                .fromTo(
                  titleLines,
                  {
                    y: 60,
                    opacity: 0,
                    filter: 'blur(28px)',
                  },
                  {
                    y: 0,
                    opacity: 1,
                    filter: 'blur(0px)',
                    stagger: 0.12,
                    duration: 0.9,
                  }
                );

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
                  /*
                   * Decode using the same effect,
                   * then wipe the description.
                   */

                  const decodeTimeline =
                    decodeElement(title);

                  /*
                   * Keep the sequence cohesive:
                   * title decoding completes first,
                   * then the description wipes in.
                   */

                  if (decodeTimeline) {
                    decodeTimeline.call(
                      () => {
                        wipeDescription(
                          description
                        );
                      }
                    );
                  } else {
                    wipeDescription(
                      description
                    );
                  }
                } else {
                  wipeDescription(
                    description
                  );
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


      {/* =====================================================
          RESPONSIVE CSS
      ====================================================== */}

      <style>{`

        /* =====================================================
           BASE / DESKTOP
        ====================================================== */

        .process-section {
          width: 100%;
          max-width: 100%;
          min-width: 0;

          box-sizing: border-box;

          padding-top: 100px;
          padding-bottom: 100px;

          overflow-x: hidden;
        }


        .process-heading-wrap {
          width: 100%;
          max-width: 100%;

          box-sizing: border-box;

          margin-bottom: 100px;

          padding-top: 18px;
          padding-left: 30px;
          padding-right: 30px;
        }


        .process-main-title {
          width: 100%;
          max-width: 100%;

          box-sizing: border-box;

          overflow: hidden;
        }


        .process-title-line {
          display: block;

          width: 100%;

          overflow: hidden;
        }


        .process-title-line-text {
          display: block;

          width: 100%;

          font-size: clamp(
            44px,
            10.5vw,
            150px
          );

          line-height: 0.8;

          overflow-wrap: normal;
        }


        .process-row {
          width: 100%;
          max-width: 100%;

          box-sizing: border-box;

          overflow: hidden;
        }


        .process-row-inner {

          width: 100%;
          max-width: 100%;

          min-height: 120px;

          display: grid;

          grid-template-columns:
            55px
            minmax(0, 1fr)
            1px
            minmax(280px, 42%);

          align-items: center;

          box-sizing: border-box;

          padding-left: 30px;
          padding-right: 50px;
        }


        /* =====================================================
           NUMBER
        ====================================================== */

        .process-number {

          min-width: 0;

          font-family:
            'Sharp_Grotesk_PE_Trial_Book',
            serif;

          font-size:
            clamp(17px, 1.45vw, 24px);

          font-weight: 500;

          line-height: 1;

          color: #17140f;
        }


        /* =====================================================
           TITLE
        ====================================================== */

        .process-title-wrap {

          min-width: 0;

          display: flex;

          align-items: center;

          padding-right: 40px;

          box-sizing: border-box;
        }


        .process-dash {

          width: 24px;
          height: 1px;

          flex: 0 0 auto;

          margin-right: 16px;

          background: #17140f;
        }


        .process-step-title {

          min-width: 0;
          max-width: 100%;

          margin: 0;

          font-family:
            'Easy Pixel Regular',
            Arial,
            sans-serif;

          font-size:
            clamp(30px, 4vw, 58px);

          font-weight: 500;

          line-height: 0.95;

          letter-spacing: 0;

          text-transform: uppercase;

          color: #17140f;

          white-space: nowrap;

          overflow-wrap: normal;
        }


        /* =====================================================
           DIVIDER
        ====================================================== */

        .process-divider {

          width: 1px;
          height: 46px;

          justify-self: center;

          background: #17140f;
        }


        /* =====================================================
           DESCRIPTION
        ====================================================== */

        .process-description-wrap {

          min-width: 0;

          padding-left: 30px;

          box-sizing: border-box;
        }


        .process-description {

          width: 100%;
          max-width: 700px;

          margin: 0;

          font-family:
            'Easy Pixel Regular',
            Arial,
            sans-serif;

          font-size: clamp(13px, 1.95vw, 19px);

          font-weight: 500;

          line-height: 1.42;

          color: #17140f;

          overflow-wrap: break-word;

          word-break: normal;
        }


        /* =====================================================
           LARGE DESKTOP
        ====================================================== */

        @media (min-width: 1440px) {

          .process-row-inner {
            min-height: 125px;

            padding-left: 40px;
            padding-right: 60px;
          }


          .process-title-wrap {
            padding-right: 50px;
          }


          .process-description-wrap {
            padding-left: 35px;
          }

        }


        /* =====================================================
           MEDIUM DESKTOP
        ====================================================== */

        @media (max-width: 1200px) {

          .process-section {
            padding-top: 90px;
            padding-bottom: 90px;
          }


          .process-heading-wrap {
            margin-bottom: 80px;

            padding-left: 28px;
            padding-right: 28px;
          }


          .process-row-inner {

            grid-template-columns:
              50px
              minmax(0, 1fr)
              1px
              minmax(250px, 40%);

            min-height: 112px;

            padding-left: 28px;
            padding-right: 30px;
          }


          .process-step-title {
            font-size:
              clamp(27px, 4vw, 48px);
          }


          .process-title-wrap {
            padding-right: 28px;
          }


          .process-description-wrap {
            padding-left: 24px;
          }


          .process-description {
            font-size:
              clamp(12px, 1.1vw, 15px);
          }

        }


        /* =====================================================
           TABLET
        ====================================================== */

        @media (max-width: 900px) {

          .process-section {
            padding-top: 80px;
            padding-bottom: 70px;
          }


          .process-heading-wrap {
            margin-bottom: 70px;

            padding-left: 24px;
            padding-right: 24px;
          }


          .process-title-line-text {
            font-size:
              clamp(42px, 11vw, 100px);
          }


          .process-row-inner {

            grid-template-columns:
              44px
              minmax(0, 1fr)
              1px
              minmax(210px, 38%);

            min-height: 105px;

            padding-left: 24px;
            padding-right: 24px;
          }


          .process-number {
            font-size: 16px;
          }


          .process-title-wrap {
            padding-right: 20px;
          }


          .process-dash {
            width: 20px;

            margin-right: 12px;
          }


          .process-step-title {
            font-size:
              clamp(24px, 4.8vw, 42px);
          }


          .process-divider {
            height: 42px;
          }


          .process-description-wrap {
            padding-left: 20px;
          }


          .process-description {
            font-size: 12px;

            line-height: 1.38;
          }

        }


        /* =====================================================
           SMALL TABLET
        ====================================================== */

        @media (max-width: 720px) {

          .process-section {
            padding-top: 72px;
            padding-bottom: 55px;
          }


          .process-heading-wrap {
            margin-bottom: 55px;

            padding-left: 18px;
            padding-right: 18px;
          }


          .process-title-line-text {
            font-size:
              clamp(38px, 11.5vw, 82px);

            line-height: 0.82;
          }


          .process-row-inner {

            grid-template-columns:
              40px
              minmax(0, 1fr)
              1px
              minmax(170px, 36%);

            min-height: 100px;

            padding-left: 18px;
            padding-right: 18px;
          }


          .process-title-wrap {
            padding-right: 16px;
          }


          .process-dash {
            width: 17px;

            margin-right: 10px;
          }


          .process-step-title {
            font-size:
              clamp(22px, 5.5vw, 36px);
          }


          .process-description-wrap {
            padding-left: 16px;
          }


          .process-description {
            font-size: 11px;

            line-height: 1.38;
          }

        }


        /* =====================================================
           MOBILE
        ====================================================== */

        @media (max-width: 640px) {

          .process-section {

            width: 100%;

            padding-top: 65px;
            padding-bottom: 40px;

            padding-left: 0;
            padding-right: 0;

            overflow-x: hidden;
          }


          .process-heading-wrap {

            width: 100%;

            margin-bottom: 48px;

            padding-top: 10px;

            padding-left: 16px;
            padding-right: 16px;

            box-sizing: border-box;
          }


          .process-title-line-text {

            font-size:
              clamp(40px, 13vw, 72px);

            line-height: 0.82;

            letter-spacing: -0.03em;

            white-space: normal;
          }


          /*
           * ---------------------------------------------
           * MOBILE ROW
           *
           * Number + title stay on the first row.
           * Description moves below.
           * ---------------------------------------------
           */

          .process-row-inner {

            display: grid;

            grid-template-columns:
              38px
              minmax(0, 1fr);

            min-height: auto;

            width: 100%;

            padding:
              22px
              16px
              24px;

            row-gap: 15px;

            box-sizing: border-box;
          }


          .process-number {

            grid-column: 1;
            grid-row: 1;

            padding-top: 4px;

            font-size: 14px;
          }


          .process-title-wrap {

            grid-column: 2;
            grid-row: 1;

            width: 100%;

            min-width: 0;

            padding-right: 0;
          }


          .process-dash {

            width: 16px;

            margin-right: 10px;
          }


          .process-step-title {

            min-width: 0;

            font-size:
              clamp(25px, 7.8vw, 38px);

            line-height: 0.95;

            white-space: normal;

            overflow-wrap: break-word;

            word-break: normal;
          }


          .process-divider {
            display: none;
          }


          .process-description-wrap {

            grid-column: 2;
            grid-row: 2;

            width: 100%;

            min-width: 0;

            padding-left: 0;
          }


          .process-description {

            width: 100%;

            max-width: 100%;

            font-size: 11px;

            line-height: 1.45;

            overflow-wrap: break-word;
          }

        }


        /* =====================================================
           SMALL PHONES
        ====================================================== */

        @media (max-width: 480px) {

          .process-section {
            padding-top: 55px;
            padding-bottom: 32px;
          }


          .process-heading-wrap {
            margin-bottom: 40px;

            padding-left: 12px;
            padding-right: 12px;
          }


          .process-title-line-text {

            font-size:
              clamp(36px, 13vw, 62px);

            line-height: 0.84;
          }


          .process-row-inner {

            grid-template-columns:
              34px
              minmax(0, 1fr);

            padding:
              20px
              12px
              22px;

            row-gap: 14px;
          }


          .process-number {
            font-size: 12px;

            padding-top: 3px;
          }


          .process-dash {

            width: 14px;

            margin-right: 8px;
          }


          .process-step-title {

            font-size:
              clamp(22px, 7.5vw, 32px);

            line-height: 0.98;
          }


          .process-description {

            font-size: 10.5px;

            line-height: 1.45;
          }

        }


        /* =====================================================
           VERY SMALL PHONES
        ====================================================== */

        @media (max-width: 360px) {

          .process-section {
            padding-top: 48px;
            padding-bottom: 28px;
          }


          .process-heading-wrap {
            margin-bottom: 34px;

            padding-left: 10px;
            padding-right: 10px;
          }


          .process-title-line-text {

            font-size:
              clamp(32px, 12.8vw, 52px);

            line-height: 0.86;
          }


          .process-row-inner {

            grid-template-columns:
              30px
              minmax(0, 1fr);

            padding:
              18px
              10px
              20px;

            row-gap: 12px;
          }


          .process-number {
            font-size: 11px;
          }


          .process-dash {
            width: 12px;

            margin-right: 7px;
          }


          .process-step-title {

            font-size:
              clamp(20px, 7.2vw, 28px);

            line-height: 1;
          }


          .process-description {

            font-size: 10px;

            line-height: 1.42;
          }

        }


        /* =====================================================
           EXTRA SMALL DEVICES
        ====================================================== */

        @media (max-width: 320px) {

          .process-title-line-text {
            font-size: 34px;
          }


          .process-step-title {
            font-size: 19px;
          }


          .process-description {
            font-size: 9.5px;
          }

        }


        /* =====================================================
           TOUCH DEVICES
        ====================================================== */

        @media (hover: none) and (pointer: coarse) {

          .process-title-line,
          .process-row {
            transform: none;
          }

        }


        /* =====================================================
           PROCESS TITLE DECODER
           Same visual language as PackagingSection
        ====================================================== */

        .process-step-title {
          overflow: hidden;
        }

        .process-decode-char {
          position: relative;

          display: inline-block;

          color: transparent;

          text-shadow: none;

          vertical-align: baseline;

          white-space: pre;

          overflow: visible;
        }

        .process-decode-char::before {
          content: '';

          position: absolute;

          top: 50%;
          left: 50%;

          width: 0;
          height: 1.2em;

          background: #17140f;

          transform:
            translate(-50%, -55%);

          pointer-events: none;
        }

        .process-decode-char.state-1::before {
          width: 1px;
        }

        .process-decode-char.state-2::before {
          width: 0.9em;
        }

        .process-decode-char.state-3 {
          color: inherit;

          text-shadow: inherit;
        }

        .process-decode-char.state-3::before {
          width: 0;
        }


        /* =====================================================
           DESCRIPTION WIPE
           Initial state is hidden only through clipping.
           No opacity/fade is used.
        ====================================================== */

        .process-description {
          clip-path: inset(0 100% 0 0);
          -webkit-clip-path: inset(0 100% 0 0);
          will-change: clip-path;
        }


        /* =====================================================
           REDUCED MOTION
        ====================================================== */

        @media (prefers-reduced-motion: reduce) {

          .process-title-line,
          .process-row {
            animation: none !important;

            transition: none !important;

            transform: none !important;
          }

          .process-description {
            clip-path: none !important;
            -webkit-clip-path: none !important;
            will-change: auto;
          }

          .process-decode-char {
            color: inherit !important;
          }

          .process-decode-char::before {
            width: 0 !important;
          }

        }

      `}</style>

    </section>
  );
}


export default ProcessSection;