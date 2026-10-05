'use client';

import { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import bearHand from '../images/Bear-hand.webp';
import { gsap, ScrollTrigger, prefersReducedMotion, SplitText } from '../lib/gsapSetup';
import './Nav.css';
import './WithoutUsSection.css';

const PAIN_POINTS = [
  'Fragmented Communication',
  'Unreliable Follow-Ups',
  'Vendor Confusion',
  'Production Blind Spots',
];

/*
  NODE / CALLOUT DATA
  ------------------------------------------------------------------
  Order below is the exact scroll sequence the section plays through
  while pinned: Vendor Communication -> Production Management ->
  Packaging Execution -> Export Readiness -> Dispatch Support.

  `dotX/dotY`  - where the endpoint dot (and label) sit.
  `path`       - authored from the BOX end to the DOT end so the
                 stroke-dashoffset draw animation grows bottom -> top,
                 ending exactly on the dot.
  `mobile`     - label position for phones (<= 600px). The labels are
                 drawn bigger there to stay readable, so they sit
                 beside their dot instead of where the desktop ones do.
*/
const CALLOUTS = [
  {
    key: 'vendor-communication',
    label: 'Vendor Communication',
    labelX: 68,
    labelY: 90,
    anchor: 'start',
    dotX: 186,
    dotY: 86,
    path: 'M222,105 C208,98 196,91 186,86',
    mobile: { x: 180, y: 76, anchor: 'end' },
  },
  {
    key: 'production-management',
    label: 'Production Management',
    labelX: 90,
    labelY: 25,
    anchor: 'start',
    dotX: 215,
    dotY: 20,
    path: 'M255,85 C245,60 230,35 215,20',
    mobile: { x: 208, y: 16, anchor: 'end' },
  },
  {
    key: 'packaging-execution',
    label: 'Packaging Execution',
    labelX: 308,
    labelY: 25,
    anchor: 'start',
    dotX: 300,
    dotY: 22,
    path: 'M280,82 C286,60 294,38 300,22',
    mobile: { x: 307, y: 16, anchor: 'start' },
  },
  {
    key: 'export-readiness',
    label: 'Export Readiness',
    labelX: 364,
    labelY: 60,
    anchor: 'start',
    dotX: 356,
    dotY: 60,
    path: 'M312,97 C328,85 344,72 356,60',
    mobile: { x: 363, y: 57, anchor: 'start' },
  },
  {
    key: 'dispatch-support',
    label: 'Dispatch Support',
    labelX: 390,
    labelY: 124,
    anchor: 'start',
    dotX: 384,
    dotY: 120,
    path: 'M330,120 C348,113 366,113 384,120',
    mobile: { x: 384, y: 136, anchor: 'start' },
  },
];

function WithoutUsSection() {
  const sectionRef = useRef(null);
  const handVisualRef = useRef(null);
  const handImageRef = useRef(null);
  const pathRefs = useRef([]);
  const dotRefs = useRef([]);
  const textRefs = useRef([]);
  const titleRef = useRef(null);
  const listRef = useRef(null);
  const footerTextRef = useRef(null);
  const footerButtonRef = useRef(null);

  /*
   * Footer paragraph — the same word stagger as the Hero kicker and the
   * Packaging description: words rise 50px with a 28px blur clearing,
   * 0.03s stagger, 1s back.out(1.7) — then the button rises in as the
   * last words land. Plays once, when the paragraph actually scrolls
   * into view.
   *
   * The paragraph sits INSIDE the section that gets pinned for the
   * bear-hand sequence. Without `pinnedContainer` its trigger ignored
   * the pin, so it fired mid-pin while the text was still off-screen
   * and had finished by the time you scrolled down to it.
   * `refreshPriority: -1` makes it measure after the pin is set up.
   */

  useLayoutEffect(() => {
    const el = footerTextRef.current;

    if (!el || prefersReducedMotion()) return undefined;

    let split;

    const ctx = gsap.context(() => {
      split = SplitText.create(el, {
        type: 'words',
        wordsClass: 'without-us-footer-word',
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
          pinnedContainer: sectionRef.current,
          refreshPriority: -1,
        },
      });

      tl.from(split.words, {
        y: 50,
        opacity: 0,
        filter: 'blur(28px)',
        stagger: 0.03,
        duration: 1,
        ease: 'back.out(1.7)',
      });

      if (footerButtonRef.current) {
        tl.from(
          footerButtonRef.current,
          {
            y: 24,
            opacity: 0,
            duration: 0.7,
            ease: 'power3.out',
          },
          '-=0.55'
        );
      }
    }, el);

    return () => {
      ctx.revert();
      if (split) split.revert();
    };
  }, []);

  /*
   * Intro text — one directed timeline, not separate fades:
   *
   *   1. "Without Us, You're"  chars rise (y 56 -> 0) with a soft blur
   *                            clearing, power4.out — states the thesis.
   *   2. "Dealing With :"      starts as line 1 is ~70% settled (overlap
   *                            keeps it flowing), a touch slower stagger
   *                            so it lands with weight.
   *   3. pain points           begin once line 2 has landed, one at a
   *                            time (0.28s apart), shorter rise so they
   *                            read as supporting copy.
   *
   * Plays once when the heading scrolls in; never reverses.
   */

  useLayoutEffect(() => {
    const title = titleRef.current;
    const list = listRef.current;

    if (!title || !list || prefersReducedMotion()) return undefined;

    const splits = [];

    const ctx = gsap.context(() => {
      const lines = title.querySelectorAll('.without-us-title-line');
      const items = list.querySelectorAll('.without-us-pain-point');

      const lineSplits = Array.from(lines).map((line) =>
        SplitText.create(line, { type: 'words,chars' })
      );
      const itemSplits = Array.from(items).map((item) =>
        SplitText.create(item, { type: 'words,chars' })
      );

      splits.push(...lineSplits, ...itemSplits);

      lineSplits.forEach((split) =>
        gsap.set(split.chars, { opacity: 0, y: 56, filter: 'blur(6px)' })
      );
      itemSplits.forEach((split) =>
        gsap.set(split.chars, { opacity: 0, y: 18 })
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: title,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      });

      // 1. main statement
      tl.to(lineSplits[0].chars, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        stagger: 0.035,
        duration: 1,
        ease: 'power4.out',
      });

      // 2. "Dealing With :" — overlaps the tail of line 1
      if (lineSplits[1]) {
        tl.to(
          lineSplits[1].chars,
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            stagger: 0.045,
            duration: 1,
            ease: 'power4.out',
          },
          '>-0.55'
        );
      }

      // 3. supporting pain points, one by one after the heading lands
      itemSplits.forEach((split, i) => {
        tl.to(
          split.chars,
          {
            opacity: 1,
            y: 0,
            stagger: 0.02,
            duration: 0.55,
            ease: 'back.out(1.7)',
          },
          i === 0 ? '>-0.35' : `<${0.28}`
        );
      });
    }, title);

    return () => {
      ctx.revert();
      splits.forEach((split) => split.revert());
    };
  }, []);

  useLayoutEffect(() => {
    if (
      prefersReducedMotion() ||
      !sectionRef.current ||
      !handVisualRef.current ||
      !handImageRef.current
    ) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const paths = pathRefs.current.filter(Boolean);
      const dots = dotRefs.current.filter(Boolean);
      const texts = textRefs.current.filter(Boolean);

      if (paths.length !== CALLOUTS.length) return;

      const lengths = paths.map((p) => p.getTotalLength());

      const buildScene = ({
        handOffsetX,
        handOffsetY,
        handRotate,
        pinDistance,
      }) => {
        // ---- initial ("closed") state ---------------------------------
        gsap.set(handImageRef.current, {
          x: handOffsetX,
          y: handOffsetY,
          rotate: handRotate,
          transformOrigin: '75% 25%',
        });

        paths.forEach((p, i) => {
          gsap.set(p, {
            strokeDasharray: lengths[i],
            strokeDashoffset: lengths[i],
          });
        });
        // Paths use butt caps (round caps paint a dot at the ends of a
        // zero-length dash) and stay completely invisible until their own
        // draw begins (switched on at the start of their tween below).
        gsap.set(paths, { opacity: 0 });
        gsap.set(dots, { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' });
        gsap.set(texts, { opacity: 0, y: '+=6' });

        // ---- 1) hand rises into place as the hand visual enters ---------
        const entryTrigger = ScrollTrigger.create({
          trigger: handVisualRef.current,
          start: 'top bottom',
          end: 'top top',
          scrub: 0.6,
          animation: gsap.to(handImageRef.current, {
            x: 0,
            y: 0,
            rotate: 0,
            ease: 'none',
          }),
        });

        // ---- 2) pin the section and step through the 5 nodes -----------
        const stepTl = gsap.timeline();

        CALLOUTS.forEach((_, i) => {
          stepTl
            .set(paths[i], { opacity: 0.85 }, i + 0.001)
            .to(
              paths[i],
              { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut' },
              i
            )
            .to(
              dots[i],
              { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' },
              i + 0.75
            )
            .to(
              texts[i],
              { opacity: 1, y: '+=0', duration: 0.45, ease: 'power2.out' },
              i + 0.8
            );
        });

        const pinTrigger = ScrollTrigger.create({
          // Trigger off the hand visual specifically — not the section's
          // own top (which is the intro heading/pain-points) — so the pin
          // engages once the hand/box art reaches the top of the viewport,
          // not while the intro text is still on screen.
          trigger: handVisualRef.current,
          start: 'top top',
          end: `+=${pinDistance}`,
          // Pin the whole section (so it fills the screen for the node
          // sequence) even though the trigger element is the hand visual.
          pin: sectionRef.current,
          // IMPORTANT: this app wraps everything in #crtContent, which has
          // `filter: url(#crtBulge)` for the CRT effect. A CSS `filter` on
          // an ancestor creates a new containing block for `position: fixed`
          // descendants, which is what ScrollTrigger's pin uses by default —
          // so the pin would fix itself relative to #crtContent instead of
          // the viewport, breaking (or completely mispositioning) the pin.
          // pinType: 'transform' makes ScrollTrigger pin using a CSS
          // transform instead, which is unaffected by filtered ancestors.
          pinType: 'transform',
          scrub: 0.8,
          anticipatePin: 1,
          animation: stepTl,
        });

        return () => {
          entryTrigger.kill();
          pinTrigger.kill();
        };
      };

      ScrollTrigger.matchMedia({
        '(min-width: 601px)': () =>
          buildScene({
            handOffsetX: 70,
            handOffsetY: 60,
            handRotate: -12,
            pinDistance: '350%',
          }),
        '(max-width: 600px)': () =>
          buildScene({
            handOffsetX: 30,
            handOffsetY: 40,
            handRotate: -8,
            pinDistance: '250%',
          }),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="without-us" ref={sectionRef}>

      {/* =========================================
          INTRO
      ========================================== */}

      <div className="without-us-intro">

        {/* =========================================
            MAIN HEADING
        ========================================== */}

        <h2
          className="without-us-title without-us-title-glow"
          ref={titleRef}
        >
          <span className="without-us-title-line">
            Without Us, You&apos;re
          </span>

          <span className="without-us-title-line">
            Dealing With :
          </span>
        </h2>


        {/* =========================================
            PAIN POINTS
        ========================================== */}

        <ul
          className="without-us-pain-points without-us-red-glow"
          ref={listRef}
        >
          {PAIN_POINTS.map((point) => (
            <li
              key={point}
              className="without-us-pain-point"
            >
              <span className="without-us-arrow">
                &gt;
              </span>

              <span>
                {point}
              </span>
            </li>
          ))}
        </ul>

      </div>


      {/* =========================================
          BEAR HAND VISUAL

          The old data-reveal="hand-lift" global
          reveal has been removed from this element
          on purpose — this section now drives its
          own scroll-pinned sequence directly above,
          instead of the shared site-wide system.
      ========================================== */}

      <div className="bear-hand-visual" ref={handVisualRef}>

        {/* Stage: holds the hand + its callout lines together. On
            desktop it is exactly the size of the image (same as
            before). On phones the outer .bear-hand-visual becomes a
            full-screen dark frame and this stage is centred in it,
            so the pinned sequence fills the screen like on desktop. */}
        <div className="bear-hand-stage">

        {/* =========================================
            SVG POINTER LINES

            The SVG remains behind the image so
            the lines visually disappear underneath
            the box/hand.
        ========================================== */}

        <svg
          className="bear-hand-callouts"
          viewBox="0 0 500 260"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          {CALLOUTS.map((callout, i) => (
            <g
              key={callout.key}
              className="bear-callout"
            >

              {/* Pointer line — drawn box -> dot (bottom to top) */}

              <path
                ref={(el) => {
                  pathRefs.current[i] = el;
                }}
                d={callout.path}
                fill="none"
                stroke="#ffd400"
                strokeWidth="1"
                strokeLinecap="butt"
                opacity="0.85"
              />


              {/* Pointer dot */}

              <circle
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
                cx={callout.dotX}
                cy={callout.dotY}
                r="2.5"
                fill="#ffd400"
              />


              {/* Label — desktop and mobile variants; CSS shows one.
                  GSAP fades/slides the wrapping group. */}

              <g
                ref={(el) => {
                  textRefs.current[i] = el;
                }}
                className="bear-callout-label"
                fill="#ffd400"
                // Roboto Slab is self-hosted through next/font (src/fonts);
                // a CSS variable can't go in an SVG presentation attribute,
                // so the family is set through `style` instead.
                style={{ fontFamily: 'var(--font-roboto-slab), serif' }}
              >
                <text
                  className="bear-callout-text bear-callout-text--desktop"
                  x={callout.labelX}
                  y={callout.labelY}
                  textAnchor={callout.anchor}
                  fontSize="9.5"
                  letterSpacing="0.01em"
                >
                  {callout.label}
                </text>

                <text
                  className="bear-callout-text bear-callout-text--mobile"
                  x={callout.mobile.x}
                  y={callout.mobile.y}
                  textAnchor={callout.mobile.anchor}
                  fontSize="14"
                  letterSpacing="0.01em"
                >
                  {callout.label}
                </text>
              </g>

            </g>
          ))}
        </svg>


        {/* =========================================
            BEAR HAND IMAGE
        ========================================== */}

        <Image
          ref={handImageRef}
          src={bearHand}
          alt="A furry bear hand holding a glowing packaging box"
          className="bear-hand-image"
          sizes="100vw"
          loading="eager"
        />

        </div>

      </div>


      {/* =========================================
          FOOTER
      ========================================== */}

      <div className="without-us-footer">

        <p
          className="without-us-footer-text"
          ref={footerTextRef}
        >
          Whether you&apos;re a global brand sourcing from India, a growing
          export business, or an agency managing international production
          we help make packaging execution feel less exhausting.
        </p>


        <button
          type="button"
          className="bear-pill bear-pill--solid without-us-button"
          ref={footerButtonRef}
        >
          Talk To Us About Export
        </button>

      </div>

    </section>
  );
}

export default WithoutUsSection;