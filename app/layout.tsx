import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono, Manrope } from 'next/font/google';
import { site } from '@/content/site.config';
import { siteUrl } from '@/lib/site-url';
import { Analytics } from '@/components/layout/Analytics';
import { CookieNotice } from '@/components/layout/CookieNotice';
import './globals.css';

// Self-hosted шрифт: без запросов к стороннему CDN и без скачка вёрстки.
const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-manrope',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-mono',
});

const title = `${site.hero.title} — ${site.company.name}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description: site.hero.subtitle,
  openGraph: {
    title,
    description: site.hero.subtitle,
    type: 'website',
    locale: 'ru_RU',
    siteName: site.company.name,
    // Превью в мессенджерах — первое, что видит получатель ссылки.
    images: [{ url: '/media/demo/og.jpg', width: 1200, height: 630, alt: site.hero.title }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: site.hero.subtitle,
    images: ['/media/demo/og.jpg'],
  },
  // Демо закрыто от индексации: сайт с вымышленными названием, телефоном и
  // реквизитами не должен попадать в выдачу как настоящая компания.
  robots: site.isDemo ? { index: false, follow: false } : { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0b0e10',
  // viewport-fit нужен sticky-панели «Позвонить | Рассчитать» на iPhone.
  viewportFit: 'cover',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ru"
      className={`${manrope.variable} ${mono.variable}`}
      // Единственная точка, где акцентный цвет клиента попадает в CSS.
      style={{ '--accent': site.brand.accent } as React.CSSProperties}
    >
      <body data-build={process.env.GITHUB_SHA?.slice(0, 12) ?? 'local'}>
        {/* Если скрипты не выполняются, снимаем скрытие с блоков .reveal. */}
        <noscript>
          <style>{`.reveal { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>

        {children}

        <CookieNotice />
        <Analytics />
      </body>
    </html>
  );
}
