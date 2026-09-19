import { useLayoutEffect, useRef } from 'react';
import bearHand from '../images/Bear-hand.webp';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsapSetup';
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
  },
];

function WithoutUsSection() {
  const sectionRef = useRef(null);
  const handVisualRef = useRef(null);
  const handImageRef = useRef(null);
  const pathRefs = useRef([]);
  const dotRefs = useRef([]);
  const textRefs = useRef([]);

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
          data-reveal="lines"
        >
          <span className="reveal-mask">
            <span className="without-us-title-line">
              Without Us, You&apos;re
            </span>
          </span>

          <span className="reveal-mask">
            <span className="without-us-title-line">
              Dealing With :
            </span>
          </span>
        </h2>


        {/* =========================================
            PAIN POINTS
        ========================================== */}

        <ul className="without-us-pain-points without-us-red-glow">
          {PAIN_POINTS.map((point) => (
            <li
              key={point}
              className="without-us-pain-point"
              data-reveal="fade"
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
                ref={(el) => (pathRefs.current[i] = el)}
                d={callout.path}
                fill="none"
                stroke="#ffd400"
                strokeWidth="1"
                strokeLinecap="round"
                opacity="0.85"
              />


              {/* Pointer dot */}

              <circle
                ref={(el) => (dotRefs.current[i] = el)}
                cx={callout.dotX}
                cy={callout.dotY}
                r="2.5"
                fill="#ffd400"
              />


              {/* Label */}

              <text
                ref={(el) => (textRefs.current[i] = el)}
                x={callout.labelX}
                y={callout.labelY}
                textAnchor={callout.anchor}
                fill="#ffd400"
                fontFamily="Roboto Slab, serif"
                fontSize="9.5"
                letterSpacing="0.01em"
              >
                {callout.label}
              </text>

            </g>
          ))}
        </svg>


        {/* =========================================
            BEAR HAND IMAGE
        ========================================== */}

        <img
          ref={handImageRef}
          src={bearHand}
          alt="A furry bear hand holding a glowing packaging box"
          className="bear-hand-image"
        />

      </div>


      {/* =========================================
          FOOTER
      ========================================== */}

      <div className="without-us-footer">

        <p
          className="without-us-footer-text"
          data-reveal="fade"
        >
          Whether you&apos;re a global brand sourcing from India, a growing
          export business, or an agency managing international production
          we help make packaging execution feel less exhausting.
        </p>


        <button
          type="button"
          className="bear-pill bear-pill--solid without-us-button"
          data-reveal="fade"
        >
          Talk To Us About Export
        </button>

      </div>

    </section>
  );
}

export default WithoutUsSection;