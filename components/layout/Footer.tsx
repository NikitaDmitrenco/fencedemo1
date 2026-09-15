import Link from 'next/link';
import type { Route } from 'next';
import { site, formatPhone } from '@/content/site.config';
import { Container } from '@/components/ui/Container';
import { NAV_LINKS } from '@/lib/nav';

/**
 * Футер. По ТЗ здесь закрываются последние вопросы: куда звонить, куда
 * выезжают, с кем заключается договор и где юридические документы.
 */
export function Footer() {
  const { company, legal } = site;

  const messengers = [
    company.whatsapp && {
      label: 'WhatsApp',
      href: `https://wa.me/${company.whatsapp.replace(/\D/g, '')}`,
    },
    company.telegram && { label: 'Telegram', href: `https://t.me/${company.telegram}` },
  ].filter(Boolean) as Array<{ label: string; href: string }>;

  return (
    <footer className="bg-[var(--color-ink)] pt-16 pb-12 text-white/70 lg:pt-20">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-bold text-white">{company.name}</p>
            <p className="mt-3 text-sm">{company.geo}</p>
            <p className="mt-1 text-sm">{company.workHours}</p>
          </div>

          <div>
            <p className="text-sm font-bold text-white">Связаться</p>

            <a
              href={`tel:${company.phone}`}
              className="mt-3 block text-lg font-bold text-white transition-colors hover:text-[var(--accent)]"
            >
              {formatPhone(company.phone)}
            </a>

            {messengers.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {messengers.map((m) => (
                  <li key={m.label}>
                    <a
                      href={m.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 transition-colors hover:text-white"
                    >
                      {m.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-3 text-sm">{company.address}</p>
          </div>

          <div>
            <p className="text-sm font-bold text-white">Разделы</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="transition-colors hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-bold text-white">Документы</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              <li>
                <Link
                  href={legal.privacyUrl as Route}
                  className="transition-colors hover:text-white"
                >
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link
                  href={legal.consentUrl as Route}
                  className="transition-colors hover:text-white"
                >
                  Согласие на обработку данных
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/12 pt-6 text-sm">
          <p>{legal.requisites}</p>

          {site.isDemo && (
            <p className="mt-3 text-white/45">
              Демонстрационный сайт. Название, контакты, цены, сроки, отзывы и фотографии —
              заменяемые примеры. Факты, требующие подтверждения, отмечены как [X].
            </p>
          )}
        </div>
      </Container>
    </footer>
  );
}
