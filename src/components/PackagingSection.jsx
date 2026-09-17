import girlVideo from '../Videos/Eye Closing Video Animation.mp4';
import './PackagingSection.css';

function PackagingSection() {
  return (
    <div className="packaging">
      <h2 className="packaging-title" data-reveal="lines">
        <span className="reveal-mask">
          <span className="pt-line hl hl--white hl--blue">Packaging</span>
        </span>
        <span className="reveal-mask">
          <span className="pt-line">
            that actually <span className="hl hl--white hl--gold">builds</span>
          </span>
        </span>
        <span className="reveal-mask">
          <span className="pt-line">
            <span className="hl hl--white hl--gold">brands.</span>
          </span>
        </span>
      </h2>

      <p className="packaging-desc" data-reveal="fade">
        Because packaging isn&apos;t just protection. It&apos;s perception.
        It&apos;s recall. It&apos;s retention. It&apos;s one of the biggest
        brand touchpoints you have&gt;&gt;
      </p>

      <video
        className="packaging-video"
        src={girlVideo}
        autoPlay
        muted
        loop
        playsInline
        data-reveal="image"
      />
    </div>
  );
}

export default PackagingSection;