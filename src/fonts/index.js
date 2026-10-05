import localFont from 'next/font/local';

/*
 * Self-hosted Google fonts (SIL OFL — see OFL-*.txt in this folder).
 *
 * These used to be pulled in with `@import url(https://fonts.googleapis.com/...)`
 * at the top of several component stylesheets. next/font serves them from
 * this site instead (no extra request to Google, no render-blocking CSS
 * @import chain) and exposes each family as a CSS variable that the
 * stylesheets use in place of the old family name.
 *
 * The Sharp Grotesk / Easy Pixel / Myriad / Alphakind / CS Liona fonts are
 * NOT handled here: they stay as @font-face rules in src/styles/fonts.css,
 * served from /public/Fonts, exactly as before.
 */

export const anton = localFont({
  src: './anton-latin-400-normal.woff2',
  weight: '400',
  style: 'normal',
  display: 'swap',
  variable: '--font-anton',
  // Only used further down the page, so don't preload it on every route.
  preload: false,
});

export const robotoSlab = localFont({
  src: './roboto-slab-latin-400-normal.woff2',
  weight: '400',
  style: 'normal',
  display: 'swap',
  variable: '--font-roboto-slab',
  preload: false,
});
