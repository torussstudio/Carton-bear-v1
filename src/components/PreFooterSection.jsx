import './PreFooterSection.css';
import './Nav.css';

function PreFooterSection() {
  return (
    <section className="prefooter">
      <svg
        className="prefooter-headline"
        viewBox="0 0 900 330"
        role="img"
        aria-label="Let's make packaging less exhausting"
      >
        <defs>
          <path id="prefooterLine1" d="M40,115 Q450,55 860,115" />
          <path id="prefooterLine2" d="M30,205 Q450,150 870,205" />
          <path id="prefooterLine3" d="M10,305 Q450,245 890,305" />
          <filter
            id="prefooterShadow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow
              dx="4"
              dy="7"
              stdDeviation="0"
              floodColor="#171b52"
              floodOpacity="0.9"
            />
          </filter>
        </defs>

        <text
          className="prefooter-line prefooter-line--one"
          textAnchor="middle"
          filter="url(#prefooterShadow)"
          data-reveal="fade"
        >
          <textPath href="#prefooterLine1" startOffset="50%">
            LET&apos;S MAKE
          </textPath>
        </text>

        <text
          className="prefooter-line prefooter-line--two"
          textAnchor="middle"
          filter="url(#prefooterShadow)"
          data-reveal="fade"
        >
          <textPath href="#prefooterLine2" startOffset="50%">
            PACKAGING
          </textPath>
        </text>

        <text
          className="prefooter-line prefooter-line--three"
          textAnchor="middle"
          filter="url(#prefooterShadow)"
          data-reveal="fade"
        >
          <textPath href="#prefooterLine3" startOffset="50%">
            LESS EXHAUSTING
          </textPath>
        </text>
      </svg>

      <button
        type="button"
        className="bear-pill bear-pill--solid prefooter-cta"
        data-reveal="fade"
      >
        Let&apos;s Get Packing
      </button>
    </section>
  );
}

export default PreFooterSection;