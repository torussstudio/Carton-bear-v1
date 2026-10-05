import Image from 'next/image';
import Link from 'next/link';
import logo from '../logo/carton-bear-logo.png';
import '../components/Nav.css';
import '../styles/status-page.css';

export const metadata = {
  title: 'Page not found | Carton Bear',
};

export default function NotFound() {
  return (
    <main className="status-page">
      <Image src={logo} alt="Carton Bear" className="status-page-logo" preload />
      <p className="status-page-code">ERROR 404</p>
      <h1 className="status-page-title">
        Lost In
        <br />
        Transit.
      </h1>
      <p className="status-page-text">
        This box never made it to the dock. The page you&apos;re after
        doesn&apos;t exist or has moved.
      </p>
      <div className="status-page-actions">
        <Link href="/" className="bear-pill bear-pill--solid">
          Back To Home
        </Link>
      </div>
    </main>
  );
}
