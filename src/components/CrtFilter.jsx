import { useRef, useEffect } from 'react';
import { useDisplacementMap } from '../hooks/useDisplacementMap.js';

/**
 * Renders the hidden SVG <filter> that drives the CRT bulge effect.
 * `bulge` (0-150) is applied as the feDisplacementMap `scale`.
 */
function CrtFilter({ bulge }) {
  const displaceRef = useRef(null);
  const dataUrl = useDisplacementMap(512);

  useEffect(() => {
    const el = displaceRef.current;
    if (!el) return;
    if (el.setAttributeNS) {
      el.setAttributeNS('http://www.w3.org/1999/xlink', 'href', dataUrl);
    }
    el.setAttribute('href', dataUrl);
  }, [dataUrl]);

  return (
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        <filter
          id="crtBulge"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feImage
            ref={displaceRef}
            result="map"
            x="0"
            y="0"
            width="100%"
            height="100%"
            preserveAspectRatio="none"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            scale={bulge}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}

export default CrtFilter;
