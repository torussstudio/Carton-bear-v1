'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { ScrollTrigger } from '../lib/gsapSetup';
import './DispatchesSection.css';

/*
 * Questions + answers for the FAQ-style accordion.
 * (Answer copy is a first draft — edit freely.)
 */
const DISPATCH_ITEMS = [
  {
    question: 'Why Most Packaging Delays Have Nothing to Do With Manufacturing',
    answer:
      'Most delays start long before a machine is switched on: unclear dielines, late artwork approvals, missing dimensions and vendors left waiting on answers. We lock specs, approvals and timelines up front, so production runs in the week it was booked.',
  },
  {
    question: 'Cheap Packaging Gets Expensive Very Fast',
    answer:
      'The cheapest quote rarely stays the cheapest. Thin board, weak print and loose sizing turn into damaged orders, reprints and wasted freight. We cost the whole journey, not just the unit price, so the savings are real.',
  },
  {
    question:
      'The Difference Between Packaging That Looks Good and Packaging That Actually Works',
    answer:
      'A box can win on Instagram and still fail in the back of a courier van. Packaging that works survives stacking, transit and unboxing, and still looks unmistakably like your brand when it arrives. We design for both from the first sketch.',
  },
  {
    question: 'Packaging Is Branding. Logistics. Operations. Psychology.',
    answer:
      'It is the first thing your customer touches, the thing your warehouse packs all day and the thing couriers throw around. We plan all four together, so a decision that helps one never quietly breaks another.',
  },
  {
    question:
      'What D2C Founders Should Know Before Printing Their First 10,000 Boxes',
    answer:
      'Get the size right before the print run. Confirm board grade, finishes, minimum order quantities, storage space and reorder lead times, and sample with your real product first. We walk founders through every one of these before a single box is printed.',
  },
  {
    question: 'Export Packaging Mistakes That Cost Brands Time & Money',
    answer:
      'The wrong carton strength, ignored humidity, missing markings and pallet sizes that waste container space all add up fast. We plan export packaging around the route, the climate and the destination rules from day one.',
  },
];

/*
 * Hover intent: a question only opens once the pointer has rested on it
 * for this long. Because opening one answer closes another, the rows move
 * under the cursor — the short delay stops a fast sweep down the list
 * from flicking every answer open in turn.
 */
const HOVER_INTENT_MS = 90;

function DispatchesSection() {
  const [openIndex, setOpenIndex] = useState(0); // first one open by default
  const hoverTimerRef = useRef(null);
  const listRef = useRef(null);
  const baseId = useId();

  const openItem = useCallback((index) => {
    clearTimeout(hoverTimerRef.current);
    setOpenIndex(index);
  }, []);

  // Desktop: open on hover. Uses mousemove (real pointer movement only),
  // not mouseenter, so rows sliding under a still cursor while the
  // accordion animates can't open the next question by themselves.
  const handleMouseMove = (index) => {
    clearTimeout(hoverTimerRef.current);
    if (index === openIndex) return;
    hoverTimerRef.current = setTimeout(() => {
      setOpenIndex(index);
    }, HOVER_INTENT_MS);
  };

  useEffect(() => () => clearTimeout(hoverTimerRef.current), []);

  // The list changes height a little as answers swap, so re-measure the
  // ScrollTriggers further down the page once the animation has finished.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;

    let timer;
    const onTransitionEnd = (event) => {
      if (event.propertyName !== 'grid-template-rows') return;
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), 60);
    };

    list.addEventListener('transitionend', onTransitionEnd);
    return () => {
      clearTimeout(timer);
      list.removeEventListener('transitionend', onTransitionEnd);
    };
  }, []);

  return (
    <section className="dispatches">

      {/* =========================================
          TITLE
      ========================================== */}

      <h2
        className="dispatches-title"
        data-reveal="lines"
      >
        <span className="reveal-mask">
          <span className="dispatches-title-line">
            Dispatches From
          </span>
        </span>

        <span className="reveal-mask">
          <span className="dispatches-title-line">
            Cartonbear.
          </span>
        </span>
      </h2>


      {/* =========================================
          FAQ ACCORDION
          Hover (desktop) or tap / Enter (touch,
          keyboard) opens a question; only one is
          open at a time, and the first starts open.
      ========================================== */}

      <ul className="dispatches-list" ref={listRef}>

        {DISPATCH_ITEMS.map((item, index) => {
          const isOpen = index === openIndex;
          const questionId = `${baseId}-q${index}`;
          const answerId = `${baseId}-a${index}`;

          return (
            <li
              className={`dispatches-list-item${isOpen ? ' is-open' : ''}`}
              key={item.question}
              data-reveal="fade"
              onMouseMove={() => handleMouseMove(index)}
              onMouseLeave={() => clearTimeout(hoverTimerRef.current)}
            >

              <button
                type="button"
                className="dispatches-question"
                id={questionId}
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() => openItem(index)}
              >
                <span className="dispatches-list-text">
                  {item.question}
                </span>

                <span className="dispatches-list-number">
                  {String(index + 1).padStart(3, '0')}
                </span>
              </button>

              <div
                className="dispatches-answer"
                id={answerId}
                role="region"
                aria-labelledby={questionId}
                aria-hidden={!isOpen}
              >
                <div className="dispatches-answer-inner">
                  <p className="dispatches-answer-text">
                    {item.answer}
                  </p>
                </div>
              </div>

            </li>
          );
        })}

      </ul>

    </section>
  );
}

export default DispatchesSection;
