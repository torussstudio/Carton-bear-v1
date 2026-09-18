import prefooterText from '../images/prefooter-text.png';
import './PreFooterSection.css';
import './Nav.css';

function PreFooterSection() {
  return (
    <section className="prefooter">
      <img
        src={prefooterText}
        alt="Let's make packaging less exhausting"
        className="prefooter-headline-image"
        data-reveal="image"
      />

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