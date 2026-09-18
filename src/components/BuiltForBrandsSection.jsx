import heroImage from '../images/Carton.webp';
import './BuiltForBrandsSection.css';

/*
 * ---------------------------------------------------------
 * ICONS
 * ---------------------------------------------------------
 */

const ICONS = {
  box: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3.2 20 7.5v9L12 20.8 4 16.5v-9L12 3.2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M12 12 4 7.5M12 12l8-4.5M12 12v8.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  cart: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3.5 4h2l2.1 11.1a2 2 0 0 0 2 1.6h7.4a2 2 0 0 0 2-1.6L20.5 8H6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.3" cy="20" r="1.3" fill="currentColor" />
      <circle cx="17.3" cy="20" r="1.3" fill="currentColor" />
    </svg>
  ),

  tag: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20.6 13.1 13 20.7a1.8 1.8 0 0 1-2.5 0L3 13.2V3h10.2l7.4 7.4a1.8 1.8 0 0 1 0 2.7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="8" r="1.4" fill="currentColor" />
    </svg>
  ),

  globe: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="8.6"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M3.4 12h17.2M12 3.4c2.3 2.3 3.6 5.3 3.6 8.6s-1.3 6.3-3.6 8.6c-2.3-2.3-3.6-5.3-3.6-8.6S9.7 5.7 12 3.4Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  ),

  palette: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3.2c-4.9 0-8.8 3.7-8.8 8.2 0 4 3 7.2 6.6 7.9.7.1 1.1-.5.8-1.1-.2-.5-.3-1.1.1-1.5.4-.4.9-.4 1.5-.4h1.6c2.9 0 5.9-2.2 5.9-5.7 0-4.2-3.8-7.4-7.7-7.4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="7.7" cy="10.6" r="1" fill="currentColor" />
      <circle cx="9.8" cy="7" r="1" fill="currentColor" />
      <circle cx="14.3" cy="7" r="1" fill="currentColor" />
      <circle cx="16.4" cy="10.6" r="1" fill="currentColor" />
    </svg>
  ),

  bolt: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M13.2 2.4 4.6 14h5.8l-1 8.2 9.2-12h-5.8l.4-7.8Z"
        fill="currentColor"
      />
    </svg>
  ),
};


/*
 * ---------------------------------------------------------
 * DATA
 * ---------------------------------------------------------
 */

const AUDIENCE_CARDS = [
  {
    icon: 'box',
    title: ['D2C', 'Founders'],
    description:
      'Because your packaging is literally your first physical interaction with the customer.',
    tone: 'cream',
  },

  {
    icon: 'cart',
    title: ['Ecommerce', 'Startups'],
    description:
      'You need packaging that scales without becoming an operational nightmare.',
    tone: 'olive',
  },

  {
    icon: 'tag',
    title: ['Consumer', 'Brands'],
    description:
      'Consistency matters. Random vendor improvisation doesn\u2019t.',
    tone: 'cream',
  },

  {
    icon: 'globe',
    title: ['Export', 'Businesses'],
    description:
      'Packaging coordination from India with export-ready execution support.',
    tone: 'olive',
  },

  {
    icon: 'palette',
    title: ['Creative', 'Agencies'],
    description:
      'Need production support for packaging projects? We speak both: creative and manufacturing.',
    badge: 'Rare skillset, honestly',
    tone: 'cream',
  },

  {
    icon: 'bolt',
    title: ['Fast-Moving', 'Teams'],
    description:
      'If your business moves fast, your packaging partner should too.',
    tone: 'olive',
  },
];


function BuiltForBrandsSection() {
  return (
    <section className="built">


      {/* =========================================
          HEADLINE + IMAGE
      ========================================== */}

      <div className="built-main">

        <div className="built-left">

             <div
        className="built-kicker"
        data-reveal="fade"
      >
        <span
          className="built-kicker-dash"
          aria-hidden="true"
        />

        <span className="built-kicker-text">
          Who We Do It For
        </span>
      </div>


          <h2
            className="built-title"
            data-reveal="lines"
          >

            <span className="reveal-mask">
              <span className="built-title-line built-title-line--blue">
                Built For
              </span>
            </span>

            <span className="reveal-mask">
              <span className="built-title-line built-title-line--accent">
                Modern
              </span>
            </span>

            <span className="reveal-mask">
              <span className="built-title-line built-title-line--blue">
                Brands
              </span>
            </span>

          </h2>

        </div>


        <div className="built-right">

          <img
            src={heroImage}
            alt="Retro illustration of a woman in a red dress holding a vintage TV showing the Carton Bear logo"
            className="built-image"
            data-reveal="image"
          />

        </div>

      </div>


      {/* =========================================
          AUDIENCE GRID
      ========================================== */}

      <div className="built-grid">

        {AUDIENCE_CARDS.map((card, index) => (
          <div
            className={`built-card built-card--${card.tone}`}
            key={card.title.join(' ')}
            data-reveal="fade"
          >

            <span className="built-card-number">
              {String(index + 1).padStart(2, '0')}
            </span>


            <span
              className="built-card-icon"
              aria-hidden="true"
            >
              {ICONS[card.icon]}
            </span>


            <h3 className="built-card-title">

              {card.title.map((line) => (
                <span
                  className="built-card-title-line"
                  key={line}
                >
                  {line}
                </span>
              ))}

            </h3>


            <p className="built-card-desc">
              {card.description}
            </p>


            {card.badge && (
              <span className="built-card-badge">
                {card.badge}
              </span>
            )}

          </div>
        ))}

      </div>

    </section>
  );
}

export default BuiltForBrandsSection;