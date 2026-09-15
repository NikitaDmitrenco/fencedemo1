import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Требование ТЗ: фотографии в WebP/AVIF.
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536, 1920],
  },
  // Убираем заголовок, раскрывающий стек, — лишняя информация на клиентском сайте.
  poweredByHeader: false,
  typedRoutes: true,
};

export default nextConfig;
