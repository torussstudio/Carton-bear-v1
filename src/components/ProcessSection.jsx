const PROCESS_STEPS = [
  'Understand',
  'Coordinate',
  'Quote & Optimize',
  'Produce',
  'Review',
  'Dispatch',
];

function ProcessSection() {
  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#d3d818]
        max-[420px]:px-[18px]
        max-[420px]:pt-[72px]
        max-[420px]:pb-[32px]
      "
      style={{ padding: '100px 0px' }}
    >

      {/* Noise texture */}

     <div
      className="pointer-events-none 
      absolute
      inset-0
      opacity-10 
      mix-blend-multiply"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, }}
     />

      {/* Headline */}

      <div
        className="
          relative
          mx-auto
        "
        style={{ marginBottom: '100px', paddingTop: '18px' }}
      >

        {/* Swoosh */}
        <svg
          className="
            absolute
            top-[-50%]
            left-1/2
            z-0
            h-auto
            w-[77%]
            -translate-x-1/2
            -rotate-[2deg]
          "
          viewBox="0 0 620 260"
          aria-hidden="true"
          data-reveal="fade"
        >
          <path
            d="M64,158 C58,86 182,42 322,42 C464,42 566,78 566,142 C566,198 462,228 320,228 C214,228 128,210 78,180"
            fill="none"
            stroke="rgba(43, 58, 87, 0.55)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>

        {/* Spark */}
        <svg
          className="
            absolute
            right-[23.5%]
            top-[-4%]
            z-[2]
            h-[40px]
            w-[40px]
          "
          viewBox="0 0 40 40"
          aria-hidden="true"
          data-reveal="image"
        >
          <path
            d="M20 1 C21.5 14 26 18.5 39 20 C26 21.5 21.5 26 20 39 C18.5 26 14 21.5 1 20 C14 18.5 18.5 14 20 1 Z"
            fill="#ff0000"
          />
        </svg>

        {/* Title */}
        <h2
          className="
            relative
            z-[1]
            m-0
            text-center
            font-['Sharp_Grotesk_PE_Trial_Black',sans-serif]
            font-normal
            uppercase
            leading-[0.8]
            text-[#ff0000]"
          data-reveal="lines"
        >
          <span className="reveal-mask">
            <span
              className="
                block
                text-[clamp(32px,10.5vw,150px)]
              "
            >
              Clear Process
            </span>
          </span>

          <span className="reveal-mask">
            <span
              className="
                block
                text-[clamp(44px,10.8vw,150px)]
              "

              style={{ marginTop: '0.06em' }}
            >
              No Chaos
            </span>
          </span>
        </h2>
      </div>

      {/* Process list */}
      <ul className="mx-auto list-none" style={{ margin: "0px", padding: "0px"}}>
        {PROCESS_STEPS.map((step) => (
          <li
            className="
              border-b-2
              border-[rgba(23,20,15,0.22)]
              font-['Sharp_Grotesk_PE_Trial_Book',serif]
              text-[clamp(19px,4vw,58px)]
              font-medium
              tracking-[0.4px]
              text-[#17140f]
              uppercase
            "
            style= {{ padding:"20px 35px"}}
            key={step}
            data-reveal="fade"
          >
            {step}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ProcessSection;