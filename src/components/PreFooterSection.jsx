import Image from 'next/image';
import prefooterText from '../images/prefooter-text.png';
import './PreFooterSection.css';
import './Nav.css';

function PreFooterSection() {
  return (
    <section className="prefooter">
      <Image
        src={prefooterText}
        alt="Let's make packaging less exhausting"
        className="prefooter-headline-image"
        data-reveal="image"
        sizes="100vw"
        quality={90}
        loading="eager"
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