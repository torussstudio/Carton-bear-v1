import { anton, robotoSlab } from '../fonts';
import '../styles/global.css';

const SITE_URL = 'https://cartonbear.com';
const TITLE = 'Carton Bear';
const DESCRIPTION =
  'Packaging that actually understands branding. Design-aware packaging execution for D2C brands, ecommerce businesses, agencies and growing consumer brands — from dieline to doorstep.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: TITLE,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: TITLE,
    title: TITLE,
    description: DESCRIPTION,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0506cc',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${anton.variable} ${robotoSlab.variable}`}>
      <body>
        {/* #root kept from the Vite build: global.css styles it
            (min-height + overflow-x), and the layout depends on it. */}
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
