import { useMemo } from 'react';

/**
 * Builds a radial displacement map (as a canvas data URL) used by the
 * SVG feDisplacementMap filter to create the CRT barrel-bulge effect.
 * R channel encodes X displacement, G channel encodes Y displacement.
 */
export function buildDisplacementDataURL(size = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(size, size);
  const cx = size / 2;
  const cy = size / 2;
  const maxR = Math.sqrt(cx * cx + cy * cy);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const r = dist / maxR; // 0 center -> 1 edge
      // barrel: displacement grows with r^2.2, pushing content outward near edges
      const factor = Math.pow(r, 2.2);
      const nx = dist === 0 ? 0 : dx / dist;
      const ny = dist === 0 ? 0 : dy / dist;

      const idx = (y * size + x) * 4;
      img.data[idx] = 128 + nx * factor * 127; // R channel -> X displacement
      img.data[idx + 1] = 128 + ny * factor * 127; // G channel -> Y displacement
      img.data[idx + 2] = 128;
      img.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL();
}

export function useDisplacementMap(size = 512) {
  return useMemo(() => buildDisplacementDataURL(size), [size]);
}
