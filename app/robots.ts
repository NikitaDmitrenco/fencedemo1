import type { MetadataRoute } from 'next';

import { site } from '@/content/site.config';
import { siteUrl } from '@/lib/site-url';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  // Демо целиком закрыто от обхода: страница с вымышленными названием,
  // телефоном и реквизитами не должна попадать в выдачу как настоящая
  // компания. В боевой версии (isDemo: false) обход открывается.
  if (site.isDemo) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/privacy', '/consent'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
