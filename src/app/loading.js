import Image from 'next/image';
import logo from '../logo/carton-bear-logo.png';
import '../styles/status-page.css';

/*
 * Route-level loading UI. The home page is fully static and has its own
 * branded <Preloader />, so this only ever shows during a client-side
 * navigation (e.g. 404 page -> "Back To Home") while the page streams in.
 */
export default function Loading() {
  return (
    <div className="status-page status-page--loading" role="status" aria-label="Loading">
      <Image src={logo} alt="" className="status-page-pulse" preload />
    </div>
  );
}
