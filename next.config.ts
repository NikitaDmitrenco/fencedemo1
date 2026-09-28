import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,

  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536, 1920],
  },

  poweredByHeader: false,
  typedRoutes: true,
};

export default nextConfig;