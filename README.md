# Carton Bear

Marketing site for Carton Bear — built with **Next.js 16 (App Router)**, React 19,
GSAP (ScrollTrigger + SplitText), Lenis smooth scrolling and Tailwind CSS v4.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Scripts

| Command         | What it does                                  |
| --------------- | --------------------------------------------- |
| `npm run dev`   | Development server with hot reload            |
| `npm run build` | Production build (static prerender of `/`)    |
| `npm run start` | Serve the production build locally            |
| `npm run lint`  | ESLint (`eslint-config-next/core-web-vitals`) |

## Structure

```
public/
  Fonts/                 Sharp Grotesk, Easy Pixel, Myriad, Alphakind, CS Liona (@font-face in src/styles/fonts.css)
  videos/                Hero (desktop + mobile cut) and packaging section videos
src/
  app/
    layout.js            <html>/<body>, metadata (title, description, Open Graph), next/font variables, global CSS
    page.js              Home page (Server Component) — composes every section in order
    loading.js           Route loading UI
    error.js             Error boundary (Client Component)
    not-found.js         404 page
    icon.png             Favicon (auto-linked by Next.js)
    apple-icon.png       Apple touch icon
  components/            One component (+ its CSS) per section
    SiteEffects.jsx      Boots Lenis + the site-wide data-reveal scroll animations
  fonts/                 Self-hosted Anton + Roboto Slab via next/font/local (SIL OFL)
  hooks/                 useLenis, useScrollReveal, useGrainCanvas, …
  lib/                   gsapSetup (plugin registration), lenisInstance, rgbSplit, scrollReveal
  images/ icons/ logo/   Static images, imported and served through next/image
  styles/                global.css (Tailwind + fonts + animations + RGB split), status-page.css
```

## Notes

- **Client vs server:** sections that animate with GSAP / use browser APIs are
  Client Components (`'use client'`). Static sections (Shipping, Dispatches,
  PreFooter, Footer) render on the server only.
- **Animations** are driven by GSAP + ScrollTrigger on the GSAP ticker, with Lenis
  synced to ScrollTrigger (`src/hooks/useLenis.js`). Elements marked
  `data-reveal="…"` are animated by `src/lib/scrollReveal.js`.
- **Hero video** is chosen on the client (`<= 640px` → mobile cut), so phones
  never download the desktop file.
