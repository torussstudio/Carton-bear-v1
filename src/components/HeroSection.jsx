import Nav from './Nav.jsx';
import './HeroSection.css';
import './Nav.css'; 

function HeroSection() {
  return (
    <div className="bear-hero">
      <Nav />

      <div className="bear-hero-content">
        <p className="bear-hero-kicker">
          For D2C brands, ecommerce businesses, agencies, and growing
          consumer brands. From dieline to doorstep.
        </p>

        <div className="bear-hero-ctas">
          <button type="button" className="bear-pill bear-pill--solid">
           GOT A PACK IDEA ?
          </button>
          <button type="button" className="bear-pill bear-pill--outline">
            MAKE YOUR MOVE
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;