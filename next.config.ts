import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // GitHub Pages — статический экспорт.
  output: 'export',

  // Репозиторий публикуется по адресу /fencedemo1.
  basePath: '/fencedemo1',
  trailingSlash: true,

  // GitHub Pages не имеет Next.js Image Optimization API.
  images: {
    unoptimized: true,
  },

  poweredByHeader: false,
  typedRoutes: true,
};

export default nextConfig;
