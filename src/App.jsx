import { useLenis } from './hooks/useLenis.js';
import { useScrollReveal } from './hooks/useScrollReveal.js';
import CrtFilter from './components/CrtFilter.jsx';
import CrtOverlay from './components/CrtOverlay.jsx';
import HeroSection from './components/HeroSection.jsx';
import Marquee from './components/Marquee.jsx';
import PackagingSection from './components/PackagingSection.jsx';
import Videosection from './components/Videosection.jsx';
import ServicesSection from './components/ServicesSection.jsx';
import ProcessSection from './components/ProcessSection.jsx';
import Highlightstrip from './components/Highlightstrip.jsx';
import DispatchesSection from './components/DispatchesSection.jsx';
// import BuiltForBrandsSection from './components/BuiltForBrandsSection.jsx';
import ShippingSection from './components/ShippingSection.jsx'; 
import WithoutUsSection from './components/WithoutUsSection.jsx';
import PreFooterSection from './components/PreFooterSection.jsx';

import './App.css';

const BULGE = 0;
const SCAN = 0.55;
const GRAIN = 0.1;

function App() {
  useLenis();
  useScrollReveal();

  return (
    <>
      <CrtFilter bulge={BULGE} />

      <div id="crtContent" className="crt-content">
        <HeroSection />
        <Marquee />
        <PackagingSection />
        {/* <Videosection /> */}
        <ServicesSection />
        {/* <BuiltForBrandsSection /> */}
        <ProcessSection />
        <Highlightstrip />
        <WithoutUsSection />
        <ShippingSection />
        <DispatchesSection />
        <PreFooterSection />
      </div>


      <CrtOverlay scanOpacity={SCAN} grainOpacity={GRAIN} />
    </>
  );
}

export default App;