/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    // 75 = default for photos/artwork; 90 for images that contain text
    // (prefooter headline) so the lettering stays crisp.
    qualities: [75, 90],
  },
};

export default nextConfig;
