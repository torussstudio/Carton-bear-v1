import { useLayoutEffect, useRef } from 'react';

import heroImage from '../images/Carton.webp';
import './BuiltForBrandsSection.css';

import { gsap, prefersReducedMotion } from '../lib/gsapSetup';

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


/*
 * Girl image zoom-out: starting scale (1 = no zoom).
 * 1.12 = subtle. Raise for a stronger zoom, lower for a gentler one.
 */

const IMAGE_START_SCALE = 1.12;


function BuiltForBrandsSection() {
  const titleRef = useRef(null);
  const imageRef = useRef(null);

  /*
   * Title reveal — the SAME animation as the Hero title
   * ("Understands Branding", see HeroSection.jsx):
   *
   *   each line: y 60 → 0, opacity 0 → 1, blur(28px) → none
   *   duration 0.9s, stagger 0.12s, ease power3.out
   *
   * Runs once when the title scrolls into view, then stays.
   */

  useLayoutEffect(() => {
    const title = titleRef.current;

    if (!title || prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      gsap.from(title.querySelectorAll('.built-title-line'), {
        y: 60,
        opacity: 0,
        filter: 'blur(28px)',
        stagger: 0.12,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: title,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }, title);

    return () => ctx.revert();
  }, []);

  /*
   * Girl image — scroll-linked zoom-out.
   *
   * She starts slightly zoomed in (1.12, same start scale the old reveal
   * used) and eases down to 1 as you scroll, fully driven by scroll
   * position (scrub) so it moves with your scrolling and can be scrubbed
   * back up too. The fade-in keeps its original timing (1.3s power3.out
   * when she reaches the viewport); only the scale is now scroll-driven.
   */

  useLayoutEffect(() => {
    const image = imageRef.current;
    const wrap = image ? image.parentElement : null;

    if (!image || !wrap || prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      gsap.set(image, {
        opacity: 0,
        scale: IMAGE_START_SCALE,
        transformOrigin: '50% 50%',
      });

      gsap.to(image, {
        opacity: 1,
        duration: 1.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: wrap,
          start: 'top 92%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.to(image, {
        scale: 1,
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          trigger: wrap,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

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
            ref={titleRef}
          >

            <span className="built-title-row">
              <span className="built-title-line built-title-line--blue">
                Built For
              </span>
            </span>

            <span className="built-title-row">
              <span className="built-title-line built-title-line--accent">
                Modern
              </span>
            </span>

            <span className="built-title-row">
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
            ref={imageRef}
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