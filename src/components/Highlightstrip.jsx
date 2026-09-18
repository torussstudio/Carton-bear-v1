function Highlightstrip() {
  return (
    <section className="highlight-strip">

      <div className="highlight-strip-inner">

        <p
          className="highlight-strip-text"
          data-reveal="scrub-words"
        >
          PACKAGING EXECUTION FROM INDIA, BUILT FOR GLOBAL BRANDS.
        </p>

      </div>


      <style>{`

        /* =====================================================
           BASE
        ====================================================== */

        .highlight-strip {
          position: relative;

          width: 100%;
          max-width: 100%;

          min-height: 40vh;

          display: flex;

          align-items: center;
          justify-content: center;

          box-sizing: border-box;

          padding:
            64px
            24px;

          background-color: var(--bear-bg);

          overflow: hidden;
        }


        .highlight-strip-inner {
          width: 100%;
          max-width: 1400px;

          display: flex;

          align-items: center;
          justify-content: center;

          box-sizing: border-box;
        }


        .highlight-strip-text {
          width: 100%;
          max-width: 80%;

          margin: 0;

          box-sizing: border-box;

          font-family:
            'Sharp Grotesk PE Trial Black',
            'Sharp Grotesk',
            sans-serif;

          font-size:
            clamp(32px, 6vw, 64px);

          font-weight: 400;

          line-height: 0.98;

          letter-spacing: 0.02em;

          text-align: center;

          text-transform: uppercase;

          color: var(--bear-accent);

          overflow-wrap: normal;

          word-break: normal;
        }


        /* =====================================================
           LARGE DESKTOP
        ====================================================== */

        @media (min-width: 1440px) {

          .highlight-strip {
            min-height: 40vh;

            padding:
              72px
              32px;
          }


          .highlight-strip-text {
            max-width: 82%;

            font-size:
              clamp(52px, 5.2vw, 72px);

            line-height: 0.96;
          }

        }


        /* =====================================================
           DESKTOP
        ====================================================== */

        @media (max-width: 1200px) {

          .highlight-strip {
            min-height: 38vh;

            padding:
              64px
              28px;
          }


          .highlight-strip-text {
            max-width: 86%;

            font-size:
              clamp(38px, 6.2vw, 64px);

            line-height: 0.97;
          }

        }


        /* =====================================================
           TABLET
        ====================================================== */

        @media (max-width: 900px) {

          .highlight-strip {
            min-height: 36vh;

            padding:
              56px
              24px;
          }


          .highlight-strip-inner {
            max-width: 760px;
          }


          .highlight-strip-text {
            max-width: 90%;

            font-size:
              clamp(34px, 7.2vw, 58px);

            line-height: 0.98;

            letter-spacing: 0.01em;
          }

        }


        /* =====================================================
           SMALL TABLET
        ====================================================== */

        @media (max-width: 720px) {

          .highlight-strip {
            min-height: 34vh;

            padding:
              52px
              20px;
          }


          .highlight-strip-inner {
            max-width: 620px;
          }


          .highlight-strip-text {
            max-width: 94%;

            font-size:
              clamp(30px, 7.8vw, 52px);

            line-height: 1;

            letter-spacing: 0;
          }

        }


        /* =====================================================
           MOBILE
        ====================================================== */

        @media (max-width: 640px) {

          .highlight-strip {
            width: 100%;

            min-height: 32vh;

            padding:
              48px
              16px;

            overflow-x: hidden;
          }


          .highlight-strip-inner {
            width: 100%;

            max-width: 100%;
          }


          .highlight-strip-text {
            width: 100%;

            max-width: 96%;

            margin: 0 auto;

            font-size:
              clamp(25px, 8.8vw, 42px);

            line-height: 1.02;

            letter-spacing: 0;

            overflow-wrap: normal;

            word-break: normal;
          }

        }


        /* =====================================================
           SMALL PHONES
        ====================================================== */

        @media (max-width: 480px) {

          .highlight-strip {
            min-height: 30vh;

            padding:
              42px
              12px;
          }


          .highlight-strip-text {
            max-width: 98%;

            font-size:
              clamp(23px, 8.8vw, 36px);

            line-height: 1.03;

            letter-spacing: 0;
          }

        }


        /* =====================================================
           VERY SMALL PHONES
        ====================================================== */

        @media (max-width: 360px) {

          .highlight-strip {
            min-height: 28vh;

            padding:
              38px
              10px;
          }


          .highlight-strip-text {
            max-width: 100%;

            font-size:
              clamp(21px, 8.7vw, 31px);

            line-height: 1.04;
          }

        }


        /* =====================================================
           EXTRA SMALL DEVICES
        ====================================================== */

        @media (max-width: 320px) {

          .highlight-strip-text {
            font-size: 21px;

            line-height: 1.05;
          }

        }


        /* =====================================================
           REDUCED MOTION
        ====================================================== */

        @media (prefers-reduced-motion: reduce) {

          .highlight-strip-text {
            animation: none !important;

            transition: none !important;
          }

        }

      `}</style>

    </section>
  );
}

export default Highlightstrip;