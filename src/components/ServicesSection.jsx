import { useLayoutEffect, useRef } from 'react';

import packagingDesign from '../images/packaging-design.png';
import packagingSystems from '../images/packaging-systems.png';
import corrugatedBoxes from '../images/Corrugated-boxes.png';
import ecommerceMailers from '../images/ecommerce-mailers.png';
import premiumBoxes from '../images/premium-boxes.png';
import vendorCoordination from '../images/vendor-coordination.png';

import './ServicesSection.css';

import {
  gsap,
  ScrollTrigger,
  SplitText,
  prefersReducedMotion,
} from '../lib/gsapSetup';


const SERVICES = [
  {
    title: 'Packaging Design & Consultation',
    tags: ['Intentional', 'Scalable', 'Photogenic'],
    image: packagingDesign,
  },

  {
    title: 'Packaging Systems',
    tags: ['Brand Language', 'SKU Consistency'],
    image: packagingSystems,
  },

  {
    title: 'Corrugated Boxes',
    tags: ['Ecommerce', 'Retail', 'Exports'],
    image: corrugatedBoxes,
  },

  {
    title: 'Ecommerce Mailers',
    tags: ['D2C', 'Unboxing-ready'],
    image: ecommerceMailers,
  },

  {
    title: 'Premium & Rigid Boxes',
    tags: ['Gifting', 'Premium', 'Launches'],
    image: premiumBoxes,
  },

  {
    title: 'Vendor Coordination & Production',
    tags: ['Sourcing', 'QC', 'Dispatch'],
    image: vendorCoordination,
  },
];


function ServicesSection() {
  const sectionRef = useRef(null);
  const bottomTextRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return undefined;

    let bottomSplit;
    const imageCleanups = [];

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.service-card');
      const images = gsap.utils.toArray('.service-image');
      const headings = gsap.utils.toArray('.service-heading');
      const tagGroups = gsap.utils.toArray('.service-tags');


      /*
       * ---------------------------------------------------------
       * REDUCED MOTION
       * ---------------------------------------------------------
       */

      if (prefersReducedMotion()) {
        gsap.set(cards, {
          clearProps: 'all',
        });

        gsap.set(images, {
          clearProps: 'all',
          clipPath: 'inset(0% 0% 0% 0%)',
        });

        return;
      }


      /*
       * ---------------------------------------------------------
       * SERVICE HEADINGS
       *
       * Staggered letter reveal.
       * ---------------------------------------------------------
       */

      headings.forEach((heading) => {
        const split = SplitText.create(heading, {
          type: 'chars',
        });

        gsap.set(split.chars, {
          y: 18,
          opacity: 0,
        });

        gsap.to(split.chars, {
          y: 0,
          opacity: 1,
          stagger: 0.025,
          duration: 0.55,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: heading,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        });
      });


      /*
       * ---------------------------------------------------------
       * TAG / PILL WIPE
       *
       * Left → Right reveal.
       * ---------------------------------------------------------
       */

      tagGroups.forEach((group) => {
        const tags = group.querySelectorAll('.service-tag');

        gsap.set(tags, {
          clipPath: 'inset(0 100% 0 0)',
          opacity: 0,
        });

        gsap.to(tags, {
          clipPath: 'inset(0 0% 0 0)',
          opacity: 1,
          duration: 0.55,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: group,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        });
      });


      /*
       * ---------------------------------------------------------
       * IMAGE REVEAL
       *
       * TOP → BOTTOM
       *
       * No overlay is used.
       * The image itself is revealed using clip-path.
       * ---------------------------------------------------------
       */

      images.forEach((image) => {
        gsap.set(image, {
          clipPath: 'inset(0% 0% 100% 0%)',
        });

        gsap.to(image, {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.9,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: image,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true,
          },
        });
      });


      /*
       * ---------------------------------------------------------
       * CARD FADE / POSITION
       * ---------------------------------------------------------
       */

      cards.forEach((card) => {
        gsap.fromTo(
          card,
          {
            y: 20,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 92%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });


      /*
       * ---------------------------------------------------------
       * 3D IMAGE MOUSE INTERACTION
       * ---------------------------------------------------------
       */

      images.forEach((image) => {
        const wrapper = image.parentElement;

        if (!wrapper) return;

        gsap.set(wrapper, {
          perspective: 1000,
        });

        gsap.set(image, {
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center',
        });


        const handleMove = (event) => {
          const rect = wrapper.getBoundingClientRect();

          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;

          const percentX = x / rect.width - 0.5;
          const percentY = y / rect.height - 0.5;

          gsap.to(image, {
            rotationY: percentX * 8,
            rotationX: percentY * -8,
            scale: 1.025,
            transformPerspective: 1000,
            duration: 0.45,
            ease: 'power3.out',
            overwrite: true,
          });
        };


        const handleLeave = () => {
          gsap.to(image, {
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            duration: 0.7,
            ease: 'power3.out',
            overwrite: true,
          });
        };


        wrapper.addEventListener('mousemove', handleMove);
        wrapper.addEventListener('mouseleave', handleLeave);


        imageCleanups.push(() => {
          wrapper.removeEventListener('mousemove', handleMove);
          wrapper.removeEventListener('mouseleave', handleLeave);
        });
      });


      /*
       * ---------------------------------------------------------
       * BOTTOM STATEMENT
       *
       * Same reveal style as the Hero text.
       *
       * IMPORTANT:
       * The parent remains a normal BLOCK element.
       * This preserves the original line wrapping and <br>.
       * Only the individual words are animated.
       * ---------------------------------------------------------
       */

      if (bottomTextRef.current) {
        bottomSplit = SplitText.create(bottomTextRef.current, {
          type: 'words',
          wordsClass: 'services-bottom-word',
        });

        gsap.set(bottomSplit.words, {
          y: 35,
          opacity: 0,
          filter: 'blur(28px)',
        });

        gsap.to(bottomSplit.words, {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          stagger: 0.03,
          duration: 1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: bottomTextRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      }

    }, section);


    return () => {
      imageCleanups.forEach((cleanup) => cleanup());

      bottomSplit?.revert();

      ctx.revert();
    };
  }, []);


  return (
    <section
      ref={sectionRef}
      className="services-section"
    >

      {/* =========================================
          SERVICES GRID
      ========================================== */}

      <div className="services-grid">

        {SERVICES.map((service) => (
          <div
            className="service-card"
            key={service.title}
          >

            {/* =========================================
                IMAGE
            ========================================== */}

            <div className="service-image-wrapper">

              <img
                src={service.image}
                alt={service.title}
                className="service-image"
              />

            </div>


            {/* =========================================
                SERVICE HEADING
            ========================================== */}

            <h3 className="service-heading">
              {service.title}
            </h3>


            {/* =========================================
                TAGS
            ========================================== */}

            <div className="service-tags">

              {service.tags.map((tag) => (
                <span
                  className="service-tag"
                  key={tag}
                >
                  {tag}
                </span>
              ))}

            </div>

          </div>
        ))}

      </div>

    </section>
  );
}


export default ServicesSection;