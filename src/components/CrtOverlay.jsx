import { useRef } from 'react';
import { useGrainCanvas } from '../hooks/useGrainCanvas.js';
import './CrtOverlay.css';

function CrtOverlay({ scanOpacity, grainOpacity }) {
  const grainCanvasRef = useRef(null);
  useGrainCanvas(grainCanvasRef);

  return (
    <div className="overlay">
      <div className="vignette" />
      <canvas
        className="grainCanvas"
        ref={grainCanvasRef}
        style={{ opacity: grainOpacity }}
      />
      <div className="scanlines" style={{ opacity: scanOpacity }} />
      <div className="bezel" />
    </div>
  );
}

export default CrtOverlay;
