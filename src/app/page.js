import Preloader from '../components/Preloader';
import PageBulge from '../components/PageBulge';
import CrtOverlay from '../components/CrtOverlay';
import HeroSection from '../components/HeroSection';
import Marquee from '../components/Marquee';
import PackagingSection from '../components/PackagingSection';
import ServicesSection from '../components/ServicesSection';
import BuiltForBrandsSection from '../components/BuiltForBrandsSection';
import ProcessSection from '../components/ProcessSection';
import Highlightstrip from '../components/Highlightstrip';
import WithoutUsSection from '../components/WithoutUsSection';
import ShippingSection from '../components/ShippingSection';
import DispatchesSection from '../components/DispatchesSection';
import PreFooterSection from '../components/PreFooterSection';
import Footer from '../components/Footer';
import SiteEffects from '../components/SiteEffects';

const SCAN = 0.55;
const GRAIN = 0.1;

/*
 * Home page — a Server Component. Same tree and section order as the old
 * Vite <App />. Animated sections are Client Components (they opt in with
 * 'use client'); purely static sections (Shipping, Dispatches, PreFooter,
 * Footer) render on the server and ship no component JavaScript.
 */
export default function HomePage() {
  return (
    <>
      <Preloader />
      <PageBulge />

      <div id="crtContent" className="crt-content">
        <HeroSection />
        <Marquee />
        <PackagingSection />
        {/* <Videosection /> */}
        <ServicesSection />
        <BuiltForBrandsSection />
        <ProcessSection />
        <Highlightstrip />
        <WithoutUsSection />
        <ShippingSection />
        <DispatchesSection />
        <PreFooterSection />
        <Footer />
      </div>

      <CrtOverlay scanOpacity={SCAN} grainOpacity={GRAIN} />

      {/* Lenis + site-wide scroll reveals. Rendered LAST so its effects run
          after every section has mounted — the same order the hooks had
          when they lived in <App /> (a parent's effects run after its
          children's). */}
      <SiteEffects />
    </>
  );
}
