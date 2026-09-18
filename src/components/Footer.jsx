import footerBoxImg from '../images/footer-box-img.png';
import './Footer.css';

function Footer() {
  return (
    <footer className="bear-footer">
      <div className="footer-main">
        <div className="footer-brand" data-reveal="fade">
          <h2 className="footer-wordmark">
            CARTONBEAR<sup className="footer-wordmark-reg">&reg;</sup>
          </h2>

          <p className="footer-tagline">
            DESIGH-AWARE PACKAGING EXECUTION
            <br />
            FOR MODERN BRANDS. FROM DIELINE TO DOORSTEP.
          </p>

          <div className="footer-social">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="footer-social-link"
            >
              INSTAGRAM
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="footer-social-link"
            >
              LINKEDIN
            </a>
            <a
              href="mailto:hello@cartonbear.com"
              className="footer-social-link"
            >
              HELLO@CARTONBEAR.COM
            </a>
          </div>
        </div>

        <div className="footer-links-group">
          <nav className="footer-col" aria-label="Services" data-reveal="fade">
            <h3 className="footer-col-title">SERVICES</h3>
            <ul className="footer-links">
              <li>
                <a href="#">Corrugated Boxes</a>
              </li>
              <li>
                <a href="#">Ecommerce Mailers</a>
              </li>
              <li>
                <a href="#">Printed Packaging</a>
              </li>
              <li>
                <a href="#">Rigid Boxes</a>
              </li>
              <li>
                <a href="#">Export Packaging</a>
              </li>
              <li>
                <a href="#">Vendor Coordination</a>
              </li>
            </ul>
          </nav>

          <nav className="footer-col" aria-label="Company" data-reveal="fade">
            <h3 className="footer-col-title">COMPANY</h3>
            <ul className="footer-links">
              <li>
                <a href="#">Who We Serve</a>
              </li>
              <li>
                <a href="#">Our Process</a>
              </li>
              <li>
                <a href="#">Export Capability</a>
              </li>
              <li>
                <a href="#">Insights</a>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
            </ul>
          </nav>
        </div>

        <img
          src={footerBoxImg}
          alt=""
          aria-hidden="true"
          className="footer-box-art"
          data-reveal="image"
        />
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          &copy; 2025 Cartonbear. All rights reserved.
        </p>

        <p className="footer-status">
          <span className="footer-status-dot" aria-hidden="true" />
          STATUS &mdash; CURRENTLY SHIPPING THINGS.
        </p>
      </div>
    </footer>
  );
}

export default Footer;