import logo from '../logo/carton-bear-logo.png';
import './Nav.css';

function Nav() {
  return (
    <div className="bear-nav">
      <img src={logo} alt="Carton Bear" className="bear-nav-logo" />
      <div className="bear-nav-links">
        <button type="button" className="bear-pill bear-pill--outline">
          MENU
        </button>
        <button type="button" className="bear-pill bear-pill--solid">
          HIT US UP
        </button>
      </div>
    </div>
  );
}

export default Nav;