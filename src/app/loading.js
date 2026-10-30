import preloaderBg from '../images/preloader-bg.webp';
import '../styles/status-page.css';

/*
 * Route-level loading UI.
 *
 * This used to show a pulsing logo, which appeared BEFORE the home page's
 * own <Preloader /> (always in `next dev`, and on slow streams), so visitors
 * saw two different loaders back to back. It now renders exactly the
 * preloader's first frame (same textured blue, nothing else), so if it shows
 * at all it hands over to <Preloader /> invisibly.
 */
export default function Loading() {
  return (
    <div
      className="status-page-shell"
      role="status"
      aria-label="Loading"
      style={{ backgroundImage: `url(${preloaderBg.src})` }}
    />
  );
}
