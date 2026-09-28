import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',

  basePath: '/fencedemo1',
  trailingSlash: true,

  images: {
    unoptimized: true,
  },

  poweredByHeader: false,
  typedRoutes: true,
};

export default nextConfig;
