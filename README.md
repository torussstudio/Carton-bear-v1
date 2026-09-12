# CRT Bulge Scroll Demo (React)

A component-based React port of the original single-file HTML CRT bulge demo.
Built with Vite.

## Structure

```
src/
  components/
    CrtFilter.jsx        - hidden SVG filter (feImage + feDisplacementMap)
    CrtOverlay.jsx        - vignette, scanlines, animated grain, bezel
    ControlPanel.jsx      - bulge / scanline / grain sliders
    Nav.jsx                - top nav bar
    HeroSection.jsx        - section 1
    SelectedWorkSection.jsx- section 2 (work grid)
    ScrollInfoSection.jsx  - section 3
    *.css                   - per-component styles
  hooks/
    useDisplacementMap.js  - builds the radial displacement map data URL
    useGrainCanvas.js       - drives the animated noise canvas
  styles/
    global.css              - resets + CSS variables
  App.jsx                   - composes everything, owns slider state
  main.jsx                  - React entry point
```

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```
