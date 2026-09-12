import bearHand from '../images/Bear-hand.webp';
import './Nav.css';

const PAIN_POINTS = [
  'Fragmented Communication',
  'Unreliable Follow-Ups',
  'Vendor Confusion',
  'Production Blind Spots',
];

const CALLOUTS = [
  {
    label: 'Production Management',
    labelX: 150,
    labelY: 40,
    anchor: 'start',
    dotX: 260,
    dotY: 48,
    path: 'M260,48 C300,60 320,90 335,150',
  },
  {
    label: 'Packaging Execution',
    labelX: 345,
    labelY: 30,
    anchor: 'start',
    dotX: 340,
    dotY: 40,
    path: 'M340,40 C338,90 340,130 345,168',
  },
  {
    label: 'Export Readiness',
    labelX: 425,
    labelY: 78,
    anchor: 'start',
    dotX: 420,
    dotY: 86,
    path: 'M420,86 C400,110 385,140 375,178',
  },
  {
    label: 'Vendor Communication',
    labelX: 65,
    labelY: 118,
    anchor: 'start',
    dotX: 210,
    dotY: 122,
    path: 'M210,122 C260,128 300,150 320,190',
  },
  {
    label: 'Dispatch Support',
    labelX: 440,
    labelY: 158,
    anchor: 'start',
    dotX: 432,
    dotY: 160,
    path: 'M432,160 C400,168 380,185 365,205',
  },
];

function WithoutUsSection() {
  return (
    <section className="relative 
    overflow-hidden 
    bg-[#0d0b0a]
    without-us"

    style={{ 
      padding: '60px 20px' 
     }}

    >
      
      {/* Intro */}
      <div className="
      mx-auto 
      text-center
      "
      style={{ marginBottom: 'clamp(48px, 12vw, 150px)' }}
      >


        <h2 className="font-pixel text-[clamp(32px,8vw,80px)] font-normal leading-[1.1] text-[#e6392b]"style={{ marginBottom: '12px' }}> 
          <span className="block">Without Us, You&apos;re</span>
          <span className="block">Dealing With :</span>
        </h2>

        <ul className="flex list-none flex-col gap-[15px] font-pixel text-[clamp(20px,5vw,40px)] font-normal text-[#e6392b]">
          {PAIN_POINTS.map((point) => (
            <li key={point}>
              <span className="opacity-90">&gt;</span> {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Visual */}
      <div className="relative 
      mx-auto 
      max-w-[1300px]"
      style={{marginBottom: "30px"}}
      
      >
        <img
          src={bearHand}
          alt="A furry bear hand holding a glowing packaging box"
          className="block h-auto w-full"
        />

        <svg
          className="absolute top-[-11%] left-[-2%] max-w-[90%]"
          viewBox="0 0 500 260"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          {CALLOUTS.map((c) => (
            <g key={c.label}>
              <path
                d={c.path}
                fill="none"
                stroke="#ffd400"
                strokeWidth="1"
                opacity="0.85"
              />

              <circle
                cx={c.dotX}
                cy={c.dotY}
                r="2.5"
                fill="#ffd400"
              />

              <text
                x={c.labelX}
                y={c.labelY}
                textAnchor={c.anchor}
                fill="#ffd400"
                fontFamily="Roboto Slab, serif"
                fontSize="9.5"
                letterSpacing="0.01em"
              >
                {c.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Footer */}
<div
  className="mx-auto flex w-full max-w-[1550px] flex-col items-center gap-6 md:flex-row md:items-center md:justify-between md:gap-10"
>
  <p className="m-0 max-w-[810px] font-pixel text-[clamp(22px,4.5vw,40px)] font-normal uppercase leading-[1.5] tracking-[0.02em] text-[#ffd400]">
    Whether you&apos;re a global brand sourcing from India, a growing
    export business, or an agency managing international production
    we help make packaging execution feel less exhausting.
  </p>

  <button
    type="button"
    className="bear-pill
    font-pixel
    bear-pill--solid
    shrink-0
    whitespace-nowrap
    border-0
    text-[clamp(16px,3vw,28px)] 
    uppercase"
    style={{
      padding: '13px 39px',
      textShadow: '0 0 6px rgba(255,212,0,0.9), 0 0 14px rgba(255,212,0,0.7), 0 0 24px rgba(255,212,0,0.4)',
    }}
  >
    Talk To Us About Export
  </button>
</div>

    </section>
  );
}

export default WithoutUsSection;