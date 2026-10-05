'use client';

import { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap, SplitText, prefersReducedMotion } from '../lib/gsapSetup';
import './ShippingSection.css';

import ecommerceImage from '../images/e-commerce.webp';
import premiumProductImage from '../images/premium-product-packaging.webp';
import exportCartonImage from '../images/export-carton-packaging.webp';
import creativeBrandsImage from '../images/packaging-for-creative-brand.webp';
import agencyCollaborationsImage from '../images/agency-collaboration.webp';
import printedPackagingImage from '../images/printed-packaging.webp';

const SHIPPING_ITEMS = [
  {
    title: 'Ecommerce Packaging',
    desc: 'Mailers and cartons for modern online brands',
    image: ecommerceImage,
  },
  {
    title: 'Premium Product Packaging',
    desc: 'Rigid boxes and branded packaging systems',
    image: premiumProductImage,
  },
  {
    title: 'Export Cartons',
    desc: 'Packaging coordinated for international shipping',
    image: exportCartonImage,
  },
  {
    title: 'Packaging For Creative Brands',
    desc: 'For aesthetically sensitive brands',
    image: creativeBrandsImage,
  },
  {
    title: 'Agency Collaborations',
    desc: 'Production coordination for creative agencies',
    image: agencyCollaborationsImage,
  },
  {
    title: 'Printed Packaging',
    desc: 'Cohesive. Memorable. Ownable.',
    image: printedPackagingImage,
  },
];

function ShippingSection() {
  const rootRef = useRef(null);
  const titleRef = useRef(null);
  const closingRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const title = titleRef.current;

    if (!root || !title || prefersReducedMotion()) return undefined;

    const splits = [];

    const ctx = gsap.context(() => {
      /*
       * ---------------------------------------------------------
       * TITLE — same reveal as the Process section title
       * ("Clear Process / No Chaos"): every character rises 50px
       * and fades in, 0.03s stagger, 0.8s power3.out.
       * ---------------------------------------------------------
       */

      const titleLines = title.querySelectorAll('.shipping-title-line');
      const titleSplits = Array.from(titleLines).map((line) =>
        SplitText.create(line, { type: 'words,chars' })
      );
      splits.push(...titleSplits);

      const titleChars = titleSplits.flatMap((split) => split.chars);

      gsap.set(titleChars, { opacity: 0, y: 50 });

      gsap.to(titleChars, {
        y: 0,
        opacity: 1,
        stagger: 0.03,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: title,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      /*
       * ---------------------------------------------------------
       * CARD TITLES + DESCRIPTIONS — same character stagger as the
       * Services card headings: chars rise 18px and fade in,
       * 0.025s stagger, 0.55s back.out(1.7). The description starts
       * while the title is still landing. Split into words AND chars
       * so lines still wrap between words.
       * ---------------------------------------------------------
       */

      root.querySelectorAll('.shipping-copy').forEach((copy) => {
        const heading = copy.querySelector('.shipping-copy-title');
        const desc = copy.querySelector('.shipping-copy-desc');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: copy,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        });

        [heading, desc].forEach((el, i) => {
          if (!el) return;

          const split = SplitText.create(el, { type: 'words,chars' });
          splits.push(split);

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
            i === 0 ? 0 : 0.35
          );
        });
      });

      /*
       * ---------------------------------------------------------
       * IMAGES — same swipe-down reveal as the Services images:
       * clip-path opens top -> bottom, 0.9s power3.inOut.
       * ---------------------------------------------------------
       */

      // Clip the whole rounded frame (not just the picture inside it),
      // so the frame's red placeholder background never shows mid-swipe.
      root.querySelectorAll('.shipping-image').forEach((frame) => {
        gsap.set(frame, { clipPath: 'inset(0% 0% 100% 0%)' });

        gsap.to(frame, {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.9,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: frame,
            start: 'top 88%',
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
          },
        });
      });

      /*
       * ---------------------------------------------------------
       * CLOSING STATEMENT — flip-up word reveal, the same motion as
       * the Packaging title and the Highlight strip: each word starts
       * tipped back (rotationX -72, rotationY 7), 45px down and 100px
       * away in z, pivoting on its bottom edge, then flips up to rest.
       * 0.55s power3.out, words in reading order across all three
       * lines. Plays once.
       * ---------------------------------------------------------
       */

      const closing = closingRef.current;

      if (closing) {
        const lineSplits = Array.from(
          closing.querySelectorAll('.shipping-closing-line')
        ).map((line) =>
          SplitText.create(line, {
            type: 'words',
            wordsClass: 'shipping-closing-word',
          })
        );
        splits.push(...lineSplits);

        const words = lineSplits.flatMap((split) => split.words);

        gsap.set(words, {
          opacity: 0,
          y: 45,
          rotationX: -72,
          rotationY: 7,
          z: -100,
          transformOrigin: '50% 100%',
          transformStyle: 'preserve-3d',
        });

        gsap.to(words, {
          opacity: 1,
          y: 0,
          rotationX: 0,
          rotationY: 0,
          z: 0,
          duration: 0.55,
          ease: 'power3.out',
          stagger: 0.09,
          scrollTrigger: {
            trigger: closing,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, root);

    return () => {
      ctx.revert();
      splits.forEach((split) => split.revert());
    };
  }, []);

  return (
    <section className="shipping" ref={rootRef}>

      {/* =========================================
          TITLE
      ========================================== */}

      <h2
        className="shipping-title"
        ref={titleRef}
      >
        <span className="shipping-title-line">
          Some Things
        </span>

        <span className="shipping-title-line">
          We&apos;ve Been Shipping.
        </span>
      </h2>


      {/* =========================================
          SHIPPING ITEMS
      ========================================== */}

      <div className="shipping-grid">

        {SHIPPING_ITEMS.map((item, index) => (
          <div
            className={`shipping-row${
              index % 2 === 1
                ? ' shipping-row--reverse'
                : ''
            }`}
            key={item.title}
          >

            {/* IMAGE */}

            <div className="shipping-image">
              <Image
                src={item.image}
                alt=""
                className="shipping-image-content"
                sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 540px"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>


            {/* TEXT */}

            <div className="shipping-copy">
              <h3 className="shipping-copy-title">
                {item.title}
              </h3>

              <p className="shipping-copy-desc">
                {item.desc}
              </p>
            </div>

          </div>
        ))}

      </div>


      {/* =========================================
          CLOSING STATEMENT
      ========================================== */}

      <div
        className="shipping-closing"
        ref={closingRef}
      >

        <div className="shipping-closing-row">
          <p className="shipping-closing-line shipping-closing-line--lg">
            Good Packaging <br />
            Doesn&apos;t{' '}
            <span>
              Scream
            </span>
          </p>
        </div>


        <div className="shipping-closing-row">
          <p className="shipping-closing-line">
            It Just Quietly Makes
          </p>
        </div>


        <div className="shipping-closing-row">
          <p className="shipping-closing-line">
            The Brand Feel More Legit.
          </p>
        </div>

      </div>

    </section>
  );
}

export default ShippingSection;