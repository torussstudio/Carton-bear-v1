import girlVideo from '../Videos/Eye Closing Video Animation.mp4';
import './PackagingSection.css';

function PackagingSection() {
  return (
    <div className="packaging"> 
      <h2 className="packaging-title">
        <span className="font-sharp text-[clamp(1.5rem,9vw,88px)] leading-[1.05] text-[var(--bear-text)] max-w-[80%] text-center tracking-wide">Packaging</span>
        <br />
        <span className="font-sharp text-[clamp(1.5rem,9vw,88px)] leading-[1.05] text-[var(--bear-text)] max-w-[80%] text-center tracking-wide">that actually</span>{' '}
        <span className="font-sharp text-[clamp(1.5rem,9vw,88px)] leading-[1.05] text-[var(--bear-text)] max-w-[80%] text-center tracking-wide hl--white hl--gold">builds</span>
        <br />
        <span className="font-sharp text-[clamp(1.5rem,9vw,88px)] leading-[1.05] text-[var(--bear-text)] max-w-[80%] text-center tracking-wide hl--white hl--gold">brands.</span>
      </h2>

      <p className="packaging-desc">
        Because packaging isn&apos;t just protection. It&apos;s perception.
        It&apos;s recall. It&apos;s retention. It&apos;s one of the biggest
        brand touchpoints you have&gt;&gt;
      </p>

       <video  className="packaging-video" src={girlVideo} autoPlay muted loop />
    </div>
  );
}

export default PackagingSection;