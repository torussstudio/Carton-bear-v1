import { useEffect, useRef } from 'react';

/**
 * Continuously paints random grayscale noise onto the given canvas ref,
 * resizing it to match the viewport. Returns nothing — it's a side-effect
 * hook that keeps the canvas animating for as long as the component lives.
 */
export function useGrainCanvas(canvasRef) {
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

 const frameInterval = 1000 / 15; // ~15fps is plenty for grain
let lastDraw = 0;

function drawGrain(time) {
  rafRef.current = requestAnimationFrame(drawGrain);
  if (time - lastDraw < frameInterval) return;
  lastDraw = time;

  const w = canvas.width;
  const h = canvas.height;
  const imgData = ctx.createImageData(w, h);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const v = Math.random() * 255;
    imgData.data[i] = v;
    imgData.data[i + 1] = v;
    imgData.data[i + 2] = v;
    imgData.data[i + 3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);
}
rafRef.current = requestAnimationFrame(drawGrain);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [canvasRef]);
}
