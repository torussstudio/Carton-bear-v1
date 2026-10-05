'use client';

import { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';

import heroImage from '../images/Carton.webp';
import './BuiltForBrandsSection.css';

import d2cIcon from '../icons/optimized/d2c-founders-icon.png';
import ecommerceIcon from '../icons/optimized/ecommerce-icon.png';
import consumerIcon from '../icons/optimized/consumer-brands-icon.png';
import exportIcon from '../icons/optimized/export-icon.png';
import creativeIcon from '../icons/optimized/creative-agency-icon.png';
import fastIcon from '../icons/optimized/fast-moving-icon.png';

import { gsap, prefersReducedMotion, SplitText } from '../lib/gsapSetup';

/*
 * ---------------------------------------------------------
 * ICONS
 * ---------------------------------------------------------
 */

const ICONS = {
  box: d2cIcon,
  cart: ecommerceIcon,
  tag: consumerIcon,
  globe: exportIcon,
  palette: creativeIcon,
  bolt: fastIcon,
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
  const gridRef = useRef(null);

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

  /*
   * Audience cards — every part of each card animates in once, as the card
   * scrolls into view (never reverses):
   *
   *   number      fades up
   *   red square  slides down (clip-path reveal, same as the Services images)
   *   icon        pops in after the square
   *   title       char stagger (same as the Services headings)
   *   description left-to-right wipe (same as the Services tags)
   *   badge       wipe, right after the description
   */

  useLayoutEffect(() => {
    const grid = gridRef.current;

    if (!grid || prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      grid.querySelectorAll('.built-card').forEach((card) => {
        const number = card.querySelector('.built-card-number');
        const box = card.querySelector('.built-card-icon');
        const glyph = card.querySelector('.built-card-icon img');
        const lines = card.querySelectorAll('.built-card-title-line');
        const desc = card.querySelector('.built-card-desc');
        const badge = card.querySelector('.built-card-badge');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        });

        if (number) {
          gsap.set(number, { y: 12, opacity: 0 });
          tl.to(number, { y: 0, opacity: 0.65, duration: 0.5, ease: 'power3.out' }, 0);
        }

        if (box) {
          gsap.set(box, { clipPath: 'inset(0% 0% 100% 0%)' });
          tl.to(
            box,
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power3.inOut' },
            0.05
          );
        }

        if (glyph) {
          gsap.set(glyph, { scale: 0.6, opacity: 0 });
          tl.to(
            glyph,
            { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' },
            0.55
          );
        }

        let at = 0.35;

        lines.forEach((line) => {
          const split = SplitText.create(line, { type: 'chars' });

          gsap.set(split.chars, { y: 18, opacity: 0 });
          tl.to(
            split.chars,
            {
              y: 0,
              opacity: 1,
              stagger: 0.025,
              duration: 0.55,
              ease: 'back.out(1.7)',
            },
            at
          );
          at += 0.12;
        });

        if (desc) {
          gsap.set(desc, { clipPath: 'inset(0 100% 0 0)', opacity: 0 });
          tl.to(
            desc,
            {
              clipPath: 'inset(0 0% 0 0)',
              opacity: 1,
              duration: 0.8,
              ease: 'power3.out',
            },
            0.75
          );
        }

        if (badge) {
          gsap.set(badge, { clipPath: 'inset(0 100% 0 0)', opacity: 0 });
          tl.to(
            badge,
            {
              clipPath: 'inset(0 0% 0 0)',
              opacity: 1,
              duration: 0.55,
              ease: 'power3.out',
            },
            1.15
          );
        }
      });
    }, grid);

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

          <Image
            src={heroImage}
            alt="Retro illustration of a woman in a red dress holding a vintage TV showing the Carton Bear logo"
            className="built-image"
            ref={imageRef}
            loading="eager"
          />

        </div>

      </div>


      {/* =========================================
          AUDIENCE GRID
      ========================================== */}

      <div className="built-grid" ref={gridRef}>

        {AUDIENCE_CARDS.map((card, index) => (
          <div
            className={`built-card built-card--${card.tone}`}
            key={card.title.join(' ')}
          >

            <span className="built-card-number">
              {String(index + 1).padStart(2, '0')}
            </span>


            <span
              className="built-card-icon"
              aria-hidden="true"
            >
              <Image
                src={ICONS[card.icon]}
                alt=""
                draggable="false"
                sizes="56px"
                loading="eager"
              />
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