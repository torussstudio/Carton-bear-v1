import heroImage from '../images/Carton.webp';
import './BuiltForBrandsSection.css';

function BuiltForBrandsSection() {
  return (
    <section className="built">

      <div className="built-main">

        <div className="built-left">

          <h2 className="built-title">
            <span className="built-title-line built-title-line--accent">
              Built For
            </span>
            <span className="built-title-line">Modern</span>
            <span className="built-title-line">Brands</span>
          </h2>

          <img
            src={heroImage}
            alt="Retro illustration of a woman in a red dress holding a vintage TV showing the Carton Bear logo"
            className="built-image"
          />

        </div>

        <div className="built-right">
          <div className="built-placeholder" aria-hidden="true" />
        </div>
      </div>

    </section>
  );
}

export default BuiltForBrandsSection;