import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { site } from '@/content/site.config';
import { siteUrl } from '@/lib/site-url';
import './globals.css';

// Self-hosted шрифт: без запросов к стороннему CDN и без скачка вёрстки.
const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${site.hero.title} — ${site.company.name}`,
  description: site.hero.subtitle,
  openGraph: {
    title: `${site.hero.title} — ${site.company.name}`,
    description: site.hero.subtitle,
    type: 'website',
    locale: 'ru_RU',
    siteName: site.company.name,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#14181b',
  // viewport-fit нужен sticky-панели «Позвонить | Рассчитать» на iPhone.
  viewportFit: 'cover',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ru"
      className={manrope.variable}
      // Единственная точка, где акцентный цвет клиента попадает в CSS.
      style={{ '--accent': site.brand.accent } as React.CSSProperties}
    >
      <body>
        {/* Если скрипты не выполняются, снимаем скрытие с блоков .reveal. */}
        <noscript>
          <style>{`.reveal { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
