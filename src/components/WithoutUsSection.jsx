import bearHand from '../images/Bear-hand.webp';
import './Nav.css';
import './WithoutUsSection.css';

const PAIN_POINTS = [
  'Fragmented Communication',
  'Unreliable Follow-Ups',
  'Vendor Confusion',
  'Production Blind Spots',
];

const CALLOUTS = [
  {
    label: 'Production Management',
    labelX: 90,
    labelY: 25,
    anchor: 'start',
    dotX: 200,
    dotY: 27,
    path: 'M200,27 C230,40 250,65 255,85',
  },
  {
    label: 'Packaging Execution',
    labelX: 300,
    labelY: 28,
    anchor: 'start',
    dotX: 292,
    dotY: 30,
    path: 'M292,30 C288,50 283,68 280,82',
  },
  {
    label: 'Export Readiness',
    labelX: 356,
    labelY: 69,
    anchor: 'start',
    dotX: 348,
    dotY: 69,
    path: 'M348,69 C335,80 320,90 312,97',
  },
  {
    label: 'Vendor Communication',
    labelX: 68,
    labelY: 96,
    anchor: 'start',
    dotX: 134,
    dotY: 75,
    path: 'M134,75 C165,80 195,90 222,105',
  },
  {
    label: 'Dispatch Support',
    labelX: 380,
    labelY: 128,
    anchor: 'start',
    dotX: 374,
    dotY: 124,
    path: 'M374,124 C360,120 345,118 330,120',
  },
];

function WithoutUsSection() {
  return (
    <section className="without-us">

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
      ========================================== */}

      <div
        className="bear-hand-visual"
        data-reveal="hand-lift"
      >

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
          {CALLOUTS.map((callout) => (
            <g
              key={callout.label}
              className="bear-callout"
            >

              {/* Pointer line */}

              <path
                d={callout.path}
                fill="none"
                stroke="#ffd400"
                strokeWidth="1"
                opacity="0.85"
              />


              {/* Pointer dot */}

              <circle
                cx={callout.dotX}
                cy={callout.dotY}
                r="2.5"
                fill="#ffd400"
              />


              {/* Label */}

              <text
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